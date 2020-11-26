<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Alias;

use Alias\Entity\AliasInterface;
use Alias\Exception;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Filter\Shortify;
use Common\Filter\Slugify;
use Common\Traits;
use Doctrine\Common\Persistence\ObjectManager;
use Entity\Entity\EntityInterface;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceAwareObjectManagerAwareTrait;
use Instance\Repository\InstanceAwareRepository;
use Normalizer\NormalizerInterface;
use Page\Entity\PageRepositoryInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerInterface;
use Zend\Cache\Storage\StorageInterface;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\Mvc\Router\RouteInterface;

class AliasManager implements AliasManagerInterface
{
    use InstanceAwareObjectManagerAwareTrait, ClassResolverAwareTrait;
    use EventManagerAwareTrait;
    use Traits\RouterAwareTrait;

    const CACHE_NONEXISTENT = '~nonexistent~';

    /** @var UuidManagerInterface */
    protected $uuidManager;
    /** @var NormalizerInterface */
    protected $normalizer;
    /** @var StorageInterface */
    protected $storage;

    public function __construct(
        ClassResolverInterface $classResolver,
        ObjectManager $objectManager,
        UuidManagerInterface $uuidManager,
        NormalizerInterface $normalizer,
        RouteInterface $router,
        StorageInterface $storage
    ) {
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
        $this->uuidManager = $uuidManager;
        $this->normalizer = $normalizer;
        $this->router = $router;
        $this->storage = $storage;
    }

    public function getAliasOfObject(UuidInterface $uuid)
    {
        $id = $uuid->getId();
        $normalized = $this->normalizer->normalize($uuid);
        $title = $normalized->getTitle();
        $alias = '/' . $id . '/' . $this->slugify($title);

        if ($uuid instanceof EntityInterface) {
            $subjects = $uuid->getSubjects();
            if (count($subjects) > 0) {
                /** @var TaxonomyTermInterface $subject */
                $subject = $subjects[0];
                $s = $this->slugify($subject->getName());
                $alias = '/' . $s . $alias;
            }
            return $alias;
        } elseif ($uuid instanceof PageRepositoryInterface) {
            // TODO: if we require the subject here, we need to grab it from navigation.
            return $alias;
        } elseif ($uuid instanceof TaxonomyTermInterface) {
            $subject = $uuid->getSecondLevelAncestor();
            $s = $this->slugify($subject->getName());
            $alias = '/' . $s . $alias;
            return $alias;
        } elseif ($uuid instanceof UserInterface) {
            return '/user/profile/' . $this->slugify($uuid->getUsername());
        }

        return null;
    }

    public function getAliasOfSource(string $source)
    {
        if (
            preg_match(
                '/^(:?\/entity\/view\/(?<entityId>\d+))|(:?\/page\/view\/(?<pageId>\d+))|(:?\/taxonomy\/term\/get\/(?<termId>\d+))$/',
                $source,
                $matches
            )
        ) {
            $id =
                $matches['entityId'] ?:
                $matches['pageId'] ?:
                $matches['termId'];
            try {
                $uuid = $this->uuidManager->getUuid($id, true, false);
            } catch (NotFoundException $e) {
                return null;
            }
            return $this->getAliasOfObject($uuid);
        }

        return null;
    }

    public function resolveLegacyAlias($alias, InstanceInterface $instance)
    {
        if (!is_string($alias)) {
            throw new Exception\InvalidArgumentException(
                sprintf(
                    'Expected alias to be string but got "%s"',
                    gettype($alias)
                )
            );
        }

        $key = 'source:by:alias:' . $instance->getId() . ':' . $alias;
        if ($this->storage->hasItem($key)) {
            // The item is null so it didn't get found.
            $item = $this->storage->getItem($key);
            if ($item === self::CACHE_NONEXISTENT) {
                return null;
            }
            return $item;
        }

        /* @var $entity Entity\AliasInterface */
        $criteria = ['alias' => $alias, 'instance' => $instance->getId()];
        $order = ['timestamp' => 'DESC'];
        $results = $this->getAliasRepository()->findBy($criteria, $order, 1);
        $entity = current($results);

        if (!is_object($entity)) {
            $this->storage->setItem($key, self::CACHE_NONEXISTENT);
            return null;
        }

        $source = $entity->getSource();
        $this->storage->setItem($key, $source);

        return $source;
    }

    public function resolveAliasInInstance(
        string $alias,
        InstanceInterface $instance
    ) {
        $uuid = $this->getUuidOfAlias($alias);
        if ($uuid === null) {
            $aliases = $this->findLegacyAliases($alias, $instance);
            if (count($aliases) === 0) {
                return null;
            }

            $currentAlias = $aliases[0];
            $path = $this->getAliasOfObject($currentAlias->getObject());
            return [
                'id' => $currentAlias->getObject()->getId(),
                'instance' => $currentAlias->getInstance()->getSubdomain(),
                'path' => $path,
            ];
        } else {
            $path = $this->getAliasOfObject($uuid);
            return $path
                ? [
                    'id' => $uuid->getId(),
                    'instance' => $instance->getSubdomain(),
                    'path' => $this->getAliasOfObject($uuid),
                ]
                : null;
        }
    }

    public function getUuidOfAlias(string $alias)
    {
        if (
            preg_match(
                '/^(?<subject>[^\/]+\/)?(?<id>\d+)\/(?<title>[^\/]+)$/',
                $alias,
                $matches
            )
        ) {
            try {
                return $this->uuidManager->getUuid($matches['id'], true);
            } catch (NotFoundException $e) {
                // UUID not found, fall through
            }
        }
        return null;
    }

    /**
     * @return Entity\AliasInterface[]
     */
    protected function findLegacyAliases($alias, InstanceInterface $instance)
    {
        $criteria = ['alias' => $alias, 'instance' => $instance->getId()];
        $order = ['timestamp' => 'DESC'];
        return $this->getAliasRepository()->findBy($criteria, $order);
    }

    /**
     * @return InstanceAwareRepository
     */
    protected function getAliasRepository()
    {
        return $this->getObjectManager()->getRepository(
            $this->getClassResolver()->resolveClassName(AliasInterface::class)
        );
    }

    protected function slugify(string $text)
    {
        $slugified = [];
        $text = Shortify::shortify($text);

        foreach (explode('/', $text) as $token) {
            $token = Slugify::slugify($token);
            if (empty($token)) {
                continue;
            }

            $slugified[] = $token;
        }

        $text = implode('/', $slugified);

        return $text;
    }
}
