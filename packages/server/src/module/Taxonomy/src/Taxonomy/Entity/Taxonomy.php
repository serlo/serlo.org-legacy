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

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;

/**
 * A Taxonomy.
 *
 * @ORM\Entity
 * @ORM\Table(name="taxonomy")
 */
class Taxonomy implements TaxonomyInterface
{
    use \Type\Entity\TypeAwareTrait;
    use InstanceAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="TaxonomyTerm", mappedBy="taxonomy")
     * @ORM\OrderBy({"weight" = "ASC"})
     */
    protected $terms;

    public function __construct()
    {
        $this->terms = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getTerms()
    {
        return $this->terms;
    }

    public function addTerm($term)
    {
        $this->getTerms()->add($term);
    }

    public function getName()
    {
        return $this->getType()->getName();
    }

    public function getChildren()
    {
        $collection = new ArrayCollection();
        $terms      = $this->getTerms();
        foreach ($terms as $entity) {
            if (!$entity->hasParent() || ($entity->hasParent() && $entity->getParent()->getTaxonomy() !== $this)) {
                $collection->add($entity);
            }
        }
        return $collection;
    }
}
