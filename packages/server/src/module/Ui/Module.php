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
namespace Ui;

use Zend\EventManager\Event;
use Zend\Mvc\MvcEvent;
use Zend\Stdlib\ArrayUtils;
use Zend\Navigation\Page\Mvc;

class Module
{
    public function getAutoloaderConfig()
    {
        if (file_exists(__DIR__ . '/autoload_classmap.php')) {
            return [
                'Zend\Loader\ClassMapAutoloader' => [
                    __DIR__ . '/autoload_classmap.php',
                ],
            ];
        } else {
            return [
                'Zend\Loader\StandardAutoloader' => [
                    'namespaces' => [
                        __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                    ],
                ],
            ];
        }
    }

    public function getConfig()
    {
        $config = include __DIR__ . '/config/module.config.php';

        if (file_exists(__DIR__ . '/template_map.php')) {
            $templates = [];
            $templates['view_manager'] = [
                'template_map' => include __DIR__ . '/template_map.php',
            ];

            return ArrayUtils::merge($config, $templates);
        }

        $config['view_manager']['template_path_stack'] = [
            __DIR__ . '/templates',
        ];

        return $config;
    }

    public function onBootstrap(MvcEvent $e)
    {
        $application = $e->getApplication();
        $eventManager = $application->getEventManager();
        $eventManager->getSharedManager()->attach(
            'Zend\Mvc\Controller\AbstractController',
            MvcEvent::EVENT_DISPATCH,
            array($this, 'onDispatch'),
            // WARN: Do not changes this or navigation *will* break
            -90
        );
    }

    public function onDispatch(Event $e)
    {
        $controller = $e->getTarget();
        $serviceManager = $controller->getServiceLocator();
        $container = $serviceManager->get('default_navigation');
        $vm = $e->getViewModel();

        // If no active navigation is found, we revert to 1-col layout
        foreach ($container as $page) {
            /* @var $page Mvc */
            if ($page->isVisible(false) && $page->isActive(true)) {
                return;
            }
        }

        // The template has not been changed by the controller, so can override it!
        if (in_array($vm->getTemplate(), ['layout/layout', 'layout/1-col', 'layout/3-col', 'layout/2-col'])) {
            $controller->layout('layout/1-col');
        }
    }
}
