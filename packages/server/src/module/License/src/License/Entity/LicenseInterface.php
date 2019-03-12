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
namespace License\Entity;

use Instance\Entity\InstanceAwareInterface;

interface LicenseInterface extends InstanceAwareInterface
{

    /**
     * @return string
     */
    public function getContent();

    /**
     * @return string
     */
    public function getIconHref();

    /**
     * @return int
     */
    public function getId();

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return string
     */
    public function getUrl();

    /**
     * @param string $content
     * @return void
     */
    public function setContent($content);

    /**
     * @param string $iconHref
     * @return void
     */
    public function setIconHref($iconHref);

    /**
     * @param string $title
     * @return void
     */
    public function setTitle($title);

    /**
     * @param string $url
     * @return void
     */
    public function setUrl($url);

    /**
     * @return string
     */
    public function getAgreement();

    /**
     * @param string $agreement
     * @return void
     */
    public function setAgreement($agreement);

    /**
     * @return boolean
     */
    public function isDefault();

    /**
     * @param boolean $default
     */
    public function setDefault($default);
}
