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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Uuid\Entity\Uuid;

/**
 * A user.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="user")
 */
class User extends Uuid implements UserInterface
{

    /**
     * @ORM\ManyToMany(targetEntity="Role", inversedBy="users")
     * @ORM\JoinTable(name="role_user")
     */
    protected $roles;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    protected $email;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    protected $username;

    /**
     * @ORM\Column(type="string")
     * *
     */
    protected $password;

    /**
     * @ORM\Column(type="integer")
     * *
     */
    protected $logins;

    /**
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @ORM\Column(type="string")
     */
    protected $token;

    /**
     * @ORM\Column(type="datetime",
     * nullable=true)
     */
    protected $last_login;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $date;

    public function __construct()
    {
        $this->roles       = new ArrayCollection();
        $this->ads_enabled = true;
        $this->removed     = false;
        $this->logins      = 0;
        $this->generateToken();
    }

    public function getToken()
    {
        return $this->token;
    }

    public function generateToken()
    {
        $this->token = hash('crc32b', uniqid('user.token.', true));
        return $this;
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
        return $this->password;
    }

    public function getLogins()
    {
        return $this->logins;
    }

    public function getLastLogin()
    {
        return $this->last_login;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    public function setUsername($username)
    {
        $this->username = $username;
        return $this;
    }

    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    public function setLogins($logins)
    {
        $this->logins = $logins;
        return $this;
    }

    public function setLastLogin(DateTime $last_login)
    {
        $this->last_login = $last_login;
        return $this;
    }

    public function setDate(DateTime $date)
    {
        $this->date = $date;
        return $this;
    }

    public function addRole(RoleInterface $role)
    {
        $this->roles->add($role);
        return $this;
    }

    public function removeRole(RoleInterface $role)
    {
        $this->roles->removeElement($role);
        return $this;
    }

    public function getRoles()
    {
        return $this->roles;
    }

    public function updateLoginData()
    {
        $this->setLogins($this->getLogins() + 1);
        $this->setLastLogin(new DateTime());
        return $this;
    }

    public function hasRole(RoleInterface $role)
    {
        return $this->getRoles()->contains($role);
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }
}
