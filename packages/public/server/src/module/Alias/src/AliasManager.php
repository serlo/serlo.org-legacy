<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Alias;

use Alias\Controller\AliasController;
use Alias\Entity\AliasInterface;
use Alias\Exception;
use Attachment\Entity\ContainerInterface;
use Blog\Entity\PostInterface;
use ClassResolver\ClassResolverInterface;
use Common\Filter\Slugify;
use Discussion\Entity\CommentInterface;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceAwareEntityManager;
use Instance\Manager\InstanceAwareObjectManagerAwareTrait;
use Instance\Repository\InstanceAwareRepository;
use Normalizer\NormalizerInterface;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Entity\UserInterface;
use User\Exception\UserNotFoundException;
use User\Manager\UserManagerInterface;
use Uuid\Entity\UuidInterface;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerInterface;
use Zend\Cache\Storage\StorageInterface;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\Http\Request;
use Zend\Mvc\Router\RouteInterface;

class AliasManager implements AliasManagerInterface
{
    use EventManagerAwareTrait;
    use InstanceAwareObjectManagerAwareTrait;

    const CACHE_NONEXISTENT = '~nonexistent~';

    /** @var ClassResolverInterface */
    protected $classResolver;
    /** @var UserManagerInterface */
    protected $userManager;
    /** @var UuidManagerInterface */
    protected $uuidManager;
    /** @var NormalizerInterface */
    protected $normalizer;
    /** @var StorageInterface */
    protected $storage;
    /** @var RouteInterface */
    protected $router;

    public function __construct(
        ClassResolverInterface $classResolver,
        InstanceAwareEntityManager $objectManager,
        UserManagerInterface $userManager,
        UuidManagerInterface $uuidManager,
        NormalizerInterface $normalizer,
        RouteInterface $router,
        StorageInterface $storage
    ) {
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
        $this->userManager = $userManager;
        $this->uuidManager = $uuidManager;
        $this->normalizer = $normalizer;
        $this->router = $router;
        $this->storage = $storage;
    }

    public function getAliasOfObject(UuidInterface $uuid)
    {
        $normalized = $this->normalizer->normalize($uuid);

        if ($uuid instanceof RevisionInterface) {
            return '/entity/repository/compare/' .
                $uuid->getRepository()->getId() .
                '/' .
                $uuid->getId();
        }

        return $this->getAlias(
            $this->getContext($uuid),
            $normalized->getId(),
            $normalized->getTitle()
        );
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
        $uuid = $this->getObjectOfAlias($alias);
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

    public function routeMatchUrl(string $url)
    {
        $request = new Request();
        $request->setMethod(Request::METHOD_GET);
        $request->setUri($url);
        return $this->router->match($request);
    }

    public function getObjectOfAlias(string $alias)
    {
        // Expose /user/profile/:username as alias
        if (preg_match('/user\/profile\/(.*)/', $alias, $matches)) {
            try {
                return $this->userManager->findUserByUsername($matches[1]);
            } catch (UserNotFoundException $exception) {
                // User not found, fall through
            }
        }

        // Do not expose remaining router routes
        if ($this->isRouterRoute($alias)) {
            return null;
        }

        if (
            preg_match(
                '/^(?<subject>[^\/]+\/)?(?<id>\d+)\/(?<title>[^\/]*)$/',
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

    protected function isRouterRoute(string $alias)
    {
        if (preg_match('/^(?<id>\d+)$/', $alias)) {
            return false;
        }
        $request = new Request();
        $request->setMethod(Request::METHOD_GET);
        $request->setUri('/' . $alias);
        $match = $this->router->match($request);
        return $match !== null &&
            $match->getParams()['controller'] != AliasController::class;
    }

    /**
     * @param UuidInterface $uuid
     * @return string
     */
    protected function getContext(UuidInterface $uuid)
    {
        if ($uuid instanceof ContainerInterface) {
            return 'attachment';
        } elseif ($uuid instanceof CommentInterface) {
            return $this->getContext(
                $uuid->hasParent() ? $uuid->getParent() : $uuid->getObject()
            );
        } elseif ($uuid instanceof EntityInterface) {
            $subject = $uuid->getCanonicalSubject();
            return $subject ? $subject->getName() : '';
        } elseif ($uuid instanceof RevisionInterface) {
            /** @var UuidInterface $repository */
            $repository = $uuid->getRepository();
            return $this->getContext($repository);
        } elseif ($uuid instanceof PageRepositoryInterface) {
            return '';
        } elseif ($uuid instanceof PageRevisionInterface) {
            /** @var UuidInterface $repository */
            $repository = $uuid->getRepository();
            return $this->getContext($repository);
        } elseif ($uuid instanceof PostInterface) {
            return 'blog';
        } elseif ($uuid instanceof TaxonomyTermInterface) {
            $subject = $uuid->getSecondLevelAncestor();
            return $subject ? $subject->getName() : '';
        } elseif ($uuid instanceof UserInterface) {
            return 'user';
        }
        return '';
    }

    /**
     * @param string $alias
     * @param InstanceInterface $instance
     * @return Entity\AliasInterface[]
     */
    protected function findLegacyAliases(
        string $alias,
        InstanceInterface $instance
    ) {
        $criteria = ['alias' => $alias, 'instance' => $instance->getId()];
        $order = ['timestamp' => 'DESC'];
        return $this->getAliasRepository()->findBy($criteria, $order);
    }

    protected function getAlias($prefix, $id, $suffix)
    {
        $prefix = Slugify::slugify($prefix ?? '');
        $suffix = Slugify::slugify($suffix ?? '');
        return ($prefix ? '/' . $prefix : '') . '/' . $id . '/' . $suffix;
    }

    /**
     * @return InstanceAwareRepository
     */
    protected function getAliasRepository()
    {
        return $this->getObjectManager()->getRepository(
            $this->classResolver->resolveClassName(AliasInterface::class)
        );
    }
}
