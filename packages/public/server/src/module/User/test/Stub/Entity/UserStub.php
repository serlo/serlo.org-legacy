<?php

namespace UserTest\Stub\Entity;

use Authorization\Entity\RoleInterface;
use DateTime;
use User\Entity\UserInterface;

class UserStub implements UserInterface
{
    /** @var int */
    protected $id;
    /** @var string */
    protected $username = 'username';
    /** @var string */
    protected $email = 'email';

    public function __construct(int $id, $data = [])
    {
        $this->id = $id;
        if (array_key_exists('username', $data)) {
            $this->username = $data['username'];
        }
        if (array_key_exists('email', $data)) {
            $this->email = $data['email'];
        }
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getPassword()
    {
        // TODO: Implement getPassword() method.
    }

    public function getLogins()
    {
        // TODO: Implement getLogins() method.
    }

    public function getLastLogin()
    {
        // TODO: Implement getLastLogin() method.
    }

    public function getDate()
    {
        // TODO: Implement getDate() method.
    }

    public function getRoles()
    {
        // TODO: Implement getRoles() method.
    }

    public function getToken()
    {
        // TODO: Implement getToken() method.
    }

    public function generateToken()
    {
        // TODO: Implement generateToken() method.
    }

    public function setEmail($email)
    {
        // TODO: Implement setEmail() method.
    }

    public function setUsername($username)
    {
        // TODO: Implement setUsername() method.
    }

    public function setPassword($password)
    {
        // TODO: Implement setPassword() method.
    }

    public function setLastLogin(DateTime $lastLogin)
    {
        // TODO: Implement setLastLogin() method.
    }

    public function setDate(DateTime $date)
    {
        // TODO: Implement setDate() method.
    }

    public function addRole(RoleInterface $role)
    {
        // TODO: Implement addRole() method.
    }

    public function removeRole(RoleInterface $role)
    {
        // TODO: Implement removeRole() method.
    }

    public function hasRole(RoleInterface $role)
    {
        // TODO: Implement hasRole() method.
    }

    public function setDescription($description)
    {
        // TODO: Implement setDescription() method.
    }

    public function getDescription()
    {
        // TODO: Implement getDescription() method.
    }

    public function updateLoginData()
    {
        // TODO: Implement updateLoginData() method.
    }

    public function getField($field)
    {
        // TODO: Implement getField() method.
    }

    public function setField($field, $value)
    {
        // TODO: Implement setField() method.
    }

    public function getFields()
    {
        // TODO: Implement getFields() method.
    }

    public function getId()
    {
        return $this->id;
    }

    public function getTrashed()
    {
        // TODO: Implement getTrashed() method.
    }

    public function isTrashed()
    {
        // TODO: Implement isTrashed() method.
    }

    public function setTrashed($trashed)
    {
        // TODO: Implement setTrashed() method.
    }

    public function __toString()
    {
        // TODO: Implement __toString() method.
    }
}
