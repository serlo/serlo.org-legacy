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
namespace Uuid\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Uuid\Exception;

/**
 * @ORM\Entity
 * @ORM\Table(name="uuid")
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="discriminator", type="string")
 * @ORM\DiscriminatorMap({
 * "taxonomyTerm" = "Taxonomy\Entity\TaxonomyTerm",
 * "user" = "User\Entity\User",
 * "attachment" = "Attachment\Entity\Container",
 * "uuid" = "Uuid\Entity\Uuid",
 * "blogPost" = "Blog\Entity\Post",
 * "entity" = "Entity\Entity\Entity",
 * "entityRevision" = "Entity\Entity\Revision",
 * "page" = "Page\Entity\PageRepository",
 * "pageRevision" = "Page\Entity\PageRevision",
 * "comment" = "Discussion\Entity\Comment"
 * })
 */
class Uuid implements UuidInterface
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $trashed = false;

    /**
     * @ORM\OneToMany(targetEntity="Flag\Entity\Flag", mappedBy="object")
     */
    protected $flags;

    /**
     * @ORM\OneToMany(targetEntity="Discussion\Entity\Comment", mappedBy="object", cascade={"remove"})
     */
    protected $opinions;

    public function __construct()
    {
        $this->opinions = new ArrayCollection;
    }

    public function isTrashed()
    {
        return $this->getTrashed();
    }

    public function getTrashed()
    {
        return $this->trashed;
    }

    public function setTrashed($trashed)
    {
        $this->trashed = (bool)$trashed;
    }

    public function getId()
    {
        return $this->id;
    }

    public function __toString()
    {
        return (string)$this->getId();
    }
}
