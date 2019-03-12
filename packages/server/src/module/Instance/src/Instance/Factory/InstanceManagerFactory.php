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
namespace Instance\Factory;

use ClassResolver\ClassResolverFactoryTrait;
use Common\Factory\AuthorizationServiceFactoryTrait;
use Common\Factory\EntityManagerFactoryTrait;
use Instance\Manager\InstanceManager;
use Instance\Options\InstanceOptions;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class InstanceManagerFactory implements FactoryInterface
{
    use EntityManagerFactoryTrait;
    use ClassResolverFactoryTrait;
    use AuthorizationServiceFactoryTrait;

    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        /* @var $options InstanceOptions */
        $options = $serviceLocator->get('Instance\Options\InstanceOptions');
        /* @var $pluginManager AbstractPluginManager */
        $pluginManager        = $serviceLocator->get('Instance\Strategy\StrategyPluginManager');
        $objectManager        = $this->getEntityManager($serviceLocator);
        $classResolver        = $this->getClassResolver($serviceLocator);
        $authorizationService = $this->getAuthorizationService($serviceLocator);
        $strategy             = $pluginManager->get($options->getStrategy());
        $instance             = new InstanceManager($authorizationService, $classResolver, $options, $objectManager, $strategy);

        return $instance;
    }
}
