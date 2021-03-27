<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace AuthenticationTest\Stub\Service;

use Authentication\Service\AuthenticationServiceInterface;
use Error;
use UserTest\Stub\Entity\UserStub;
use Zend\Authentication\Result;

class AuthenticationServiceStub implements AuthenticationServiceInterface
{
    /** @var array */
    protected $mocks = [];
    /** @var array */
    protected $requests = [];

    public function init($mocks)
    {
        $this->mocks = $mocks;
        $this->requests = [];
    }

    public function authenticate()
    {
        // TODO: Implement authenticate() method.
    }

    public function hasIdentity()
    {
        // TODO: Implement hasIdentity() method.
    }

    public function getIdentity()
    {
        // TODO: Implement getIdentity() method.
    }

    public function clearIdentity()
    {
        // TODO: Implement clearIdentity() method.
    }

    public function authenticateWithData($email, $password, $remember = false)
    {
        if (array_key_exists($email, $this->mocks)) {
            $mock = $this->mocks[$email];
            $this->requests[$email] = $this->getRequestsFor($email);
            array_push($this->requests[$email], [
                'password' => $password,
                'remember' => $remember,
            ]);
            if ($mock['password'] === $password) {
                $user = new UserStub($mock['id']);
                return new Result(Result::SUCCESS, $user);
            } else {
                return new Result(Result::FAILURE_CREDENTIAL_INVALID, null);
            }
        }

        throw new Error('Unexpected authentication request for ' . $email);
    }

    public function getRequestsFor($email)
    {
        return $this->requests[$email] ?? [];
    }
}
