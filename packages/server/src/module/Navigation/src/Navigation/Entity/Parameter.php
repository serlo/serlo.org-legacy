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
namespace Navigation\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use Instance\Entity\InstanceInterface;
use Type\Entity\TypeAwareTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="navigation_parameter")
 */
class Parameter implements ParameterInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Page", inversedBy="parameters")
     * @var PageInterface
     */
    protected $page;

    /**
     * @ORM\OneToMany(targetEntity="Parameter", mappedBy="parent")
     */
    protected $children;

    /**
     * @ORM\ManyToOne(targetEntity="Parameter", inversedBy="children")
     */
    protected $parent;

    /**
     * @ORM\ManyToOne(targetEntity="ParameterKey")
     */
    protected $key;

    /**
     * @ORM\Column(type="string")
     */
    protected $value;

    public function __construct()
    {
        $this->children = new ArrayCollection;
    }

    /**
     * @param ParameterInterface $child
     * @return void
     */
    public function addChild(ParameterInterface $child)
    {
        $this->children->add($child);
    }

    /**
     * @return self[]
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return InstanceInterface
     */
    public function getInstance()
    {
        return $this->page->getInstance();
    }

    /**
     * @return ParameterKeyInterface
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param ParameterKeyInterface $key
     * @return void
     */
    public function setKey(ParameterKeyInterface $key)
    {
        $this->key = $key;
    }

    /**
     * @return PageInterface
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * @param PageInterface $page
     * @return void
     */
    public function setPage(PageInterface $page)
    {
        $this->page = $page;
    }

    /**
     * @return ParameterInterface
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * @param ParameterInterface $parent
     * @return void
     */
    public function setParent(ParameterInterface $parent)
    {
        $this->parent = $parent;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param string $value
     * @return void
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * @return bool
     */
    public function hasChildren()
    {
        return $this->children->count() > 0;
    }

    /**
     * @param ParameterInterface $child
     * @return void
     */
    public function removeChild(ParameterInterface $child)
    {
        $this->children->removeElement($child);
    }
}
