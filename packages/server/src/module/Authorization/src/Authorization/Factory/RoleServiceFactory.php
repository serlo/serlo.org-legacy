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
namespace Authorization\Factory;

use Authorization\Service\RoleService;
use ClassResolver\ClassResolverFactoryTrait;
use Common\Factory\AuthorizationServiceFactoryTrait;
use Common\Factory\EntityManagerFactoryTrait;
use User\Factory\UserManagerFactoryTrait;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class RoleServiceFactory implements FactoryInterface
{
    use ClassResolverFactoryTrait, EntityManagerFactoryTrait, AuthorizationServiceFactoryTrait, UserManagerFactoryTrait;

    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $authorizationService = $this->getAuthorizationService($serviceLocator);
        $objectManager        = $this->getEntityManager($serviceLocator);
        $classResolver        = $this->getClassResolver($serviceLocator);
        $userManager          = $this->getUserManager($serviceLocator);
        $permissionService    = $serviceLocator->get('Authorization\Service\PermissionService');
        $instance             = new RoleService($authorizationService, $classResolver, $objectManager, $permissionService, $userManager);

        return $instance;
    }
}
