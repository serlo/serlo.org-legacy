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
namespace Flag\Entity;

use Instance\Entity\InstanceAwareInterface;
use Type\Entity\TypeAwareInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

interface FlagInterface extends TypeAwareInterface, InstanceAwareInterface
{

    /**
     * @return int
     */
    public function getId();

    /**
     * @return UuidInterface
     */
    public function getObject();

    /**
     * @return string
     */
    public function getContent();

    /**
     * @return UserInterface
     */
    public function getReporter();

    /**
     * @return \DateTime
     */
    public function getTimestamp();

    /**
     * @param UuidInterface $uuid
     * @return self
     */
    public function setObject(UuidInterface $uuid);

    /**
     * @param string $content
     * @return self
     */
    public function setContent($content);

    /**
     * @param UserInterface $user
     * @return self
     */
    public function setReporter(UserInterface $user);
}
