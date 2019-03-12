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
namespace Authorization\Guard;

use Zend\Mvc\MvcEvent;
use ZfcRbac\Guard\ControllerGuard;

/**
 * A hydratable controller guard can protect a controller and a set of actions
 * and hydrate the roles with a
 */
class HydratableControllerGuard extends ControllerGuard
{
    use\Zend\ServiceManager\ServiceLocatorAwareTrait;

    /**
     * {@inheritDoc}
     */
    public function setRules(array $rules)
    {
        $this->rules = [];

        foreach ($rules as $rule) {
            $controller = strtolower($rule['controller']);
            $actions    = isset($rule['actions']) ? (array)$rule['actions'] : [];

            if (empty($actions)) {
                $this->rules[$controller][0] = $rule['role_provider'];
                continue;
            }

            foreach ($actions as $action) {
                $this->rules[$controller][strtolower($action)] = $rule['role_provider'];
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    public function isGranted(MvcEvent $event)
    {
        $routeMatch = $event->getRouteMatch();
        $controller = strtolower($routeMatch->getParam('controller'));
        $action     = strtolower($routeMatch->getParam('action'));

        // If no rules apply, it is considered as granted or not based on the protection policy
        if (!isset($this->rules[$controller])) {
            return $this->protectionPolicy === self::POLICY_ALLOW;
        }

        // Algorithm is as follow: we first check if there is an exact match (controller + action), if not
        // we check if there are rules set globally for the whole controllers (see the index "0"), and finally
        // if nothing is matched, we fallback to the protection policy logic

        if (isset($this->rules[$controller][$action])) {
            $providerName = $this->rules[$controller][$action];
        } elseif (isset($this->rules[$controller][0])) {
            $providerName = $this->rules[$controller][0];
        } else {
            return $this->protectionPolicy === self::POLICY_ALLOW;
        }

        $provider = new $providerName($event);
        $provider->setServiceLocator($this->getServiceLocator());
        $allowedRoles = $provider->getRoles();

        if (in_array('*', $allowedRoles)) {
            return true;
        }

        return $this->roleService->matchIdentityRoles($allowedRoles);
    }
}
