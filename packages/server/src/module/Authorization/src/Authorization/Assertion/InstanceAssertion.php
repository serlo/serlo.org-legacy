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

use Authorization\Exception\InvalidArgumentException;
use Authorization\Exception\RuntimeException;
use Authorization\Result\AuthorizationResult;
use Authorization\Service\PermissionServiceInterface;
use Instance\Entity\InstanceInterface;
use Instance\Entity\InstanceProviderInterface;
use Instance\Manager\InstanceManagerInterface;
use Rbac\Traversal\Strategy\TraversalStrategyInterface;
use Rbac\Role\RoleInterface;

class InstanceAssertion implements AssertionInterface
{
    /**
     * @var PermissionServiceInterface
     */
    protected $permissionService;

    /**
     * @var InstanceManagerInterface
     */
    protected $instanceManager;

    /**
     * @var TraversalStrategyInterface
     */
    protected $traversalStrategy;

    /**
     * @param InstanceManagerInterface   $instanceManager
     * @param PermissionServiceInterface $permissionService
     * @param TraversalStrategyInterface $traversalStrategy
     */
    public function __construct(
        InstanceManagerInterface $instanceManager,
        PermissionServiceInterface $permissionService,
        TraversalStrategyInterface $traversalStrategy
    ) {
        $this->permissionService = $permissionService;
        $this->instanceManager   = $instanceManager;
        $this->traversalStrategy = $traversalStrategy;
    }

    /**
     * Check if this assertion is true
     *
     * @param  AuthorizationResult $authorization
     * @param  mixed               $context
     * @throws RuntimeException
     * @throws InvalidArgumentException
     * @return bool
     */
    public function assert(AuthorizationResult $authorization, $context = null)
    {
        if ($context === null) {
            $instance = null;
        } elseif ($context instanceof InstanceProviderInterface) {
            $instance = $context->getInstance();
            if (!is_object($instance)) {
                throw new RuntimeException(sprintf('%s provides an instance of null', get_class($context)));
            }
        } elseif ($context instanceof InstanceInterface) {
            $instance = $context;
        } else {
            throw new InvalidArgumentException(sprintf(
                'Expected null, InstanceProviderInterface or InstanceInterface but got %s',
                is_object($context) ? get_class($context) : gettype($context)
            ));
        }

        $permissionToCheck = $authorization->getPermission();
        $rolesToCheck      = $this->flattenRoles($authorization->getRoles());

        $permissions = $this->permissionService->findParametrizedPermissions(
            $permissionToCheck,
            'instance',
            $instance
        );

        if ($this->isGranted($rolesToCheck, $permissions)) {
            return true;
        }

        // Not found..well, that's unfortunate! Let's check if it's satisfiable with global permissions
        if ($instance !== null) {
            $permissions = $this->permissionService->findParametrizedPermissions(
                $permissionToCheck,
                'instance',
                null
            );

            if ($this->isGranted($rolesToCheck, $permissions)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Flatten an array of role with role names
     * This method iterates through the list of roles, and convert any RoleInterface to a string. For any
     * role, it also extracts all the children
     *
     * @param  array|RoleInterface[] $roles
     * @return RoleInterface[]
     */
    public function flattenRoles(array $roles)
    {
        $roleNames = [];
        $iterator  = $this->traversalStrategy->getRolesIterator($roles);

        foreach ($iterator as $role) {
            $roleNames[] = $role;
        }

        return array_unique($roleNames);
    }

    /**
     * @param array $roles
     * @param array $permissions
     * @return bool
     */
    protected function isGranted($roles, $permissions)
    {
        foreach ($permissions as $permission) {
            foreach ($roles as $role) {
                if ($role->hasPermission($permission)) {
                    return true;
                }
            }
        }

        return false;
    }
}
