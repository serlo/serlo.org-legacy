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
namespace AtheneTest\TestCase;

use ClassResolver\ClassResolverInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Zend\EventManager\EventManagerInterface;
use Zend\ServiceManager\ServiceManager;
use ZfcRbac\Service\AuthorizationService;

abstract class AbstractManagerTestCase extends AbstractObjectManagerTestCase
{

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $classResolver;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $serviceLocator;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $objectManager;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $authorizationService;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $eventManager;


    /**
     * Creates a mocked version of ClassResolver\ClassResolverInterface
     */
    final protected function mockClassResolver()
    {
        return $this->createMock(ClassResolverInterface::class);
    }

    /**
     * Creates a mocked version of Zend\ServiceManager\ServiceManager
     */
    final protected function mockServiceLocator()
    {
        return $this->createMock(ServiceManager::class);
    }

    /**
     * Creates a mocked version of Doctrine\Common\Persistence\ObjectManager
     */
    final protected function mockObjectManager()
    {
        return $this->createMock(ObjectManager::class);
    }

    /**
     * Creates a mocked version of ZfcRbac\Service\AuthorizationService
     */
    final protected function mockAuthorizationService()
    {
        return $this->createMock(AuthorizationService::class);
    }

    /**
     * Creates a mocked version of Zend\EventManager\EventManagerInterface
     */
    final protected function mockEventManager()
    {
        return $this->createMock(EventManagerInterface::class);
    }

    /**
     * Registers a new expectation for method 'find' on $objectManager
     *
     * @param \PHPUnit_Framework_MockObject_MockObject $objectManager Mocked ObjectManager
     * @param string $repositoryName Name of the repository
     * @param mixed $id The identity of the object to find
     * @param mixed $expectedReturn Expected return value for method "find"
     */
    final protected function prepareFind(\PHPUnit_Framework_MockObject_MockObject $objectManager, $repositoryName, $id, $expectedReturn)
    {
        $objectManager->expects($this->once())
            ->method('find')
            ->with($this->equalTo($repositoryName), $this->equalTo($id))
            ->will($this->returnValue($expectedReturn));
    }

    /**
     * Registers a new expectation for method 'resolveClassName' on $classResolver
     *
     * @param \PHPUnit_Framework_MockObject_MockObject $classResolver Mocked ClassResolver
     * @param string $classNameToResolve  Name of class to resolve
     * @param string $expectedReturn Expected return value for method "resolveClassName"
     */
    final protected function prepareResolveClass(\PHPUnit_Framework_MockObject_MockObject $classResolver, $classNameToResolve, $expectedReturn)
    {
        $classResolver->expects($this->once())
            ->method('resolveClassName')
            ->with($this->equalTo($classNameToResolve))
            ->will($this->returnValue($expectedReturn));
    }

    /**
     * Registers a new expectation for method 'resolve' on $classResolver
     *
     * @param \PHPUnit_Framework_MockObject_MockObject $classResolver Mocked ClassResolver
     * @param string $classNameToResolve  Name of class to resolve
     * @param mixed $expectedReturn Expected return value for method "resolve"
     */
    final protected function prepareResolve(\PHPUnit_Framework_MockObject_MockObject $classResolver, $classNameToResolve, $expectedReturn)
    {
        $classResolver->expects($this->once())
            ->method('resolve')
            ->with($this->equalTo($classNameToResolve))
            ->will($this->returnValue($expectedReturn));
    }

    /**
     * Registers a new expectation for method 'isGranted' on $authorizationService
     *
     * @param \PHPUnit_Framework_MockObject_MockObject $authorizationService The mocked AuthorizationService
     * @param string $permission The permission to check
     * @param mixed $context Context of the permission
     * @param boolean $expectedReturn Granted or not
     */
    final protected function prepareIsGranted(\PHPUnit_Framework_MockObject_MockObject $authorizationService, $permission, $context, $expectedReturn)
    {
        $authorizationService->expects($this->once())
            ->method('isGranted')
            ->with($this->equalTo($permission), $this->equalTo($context))
            ->will($this->returnValue($expectedReturn));
    }


    /**
     * Registers a new expectation for method 'findBy' on a mocked Repository specified via $repository
     *
     * @param \PHPUnit_Framework_MockObject_MockObject $objectManager Mocked ObjectManager for the Repository
     * @param string $repository Name of the Repository
     * @param array $criteria Criteria for findBy
     * @param mixed $expectedReturn Expected return value for findBy
     */
    final protected function prepareFindBy($objectManager, $repository, array $criteria, $expectedReturn)
    {
        $repo = $this->mockEntityRepository();

        $objectManager->expects($this->once())
            ->method('getRepository')
            ->with($repository)
            ->will($this->returnValue($repo));

        $repo->expects($this->once())
            ->method('findBy')
            ->with($criteria)
            ->will($this->returnValue($expectedReturn));
    }

    /**
     * Registers a new expectation for method 'findOneBy' on a mocked Repository specified via $repository
     *
     * @param \PHPUnit_Framework_MockObject_MockObject $objectManager Mocked ObjectManager for the Repository
     * @param string $repository Name of the Repository
     * @param array $criteria Criteria for findOneBy
     * @param mixed $expectedReturn Expected return value for findOneBy
     */
    final protected function prepareFindOneBy($objectManager, $repository, array $criteria, $expectedReturn)
    {
        $repo = $this->mockEntityRepository();

        $objectManager->expects($this->once())
            ->method('getRepository')
            ->with($repository)
            ->will($this->returnValue($repo));

        $repo->expects($this->once())
            ->method('findOneBy')
            ->with($criteria)
            ->will($this->returnValue($expectedReturn));
    }
}
