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
namespace Instance\Strategy;

use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceManagerInterface;
use Zend\Mvc\Router\RouteInterface;
use Zend\Mvc\Router\RouteMatch;
use Zend\Session\AbstractContainer;
use Zend\Session\Container;
use Zend\Stdlib\ResponseInterface;

class CookieStrategy extends AbstractStrategy
{
    /**
     * @var InstanceInterface
     */
    protected $instance;

    /**
     * @var AbstractContainer
     */
    protected $container;

    /**
     * @var ResponseInterface
     */
    protected $response;

    /**
     * @var RouteInterface
     */
    protected $router;

    /**
     * @var RouteMatch
     */
    protected $routeMatch;

    /**
     * @param ResponseInterface $response
     * @param RouteInterface    $router
     * @param RouteMatch        $routeMatch
     * @param AbstractContainer $container
     */
    public function __construct(
        ResponseInterface $response,
        RouteInterface $router,
        RouteMatch $routeMatch,
        AbstractContainer $container = null
    ) {
        $this->container  = $container;
        $this->response   = $response;
        $this->router     = $router;
        $this->routeMatch = $routeMatch;
    }

    /**
     * {@inheritDoc}
     */
    public function getActiveInstance(InstanceManagerInterface $instanceManager)
    {
        if (!is_object($this->instance)) {
            $container = $this->getContainer();
            if (!$container->offsetExists('instance')) {
                $this->instance = $instanceManager->getDefaultInstance();
            } else {
                $this->instance = $instanceManager->getInstance($container->offsetGet('instance'));
            }
        }

        return $this->instance;
    }

    /**
     * {@inheritDoc}
     */
    public function switchInstance(InstanceInterface $instance)
    {
        $container = $this->getContainer();
        $container->offsetSet('instance', $instance->getId());
        $url = $this->router->assemble($this->routeMatch->getParams(), ['name' => $this->routeMatch->getMatchedRouteName()]);
        $this->redirect($url);
    }

    /**
     * @return AbstractContainer
     */
    protected function getContainer()
    {
        if (!is_object($this->container)) {
            $this->container = new Container('instance');
        }

        return $this->container;
    }
}
