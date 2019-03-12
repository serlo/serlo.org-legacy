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
namespace Flag\Entity;

use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="flag")
 */
class Flag implements FlagInterface
{
    use\Type\Entity\TypeAwareTrait;
    use InstanceAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Uuid\Entity\Uuid", inversedBy="flags")
     * @ORM\JoinColumn(name="uuid_id", referencedColumnName="id")
     */
    protected $object;

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     */
    protected $reporter;

    /**
     * @ORM\Column(type="string")
     */
    protected $content;

    /**
     * @ORM\Column(type="datetime", name="`timestamp`", options={"default"="CURRENT_TIMESTAMP"})
     */
    protected $timestamp;

    public function getTimestamp()
    {
        return $this->timestamp;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getObject()
    {
        return $this->object;
    }

    public function setObject(UuidInterface $object)
    {
        $this->object = $object;

        return $this;
    }

    public function getReporter()
    {
        return $this->reporter;
    }

    public function setReporter(UserInterface $reporter)
    {
        $this->reporter = $reporter;

        return $this;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }
}
