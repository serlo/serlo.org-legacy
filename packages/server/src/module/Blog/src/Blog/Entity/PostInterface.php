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
namespace Blog\Entity;

use DateTime;
use Instance\Entity\InstanceAwareInterface;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

interface PostInterface extends UuidInterface, TaxonomyTermAwareInterface, InstanceAwareInterface
{

    /**
     * Gets the id.
     *
     * @return int
     */
    public function getId();

    /**
     * Gets the content.
     *
     * @return string
     */
    public function getContent();

    /**
     * Gets the creation date.
     *
     * @return Datetime
     */
    public function getTimestamp();

    /**
     * Gets the publish date.
     *
     * @return DateTime
     */
    public function getPublish();

    /**
     * @return int
     */
    public function isPublished();

    /**
     * Gets the title.
     *
     * @return string
     */
    public function getTitle();

    /**
     * Sets the title.
     *
     * @param string $title
     * @return self
     */
    public function setTitle($title);

    /**
     * Gets the author.
     *
     * @return UserInterface
     */
    public function getAuthor();

    /**
     * Gets the category.
     *
     * @return TaxonomyTermInterface
     */
    public function getBlog();

    /**
     * Sets the category.
     *
     * @param TaxonomyTermInterface $category
     * @return self
     */
    public function setBlog(TaxonomyTermInterface $category);

    /**
     * Sets the creation date.
     *
     * @param Datetime $date
     * @return self
     */
    public function setTimestamp(Datetime $date);

    /**
     * Sets the content.
     *
     * @param string $content
     * @return self
     */
    public function setContent($content);

    /**
     * Sets the author.
     *
     * @param UserInterface $author
     * @return self
     */
    public function setAuthor(UserInterface $author);

    /**
     * Sets the publish date.
     *
     * @param Datetime $publish
     * @return self
     */
    public function setPublish(Datetime $publish = null);
}
