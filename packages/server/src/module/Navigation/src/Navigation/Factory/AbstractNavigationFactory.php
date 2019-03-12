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
namespace Navigation\Factory;

use Zend\Mvc\ApplicationInterface;
use Zend\Mvc\Router\RouteMatch;
use Zend\Navigation\Service\AbstractNavigationFactory as ZendAbstractNavigationFactory;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * Class AbstractNavigationFactory
 * Works, even if no RouteMatch is returned by the Application.
 *
 * @package Navigation\Factory
 */
abstract class AbstractNavigationFactory extends ZendAbstractNavigationFactory
{
    /**
     * @var RouteMatch
     */
    protected $routeMatch;

    /**
     * @param ApplicationInterface $application
     * @return RouteMatch
     */
    public function getRouteMatch(ApplicationInterface $application)
    {
        if (!is_object($this->routeMatch)) {
            if (is_object($application->getMvcEvent()->getRouteMatch())) {
                $this->setRouteMatch($application->getMvcEvent()->getRouteMatch());
            } else {
                $this->setRouteMatch(new RouteMatch([]));
            }
        }
        return $this->routeMatch;
    }

    /**
     * @param RouteMatch $routeMatch
     */
    public function setRouteMatch(RouteMatch $routeMatch)
    {
        $this->routeMatch = $routeMatch;
    }

    /**
     * @param ServiceLocatorInterface   $serviceLocator
     * @param array|\Zend\Config\Config $pages
     * @return mixed
     */
    protected function preparePages(ServiceLocatorInterface $serviceLocator, $pages)
    {
        $application = $serviceLocator->get('Application');
        $routeMatch  = $this->getRouteMatch($application);
        $router      = $application->getMvcEvent()->getRouter();

        return $this->injectComponents($pages, $routeMatch, $router);
    }
}
