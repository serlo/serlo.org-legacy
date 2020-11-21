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
namespace Alias\Controller;

use Alias;
use Alias\AliasManagerInterface;
use Alias\Exception\AliasNotFoundException;
use Instance\Manager\InstanceManagerInterface;
use Zend\Http\Request;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Router\RouteInterface;

class AliasController extends AbstractActionController
{
    /** @var AliasManagerInterface */
    private $aliasManager;
    /** @var InstanceManagerInterface */
    private $instanceManager;
    /** @var RouteInterface */
    private $router;

    public function __construct(
        AliasManagerInterface $aliasManager,
        InstanceManagerInterface $instanceManager,
        RouteInterface $router
    ) {
        $this->aliasManager = $aliasManager;
        $this->instanceManager = $instanceManager;
        $this->router = $router;
    }

    public function resolveAction()
    {
        // Note: URLs of the form `/:id` are instead handled by the Normalizer module and redirect to this route instead.
        // This is necessary because the place in the navigation is determined via route.
        // Furthermore, we have some special behavior for XHR that are used for injections.
        $alias = $this->params('alias');
        $url = $this->resolveLegacyAlias($alias);
        return $url === null
            ? $this->notFoundResponse()
            : $this->routerResponse($url);
    }

    private function resolveLegacyAlias($alias)
    {
        $instance = $this->instanceManager->getInstanceFromRequest();
        try {
            return $this->aliasManager->findSourceByAlias(
                $alias,
                $instance,
                true
            );
        } catch (AliasNotFoundException $e) {
            return null;
        }
    }

    private function routerResponse($url)
    {
        $request = new Request();
        $request->setMethod(Request::METHOD_GET);
        $request->setUri($url);
        $routeMatch = $this->router->match($request);

        if ($routeMatch === null) {
            return $this->notFoundResponse();
        }

        $params = array_merge($routeMatch->getParams(), [
            'forwarded' => true,
            'isXmlHttpRequest' => $this->getRequest()->isXmlHttpRequest(),
        ]);
        $controller = $params['controller'];
        return $this->forward()->dispatch($controller, $params);
    }

    private function notFoundResponse()
    {
        $this->getResponse()->setStatusCode(404);
        return false;
    }
}
