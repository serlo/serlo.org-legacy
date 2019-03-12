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

interface MetadataInterface
{
    /**
     * @return string
     */
    public function getAuthor();

    /**
     * @return string
     */
    public function getContext();

    /**
     * @return string
     */
    public function getDescription();

    /**
     * @return string
     */
    public function getMetaDescription();

    /**
     * @return DateTime
     */
    public function getCreationDate();

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return string
     */
    public function getLanguageCode();

    /**
     * @return string
     */
    public function getLicense();

    /**
     * @return DateTime
     */
    public function getLastModified();

    /**
     * @return array|string[]
     */
    public function getKeywords();

    /**
     * @return string
     */
    public function getRobots();
}
