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
namespace Contexter\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Comment ORM Entity
 *
 * @ORM\Entity
 * @ORM\Table(name="context_route_parameter")
 */
class RouteParameter implements RouteParameterInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\Column(type="string", name="`key`")
     */
    protected $key;

    /**
     * @ORM\Column(type="string", name="`value`")
     */
    protected $value;

    /**
     * @ORM\ManyToOne(targetEntity="Route", inversedBy="parameters")
     * @ORM\JoinColumn(name="context_route_id", referencedColumnName="id")
     */
    protected $route;

    public function getId()
    {
        return $this->id;
    }

    public function getKey()
    {
        return $this->key;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function getRoute()
    {
        return $this->route;
    }

    public function setKey($key)
    {
        $this->key = $key;

        return $this;
    }

    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    public function setRoute(RouteInterface $route)
    {
        $this->route = $route;

        return $this;
    }
}
