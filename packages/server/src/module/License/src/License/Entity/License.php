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

use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="license")
 */
class License implements LicenseInterface
{
    use InstanceAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     */
    protected $title;

    /**
     * @ORM\Column(type="string")
     */
    protected $url;

    /**
     * @ORM\Column(type="boolean", name="`default`")
     */
    protected $default;

    /**
     * @ORM\Column(type="string")
     */
    protected $content;

    /**
     * @ORM\Column(type="string")
     */
    protected $agreement;

    /**
     * @ORM\Column(type="string", name="icon_href")
     */
    protected $iconHref;

    /**
     * @return string
     */
    public function getAgreement()
    {
        return $this->agreement;
    }

    /**
     * @param string $agreement
     */
    public function setAgreement($agreement)
    {
        $this->agreement = $agreement;
    }

    /**
     * @return string $iconHref
     */
    public function getIconHref()
    {
        return $this->iconHref;
    }

    /**
     * @param string $iconHref
     * @return void
     */
    public function setIconHref($iconHref)
    {
        $this->iconHref = $iconHref;
    }

    /**
     * @return int $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return void
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string $url
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param string $url
     * @return void
     */
    public function setUrl($url)
    {
        $this->url = $url;
    }

    /**
     * @return string $content
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param string $content
     * @return void
     */
    public function setContent($content)
    {
        $this->content = $content;
    }

    /**
     * @return boolean
     */
    public function isDefault()
    {
        return $this->default;
    }

    /**
     * @param boolean $default
     */
    public function setDefault($default)
    {
        $this->default = (boolean)$default;
    }
}
