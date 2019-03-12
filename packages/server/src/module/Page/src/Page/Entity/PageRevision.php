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
namespace Page\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use User\Entity\UserInterface;
use Uuid\Entity\Uuid;
use Versioning\Entity\RepositoryInterface;

/**
 * A Page Revision.
 *
 * @ORM\Entity
 * @ORM\Table(name="page_revision")
 */
class PageRevision extends Uuid implements PageRevisionInterface
{

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    protected $author;

    /**
     * @ORM\ManyToOne(targetEntity="PageRepository", inversedBy="revisions")
     */
    protected $page_repository;

    /**
     * @ORM\Column(type="text",length=255)
     */
    protected $title;

    /**
     * @ORM\Column(type="text")
     */
    protected $content;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    protected $date;


    public function getRepository()
    {
        return $this->page_repository;
    }

    public function setRepository(RepositoryInterface $repository)
    {
        $this->page_repository = $repository;
    }

    public function getInstance()
    {
        return $this->getRepository()->getInstance();
    }

    public function getTimestamp()
    {
        return $this->date;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function setDate(DateTime $date)
    {
        $this->date = $date;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor(UserInterface $author)
    {
        $this->author = $author;
    }

    public function populate(array $data = [])
    {
        $this->injectFromArray('author', $data);
        $this->injectFromArray('title', $data);
        $this->injectFromArray('content', $data);
        $this->injectFromArray('date', $data);
        return $this;
    }

    public function set($key, $value)
    {
        $this->$key = $value;
    }

    private function injectFromArray($key, array $array, $default = null)
    {
        if (array_key_exists($key, $array)) {
            $this->$key = $array[$key];
        } elseif ($default !== null) {
            $this->$key = $default;
        }
    }

    public function isOryEditorFormat()
    {
        $parsed = json_decode($this->getContent(), true);
        return $parsed !== null && isset($parsed['cells']);
    }
}
