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

namespace Alias\Factory;

use Alias\View\Helper\Url;
use Zend\Console\Console;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class UrlHelperFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $helperPluginManager
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $helperPluginManager)
    {
        $serviceLocator = $helperPluginManager->getServiceLocator();
        $aliasManager   = $serviceLocator->get('Alias\AliasManager');
        $tenantManager  = $serviceLocator->get('Instance\Manager\InstanceManager');
        $isConsole      = Console::isConsole();
        $router         = $isConsole ? 'HttpRouter' : 'Router';
        $match          = $serviceLocator->get('application')->getMvcEvent()->getRouteMatch();
        $helper         = new Url($aliasManager, $tenantManager);

        $helper->setRouter($serviceLocator->get($router));

        $interface = 'Zend\Mvc\Router\\';
        $interface = $interface . $isConsole ? 'Console' : 'Http';
        $interface = $interface . '\RouteMatch';

        if ($match instanceof $interface) {
            $helper->setRouteMatch($match);
        }

        return $helper;
    }
}
