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
namespace Page\Provider;

use Zend\Mvc\MvcEvent;

class FirewallHydrator
{
    use\Page\Manager\PageManagerAwareTrait;
    use\Zend\ServiceManager\ServiceLocatorAwareTrait;

    protected $event;

    public function __construct(MvcEvent $event)
    {
        $this->event = $event;
    }

    public function getRoles()
    {
        $this->setPageManager(
            $this->getServiceLocator()->get('Page\Manager\PageManager')
        );
        $routeMatch = $this->event->getRouteMatch();
        $id         = $routeMatch->getParam('page');
        if ($id === null) {
            $id = $routeMatch->getParam('id');
        }
        $pageRepository = $this->getPageManager()->getPageRepository($id);

        $allRoles = $this->getPageManager()->findAllRoles();
        $array    = [];

        foreach ($allRoles as $role) {
            if ($pageRepository->hasRole($role)) {
                $array[] = $role->getName();
            }
        }

        return $array;
    }
}
