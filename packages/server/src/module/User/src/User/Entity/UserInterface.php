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
namespace User\Entity;

use Authorization\Entity\RoleInterface;
use DateTime;
use Doctrine\Common\Collections\Collection;
use Uuid\Entity\UuidInterface;
use ZfcRbac\Identity\IdentityInterface;

interface UserInterface extends UuidInterface, IdentityInterface
{

    /**
     * @return string
     */
    public function getEmail();

    /**
     * @return string
     */
    public function getUsername();

    /**
     * @return string
     */
    public function getPassword();

    /**
     * @return string
     */
    public function getLogins();

    /**
     * @return DateTime
     */
    public function getLastLogin();

    /**
     * @return DateTime
     */
    public function getDate();

    /**
     * @return Collection RoleInterface[]
     */
    public function getRoles();

    /**
     * @return string
     */
    public function getToken();

    /**
     * @return self
     */
    public function generateToken();

    /**
     * @param string $email
     * @return self
     */
    public function setEmail($email);

    /**
     * @param string $username
     * @return self
     */
    public function setUsername($username);

    /**
     * @param string $password
     * @return self
     */
    public function setPassword($password);

    /**
     * @param DateTime $lastLogin
     * @return self
     */
    public function setLastLogin(DateTime $lastLogin);

    /**
     * @param DateTime $date
     * @return self
     */
    public function setDate(DateTime $date);

    /**
     * @param RoleInterface $role
     * @return self
     */
    public function addRole(RoleInterface $role);

    /**
     * @param RoleInterface $role
     * @return self
     */
    public function removeRole(RoleInterface $role);

    /**
     * @param RoleInterface $role
     */
    public function hasRole(RoleInterface $role);

    /**
     * @param string $description
     * @return void
     */
    public function setDescription($description);

    /**
     * @return string
     */
    public function getDescription();
}
