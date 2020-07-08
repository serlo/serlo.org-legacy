<?php

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
