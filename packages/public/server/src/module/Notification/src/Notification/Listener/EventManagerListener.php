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

namespace Notification\Listener;

use Event\Entity\EventLogInterface;
use Event\EventManager;
use Notification\Entity\SubscriptionInterface;
use Notification\NotificationManagerAwareTrait;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use User\Entity\UserInterface;

class EventManagerListener extends AbstractListener
{
    use NotificationManagerAwareTrait;

    public function onLog(Event $e)
    {
        /** @var EventLogInterface $eventLog */
        $eventLog = $e->getParam('log');

        /* @var SubscriptionInterface[] $subscriptions */
        $object = $eventLog->getObject();
        $subscriptions = $this->getSubscriptionManager()->findSubscriptionsByUuid($object);
        $subscribed = [];

        foreach ($subscriptions as $subscription) {
            $subscriber = $subscription->getSubscriber();
            // Don't create notifications for myself
            if ($subscriber !== $eventLog->getActor()) {
                $this->getNotificationManager()->createNotification(
                    $subscriber,
                    $eventLog
                );
                $subscribed[] = $subscriber;
            }
        }

        foreach ($eventLog->getParameters() as $parameter) {
            if ($parameter->getValue() instanceof UuidInterface) {
                /* @var $subscribers UserInterface[] */
                $object = $parameter->getValue();
                $subscriptions = $this->getSubscriptionManager()->findSubscriptionsByUuid($object);

                foreach ($subscriptions as $subscription) {
                    $subscriber = $subscription->getSubscriber();
                    if (!in_array($subscriber, $subscribed) && $subscriber !== $eventLog->getActor()) {
                        $this->getNotificationManager()->createNotification(
                            $subscriber,
                            $eventLog
                        );
                    }
                }
            }
        }
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'log',
            [
                $this,
                'onLog',
            ]
        );
    }

    protected function getMonitoredClass()
    {
        return EventManager::class;
    }
}
