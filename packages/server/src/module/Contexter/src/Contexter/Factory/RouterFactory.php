<?php
/**
 * This file is part of Serlo.org.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Contexter\Factory;

use Contexter\Router\Router;
use Zend\Mvc\Router\Http\RouteMatch;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class RouterFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceManager)
    {
        $config     = $serviceManager->get('config');
        $routeMatch = $serviceManager->get('Application')->getMvcEvent()->getRouteMatch();
        $routeMatch = $routeMatch !== null ? $routeMatch : new RouteMatch([]);
        $instance   = new Router();
        $instance->setConfig($config['Manager\ContextManager']['router']);
        $instance->setServiceLocator($serviceManager);
        $instance->setRouter($serviceManager->get('Router'));
        $instance->setRouteMatch($routeMatch);
        $instance->setObjectManager($serviceManager->get('Doctrine\ORM\EntityManager'));
        $instance->setClassResolver($serviceManager->get('ClassResolver\ClassResolver'));
        $instance->setContextManager($serviceManager->get('Contexter\Manager\ContextManager'));

        return $instance;
    }
}