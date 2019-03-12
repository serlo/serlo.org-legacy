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
namespace Authorization\Result;

use Authorization\Service\AuthorizationService;
use Rbac\Role\RoleInterface;
use ZfcRbac\Identity\IdentityInterface;

class AuthorizationResult
{
    /**
     * @var string
     */
    protected $permission;

    /**
     * @var IdentityInterface|null
     */
    protected $identity;

    /**
     * @var RoleInterface[]
     */
    protected $roles = [];

    /**
     * @var AuthorizationService
     */
    protected $authorizationService;

    /**
     * @param AuthorizationService $authorizationService
     */
    public function setAuthorizationService(AuthorizationService $authorizationService)
    {
        $this->authorizationService = $authorizationService;
    }

    /**
     * @return AuthorizationService
     */
    public function getAuthorizationService()
    {
        return $this->authorizationService;
    }

    /**
     * @return null|IdentityInterface
     */
    public function getIdentity()
    {
        return $this->identity;
    }

    /**
     * @param null|IdentityInterface $identity
     */
    public function setIdentity($identity)
    {
        $this->identity = $identity;
    }

    /**
     * @return string
     */
    public function getPermission()
    {
        return $this->permission;
    }

    /**
     * @param string $permission
     */
    public function setPermission($permission)
    {
        $this->permission = $permission;
    }

    /**
     * @return RoleInterface[]
     */
    public function getRoles()
    {
        return $this->roles;
    }

    /**
     * @param RoleInterface[] $roles
     */
    public function setRoles(array $roles)
    {
        $this->roles = $roles;
    }
}
