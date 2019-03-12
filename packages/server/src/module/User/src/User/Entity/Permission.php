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

use Authorization\Entity\ParametrizedPermissionInterface;
use Authorization\Entity\PermissionInterface;
use Authorization\Entity\RoleInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="instance_permission")
 */
class Permission implements ParametrizedPermissionInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToMany(targetEntity="Role", inversedBy="permissions")
     * @ORM\JoinTable(name="role_permission")
     */
    protected $roles;

    /**
     * @ORM\ManyToOne(targetEntity="PermissionKey",inversedBy="parametrizedPermissions")
     * @ORM\JoinColumn(name="permission_id", referencedColumnName="id")
     */
    protected $permission;

    /**
     * @ORM\ManyToOne(targetEntity="Instance\Entity\Instance")
     * @ORM\JoinColumn(name="instance_id", referencedColumnName="id", nullable=true)
     */
    protected $instance;

    public function __toString()
    {
        return $this->getName();
    }

    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->permission->getName();
    }

    /**
     * @param string $key
     * @return mixed
     */
    public function getParameter($key)
    {
        if ($key == 'instance') {
            return $this->instance;
        }

        return null;
    }

    /**
     * @return PermissionInterface
     */
    public function getPermission()
    {
        return $this->permission;
    }

    public function setPermission(PermissionInterface $permission)
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
     * @param string $key
     * @param mixed  $value
     * @return void
     */
    public function setParameter($key, $value)
    {
        if ($key === 'instance') {
            $this->instance = $value;
        }
    }
}
