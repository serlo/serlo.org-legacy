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
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="subscription")
 */
class Subscription implements SubscriptionInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\OneToOne(targetEntity="Uuid\Entity\Uuid")
     * @ORM\JoinColumn(name="uuid_id", referencedColumnName="id")
     */
    protected $object;

    /**
     * @ORM\OneToOne(targetEntity="User\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @ORM\Column(type="boolean", name="notify_mailman")
     */
    protected $notifyMailman;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $date;

    public function getNotifyMailman()
    {
        return $this->notifyMailman;
    }

    public function setNotifyMailman($notifyMailman)
    {
        $this->notifyMailman = (bool) $notifyMailman;
    }

    public function setSubscriber(UserInterface $user)
    {
        $this->user = $user;
    }

    public function getSubscriber()
    {
        return $this->user;
    }

    public function setSubscribedObject(UuidInterface $uuid)
    {
        $this->object = $uuid;
    }

    public function getSubscribedObject()
    {
        return $this->object;
    }

    public function getTimestamp()
    {
        return $this->date;
    }
}
