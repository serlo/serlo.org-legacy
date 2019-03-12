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
namespace Authorization\Entity;

use Rbac\Role\HierarchicalRoleInterface;
use User\Entity\UserInterface;

interface RoleInterface extends HierarchicalRoleInterface
{
    /**
     * @param RoleInterface $child
     * @return void
     */
    public function addChild(RoleInterface $child);

    /**
     * @param RoleInterface[] $children
     * @return void
     */
    public function addChildren($children);

    /**
     * @param RoleInterface[] $children
     * @return void
     */
    public function removeChildren($children);

    /**
     * @param ParametrizedPermissionInterface $permission
     * @return void
     */
    public function addPermission(ParametrizedPermissionInterface $permission);

    /**
     * @param UserInterface $user
     * @return void
     */
    public function addUser(UserInterface $user);

    /**
     * @return int
     */
    public function getId();

    /**
     * @return ParametrizedPermissionInterface[]
     */
    public function getPermissions();

    /**
     * @return UserInterface[]
     */
    public function getUsers();

    /**
     * @param RoleInterface $child
     * @return mixed
     */
    public function removeChild(RoleInterface $child);

    /**
     * @param ParametrizedPermissionInterface $permission
     * @return mixed
     */
    public function removePermission(ParametrizedPermissionInterface $permission);

    /**
     * @param UserInterface $user
     * @return mixed
     */
    public function removeUser(UserInterface $user);

    /**
     * @param string $name
     * @return mixed
     */
    public function setName($name);
}
