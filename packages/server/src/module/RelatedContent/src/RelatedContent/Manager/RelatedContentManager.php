<?php
/**
 * This file is part of Athene2.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace RelatedContent\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Common\Traits\RouterAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use RelatedContent\Entity;
use RelatedContent\Entity\ContainerInterface;
use RelatedContent\Exception;
use RelatedContent\Result\CategoryResult;
use RelatedContent\Result\ExternalResult;
use RelatedContent\Result\InternalResult;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerAwareTrait;
use Uuid\Manager\UuidManagerInterface;
use Zend\Mvc\Router\RouteInterface;
use ZfcRbac\Service\AuthorizationService;

class RelatedContentManager implements RelatedContentManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;
    use RouterAwareTrait, UuidManagerAwareTrait;
    use FlushableTrait, AuthorizationAssertionTrait;
    use InstanceManagerAwareTrait;

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceManagerInterface $instanceManager,
        RouteInterface $route,
        ObjectManager $objectManager,
        UuidManagerInterface $uuidManager
    ) {
        $this->setAuthorizationService($authorizationService);
        $this->classResolver   = $classResolver;
        $this->instanceManager = $instanceManager;
        $this->router          = $route;
        $this->objectManager   = $objectManager;
        $this->uuidManager     = $uuidManager;
    }

    public function addCategory($container, $name)
    {
        $this->assertGranted('related.content.create');

        $container = $this->getContainer($container);
        $holder    = $this->createHolder($container);
        /* @var $internal Entity\CategoryInterface */
        $internal = $this->getClassResolver()->resolve('RelatedContent\Entity\CategoryInterface');

        $this->assertGranted('related.content.create', $container);
        $internal->setTitle($name);
        $internal->setHolder($holder);
        $this->getObjectManager()->persist($internal);

        return $internal;
    }

    public function addExternal($container, $title, $url)
    {
        /* @var $external Entity\ExternalInterface */
        $external  = $this->getClassResolver()->resolve('RelatedContent\Entity\ExternalInterface');
        $container = $this->getContainer($container);
        $holder    = $this->createHolder($container);

        $this->assertGranted('related.content.create', $container);
        $external->setTitle($title);
        $external->setHolder($holder);
        $external->setUrl($url);
        $this->getObjectManager()->persist($external);

        return $external;
    }

    public function addInternal($container, $title, $reference)
    {
        /* @var $internal Entity\InternalInterface */
        $internal  = $this->getClassResolver()->resolve('RelatedContent\Entity\InternalInterface');
        $object    = $this->getUuid($reference);
        $container = $this->getContainer($container);
        $holder    = $this->createHolder($container);

        $this->assertGranted('related.content.create', $container);
        $internal->setTitle($title);
        $internal->setHolder($holder);
        $internal->setReference($object);
        $this->getObjectManager()->persist($internal);

        return $internal;
    }

    public function aggregateRelatedContent($id)
    {
        $related = $this->getContainer($id);
        return $results = $this->aggregate($related);
    }

    public function getContainer($id)
    {
        /* @var $related Entity\ContainerInterface */
        $className = $this->getClassResolver()->resolveClassName('RelatedContent\Entity\ContainerInterface');
        $related   = $this->getObjectManager()->find($className, $id);

        if (!is_object($related)) {
            return $this->createContainer($id);
        }

        $this->assertGranted('related.content.get', $related);

        return $related;
    }

    public function positionHolder($holder, $position)
    {
        /* @var $holder Entity\HolderInterface */
        $className = $this->getClassResolver()->resolveClassName('RelatedContent\Entity\HolderInterface');
        $holder    = $this->getObjectManager()->find($className, $holder);

        if (!is_object($holder)) {
            throw new Exception\RuntimeException(sprintf('Holder not found by id `%d`', $holder));
        }

        $this->assertGranted('related.content.update', $holder->getContainer());
        $holder->setPosition($position);
        $this->getObjectManager()->persist($holder);
    }

    public function removeRelatedContent($id)
    {
        /* @var $object Entity\HolderInterface */
        $className = $this->getClassResolver()->resolveClassName('RelatedContent\Entity\HolderInterface');
        $object    = $this->getObjectManager()->find($className, $id);

        if (!is_object($object)) {
            throw new Exception\RelationNotFoundException(sprintf('Could not find internal by id `%d`', $id));
        }

        $this->assertGranted('related.content.purge', $object->getContainer());
        $this->getObjectManager()->remove($object);
    }

    protected function aggregate(ContainerInterface $related)
    {
        $collection = new ArrayCollection();
        foreach ($related->getHolders() as $holder) {
            $specific = $holder->getSpecific();
            if ($specific instanceof Entity\InternalInterface) {
                $result = new InternalResult();
                $result->setObject($specific);
                $result->setRouter($this->getRouter());
            } elseif ($specific instanceof Entity\ExternalInterface) {
                $result = new ExternalResult();
                $result->setObject($specific);
            } elseif ($specific instanceof Entity\CategoryInterface) {
                $result = new CategoryResult();
                $result->setObject($specific);
            } else {
                throw new Exception\RuntimeException(sprintf(
                    'Could not find a result type for `%s`',
                    get_class($specific)
                ));
            }
            $collection->add($result);
        }

        return $collection;
    }

    /**
     * @param int $id
     * @return Entity\ContainerInterface
     */
    protected function createContainer($id)
    {
        // No Authorization required for this.

        /* @var $container Entity\ContainerInterface */
        $uuid      = $this->getUuid($id);
        $container = $this->getClassResolver()->resolveClassName('RelatedContent\Entity\ContainerInterface');
        $instance  = $this->getInstanceManager()->getInstanceFromRequest();
        $container = new $container($uuid, $instance);
        $this->getObjectManager()->persist($container);
        return $container;
    }

    /**
     * @param Entity\ContainerInterface $container
     * @return Entity\HolderInterface
     */
    protected function createHolder(Entity\ContainerInterface $container)
    {
        $this->assertGranted('related.content.create', $container);

        /* @var $holder Entity\HolderInterface */
        $holder = $this->getClassResolver()->resolve('RelatedContent\Entity\HolderInterface');
        $holder->setContainer($container);
        $holder->setPosition(999);
        $this->getObjectManager()->persist($holder);
        $this->getObjectManager()->flush($holder);

        return $holder;
    }

    protected function getUuid($reference)
    {
        try {
            return $this->getUuidManager()->getUuid($reference);
        } catch (NotFoundException $e) {
            throw new Exception\NotFoundException;
        }
    }
}
