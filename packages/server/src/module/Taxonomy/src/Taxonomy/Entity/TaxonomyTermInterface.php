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

use Doctrine\Common\Collections\Collection;
use Instance\Entity\InstanceProviderInterface;
use Type\Entity\TypeInterface;
use Uuid\Entity\UuidInterface;
use Zend\Filter\FilterInterface;

interface TaxonomyTermInterface extends InstanceProviderInterface, UuidInterface
{
    /**
     * @param TaxonomyTermAwareInterface $object
     * @return self
     */
    public function associateObject(TaxonomyTermAwareInterface $object);

    /**
     * @param string|null     $association
     * @param FilterInterface $filter
     * @return int
     */
    public function countAssociations($association = null, FilterInterface $filter = null);

    /**
     * @param TaxonomyTermAwareInterface $object
     * @return string
     */
    public function getAssociationFieldName(TaxonomyTermAwareInterface $object);

    /**
     * @param string $name
     * @return TaxonomyTermInterface
     */
    public function findAncestorByTypeName($name);

    /**
     * @param array|string[] $names
     * @return self[]|Collection
     */
    public function findChildrenByTaxonomyNames(array $names);

    /**
     * @param string $association
     * @return TaxonomyTermAwareInterface[]|Collection
     */
    public function getAssociated($association = null);

    /**
     * @param string $association
     * @param array  $allowedTaxonomies
     * @return TaxonomyTermAwareInterface[]|Collection
     */
    public function getAssociatedRecursive($association, array $allowedTaxonomies = []);

    /**
     * @return Collection|TaxonomyTermInterface[]
     */
    public function getChildren();

    /**
     * @param bool $trashed
     * @return Collection|TaxonomyTermInterface[]
     */
    public function findChildrenByTrashed($trashed);

    /**
     * @return string
     */
    public function getDescription();

    /**
     * @return int
     */
    public function getId();

    /**
     * @return string
     */
    public function getName();

    /**
     * @return self
     */
    public function getParent();

    /**
     * @return int
     */
    public function getPosition();

    /**
     * @return TaxonomyInterface
     */
    public function getTaxonomy();

    /**
     * @return TypeInterface
     */
    public function getType();

    /**
     * @return bool
     */
    public function hasChildren();

    /**
     * @return bool
     */
    public function hasParent();

    /**
     * @param TaxonomyTermAwareInterface $object
     * @return bool
     */
    public function isAssociated(TaxonomyTermAwareInterface $object);

    /**
     * @param self $ancestor
     * @return bool
     */
    public function knowsAncestor(TaxonomyTermInterface $ancestor);

    /**
     * @param TaxonomyTermAwareInterface|int $object
     * @param int                            $position
     * @param string                         $association
     * @return self
     */
    public function positionAssociatedObject($object, $position, $association = null);

    /**
     * @param TaxonomyTermAwareInterface $object
     * @return self
     */
    public function removeAssociation(TaxonomyTermAwareInterface $object);

    /**
     * @param string $description
     * @return self
     */
    public function setDescription($description);

    /**
     * @param self $parent
     * @return self
     */
    public function setParent(TaxonomyTermInterface $parent = null);

    /**
     * @param int $position
     * @return self
     */
    public function setPosition($position);

    /**
     * @param TaxonomyInterface $taxonomy
     * @return self
     */
    public function setTaxonomy(TaxonomyInterface $taxonomy);
}
