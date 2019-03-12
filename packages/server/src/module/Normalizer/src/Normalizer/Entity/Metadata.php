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
namespace Normalizer\Entity;

use DateTime;
use Zend\Stdlib\AbstractOptions;

class Metadata extends AbstractOptions implements MetadataInterface
{

    /**
     * @var string
     */
    protected $author;

    /**
     * @var DateTime
     */
    protected $lastModified;

    /**
     * @var string
     */
    protected $context;

    /**
     * @var string
     */
    protected $description;

    /**
     * @var string
     */
    protected $metaDescription;

    /**
     * @var DateTime
     */
    protected $creationDate;

    /**
     * @var string
     */
    protected $title;

    /**
     * @var string
     */
    protected $languageCode;

    /**
     * @var string
     */
    protected $license;

    /**
     * @var string
     */
    protected $robots;

    /**
     * @var array|string[]
     */
    protected $keywords = [];

    public function __construct(array $data)
    {
        parent::__construct($data);
        $this->creationDate = $this->creationDate ? $this->creationDate : new DateTime();
        $this->lastModified = $this->lastModified ? $this->lastModified : new DateTime();
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getAuthor()
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * @param string $author
     */
    public function setAuthor($author)
    {
        $this->author = $author;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getContext()
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * @param string $context
     */
    public function setContext($context)
    {
        $this->context = $context;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getCreationDate()
     */
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * @param DateTime $timestamp
     */
    public function setCreationDate(DateTime $timestamp)
    {
        $this->creationDate = $timestamp;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getDescription()
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getMetaDescription()
    {
        return $this->metaDescription;
    }

    /**
     * @param string $metaDescription
     */
    public function setMetaDescription($metaDescription)
    {
        $this->metaDescription = $metaDescription;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getKeywords()
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

    /**
     * @param array|string[] $keywords
     */
    public function setKeywords(array $keywords)
    {
        $this->keywords = $keywords;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getLanguageCode()
     */
    public function getLanguageCode()
    {
        return $this->languageCode;
    }

    /**
     * @param string $languageCode
     */
    public function setLanguageCode($languageCode)
    {
        $this->languageCode = $languageCode;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getLastModified()
     */
    public function getLastModified()
    {
        return $this->lastModified;
    }

    /**
     * @param DateTime $lastModified
     */
    public function setLastModified(DateTime $lastModified)
    {
        $this->lastModified = $lastModified;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getLicense()
     */
    public function getLicense()
    {
        return $this->license;
    }

    /**
     * @param string $license
     */
    public function setLicense($license)
    {
        $this->license = $license;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getTitle()
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * {@inheritdoc}
     * @see \Normalizer\Entity\MetadataInterface::getRobots()
     */
    public function getRobots()
    {
        return $this->robots;
    }

    /**
     * @param string $robots
     */
    public function setRobots($robots)
    {
        $this->robots = $robots;
    }
}
