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
namespace Alias;

use Exception;
use Zend\EventManager\EventInterface;
use Zend\Http\Request as HttpRequest;
use Zend\Http\Response as HttpResponse;
use Zend\ModuleManager\Feature\BootstrapListenerInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\Mvc\MvcEvent;

class Module implements BootstrapListenerInterface, ConfigProviderInterface
{
    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function onBootstrap(EventInterface $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $eventManager->attach(
            MvcEvent::EVENT_DISPATCH,
            [$this, 'onDispatch'],
            1000
        );
    }

    public function onDispatch(MvcEvent $e)
    {
        $application = $e->getApplication();
        $response = $e->getResponse();
        $request = $application->getRequest();
        $serviceManager = $application->getServiceManager();
        /* @var $aliasManager AliasManagerInterface */
        $aliasManager = $serviceManager->get('Alias\AliasManager');
        $instanceManager = $serviceManager->get(
            'Instance\Manager\InstanceManager'
        );

        if (
            !(
                $response instanceof HttpResponse &&
                $request instanceof HttpRequest
            )
        ) {
            return null;
        }

        /* @var $uriClone \Zend\Uri\Http */
        $uriClone = clone $request->getUri();
        $uri = $uriClone->getPath();
        $query = $uriClone->getQuery();

        try {
            $location = $aliasManager->findAliasBySource(
                $uri,
                $instanceManager->getInstanceFromRequest()
            );
        } catch (Exception $ex) {
            return null;
        }

        if ($query) {
            $location .= '?' . $query;
        }

        $response->getHeaders()->addHeaderLine('Location', $location);
        $response->setStatusCode(301);
        $response->sendHeaders();
        $e->stopPropagation();
        return $response;
    }

    public function onDispatchError(MvcEvent $e)
    {
        $application = $e->getApplication();
        $response = $e->getResponse();
        $request = $application->getRequest();
        $serviceManager = $application->getServiceManager();
        /* @var $aliasManager AliasManagerInterface */
        $aliasManager = $serviceManager->get('Alias\AliasManager');
        $instanceManager = $serviceManager->get(
            'Instance\Manager\InstanceManager'
        );
        if (
            !(
                $response instanceof HttpResponse &&
                $request instanceof HttpRequest
            )
        ) {
            return null;
        }

        /* @var $uriClone \Zend\Uri\Http */
        $uriClone = clone $request->getUri();

        try {
            $uri = $uriClone->makeRelative('/')->getPath();
            $location = $aliasManager->findCanonicalAlias(
                $uri,
                $instanceManager->getInstanceFromRequest()
            );
        } catch (Exception $ex) {
            return null;
        }

        $response->getHeaders()->addHeaderLine('Location', $location);
        $response->setStatusCode(301);
        $response->sendHeaders();
        $e->stopPropagation();
        return $response;
    }
}
