<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Notification;

use Common\ObjectManager\Flushable;
use Doctrine\Common\Collections\ArrayCollection;
use Event\Entity\EventLogInterface;
use Notification\Entity\NotificationInterface;
use User\Entity\UserInterface;

interface NotificationManagerInterface extends Flushable
{
    /**
     * @param UserInterface $user
     * @param EventLogInterface $eventLog
     * @param bool $email
     * @return NotificationInterface
     */
    public function createNotification(
        UserInterface $user,
        EventLogInterface $eventLog,
        bool $email
    );

    /**
     * @param UserInterface $user
     * @return ArrayCollection
     */
    public function findMailmanNotificationsBySubscriber(UserInterface $user);

    /**
     * @param UserInterface $user
     * @param int           $limit
     * @return ArrayCollection
     */
    public function findNotificationsBySubscriber(
        UserInterface $user,
        $limit = 20
    );

    /**
     * @param UserInterface $user
     * @return void
     */
    public function markRead(UserInterface $user);
}
