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
use Entity\Exception;
use Instance\Entity\InstanceAwareTrait;
use License\Entity\LicenseInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Entity\TaxonomyTermNodeInterface;
use Type\Entity\TypeAwareTrait;
use Uuid\Entity\Uuid;
use Uuid\Filter\NotTrashedCollectionFilter;
use Versioning\Entity\RevisionInterface;
use Versioning\Filter\HasCurrentRevisionCollectionFilter;
use Zend\Filter\FilterChain;

/**
 * An entity.
 *
 * @ORM\Entity
 * @ORM\Table(name="entity")
 */
class Entity extends Uuid implements EntityInterface
{
    use TypeAwareTrait;
    use InstanceAwareTrait;

    /**
     * @ORM\OneToMany(targetEntity="EntityLink", mappedBy="child", cascade={"persist", "remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"order" = "ASC"})
     */
    protected $parentLinks;

    /**
     * @ORM\OneToMany(targetEntity="EntityLink", mappedBy="parent", cascade={"persist", "remove"},
     * orphanRemoval=true)
     * @ORM\OrderBy({"order" = "ASC"})
     */
    protected $childLinks;

    /**
     * @ORM\OneToMany(targetEntity="Revision", mappedBy="repository", cascade={"remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"id" = "DESC"})
     */
    protected $revisions;

    /**
     * @ORM\OneToOne(targetEntity="Revision")
     * @ORM\JoinColumn(name="current_revision_id", referencedColumnName="id")
     */
    protected $currentRevision;

    /**
     * @ORM\OneToMany(targetEntity="Taxonomy\Entity\TaxonomyTermEntity", mappedBy="entity", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    protected $termTaxonomyEntities;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    protected $date;

    /**
     * @ORM\ManyToOne(targetEntity="License\Entity\LicenseInterface")
     */
    protected $license;

    public function __construct()
    {
        $this->revisions = new ArrayCollection();
        $this->childLinks = new ArrayCollection();
        $this->parentLinks = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->parents = new ArrayCollection();
        $this->issues = new ArrayCollection();
        $this->terms = new ArrayCollection();
        $this->termTaxonomyEntities = new ArrayCollection();
        $this->date = new \DateTime();
    }

    public function addRevision(RevisionInterface $revision)
    {
        $this->revisions->add($revision);
    }

    public function addTaxonomyTerm(TaxonomyTermInterface $taxonomyTerm, TaxonomyTermNodeInterface $node = null)
    {
        if ($node === null) {
            throw new Exception\InvalidArgumentException('Missing parameter node');
        }
        $this->termTaxonomyEntities->add($node);
    }

    public function countUnrevised()
    {
        $current = $this->getCurrentRevision() ? $this->getCurrentRevision()->getId() : 0;

        return $this->revisions->matching(
            Criteria::create()->where(Criteria::expr()->gt('id', $current))->andWhere(
                Criteria::expr()->eq('trashed', false)
            )
        )->count();
    }

    public function createLink()
    {
        return new EntityLink();
    }

    public function createRevision()
    {
        $revision = new Revision();
        $revision->setRepository($this);

        return $revision;
    }

    public function getChildLinks()
    {
        return $this->childLinks;
    }

    public function getChildren($linkType, $childType = null)
    {
        $collection = new ArrayCollection();

        foreach ($this->getChildLinks() as $link) {
            $childTypeName = $link->getChild()->getType()->getName();
            if ($link->getType()->getName() === $linkType
                && ($childType === null || ($childType !== null && $childTypeName === $childType))) {
                $collection->add($link->getChild());
            }
        }

        return $collection;
    }


    public function getValidChildren($linkType, $childType=null)
    {
        $filterchain = new FilterChain();
        $filterchain->attach(new HasCurrentRevisionCollectionFilter())
            ->attach(new NotTrashedCollectionFilter());
        $elements = $filterchain->filter($this->getChildren($linkType, $childType))->getValues();
        return new ArrayCollection($elements);
    }

    public function getCurrentRevision()
    {
        return $this->currentRevision;
    }

    public function setCurrentRevision(RevisionInterface $currentRevision)
    {
        $this->currentRevision = $currentRevision;
    }

    public function getHead()
    {
        return $this->revisions->first();
    }

    public function getLicense()
    {
        return $this->license;
    }

    public function setLicense(LicenseInterface $license)
    {
        $this->license = $license;
    }

    public function getParentLinks()
    {
        return $this->parentLinks;
    }

    public function getParents($linkType, $parentType = null)
    {
        $collection = new ArrayCollection();

        foreach ($this->getParentLinks() as $link) {
            $childTypeName = $link->getChild()->getType()->getName();
            if ($link->getType()->getName() === $linkType
                && ($parentType === null || ($parentType !== null && $childTypeName === $parentType))) {
                $collection->add($link->getParent());
            }
        }

        return $collection;
    }

    public function getNextValidSibling($linkType, EntityInterface $previous)
    {
        $children = $this->getValidChildren($linkType, $previous->getType()->getName());

        // Checks if the given entity is a child at all
        if (($index = $children->indexOf($previous)) === false) {
            return null;
        }

        if ($index + 1 < $children->count()) {
            return $children->get($index + 1);
        }

        return null;
    }

    public function getPreviousValidSibling($linkType, EntityInterface $following)
    {
        $children = $this->getValidChildren($linkType, $following->getType()->getName());

        if (($index = $children->indexOf($following)) === false) {
            return null;
        }

        if ($index-1 >= 0) {
            return $children->get($index-1);
        }

        return null;
    }

    public function getRevisions()
    {
        return $this->revisions;
    }

    public function getTaxonomyTerms()
    {
        $collection = new ArrayCollection();

        foreach ($this->termTaxonomyEntities as $rel) {
            $collection->add($rel->getTaxonomyTerm());
        }

        return $collection;
    }

    public function getTimestamp()
    {
        return $this->date;
    }

    public function hasCurrentRevision()
    {
        return is_object($this->getCurrentRevision());
    }

    public function hasHead()
    {
        return is_object($this->getHead());
    }

    public function isUnrevised()
    {
        return $this->countUnrevised() > 0;
    }

    public function removeRevision(RevisionInterface $revision)
    {
        $this->revisions->removeElement($revision);
    }

    public function removeTaxonomyTerm(TaxonomyTermInterface $taxonomyTerm, TaxonomyTermNodeInterface $node = null)
    {
        if ($node === null) {
            throw new Exception\InvalidArgumentException('Missing parameter node');
        }
        $this->termTaxonomyEntities->removeElement($node);
    }

    public function setTimestamp(\DateTime $date)
    {
        $this->date = $date;
    }
}
