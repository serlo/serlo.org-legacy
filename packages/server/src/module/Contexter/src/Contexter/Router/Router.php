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
namespace Contexter\Router;

use Contexter\Adapter\AdapterInterface;
use Contexter\Entity;
use Contexter\Exception;
use Doctrine\Common\Collections\ArrayCollection;
use Type\Entity\TypeInterface;
use Zend\Http\Request;
use Zend\Mvc\Router\RouteMatch;

class Router implements RouterInterface
{
    use \Common\Traits\RouterAwareTrait, \Zend\ServiceManager\ServiceLocatorAwareTrait, \Common\Traits\ConfigAwareTrait,
        \Contexter\Manager\ContextManagerAwareTrait, \Common\Traits\ObjectManagerAwareTrait,
        \ClassResolver\ClassResolverAwareTrait;

    /**
     * @var RouteMatch
     */
    protected $routeMatch;

    /**
     * @var RouteMatch
     */
    protected $factoryRouteMatch;

    /**
     * @var array
     */
    protected $parameters;

    /**
     * @var AdapterInterface[]
     */
    protected $adapters;

    public function match($uri = null, $type = null)
    {
        if ($uri !== null) {
            $routeMatch = $this->matchUri($uri);
            $this->setRouteMatch($routeMatch);
        } else {
            if (!is_object($this->getRouteMatch())) {
                throw new \Contexter\Exception\RuntimeException(sprintf('No RouteMatch set!'));
            }
        }

        $className = $this->getClassResolver()->resolveClassName('Contexter\Entity\RouteInterface');

        $criteria = [
            'name' => $this->getRouteMatch()->getMatchedRouteName(),
        ];

        if ($type) {
            $type = $this->getContextManager()->findTypeByName($type);
        }

        $routes = $this->getObjectManager()->getRepository($className)->findBy($criteria);

        $result = $this->matchRoutes($routes, $type);
        $this->clear();

        return $result;
    }

    public function matchUri($uri)
    {
        $request = new Request();
        $request->setUri($uri);
        $request->setMethod('post');

        return $this->getRouter()->match($request);
    }

    public function getAdapter()
    {
        $requestedController = $this->getRouteMatch()->getParam('controller');
        $requestedAction     = $this->getRouteMatch()->getParam('action');
        $adapters            = $this->getOption('adapters');
        foreach ($adapters as $adapter) {
            foreach ($adapter['controllers'] as $controller) {
                $action = isset($controller['action']) ? ($controller['action'] === $requestedAction) : true;
                if ($controller['controller'] === $requestedController && $action) {
                    $controller = $requestedController;
                    /* @var $adapter AdapterInterface */
                    $adapter = $this->getServiceLocator()->get($adapter['adapter']);
                    $adapter->setRouteMatch($this->getRouteMatch());
                    $adapter->setAdaptee(
                        $this->getServiceLocator()->get($controller)
                    );

                    return $adapter;
                }
            }
        }

        throw new Exception\RuntimeException(sprintf(
            'No suitable adapter found for controller `%s`',
            $requestedController
        ));
    }

    public function hasAdapter()
    {
        try {
            $this->getAdapter();

            return true;
        } catch (Exception\RuntimeException $e) {
            return false;
        }
    }

    /**
     * @return RouteMatch $routeMatch
     */
    public function getRouteMatch()
    {
        return $this->routeMatch;
    }

    /**
     * @param RouteMatch $routeMatch
     * @return self
     */
    public function setRouteMatch(RouteMatch $routeMatch)
    {
        if ($this->factoryRouteMatch === null) {
            $this->factoryRouteMatch = $this->routeMatch;
        }
        $this->routeMatch = $routeMatch;

        return $this;
    }

    protected function matchRoutes(array $routes, TypeInterface $type = null)
    {
        $result = new ArrayCollection();
        /* @var $route Entity\RouteInterface */
        foreach ($routes as $route) {
            if ((!$type || $route->getContext()->getType() === $type) && $this->matchesParameters($route)) {
                $context = $this->getContextManager()->getContext(
                    $route->getContext()->getId()
                );
                $result->add($context);
            }
        }

        return $result;
    }

    protected function matchesParameters(Entity\RouteInterface $route)
    {
        /* @var $parameter Entity\RouteParameterInterface */
        foreach ($route->getParameters() as $parameter) {
            if (!$this->matchesParameter($parameter)) {
                return false;
            }
        }

        return true;
    }

    protected function matchesParameter(Entity\RouteParameterInterface $parameter)
    {
        $parameters = $this->getAdapter()->getParams();
        $key        = $parameter->getKey();

        if (isset($parameters[$key])) {
            if (is_array($parameters[$key])) {
                return in_array($parameter->getValue(), $parameters[$key]);
            } else {
                return strtolower($parameters[$key]) == strtolower($parameter->getValue());
            }
        }

        return false;
    }

    protected function clear()
    {
        if (is_object($this->factoryRouteMatch)) {
            $this->setRouteMatch($this->factoryRouteMatch);
        }

        return $this;
    }

    protected function getDefaultConfig()
    {
        return [
            'adapters' => [],
        ];
    }
}
