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
namespace Ads\Entity;

use Attachment\Entity\ContainerInterface;
use Attachment\Entity\FileInterface;
use Instance\Entity\InstanceAwareInterface;
use User\Entity\UserInterface;

interface AdInterface extends InstanceAwareInterface
{

    /**
     * Upcounts the click counter
     *
     * @return void
     */
    public function click();

    /**
     * Gets the image.
     *
     * @return ContainerInterface
     */
    public function getAttachment();

    /**
     * Gets the author.
     *
     * @return UserInterface
     */
    public function getAuthor();

    /**
     * Gets the clicks.
     *
     * @return int
     */
    public function getClicks();

    /**
     * Gets the content.
     *
     * @return string
     */
    public function getContent();

    /**
     * Gets the frequency.
     *
     * @return float
     */
    public function getFrequency();

    /**
     * Gets the id.
     *
     * @return int
     */
    public function getId();

    /**
     * Gets the image.
     *
     * @return FileInterface
     */
    public function getImage();

    /**
     * Gets the title.
     *
     * @return string
     */
    public function getTitle();

    /**
     * Gets the url.
     *
     * @return string
     */
    public function getUrl();

    /**
     * Gets the banner.
     *
     * @return boolean
     */
    public function getBanner();
}
