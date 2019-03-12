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
namespace RelatedContent\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="related_content")
 */
class Holder implements HolderInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Container", inversedBy="externalRelations")
     */
    protected $container;

    /**
     * @ORM\OneToOne(targetEntity="External", mappedBy="id")
     */
    protected $external;

    /**
     * @ORM\OneToOne(targetEntity="Internal", mappedBy="id")
     */
    protected $internal;

    /**
     * @ORM\OneToOne(targetEntity="Category", mappedBy="id")
     */
    protected $category;

    /**
     * @ORM\Column(type="integer")
     */
    protected $position;

    public function getPosition()
    {
        return $this->position;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getContainer()
    {
        return $this->container;
    }

    public function getSpecific()
    {
        $keys = [
            'internal',
            'external',
            'category',
        ];
        foreach ($keys as $key) {
            if (is_object($this->$key)) {
                return $this->$key;
            }
        }
        return null;
    }

    public function setContainer(ContainerInterface $container)
    {
        $this->container = $container;
        return $this;
    }

    public function setPosition($position)
    {
        $this->position = $position;
        return $this;
    }
}
