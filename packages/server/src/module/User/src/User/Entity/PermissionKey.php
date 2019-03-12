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

use Authorization\Entity\PermissionInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A role.
 *
 * @ORM\Entity
 * @ORM\Table(name="permission")
 */
class PermissionKey implements PermissionInterface
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\OneToMany(targetEntity="PermissionKey",mappedBy="permission")
     */
    protected $parametrizedPermissions;

    public function __construct()
    {
        $this->parametrizedPermissions = new ArrayCollection();
    }

    /**
     * @return \Authorization\Entity\ParametrizedPermissionInterface[]|ArrayCollection
     */
    public function getParametrizedPermissions()
    {
        return $this->parametrizedPermissions;
    }

    /**
     * @return \Authorization\Entity\ParametrizedPermissionInterface[]|ArrayCollection
     */
    public function getRoles()
    {
        $return = new ArrayCollection();
        foreach ($this->getParametrizedPermissions() as $permission) {
            foreach ($permission->getRoles() as $role) {
                if (!$return->contains($role)) {
                    $return->add($role->getRoles());
                }
            }
        }

        return $return;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getName();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }
}
