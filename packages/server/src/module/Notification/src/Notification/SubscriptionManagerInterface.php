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

use Common\ObjectManager\Flushable;
use Notification\Entity\SubscriptionInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

interface SubscriptionManagerInterface extends Flushable
{

    /**
     * @param UuidInterface $uuid
     * @return SubscriptionInterface[]
     */
    public function findSubscriptionsByUuid(UuidInterface $uuid);

    /**
     * @param UserInterface $user
     * @param UuidInterface $object
     * @return SubscriptionInterface
     */
    public function findSubscription(UserInterface $user, UuidInterface $object);

    /**
     * @param UserInterface $user
     * @return SubscriptionInterface[]
     */
    public function findSubscriptionsByUser(UserInterface $user);

    /**
     * @return bool
     */
    public function hasSubscriptions();

    /**
     * @param UserInterface $user
     * @param UuidInterface $object
     * @return bool
     */
    public function isUserSubscribed(UserInterface $user, UuidInterface $object);

    /**
     * @param UserInterface $user
     * @param UuidInterface $object
     * @param bool          $notifyMailman
     * @return void
     */
    public function update(UserInterface $user, UuidInterface $object, $notifyMailman);

    /**
     * @param UserInterface $user
     * @param UuidInterface $object
     * @param bool          $notifyMailman
     * @return void
     */
    public function subscribe(UserInterface $user, UuidInterface $object, $notifyMailman);

    /**
     * @param UserInterface $user
     * @param UuidInterface $object
     * @return void
     */
    public function unSubscribe(UserInterface $user, UuidInterface $object);
}
