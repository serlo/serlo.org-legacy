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
namespace Alias\Entity;

use DateTime;
use Instance\Entity\InstanceAwareInterface;
use Uuid\Entity\UuidInterface;

interface AliasInterface extends InstanceAwareInterface
{

    /**
     * Returns the ID
     *
     * @return int
     */
    public function getId();

    /**
     * Returns the source
     *
     * @return string
     */
    public function getSource();

    /**
     * Returns the alias
     *
     * @return string
     */
    public function getAlias();

    /**
     * Gets the object
     *
     * @return UuidInterface
     */
    public function getObject();

    /**
     * Sets the source
     *
     * @param string $source
     * @return void
     */
    public function setSource($source);

    /**
     * Sets the alias
     *
     * @param string $alias
     * @return void
     */
    public function setAlias($alias);

    /**
     * Sets the object
     *
     * @param UuidInterface $uuid
     * @return void
     */
    public function setObject(UuidInterface $uuid);

    /**
     * @return DateTime
     */
    public function getTimestamp();

    /**
     * @param DateTime $timestamp
     * @return void
     */
    public function setTimestamp(DateTime $timestamp);
}
