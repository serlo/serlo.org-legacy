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

use Blog\Entity\PostInterface;
use Discussion\Entity\CommentInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Entity\Entity\EntityInterface;
use Taxonomy\Exception\RuntimeException;
use Taxonomy\Exception;
use Term\Entity\TermEntityInterface;
use Uuid\Entity\Uuid;
use Zend\Filter\FilterInterface;

/**
 * A
 * Taxonomy.
 *
 * @ORM\Entity
 * @ORM\Table(name="term_taxonomy")
 */
class TaxonomyTerm extends Uuid implements TaxonomyTermInterface
{

    /**
     * @ORM\ManyToOne(targetEntity="Taxonomy\Entity\Taxonomy",inversedBy="terms")
     */
    protected $taxonomy;

    /**
     * @ORM\ManyToOne(targetEntity="Term\Entity\TermEntity",
     * inversedBy="termTaxonomies")
     */
    protected $term;

    /**
     * @ORM\OneToMany(targetEntity="TaxonomyTerm", mappedBy="parent", cascade={"remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"weight"="ASC"})
     */
    protected $children;

    /**
     * @ORM\ManyToOne(targetEntity="TaxonomyTerm",inversedBy="children")
     * @ORM\JoinColumn(name="parent_id",referencedColumnName="id")
     */
    protected $parent;

    /**
     * @ORM\Column(type="integer")
     */
    protected $weight;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $description;

    /**
     * @ORM\OneToMany(
     * targetEntity="TaxonomyTermEntity",
     * mappedBy="termTaxonomy",
     * cascade={"persist", "remove"},
     * orphanRemoval=true
     * )
     * @ORM\OrderBy({"position" = "ASC"})
     */
    protected $termTaxonomyEntities;

    /**
     * @ORM\OneToMany(targetEntity="Blog\Entity\Post",mappedBy="blog")
     * @ORM\OrderBy({"publish"="DESC"})
     */
    protected $blogPosts;

    protected $allowedRelations = [
        'entities' => 'termTaxonomyEntities',
        'termTaxonomyEntities',
        'blogPosts',
    ];

    public function __construct()
    {
        $this->children             = new ArrayCollection();
        $this->entities             = new ArrayCollection();
        $this->blogPosts            = new ArrayCollection();
        $this->termTaxonomyEntities = new ArrayCollection();
        $this->weight               = 0;
    }

    public function associateObject(TaxonomyTermAwareInterface $entity)
    {
        $field  = $this->getAssociationFieldName($entity);
        $method = 'add' . ucfirst($field);
        if (!method_exists($this, $method)) {
            $this->getAssociated($field)->add($entity);
            $entity->addTaxonomyTerm($this);
        } else {
            $this->$method($entity);
        }
    }

    public function countAssociations($field = null, FilterInterface $filter = null)
    {
        if ($field === null) {
            $count     = 0;
            $relations = [
                'entities',
                'blogPosts',
            ];

            foreach ($relations as $relation) {
                $count += $this->countAssociations($relation, $filter);
            }

            return $count;
        }

        if ($filter) {
            return $filter->filter($this->getAssociated($field))->count();
        }

        return $this->getAssociated($field)->count();
    }

    public function findAncestorByTypeName($name)
    {
        $term = $this;
        while ($term->hasParent()) {
            $term = $term->getParent();
            if ($term->getTaxonomy()->getName() === $name) {
                return $term;
            }
        }

        throw new Exception\TermNotFoundException();
    }

    public function findChildrenByTaxonomyNames(array $names)
    {
        return $this->getChildren()->filter(
            function (TaxonomyTermInterface $term) use ($names) {
                return in_array(
                    $term->getTaxonomy()->getName(),
                    $names
                );
            }
        );
    }

    /**
     * @param bool $trashed
     * @return Collection|TaxonomyTermInterface[]
     */
    public function findChildrenByTrashed($trashed)
    {
        return $this->getChildren()->filter(
            function (TaxonomyTermInterface $t) use ($trashed) {
                return $t->isTrashed() == $trashed;
            }
        );
    }

    public function getAssociated($field = null)
    {
        if ($field === null) {
            $elements = [];
            $fields   = [
                'entities',
                'blogPosts',
            ];

            foreach ($fields as $field) {
                $elements[] = $this->getAssociated($field);
            }

            return new ArrayCollection($elements);
        }

        if (!in_array($field, $this->allowedRelations) && !isset($this->allowedRelations[$field])) {
            throw new RuntimeException(sprintf('Field %s is not whitelisted.', $field));
        }

        $method = 'get' . ucfirst($field);
        if (method_exists($this, $method)) {
            return $this->$method();
        } else {
            return $this->$field;
        }
    }

