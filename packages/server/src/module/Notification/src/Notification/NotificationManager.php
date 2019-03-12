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
namespace Notification;

use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Event\Entity\EventLogInterface;
use Notification\Entity\NotificationInterface;
use Notification\Filter\PersistentNotificationFilterChain;
use User\Entity\UserInterface;
use Zend\EventManager\EventManagerAwareTrait;

class NotificationManager implements NotificationManagerInterface
{
    use ClassResolverAwareTrait, ObjectManagerAwareTrait;
    use FlushableTrait;

    /**
     * @var PersistentNotificationFilterChain
     */
    protected $persistentNotificationFilterChain;

    public function __construct(ClassResolverInterface $classResolver, ObjectManager $objectManager)
    {
        $this->classResolver                     = $classResolver;
        $this->objectManager                     = $objectManager;
        $this->persistentNotificationFilterChain = new PersistentNotificationFilterChain($objectManager);
    }

    public function createNotification(UserInterface $user, EventLogInterface $log)
    {
        /* @var $notificationLog \Notification\Entity\NotificationEventInterface */
        $notification    = $this->aggregateNotification($user, $log);
        $class           = 'Notification\Entity\NotificationEventInterface';
        $className       = $this->getClassResolver()->resolveClassName($class);
        $notificationLog = new $className();

        $notification->setUser($user);
        $notification->setSeen(false);
        $notification->setTimestamp(new DateTime());
        $notification->addEvent($notificationLog);
        $notificationLog->setEventLog($log);
        $notificationLog->setNotification($notification);

        $this->getObjectManager()->persist($notification);
        $this->getObjectManager()->persist($notificationLog);

        return $notification;
    }

    public function findNotificationsBySubscriber(UserInterface $user, $limit = 20)
    {
        $className     = $this->getClassResolver()->resolveClassName('Notification\Entity\NotificationInterface');
        $criteria      = ['user' => $user->getId()];
        $order         = ['id' => 'desc'];
        $notifications = $this->getObjectManager()->getRepository($className)->findBy($criteria, $order, $limit);
        $collection    = new ArrayCollection($notifications);
        return $this->persistentNotificationFilterChain->filter($collection);
    }

    public function markRead(UserInterface $user)
    {
        $notifications = $this->findNotificationsBySubscriber($user, 100);
        $entityManager = $this->objectManager;
        $notifications->map(
            function (NotificationInterface $n) use ($entityManager) {
                if (!$n->getSeen()) {
                    $n->setSeen(true);
                    $entityManager->persist($n);
                }
            }
        );
    }

    /**
     * @param UserInterface     $user
     * @param EventLogInterface $log
     * @return NotificationInterface
     */
    protected function aggregateNotification(UserInterface $user, EventLogInterface $log)
    {
        $className = $this->getClassResolver()->resolveClassName('Notification\Entity\NotificationInterface');
        return new $className();
    }
}
