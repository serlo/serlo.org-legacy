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

/**
 * An entity link.
 *
 * @ORM\Entity
 * @ORM\Table(name="entity_revision_field")
 */
class RevisionField
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Revision", inversedBy="fields")
     * @ORM\JoinColumn(name="entity_revision_id", referencedColumnName="id")
     */
    protected $revision;

    /**
     * @ORM\Column(type="string", name="field")
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     */
    protected $value;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return RevisionInterface $entityRevisionId
     */
    public function getRevision()
    {
        return $this->revision;
    }

    /**
     * @return string $field
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param RevisionInterface $entityRevision
     */
    public function setRevision(RevisionInterface $entityRevision)
    {
        $this->revision = $entityRevision;
    }

    /**
     * @param string $field
     */
    public function setName($field)
    {
        $this->name = $field;
    }

    /**
     * @param string $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    public function __construct($revision, $field)
    {
        $this->revision = $revision;
        $this->name     = $field;
    }
}
