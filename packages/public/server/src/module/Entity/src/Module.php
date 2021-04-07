<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Entity;

use Zend\EventManager\EventInterface;
use Zend\ModuleManager\Feature\BootstrapListenerInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\Mvc\MvcEvent;
use Zend\Stdlib\ArrayUtils;

class Module implements BootstrapListenerInterface, ConfigProviderInterface
{
    public static $listeners = [
        'Entity\Listener\EntityControllerListener',
        'Entity\Listener\RepositoryControllerListener',
        'Entity\Listener\PageControllerListener',
    ];

    public function getConfig()
    {
        $include = ['module', 'types', 'route'];
        $config = [];

        foreach ($include as $file) {
            $config = ArrayUtils::merge(
                $config,
                include __DIR__ . '/../config/' . $file . '.config.php'
            );
        }

        return $config;
    }

    public function onBootstrap(EventInterface $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $eventManager->attach(
            MvcEvent::EVENT_DISPATCH,
            [$this, 'onDispatchRegisterListeners'],
            1000
        );
    }

    public function onDispatchRegisterListeners(MvcEvent $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $sharedEventManager = $eventManager->getSharedManager();
        foreach (self::$listeners as $listener) {
            $sharedEventManager->attachAggregate(
                $e
                    ->getApplication()
                    ->getServiceManager()
                    ->get($listener)
            );
        }
    }
}
