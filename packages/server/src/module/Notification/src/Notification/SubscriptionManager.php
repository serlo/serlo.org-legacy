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
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

class SubscriptionManager implements SubscriptionManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait, FlushableTrait;

    public function findSubscriptionsByUser(UserInterface $user)
    {
        $className     = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $criteria      = ['user' => $user->getId()];
        $subscriptions = $this->getObjectManager()->getRepository($className)->findBy($criteria);
        $collection    = new ArrayCollection($subscriptions);
        return $collection;
    }

    public function findSubscriptionsByUuid(UuidInterface $uuid)
    {
        $className     = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $criteria      = ['object' => $uuid->getId()];
        $subscriptions = $this->getObjectManager()->getRepository($className)->findBy($criteria);
        $collection    = new ArrayCollection($subscriptions);
        return $collection;
    }

    public function update(UserInterface $user, UuidInterface $object, $email)
    {
        $className    = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $criteria     = [
            'user'   => $user->getId(),
            'object' => $object->getId(),
        ];
        $subscription = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        $subscription->setNotifyMailman((bool)$email);
        $this->objectManager->persist($subscription);
    }

    public function findSubscription(UserInterface $user, UuidInterface $object)
    {
        $className    = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $criteria     = [
            'user'   => $user->getId(),
            'object' => $object->getId(),
        ];
        $subscription = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);
        return $subscription;
    }

    public function isUserSubscribed(UserInterface $user, UuidInterface $object)
    {
        $className    = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $criteria     = [
            'user'   => $user->getId(),
            'object' => $object->getId(),
        ];
        $subscription = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);
        return is_object($subscription);
    }

    public function unSubscribe(UserInterface $user, UuidInterface $object)
    {
        $className    = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $criteria     = [
            'user'   => $user->getId(),
            'object' => $object->getId(),
        ];
        $subscription = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (is_object($subscription)) {
            $this->objectManager->remove($subscription);
        }
    }

    public function subscribe(UserInterface $user, UuidInterface $object, $notifyMailman)
    {
        if (!$this->isUserSubscribed($user, $object)) {
            $class = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
            /* @var $entity \Notification\Entity\SubscriptionInterface */
            $entity = new $class();
            $entity->setSubscriber($user);
            $entity->setSubscribedObject($object);
            $entity->setNotifyMailman($notifyMailman);
            $this->getObjectManager()->persist($entity);
        }
    }

    public function hasSubscriptions()
    {
        $className     = $this->getClassResolver()->resolveClassName('Notification\Entity\SubscriptionInterface');
        $subscriptions = $this->getObjectManager()->getRepository($className)->findBy([], null, 1);
        return count($subscriptions) > 0;
    }
}
