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

use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use User\Entity\UserInterface;

/**
 * An Ad for 'Bildung im Netz'
 *
 * @ORM\Entity
 * @ORM\Table(name="ad")
 */
class Ad implements AdInterface
{
    use InstanceAwareTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Attachment\Entity\Container")
     */
    protected $image;

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    protected $author;

    /**
     * @ORM\Column(type="text",length=255)
     */
    protected $title;

    /**
     * @ORM\Column(type="text",length=255)
     */
    protected $url;

    /**
     * @ORM\Column(type="text")
     */
    protected $content;

    /**
     * @ORM\Column(type="float")
     */
    protected $frequency;

    /**
     * @ORM\Column(type="integer")
     */
    protected $clicks;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $banner;

    public function __construct()
    {
        $this->clicks = 0;
    }

    public function click()
    {
        $this->clicks++;
    }

    public function getAttachment()
    {
        return $this->image;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor(UserInterface $author)
    {
        $this->author = $author;
    }

    public function getClicks()
    {
        return $this->clicks;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function getFrequency()
    {
        return $this->frequency;
    }

    public function setFrequency($frequency)
    {
        $this->frequency = $frequency;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getImage()
    {
        return $this->getAttachment()->getFirstFile();
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function setAttachment($attachment)
    {
        $this->image = $attachment;
    }

    public function getBanner()
    {
        return $this->banner;
    }

    public function setBanner($banner = false)
    {
        $this->banner = $banner;
    }
}