    public function getAssociatedRecursive($association, array $allowedTaxonomies = [])
    {
        $collection = new ArrayCollection();
        $this->iterAssociationNodes($collection, $this, $association, $allowedTaxonomies);
        return $collection;
    }

    public function getChildren()
    {
        return $this->children;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getInstance()
    {
        return $this->getTaxonomy()->getInstance();
    }

    public function getName()
    {
        return $this->getTerm()->getName();
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function setParent(TaxonomyTermInterface $parent = null)
    {
        if (!$parent) {
            return;
        }
        $this->parent = $parent;
        $parent->getChildren()->add($this);
    }

    public function getPosition()
    {
        return $this->weight;
    }

    public function getTaxonomy()
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(TaxonomyInterface $taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }

    public function getTerm()
    {
        return $this->term;
    }

    public function setTerm(TermEntityInterface $term)
    {
        $this->term = $term;
    }

    public function getType()
    {
        return $this->getTaxonomy()->getType();
    }

    public function hasChildren()
    {
        return $this->getChildren()->count() !== 0;
    }

    public function hasParent()
    {
        return (is_object($this->getParent()));
    }

    public function isAssociated(TaxonomyTermAwareInterface $object)
    {
        $field        = $this->getAssociationFieldName($object);
        $associations = $this->getAssociated($field);
        return $associations->contains($object);
    }

    public function knowsAncestor(TaxonomyTermInterface $ancestor)
    {
        $term = $this;
        while ($term->hasParent()) {
            $term = $term->getParent();
            if ($term === $ancestor) {
                return true;
            }
        }

        return false;
    }

    public function positionAssociatedObject($object, $order, $association = null)
    {
        if (!$association) {
            $association = $this->getAssociationFieldName($object);
        }
        $method = 'order' . ucfirst($association);

        if (!method_exists($this, $method)) {
            throw new Exception\SortingNotSupported(sprintf(
                'Association `%s` does not support sorting. You\'d have to implement a node',
                $association
            ));
        }

        return $this->$method($object, $order);
    }

    public function removeAssociation(TaxonomyTermAwareInterface $entity)
    {
        $field  = $this->getAssociationFieldName($entity);
        $method = 'remove' . ucfirst($field);
        if (!method_exists($this, $method)) {
            $this->getAssociated($field)->removeElement($entity);
            $entity->removeTaxonomyTerm($this);
        } else {
            $this->$method($entity);
        }
    }

    public function setPosition($position)
    {
        $this->weight = $position;
    }

    protected function addEntities(EntityInterface $entity)
    {
        // Build new relation object to handle join entity correct
        $rel = new TaxonomyTermEntity($this, $entity);

        // Add relation object to collection
        $this->getEntityNodes()->add($rel);
        $entity->addTaxonomyTerm($this, $rel);
    }

    public function getAssociationFieldName(TaxonomyTermAwareInterface $object)
    {
        if ($object instanceof EntityInterface) {
            return 'entities';
        } elseif ($object instanceof PostInterface) {
            return 'blogPosts';
        } else {
            throw new RuntimeException(sprintf('Could not determine which field to use for %s', get_class($object)));
        }
    }

    protected function getEntities()
    {
        $collection = new ArrayCollection();

        foreach ($this->getEntityNodes() as $rel) {
            $collection->add($rel->getObject());
        }

        return $collection;
    }

    /**
     * @return ArrayCollection TaxonomyTermNodeInterface[]
     */
    protected function getEntityNodes()
    {
        return $this->termTaxonomyEntities;
    }

    protected function iterAssociationNodes(
        Collection $collection,
        TaxonomyTermInterface $term,
        $associations,
        array $allowedTaxonomies
    ) {
        foreach ($term->getAssociated($associations) as $link) {
            $collection->add($link);
        }

        foreach ($term->getChildren() as $child) {
            if (empty($allowedTaxonomies) || in_array($child->getTaxonomy()->getName(), $allowedTaxonomies)) {
                $this->iterAssociationNodes($collection, $child, $associations, $allowedTaxonomies);
            }
        }
    }

    protected function orderEntities($object, $position)
    {
        if ($object instanceof TaxonomyTermAwareInterface) {
            $id = $object->getId();
        } else {
            $id = (int)$object;
        }

        foreach ($this->getEntityNodes() as $rel) {
            if ($rel->getObject()->getId() === $id) {
                $rel->setPosition($position);
                break;
            }
        }

        return $rel;
    }

    protected function removeEntities(EntityInterface $entity)
    {
        // Iterate over all join entities to find the correct
        foreach ($this->getEntityNodes() as $rel) {
            if ($rel->getObject() === $entity) {
                $this->getEntityNodes()->removeElement($rel);
                $rel->getObject()->removeTaxonomyTerm($this, $rel);
                break;
            }
        }
    }
}
