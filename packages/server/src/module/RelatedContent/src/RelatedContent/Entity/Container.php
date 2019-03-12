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
namespace RelatedContent\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use Instance\Entity\InstanceInterface;
use Uuid\Entity\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="related_content_container")
 */
class Container implements ContainerInterface
{
    use InstanceAwareTrait;

    /**
     * @ORM\Id
     * @ORM\OneToOne(targetEntity="Uuid\Entity\Uuid")
     * @ORM\JoinColumn(name="id", referencedColumnName="id")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="Holder",
     * mappedBy="container")
     * @ORM\OrderBy({"position" = "ASC"})
     */
    protected $holders;

    public function __construct(UuidInterface $id, InstanceInterface $instance)
    {
        $this->id                = $id;
        $this->holders           = new ArrayCollection();
        $this->internalRelations = new ArrayCollection();
        $this->instance          = $instance;
    }

    public function getId()
    {
        return $this->id->getId();
    }

    public function getHolders()
    {
        return $this->holders;
    }

    public function addHolder(HolderInterface $holder)
    {
        $this->holders->add($holder);
    }

    public function getObject()
    {
        return $this->id;
    }
}
