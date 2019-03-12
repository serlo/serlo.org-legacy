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
namespace Ui\Options;

use Zend\Stdlib\AbstractOptions;

class BrandHelperInstanceOptions extends AbstractOptions
{
    /**
     * @var string
     */
    protected $name = 'Athene2';

    /**
     * @var string
     */
    protected $slogan = 'The Learning Resources Management System';

    /**
     * @var string
     */
    protected $description = 'Manage your learning resources, easy, fast and reliable.';

    /**
     * @var string
     */
    protected $logo = 'Logo html here';


    /**
     * @var string
     */
    protected $headTitle = 'Athene2';

    /**
     * @return string
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
        $this->description = (string)$description;
    }

    /**
     * @return string
     */
    public function getHeadTitle()
    {
        return $this->headTitle;
    }

    /**
     * @param string $headTitle
     */
    public function setHeadTitle($headTitle)
    {
        $this->headTitle = $headTitle;
    }

    /**
     * @return string
     */
    public function getLogo()
    {
        return $this->logo;
    }

    /**
     * @param string $logo
     */
    public function setLogo($logo)
    {
        $this->logo = $logo;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getSlogan()
    {
        return $this->slogan;
    }

    /**
     * @param string $slogan
     */
    public function setSlogan($slogan)
    {
        $this->slogan = $slogan;
    }
}
