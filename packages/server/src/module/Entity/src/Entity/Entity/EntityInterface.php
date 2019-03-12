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

use Doctrine\Common\Collections\Collection;
use DateTime;
use Instance\Entity\InstanceAwareInterface;
use License\Entity\LicenseAwareInterface;
use Link\Entity\LinkableInterface;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Type\Entity\TypeAwareInterface;
use Uuid\Entity\UuidInterface;
use Versioning\Entity\RepositoryInterface;

interface EntityInterface extends UuidInterface, InstanceAwareInterface, RepositoryInterface, LinkableInterface, LicenseAwareInterface,
            TaxonomyTermAwareInterface, TypeAwareInterface
{

    /**
     * @return DateTime
     */
    public function getTimestamp();

    /**
     * @param DateTime $date
     */
    public function setTimestamp(DateTime $date);

    /**
     * Returns the children
     *
     * @param string $linkType
     * @param string $childType
     * @return Collection|EntityInterface[]
     */
    public function getChildren($linkType, $childType = null);

    /**
     * Returns the children that are revised and not trashed
     *
     * @param string $linkType
     * @param string $childType
     * @return Collection|EntityInterface[]
     */
    public function getValidChildren($linkType, $childType = null);

    /**
     * Returns the parents
     *
     * @param string $linkyType
     * @param string $parentType
     * @return Collection|EntityInterface[]
     */
    public function getParents($linkyType, $parentType = null);

    /**
     * Returns the entity following the given entity or null
     *
     * @param EntityInterface $previous
     * @return EntityInterface|null
     */
    public function getNextValidSibling($linkType, EntityInterface $previous);

    /**
     * Returns the previous valid sibling or null
     *
     * @param EntityInterface $following
     * @return EntityInterface|null
     */
    public function getPreviousValidSibling($linkType, EntityInterface $following);

    /**
     * @return bool
     */
    public function isUnrevised();

    /**
     * @return int
     */
    public function countUnrevised();
}
