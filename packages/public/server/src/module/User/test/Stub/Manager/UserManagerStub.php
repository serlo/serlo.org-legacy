<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace UserTest\Stub\Manager;

use User\Entity\UserInterface;
use User\Manager\UserManagerInterface;

class UserManagerStub implements UserManagerInterface
{
    /** @var int */
    protected $authenticatedUser = null;
    /** @var array */
    protected $users = [];

    public function init(array $users = [], $authenticatedUser = null)
    {
        $this->authenticatedUser = $authenticatedUser;
        $this->users = $users;
    }

    public function flush()
    {
        // TODO: Implement flush() method.
    }

    public function createUser(array $data)
    {
        // TODO: Implement createUser() method.
    }

    public function findAllUsers($page = 0, $limit = 50)
    {
        // TODO: Implement findAllUsers() method.
    }

    public function findUserByEmail($email)
    {
        // TODO: Implement findUserByEmail() method.
    }

    public function findUserByToken($token)
    {
        // TODO: Implement findUserByToken() method.
    }

    public function findUserByUsername($username)
    {
        // TODO: Implement findUserByUsername() method.
    }

    public function getActiveAuthorIds()
    {
        return [];
    }

    public function getActiveReviewerIds()
    {
        return [];
    }

    public function generateUserToken($id)
    {
        // TODO: Implement generateUserToken() method.
    }

    public function getUser($id)
    {
        return $this->users[$id];
    }

    public function getUserFromAuthenticator()
    {
        return $this->authenticatedUser
            ? $this->users[$this->authenticatedUser]
            : null;
    }

    public function updateUserPassword($id, $password)
    {
        // TODO: Implement updateUserPassword() method.
    }

    public function mergeFields($user, $data)
    {
        // TODO: Implement mergeFields() method.
    }

    public function persist($object)
    {
        // TODO: Implement persist() method.
    }
}
