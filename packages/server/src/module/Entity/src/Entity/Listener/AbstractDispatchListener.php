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
namespace Entity\Listener;

use Common\Listener\AbstractSharedListenerAggregate;
use Entity\Controller\AbstractController;
use Navigation\Factory\DefaultNavigationFactory;
use Taxonomy\Strategy\BranchDecisionMakerStrategy;
use Taxonomy\Strategy\ShortestBranchDecisionMaker;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use Zend\Mvc\MvcEvent;
use Zend\Mvc\Router\RouteMatch;

abstract class AbstractDispatchListener extends AbstractSharedListenerAggregate
{
    protected $strategy;

    public function __construct(BranchDecisionMakerStrategy $strategy = null)
    {
        if (!$strategy) {
            $strategy = new ShortestBranchDecisionMaker();
        }
        $this->strategy = $strategy;
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            MvcEvent::EVENT_DISPATCH,
            [
                $this,
                'onDispatch',
            ]
        );
    }

    public function onDispatch(Event $event)
    {
        $controller = $event->getTarget();
        if (!$controller instanceof AbstractController) {
            return;
        }

        $entity = $controller->getEntity();
        if (!$entity) {
            return;
        }

        $terms = $entity->getTaxonomyTerms();

        if ($terms->isEmpty()) {
            foreach ($entity->getParents('link') as $parent) {
                $terms = $parent->getTaxonomyTerms();
                if (!$terms->isEmpty()) {
                    break;
                }
            }
        }

        $term  = $this->strategy->findBranch($terms);

        if ($term) {
            /* @var $navigationFactory DefaultNavigationFactory */
            $navigationFactory = $controller->getServiceLocator()->get(
                'Navigation\Factory\DefaultNavigationFactory'
            );
            $params            = [
                'term'       => $term->getId(),
                'controller' => 'Taxonomy\Controller\GetController',
                'action'     => 'index',
            ];
            $routeMatch        = new RouteMatch($params);

            $routeMatch->setMatchedRouteName('taxonomy/term/get');
            $navigationFactory->setRouteMatch($routeMatch);
        }
    }
}
