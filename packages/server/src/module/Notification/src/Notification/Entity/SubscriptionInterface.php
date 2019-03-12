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

use DateTime;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

interface SubscriptionInterface
{

    /**
     * @return bool
     */
    public function getNotifyMailman();

    /**
     * @return UuidInterface
     */
    public function getSubscribedObject();

    /**
     * @return UserInterface
     */
    public function getSubscriber();

    /**
     * @return DateTime
     */
    public function getTimestamp();

    /**
     * @var bool
     * @return void
     */
    public function setNotifyMailman($notifyMailman);

    /**
     * @param UuidInterface $uuid
     * @return void
     */
    public function setSubscribedObject(UuidInterface $uuid);

    /**
     * @param UserInterface $user
     * @return void
     */
    public function setSubscriber(UserInterface $user);
}
