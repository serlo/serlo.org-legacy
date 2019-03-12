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
namespace Event\Entity;

use Datetime;
use Instance\Entity\InstanceAwareInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

interface EventLogInterface extends InstanceAwareInterface
{

    /**
     * @param EventParameterInterface $parameter
     * @return self
     */
    public function addParameter(EventParameterInterface $parameter);

    /**
     * Gets the actor
     *
     * @return UserInterface
     */
    public function getActor();

    /**
     * Gets the event
     *
     * @return EventInterface
     */
    public function getEvent();

    /**
     * Returns the id
     *
     * @return int
     */
    public function getId();

    /**
     * Returns the name
     *
     * @return string
     */
    public function getName();

    /**
     * Gets the associated object (uuid)
     *
     * @return UuidInterface
     */
    public function getObject();

    /**
     * @return UuidInterface
     */
    public function getParameter($name);

    /**
     * @return EventParameterInterface[]
     */
    public function getParameters();

    /**
     * @return Datetime
     */
    public function getTimestamp();

    /**
     * Sets the actor.
     *
     * @param UserInterface $actor
     * @return self
     */
    public function setActor(UserInterface $actor);

    /**
     * Sets the event.
     *
     * @param EventInterface $event
     * @return self
     */
    public function setEvent(EventInterface $event);

    /**
     * Sets the associated object (uuid)
     *
     * @param UuidInterface $uuid
     * @return self
     */
    public function setObject(UuidInterface $uuid);
}
