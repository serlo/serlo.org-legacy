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

namespace Notification\Listener;

use DateTime;
use Event\Entity\EventLogInterface;
use Event\EventManager;
use FeatureFlags\Service;
use MessageQueue\Producer;
use Notification\Entity\SubscriptionInterface;
use Notification\NotificationManagerAwareTrait;
use Notification\SubscriptionManagerInterface;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use User\Entity\UserInterface;

class EventManagerListener extends AbstractListener
{
    use NotificationManagerAwareTrait;

    /** @var Service */
    private $featureFlags;
    /** @var Producer */
    private $producer;

    public function __construct(SubscriptionManagerInterface $subscriptionManager, Service $featureFlags, Producer $producer)
    {
        parent::__construct($subscriptionManager);
        $this->featureFlags;
        $this->producer;
    }

    public function onLog(Event $e)
    {
        /** @var EventLogInterface $eventLog */
        $eventLog = $e->getParam('log');

        /* @var SubscriptionInterface[] $subscriptions */
        $object = $eventLog->getObject();
        $subscriptions = $this->getSubscriptionManager()->findSubscriptionsByUuid($object);
        $subscribed = [];

        if ($this->featureFlags->isEnabled('notifications')) {
            $this->producer->send('notifications', [
                'type' => 'create-event',
                'payload' => [
                    'event' => [
                        'provider_id' => 'serlo.org',
                        'id' => $eventLog->getId(),
                    ],
                    'user' => [
                        'provider_id' => 'serlo.org',
                        'id' => $eventLog->getActor()->getId(),
                    ],
                    'created_at' => $eventLog->getTimestamp()->format(DateTime::ISO8601),
                ],
            ]);
        }

        foreach ($subscriptions as $subscription) {
            $subscriber = $subscription->getSubscriber();
            // Don't create notifications for myself
            if ($subscriber !== $eventLog->getActor()) {
                $this->getNotificationManager()->createNotification(
                    $subscriber,
                    $eventLog,
                    $subscription->getNotifyMailman()
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
                            $eventLog,
                            $subscription->getNotifyMailman()
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
