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

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use User\Entity\UserInterface;
use Uuid\Entity\Uuid;
use Versioning\Entity\RepositoryInterface;

/**
 * An entity link.
 *
 * @ORM\Entity
 * @ORM\Table(name="entity_revision")
 */
class Revision extends Uuid implements RevisionInterface
{
    /**
     * @ORM\ManyToOne(targetEntity="Entity", inversedBy="revisions")
     */
    protected $repository;

    /**
     * @ORM\OneToMany(targetEntity="RevisionField", mappedBy="revision", cascade={"persist"})
     */
    protected $fields;

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     */
    protected $author;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    protected $date;

    public function __construct()
    {
        $this->fields = new ArrayCollection();
        $this->date = new \DateTime();
    }

    public function delete()
    {
        return $this;
    }

    public function get($field, $default = null)
    {
        $field = $this->getField($field);

        if (!is_object($field)) {
            return $default;
        }

        return $field->getValue();
    }

    protected function getField($field)
    {
        $expression = Criteria::expr()->eq("name", $field);
        $criteria   = Criteria::create()->where($expression)->setFirstResult(0)->setMaxResults(1);
        $data       = $this->fields->matching($criteria);

        if (empty($data)) {
            return null;
        }

        return $data[0];
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor(UserInterface $author)
    {
        $this->author = $author;
    }

    public function getFields()
    {
        return $this->fields;
    }

    public function getTimestamp()
    {
        return $this->date;
    }

    public function set($name, $value)
    {
        $entity = $this->getField($name);

        if (!is_object($entity)) {
            $entity = new RevisionField($name, $this->getId());
            $this->fields->add($entity);
        }

        $entity->setName($name);
        $entity->setRevision($this);
        $entity->setValue($value);

        return $entity;
    }

    public function setTimestamp(\DateTime $date)
    {
        $this->date = $date;
    }

    public function getInstance()
    {
        return $this->getRepository()->getInstance();
    }

    public function getRepository()
    {
        return $this->repository;
    }

    public function setRepository(RepositoryInterface $repository)
    {
        $this->repository = $repository;
    }
}
