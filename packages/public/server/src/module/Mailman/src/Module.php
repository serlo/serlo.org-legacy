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
namespace Mailman;

use Mailman\Options\ModuleOptions;
use Zend\Console\Request;
use Zend\EventManager\EventInterface;
use Zend\ModuleManager\Feature\BootstrapListenerInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\Mvc\MvcEvent;
use Zend\Uri\Http;
use Zend\View\Helper\ServerUrl;

class Module implements BootstrapListenerInterface, ConfigProviderInterface
{
    public static $listeners = [
        'Mailman\Listener\UserControllerListener',
        'Mailman\Listener\AuthenticationControllerListener',
        'Mailman\Listener\NotificationWorkerListener',
    ];

    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function onBootstrap(EventInterface $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $eventManager->attach(MvcEvent::EVENT_DISPATCH, array($this, 'onDispatchRegisterListeners'), 1000);
    }

    public function onDispatchRegisterListeners(MvcEvent $e)
    {
        $eventManager       = $e->getApplication()->getEventManager();
        $sharedEventManager = $eventManager->getSharedManager();
        foreach (self::$listeners as $listener) {
            $sharedEventManager->attachAggregate(
                $e->getApplication()->getServiceManager()->get($listener)
            );
        }

        $application        = $e->getApplication();
        $serviceLocator     = $application->getServiceManager();
        if ($e->getRequest() instanceof Request) {
            /* @var $moduleOptions Options\ModuleOptions */
            $moduleOptions = $serviceLocator->get('Mailman\Options\ModuleOptions');
            $uri           = new Http($moduleOptions->getLocation());
            $serviceLocator->get('HttpRouter')->setRequestUri($uri);

            $moduleOptions = $serviceLocator->get('Mailman\Options\ModuleOptions');
            $serverUrlHelper = $serviceLocator->get('ViewHelperManager')->get('serverUrl');
            $this->injectServerUrl($serverUrlHelper, $moduleOptions);
            $serverUrlHelper = $serviceLocator->get('ZfcTwigViewHelperManager')->get('serverUrl');
            $this->injectServerUrl($serverUrlHelper, $moduleOptions);
        }
    }

    /**
     * @param ServerUrl     $serverUrlHelper
     * @param ModuleOptions $moduleOptions
     */
    protected function injectServerUrl(ServerUrl $serverUrlHelper, ModuleOptions $moduleOptions)
    {
        $options = parse_url($moduleOptions->getLocation());
        $serverUrlHelper->setScheme($options['scheme']);
        $serverUrlHelper->setHost($options['host']);
    }
}
