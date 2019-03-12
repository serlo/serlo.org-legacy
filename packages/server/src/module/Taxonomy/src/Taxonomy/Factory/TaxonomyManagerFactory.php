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
namespace Taxonomy\Factory;

use ClassResolver\ClassResolverFactoryTrait;
use Common\Factory\AuthorizationServiceFactoryTrait;
use Common\Factory\EntityManagerFactoryTrait;
use Instance\Factory\InstanceManagerFactoryTrait;
use Taxonomy\Manager\TaxonomyManager;
use Taxonomy\Options\ModuleOptions;
use Type\Factory\TypeManagerFactoryTrait;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class TaxonomyManagerFactory implements FactoryInterface
{
    use ClassResolverFactoryTrait, EntityManagerFactoryTrait;
    use TypeManagerFactoryTrait, AuthorizationServiceFactoryTrait;
    use InstanceManagerFactoryTrait;

    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        /* @var $moduleOptions ModuleOptions */
        $authorizationService = $this->getAuthorizationService($serviceLocator);
        $classResolver        = $this->getClassResolver($serviceLocator);
        $objectManager        = $this->getEntityManager($serviceLocator);
        $typeManager          = $this->getTypeManager($serviceLocator);
        $instanceManager      = $this->getInstanceManager($serviceLocator);
        $moduleOptions        = $serviceLocator->get('Taxonomy\Options\ModuleOptions');
        $service              = new TaxonomyManager($authorizationService, $classResolver, $moduleOptions, $instanceManager, $objectManager, $typeManager);
        return $service;
    }
}
