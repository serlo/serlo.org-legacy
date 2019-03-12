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
namespace Authorization\Service;

use Authorization\Entity\PermissionInterface;
use Common\ObjectManager\Flushable;
use Rbac\Role\RoleInterface;
use User\Entity\UserInterface;
use Zend\Form\FormInterface;

interface RoleServiceInterface extends Flushable
{
    /**
     * @param FormInterface $form
     * @return RoleInterface
     */
    public function createRole(FormInterface $form);

    /**
     * @return RoleInterface[]
     */
    public function findAllRoles();

    /**
     * @param $name
     * @return RoleInterface
     */
    public function findRoleByName($name);

    /**
     * @param int $id
     * @return RoleInterface
     */
    public function getRole($id);

    /**
     * @param int|RoleInterface $role
     * @param int|UserInterface $user
     * @return void
     */
    public function grantIdentityRole($role, $user);

    /**
     * @param int|RoleInterface       $role
     * @param int|PermissionInterface $permission
     * @return void
     */
    public function grantRolePermission($role, $permission);

    /**
     * @param int $role
     * @param int $user
     * @return void
     */
    public function removeIdentityRole($role, $user);

    /**
     * @param int $role
     * @param int $permission
     * @return void
     */
    public function removeRolePermission($role, $permission);
}
