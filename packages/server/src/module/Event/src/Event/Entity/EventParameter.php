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

use Doctrine\ORM\Mapping as ORM;
use Uuid\Entity\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="event_parameter")
 */
class EventParameter implements EventParameterInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="EventLog", inversedBy="parameters")
     */
    protected $log;

    /**
     * @ORM\ManyToOne(targetEntity="EventParameterName")
     */
    protected $name;

    /**
     * @ORM\OneToOne(targetEntity="EventParameterUuid", mappedBy="eventParameter", cascade={"persist", "remove"})
     */
    protected $object;

    /**
     * @ORM\OneToOne(targetEntity="EventParameterString", mappedBy="eventParameter", cascade={"persist", "remove"})
     */
    protected $string;

    public function getId()
    {
        return $this->id;
    }

    public function getInstance()
    {
        return $this->log->getInstance();
    }

    public function getLog()
    {
        return $this->log;
    }

    public function setLog(EventLogInterface $log)
    {
        $this->log = $log;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName(EventParameterNameInterface $name)
    {
        $this->name = $name;
    }

    public function getValue()
    {
        if (is_object($this->object)) {
            return $this->object->getValue();
        } elseif (is_object($this->string)) {
            return $this->string->getValue();
        }
        return null;
    }

    public function setValue($value)
    {
        if ($value instanceof UuidInterface) {
            $param        = new EventParameterUuid($this, $value);
            $this->object = $param;
        } else {
            $param        = new EventParameterString($this, $value);
            $this->string = $param;
        }
    }
}
