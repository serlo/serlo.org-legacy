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
namespace Event\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="event_log")
 */
class EventLog implements EventLogInterface
{
    use InstanceAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     * @ORM\JoinColumn(name="actor_id", referencedColumnName="id")
     */
    protected $actor;

    /**
     * @ORM\ManyToOne(targetEntity="Event")
     * @ORM\JoinColumn(name="event_id", referencedColumnName="id")
     */
    protected $event;

    /**
     * @ORM\ManyToOne(targetEntity="Uuid\Entity\Uuid")
     * @ORM\JoinColumn(name="uuid_id", referencedColumnName="id")
     */
    protected $uuid;

    /**
     * @ORM\OneToMany(targetEntity="EventParameter", mappedBy="log")
     */
    protected $parameters;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $date;

    public function __construct()
    {
        $this->parameters = new ArrayCollection();
    }

    public function getParameters()
    {
        return $this->parameters;
    }

    public function getParameter($name)
    {
        foreach ($this->getParameters() as $parameter) {
            if ($parameter->getName() == $name) {
                if ($parameter instanceof EventParameterUuid) {
                    return $parameter->getValue();
                } else {
                    return $parameter->getValue();
                }
            }
        }

        return null;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getActor()
    {
        return $this->actor;
    }

    public function getEvent()
    {
        return $this->event;
    }

    public function getName()
    {
        return $this->getEvent()->getName();
    }

    public function getObject()
    {
        return $this->uuid;
    }

    public function getTimestamp()
    {
        return $this->date;
    }

    public function setActor(UserInterface $actor)
    {
        $this->actor = $actor;
    }

    public function setEvent(EventInterface $event)
    {
        $this->event = $event;
    }

    public function setObject(UuidInterface $uuid)
    {
        $this->uuid = $uuid;
    }

    public function addParameter(EventParameterInterface $parameter)
    {
        $this->parameters->add($parameter);
    }
}
