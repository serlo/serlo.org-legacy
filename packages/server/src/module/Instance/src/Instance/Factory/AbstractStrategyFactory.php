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

use Zend\Mvc\Router\RouteMatch;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

abstract class AbstractStrategyFactory implements FactoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        /* @var $serviceLocator AbstractPluginManager */
        $serviceManager = $serviceLocator->getServiceLocator();
        $response       = $serviceManager->get('Response');
        $request        = $serviceManager->get('Request');
        $router         = $serviceManager->get('Router');
        $routeMatch     = $router->match($request);
        $class          = $this->getClass();

        if (null === $routeMatch) {
            $routeMatch = new RouteMatch([]);
            $routeMatch->setMatchedRouteName('home');
        }

        return new $class($response, $router, $routeMatch);
    }

    abstract protected function getClass();
}
