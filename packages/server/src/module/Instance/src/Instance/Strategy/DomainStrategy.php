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
use Instance\Exception;
use Instance\Manager\InstanceManagerInterface;
use Zend\Mvc\Router\RouteInterface;
use Zend\Mvc\Router\RouteMatch;
use Zend\Stdlib\ResponseInterface;

class DomainStrategy extends AbstractStrategy
{
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
     * @var InstanceInterface
     */
    protected $instance;

    /**
     * @param ResponseInterface $response
     * @param RouteInterface    $router
     * @param RouteMatch        $routeMatch
     */
    public function __construct(ResponseInterface $response, RouteInterface $router, RouteMatch $routeMatch)
    {
        $this->response   = $response;
        $this->routeMatch = $routeMatch;
        $this->router     = $router;
    }

    /**
     * {@inheritDoc}
     */
    public function getActiveInstance(InstanceManagerInterface $instanceManager)
    {
        if (!array_key_exists('HTTP_HOST', (array)$_SERVER)) {
            return $instanceManager->getDefaultInstance();
        }

        if (!is_object($this->instance)) {
            $subDomain      = explode('.', $_SERVER['HTTP_HOST'])[0];
            $this->instance = $instanceManager->findInstanceBySubDomain($subDomain);
        }

        return $this->instance;
    }

    /**
     * {@inheritDoc}
     */
    public function switchInstance(InstanceInterface $instance)
    {
        if (!array_key_exists('HTTP_HOST', (array)$_SERVER)) {
            throw new Exception\RuntimeException(sprintf('Host not set.'));
        }

        $url = $this->router->assemble(
            $this->routeMatch->getParams(),
            [
                'name' => $this->routeMatch->getMatchedRouteName(),
            ]
        );

        $hostNames = explode('.', $_SERVER['HTTP_HOST']);
        $tld       = $hostNames[count($hostNames) - 2] . "." . $hostNames[count($hostNames) - 1];
        $url = 'http://' . $instance->getSubdomain() . '.' . $tld . $url;

        $this->redirect($url);
    }
}
