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
namespace Alias\Controller;

use Alias;
use Alias\AliasManagerInterface;
use Alias\Controller\Plugin\Url;
use Instance\Manager\InstanceManagerInterface;
use Normalizer\NormalizerInterface;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class AliasController extends AbstractActionController
{
    /** @var AliasManagerInterface */
    private $aliasManager;
    /** @var InstanceManagerInterface */
    private $instanceManager;
    /** @var UuidManagerInterface */
    private $uuidManager;
    /** @var NormalizerInterface */
    private $normalizer;

    public function __construct(
        AliasManagerInterface $aliasManager,
        InstanceManagerInterface $instanceManager,
        UuidManagerInterface $uuidManager,
        NormalizerInterface $normalizer
    ) {
        $this->aliasManager = $aliasManager;
        $this->instanceManager = $instanceManager;
        $this->uuidManager = $uuidManager;
        $this->normalizer = $normalizer;
    }

    public function resolveAction()
    {
        $alias = $this->params('alias');

        if (preg_match('/^(?<id>\d+)$/', $alias, $matches)) {
            return $this->resolveUuid($matches['id']);
        } else {
            $url = $this->resolveAlias($alias);
            return $url === null
                ? $this->notFoundResponse()
                : $this->routerResponse($url);
        }
    }

    private function resolveAlias($alias)
    {
        $uuid = $this->aliasManager->getObjectOfAlias($alias);
        if ($uuid === null) {
            $instance = $this->instanceManager->getInstanceFromRequest();
            return $this->aliasManager->resolveLegacyAlias($alias, $instance);
        } else {
            $normalized = $this->normalizer->normalize($uuid);
            return $this->getUrlOfNormalizedObject($normalized);
        }
    }

    private function resolveUuid($id)
    {
        try {
            $object = $this->uuidManager->getUuid($id, true);
        } catch (NotFoundException $e) {
            return $this->notFoundResponse();
        }
        $normalized = $this->normalizer->normalize($object);
        $url = $this->getUrlOfNormalizedObject($normalized);
        $response = $this->routerResponse($url);

        if (!$this->getRequest()->isXmlHttpRequest()) {
            return $response;
        }

        // Note: The behavior below is needed for injections. Basically, we override the response when we have an XHR and return JSON instead.

        if ($response instanceof JsonModel) {
            $response = new ViewModel(['data' => $response->getVariables()]);
            $response->setTemplate('normalizer/json');
        }

        $view = new ViewModel([
            'id' => $object->getId(),
            'type' => $normalized->getType(),
            'url' => $url,
            '__disableTemplateDebugger' => true,
        ]);

        $view->addChild($response, 'response');
        $view->setTemplate('normalizer/ref');
        $view->setTerminal(true);
        return $view;
    }

    private function getUrlOfNormalizedObject($normalized)
    {
        $routeName = $normalized->getRouteName();
        $routeParams = $normalized->getRouteParams();
        /** @var Url $urlPlugin */
        $urlPlugin = $this->url();
        return $urlPlugin->fromRoute(
            $routeName,
            $routeParams,
            null,
            null,
            false
        );
    }

    private function routerResponse($url)
    {
        $routeMatch = $this->aliasManager->routeMatchUrl($url);
        if ($routeMatch === null) {
            return $this->notFoundResponse();
        }
        $this->getEvent()->setRouteMatch($routeMatch);
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
