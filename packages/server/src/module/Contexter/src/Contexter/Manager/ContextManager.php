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
namespace Contexter\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Contexter\Entity\ContextInterface;
use Contexter\Entity\RouteInterface;
use Contexter\Exception;
use Contexter\Options\ModuleOptions;
use Contexter\Router;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Type\Entity\TypeInterface;
use Type\TypeManagerAwareTrait;
use Type\TypeManagerInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Uuid\Manager\UuidManagerInterface;
use ZfcRbac\Service\AuthorizationService;

class ContextManager implements ContextManagerInterface
{
    use ObjectManagerAwareTrait, InstanceManagerAwareTrait;
    use UuidManagerAwareTrait;
    use TypeManagerAwareTrait, AuthorizationAssertionTrait;
    use FlushableTrait, ClassResolverAwareTrait;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceManagerInterface $instanceManager,
        ModuleOptions $moduleOptions,
        TypeManagerInterface $typeManager,
        ObjectManager $objectManager,
        UuidManagerInterface $uuidManager
    ) {
        $this->setAuthorizationService($authorizationService);
        $this->classResolver   = $classResolver;
        $this->instanceManager = $instanceManager;
        $this->typeManager     = $typeManager;
        $this->objectManager   = $objectManager;
        $this->uuidManager     = $uuidManager;
        $this->moduleOptions   = $moduleOptions;
    }

    public function add($objectId, $type, $title)
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $this->assertGranted('contexter.context.add', $instance);

        /* @var $context ContextInterface */
        $object  = $this->getUuidManager()->getUuid($objectId);
        $type    = $this->findTypeByName($type);
        $context = $this->getClassResolver()->resolve('Contexter\Entity\ContextInterface');

        $context->setTitle($title);
        $context->setObject($object);
        $context->setInstance($instance);
        $context->setType($type);
        $this->getObjectManager()->persist($context);

        return $context;
    }

    public function addRoute(ContextInterface $context, $routeName, array $params = [])
    {
        $this->assertGranted('contexter.route.add', $context);

        /* @var $route RouteInterface */
        $route = $this->getClassResolver()->resolve('Contexter\Entity\RouteInterface');
        $route->setName($routeName);
        $route->addParameters($params);
        $route->setContext($context);
        $context->addRoute($route);
        $this->getObjectManager()->persist($route);

        return $route;
    }

    public function findAll()
    {
        $className = $this->getClassResolver()->resolveClassName('Contexter\Entity\ContextInterface');
        $results   = $this->getObjectManager()->getRepository($className)->findAll();
        foreach ($results as $result) {
            $this->assertGranted('contexter.context.get', $result);
        }
        return new ArrayCollection($results);
    }

    public function findAllTypeNames()
    {
        return $this->findAllTypes()->map(
            function (TypeInterface $e) {
                return $e->getName();
            }
        );
    }

    public function findTypeByName($name)
    {
        return $this->getTypeManager()->findTypeByName($name);
    }

    public function getContext($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Contexter\Entity\ContextInterface');
        $context   = $this->getObjectManager()->find($className, $id);

        if (!is_object($context)) {
            throw new Exception\ContextNotFoundException(sprintf('Could not find a context by the id of %d', $id));
        }

        $this->assertGranted('contexter.context.get', $context);
        return $context;
    }

    public function getRoute($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Contexter\Entity\RouteInterface');
        $object    = $this->getObjectManager()->find($className, $id);

        if (!is_object($object)) {
            throw new Exception\RuntimeException(sprintf('Could not find a route by the id of %d', $id));
        }

        $this->assertGranted('contexter.route.get', $object);
        return $object;
    }

    public function removeContext($id)
    {
        $context = $this->getContext($id);
        $this->assertGranted('contexter.context.remove', $context);
        $this->getObjectManager()->remove($context);
    }

    public function removeRoute($id)
    {
        $route = $this->getRoute($id);
        $this->assertGranted('contexter.route.remove', $route->getContext());
        $this->getObjectManager()->remove($route);
    }

    protected function findAllTypes()
    {
        $types = $this->moduleOptions->getTypes();
        return $this->getTypeManager()->findTypesByNames($types);
    }

    protected function getTypeRepository()
    {
        $className = $this->getClassResolver()->resolveClassName('Contexter\Entity\TypeInterface');
        return $this->getObjectManager()->getRepository($className);
    }
}
