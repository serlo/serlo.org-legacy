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
namespace Navigation\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use Type\Entity\TypeAwareTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="navigation_container")
 */
class Container implements ContainerInterface
{
    use InstanceAwareTrait, TypeAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="Page", mappedBy="container")
     * @ORM\OrderBy({"position" = "ASC"})
     */
    protected $pages;

    public function __construct()
    {
        $this->pages = new ArrayCollection;
    }

    /**
     * @param PageInterface $page
     * @return void
     */
    public function removePage(PageInterface $page)
    {
        $this->pages->removeElement($page);
    }

    /**
     * @param PageInterface $page
     * @return void
     */
    public function addPage(PageInterface $page)
    {
        $this->pages->add($page);
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return PageInterface[]
     */
    public function getPages()
    {
        return $this->pages->matching(
            Criteria::create()->where(Criteria::expr()->isNull('parent'))->orderBy(['position' => 'asc'])
        );
    }
}
