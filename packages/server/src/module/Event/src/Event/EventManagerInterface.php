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
namespace Event;

use Doctrine\Common\Collections\Collection;
use Event\Entity\EventInterface;
use Event\Entity\EventLogInterface;
use Instance\Entity\InstanceInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;
use Zend\Paginator\Paginator;

interface EventManagerInterface
{
    /**
     * @param int $userId
     * @return EventLogInterface[]|Collection
     */
    public function findEventsByActor($userId);

    /**
     * @param int $userId
     * @param int $page
     * @param int $limit
     * @return Paginator
     */
    public function findAllEventsByActor($userId, $page, $limit = 100);
    /**
     * @param int   $objectId
     * @param bool  $recursive
     * @param array $filter
     * @return EventLogInterface[]|Collection
     */
    public function findEventsByObject($objectId, $recursive = true, array $filter = []);

    /**
     * Finds an event by it's name
     *
     * @param string $eventName
     * @return EventInterface
     */
    public function findTypeByName($eventName);

    /**
     * @param int $id
     * @return EventLogInterface
     */
    public function getEvent($id);

    /**
     * @param UserInterface $user
     * @param array $names
     * @return EventLogInterface[]|Collection
     */
    public function findEventsByNamesAndActor(UserInterface $user, array $names);

    /**
     * @param int $page
     * @param int $limit
     * @return Paginator
     */
    public function findAll($page, $limit = 100);

    /**
     * @param string            $eventName
     * @param InstanceInterface $instance
     * @param UuidInterface     $uuid
     * @param array             $parameters
     * @return EventLogInterface
     */
    public function logEvent(
        $eventName,
        InstanceInterface $instance,
        UuidInterface $uuid,
        array $parameters = []
    );
}
