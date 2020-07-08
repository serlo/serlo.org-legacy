<?php

namespace Authentication\Service;

use Zend\Authentication\AuthenticationServiceInterface as ZendAuthenticationServiceInterface;
use Zend\Authentication\Result;

interface AuthenticationServiceInterface extends
    ZendAuthenticationServiceInterface
{
    /**
     * @param string $email
     * @param string $password
     * @param bool $remember
     * @return Result
     */
    public function authenticateWithData($email, $password, $remember = false);
}
