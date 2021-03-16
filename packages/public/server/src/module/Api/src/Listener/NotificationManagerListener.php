<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Api\Listener;

use Api\Manager\NotificationApiManager;
use Common\Listener\AbstractSharedListenerAggregate;
use Notification\Entity\NotificationInterface;
use Notification\NotificationManager;
use User\Entity\UserInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class NotificationManagerListener extends AbstractSharedListenerAggregate
{
    /** @var NotificationApiManager */
    protected $manager;

    public function __construct(NotificationApiManager $manager)
    {
        $this->manager = $manager;
    }

    public function onCreate(Event $e)
    {
        /** @var NotificationInterface $notification */
        $notification = $e->getParam('notification');
        /** @var UserInterface $user */
        $user = $e->getParam('user');
        $this->manager->setEventData($notification->getEvents()->first());
        $this->manager->setNotificationData($user);
    }

    public function onMarkRead(Event $e)
    {
        /** @var UserInterface $user */
        $user = $e->getParam('user');
        $this->manager->setNotificationData($user);
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'create',
            [$this, 'onCreate'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'markRead',
            [$this, 'onMarkRead'],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return NotificationManager::class;
    }
}
