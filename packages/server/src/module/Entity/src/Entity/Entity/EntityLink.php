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
namespace Entity\Entity;

use Doctrine\ORM\Mapping as ORM;
use Link\Entity\LinkableInterface;
use Link\Entity\LinkInterface;

/**
 * An
 * entity
 * link.
 *
 * @ORM\Entity
 * @ORM\Table(name="entity_link")
 */
class EntityLink implements LinkInterface
{
    use \Type\Entity\TypeAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    public $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entity",
     * inversedBy="parents")
     * @ORM\JoinColumn(name="child_id",
     * referencedColumnName="id")
     */
    public $child;

    /**
     * @ORM\ManyToOne(targetEntity="Entity",
     * inversedBy="children")
     * @ORM\JoinColumn(name="parent_id",
     * referencedColumnName="id")
     */
    public $parent;

    /**
     * @ORM\Column(name="`order`", type="integer")
     */
    public $order;

    public function getPosition()
    {
        return $this->order;
    }

    public function setPosition($position)
    {
        $this->order = $position;

        return $this;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getChild()
    {
        return $this->child;
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function setChild(LinkableInterface $child)
    {
        $this->child = $child;
    }

    public function setParent(LinkableInterface $parent)
    {
        $this->parent = $parent;
    }
}
