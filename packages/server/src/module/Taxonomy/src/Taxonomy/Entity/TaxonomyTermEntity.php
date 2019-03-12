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
namespace Taxonomy\Entity;

use Doctrine\ORM\Mapping as ORM;
use Entity\Entity\EntityInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="term_taxonomy_entity")
 */
class TaxonomyTermEntity implements TaxonomyTermNodeInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     * targetEntity="TaxonomyTerm",
     * inversedBy="termTaxonomyEntity",
     * cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="term_taxonomy_id", referencedColumnName="id", nullable=false)
     */
    protected $termTaxonomy;

    /**
     * @ORM\ManyToOne(
     * targetEntity="Entity\Entity\Entity",
     * inversedBy="termTaxonomyEntity",
     * cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id", nullable=false)
     */
    protected $entity;

    /**
     * @ORM\Column(name="position", type="integer")
     */
    protected $position;

    public function __construct(TaxonomyTermInterface $termTaxonomy, EntityInterface $entity)
    {
        $this->setTaxonomyTerm($termTaxonomy);
        $this->setObject($entity);
        $this->setPosition(0);
    }

    public function getId()
    {
        return $this->id;
    }

    public function getTaxonomyTerm()
    {
        return $this->termTaxonomy;
    }

    public function getObject()
    {
        return $this->entity;
    }

    public function getPosition()
    {
        return $this->position;
    }

    public function setTaxonomyTerm(TaxonomyTermInterface $termTaxonomy)
    {
        $this->termTaxonomy = $termTaxonomy;
        return $this;
    }

    public function setObject(TaxonomyTermAwareInterface $entity)
    {
        $this->entity = $entity;
        return $this;
    }

    public function setPosition($position)
    {
        $this->position = $position;
        return $this;
    }
}
