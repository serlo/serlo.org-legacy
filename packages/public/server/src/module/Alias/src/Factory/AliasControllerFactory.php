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
namespace Alias\Factory;

use Alias\AliasManager;
use Alias\AliasManagerInterface;
use Alias\Controller\AliasController;
use Common\Factory\AbstractControllerFactory;
use Instance\Manager\InstanceManager;
use Instance\Manager\InstanceManagerInterface;
use Zend\Mvc\Router\RouteInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AliasControllerFactory extends AbstractControllerFactory
{
    protected function createController(ServiceLocatorInterface $serviceManager)
    {
        /** @var AliasManagerInterface $aliasManager */
        $aliasManager = $serviceManager->get(AliasManager::class);
        /** @var InstanceManagerInterface $instanceManager */
        $instanceManager = $serviceManager->get(InstanceManager::class);
        /** @var RouteInterface $router */
        $router = $serviceManager->get('Router');
        return new AliasController($aliasManager, $instanceManager, $router);
    }
}
