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
namespace Metadata\Manager;

use Metadata\Entity;
use Uuid\Entity\UuidInterface;
use Doctrine\Common\Collections\Collection;

interface MetadataManagerInterface
{

    /**
     * @param int $id
     * @return Entity\MetadataInterface
     */
    public function getMetadata($id);

    /**
     * @param int $id
     * @return void
     */
    public function removeMetadata($id);

    /**
     * @param UuidInterface $object
     * @return Entity\MetadataInterface[]|Collection
     */
    public function findMetadataByObject(UuidInterface $object);

    /**
     * @param UuidInterface $object
     * @param string        $key
     * @param string        $value
     * @return Entity\MetadataInterface|Collection
     */
    public function addMetadata(UuidInterface $object, $key, $value);

    /**
     * @param UuidInterface $object
     * @param string        $key
     * @return Entity\MetadataInterface[]|Collection
     */
    public function findMetadataByObjectAndKey(UuidInterface $object, $key);

    /**
     * @param \Uuid\Entity\UuidInterface $object
     * @param string                     $key
     * @param string                     $value
     * @return Entity\MetadataInterface
     */
    public function findMetadataByObjectAndKeyAndValue(UuidInterface $object, $key, $value);
}
