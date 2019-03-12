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
namespace Authorization\Assertion;

use Authorization\Entity\RoleInterface;
use Authorization\Exception\InvalidArgumentException;
use Authorization\Exception\PermissionNotFoundException;
use Authorization\Result\AuthorizationResult;
use Authorization\Service\PermissionServiceAwareTrait;
use Authorization\Service\PermissionServiceInterface;
use Authorization\Service\RoleServiceAwareTrait;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Rbac\Traversal\Strategy\TraversalStrategyInterface;

class RoleAssertion implements AssertionInterface
{
    use PermissionServiceAwareTrait, InstanceManagerAwareTrait;

    /**
     * @var TraversalStrategyInterface
     */
    protected $traversalStrategy;

    public function __construct(
        InstanceManagerInterface $instanceManager,
        PermissionServiceInterface $permissionService,
        TraversalStrategyInterface $traversalStrategy
    ) {
        $this->permissionService = $permissionService;
        $this->instanceManager   = $instanceManager;
        $this->traversalStrategy = $traversalStrategy;
    }

    public function assert(AuthorizationResult $result, $role = null)
    {
        if (!$role instanceof RoleInterface) {
            throw new InvalidArgumentException;
        }

        $instanceManager   = $this->getInstanceManager();
        $permissionService = $this->getPermissionService();
        $assertion         = new InstanceAssertion($instanceManager, $permissionService, $this->traversalStrategy);
        $checkPermission   = $result->getPermission() . '.' . $role->getName();
        $result            = clone $result;
        $instancesToCheck  = [];
        $rolesToCheck      = $assertion->flattenRoles([$role]);

        foreach ($rolesToCheck as $roleToCheck) {
            foreach ($roleToCheck->getPermissions() as $permission) {
                $instance = $permission->getParameter('instance');
                if (!in_array($instance, $instancesToCheck)) {
                    $instancesToCheck[] = $instance;
                }
            }
        }

        try {
            $this->getPermissionService()->findPermissionByName($checkPermission);
        } catch (PermissionNotFoundException $e) {
            $checkPermission = $result->getPermission();
        }

        $result->setPermission($checkPermission);

        foreach ($instancesToCheck as $instance) {
            if (!$assertion->assert($result, $instance)) {
                return false;
            }
        }

        return true;
    }
}
