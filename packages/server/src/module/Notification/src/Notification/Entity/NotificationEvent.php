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
namespace Notification\Entity;

use Doctrine\ORM\Mapping as ORM;
use Event\Entity\EventLogInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="notification_event")
 */
class NotificationEvent implements NotificationEventInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\OneToOne(targetEntity="Event\Entity\EventLog")
     * @ORM\JoinColumn(name="event_log_id", referencedColumnName="id")
     */
    protected $eventLog;

    /**
     * @ORM\OneToOne(targetEntity="Notification")
     * @ORM\JoinColumn(name="notification_id", referencedColumnName="id")
     */
    protected $notification;

    /*
     * (non-PHPdoc) @see \User\Notification\Entity\NotificationEventInterface::getEventLog()
     */
    public function getEventLog()
    {
        return $this->eventLog;
    }

    /*
     * (non-PHPdoc) @see \User\Notification\Entity\NotificationEventInterface::setEventLog()
     */
    public function setEventLog(EventLogInterface $eventLog)
    {
        $this->eventLog = $eventLog;

        return $this;
    }

    /*
     * (non-PHPdoc) @see \User\Notification\Entity\NotificationEventInterface::getId()
     */
    public function getId()
    {
        return $this->id;
    }

    /*
     * (non-PHPdoc) @see \User\Notification\Entity\NotificationEventInterface::getNotification()
     */
    public function getNotification()
    {
        return $this->notification;
    }

    /*
     * (non-PHPdoc) @see \User\Notification\Entity\NotificationEventInterface::setNotification()
     */
    public function setNotification(NotificationInterface $notification)
    {
        $this->notification = $notification;

        return $this;
    }
}
