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
namespace User\Manager;

use Common\ObjectManager\Flushable;
use Doctrine\ORM\EntityRepository;
use User\Entity\UserInterface;
use Zend\Paginator\Paginator;

interface UserManagerInterface extends Flushable
{

    /**
     * @param array $data
     * @return UserInterface
     */
    public function createUser(array $data);

    /**
     * @param int $page
     * @param int $limit
     * @return Paginator|UserInterface[]
     */
    public function findAllUsers($page = 0, $limit = 50);

    /**
     * @param string $email
     * @return UserInterface
     */
    public function findUserByEmail($email);

    /**
     * @param string $token
     * @return UserInterface
     */
    public function findUserByToken($token);

    /**
     * @param string $username
     * @return UserInterface
     */
    public function findUserByUsername($username);

    /**
     * @param int $id
     * @return mixed
     */
    public function generateUserToken($id);

    /**
     * @param int $id
     * @return UserInterface
     */
    public function getUser($id);

    /**
     * @return UserInterface
     */
    public function getUserFromAuthenticator();

    /**
     * @param int    $id
     * @param string $password
     * @return mixed
     */
    public function updateUserPassword($id, $password);
}
