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
namespace Ui\View\Helper;

use Instance\Manager\InstanceManagerInterface;
use Ui\Options\BrandHelperOptions;
use Zend\View\Helper\AbstractHelper;

class Brand extends AbstractHelper
{
    /**
     * @var BrandHelperOptions
     */
    protected $options;

    /**
     * @var InstanceManagerInterface
     */
    protected $instanceManager;

    /**
     * @param BrandHelperOptions       $brandHelperOptions
     * @param InstanceManagerInterface $instanceManager
     */
    public function __construct(BrandHelperOptions $brandHelperOptions, InstanceManagerInterface $instanceManager)
    {
        $key                   = $instanceManager->getInstanceFromRequest()->getName();
        $this->instanceManager = $instanceManager;
        $this->options         = $brandHelperOptions->getInstance($key);
    }

    /**
     * @return $this
     */
    public function __invoke()
    {
        return $this;
    }

    /**
     * @param bool $stripTags
     * @return string
     */
    public function getBrand($stripTags = false)
    {
        if ($stripTags) {
            return strip_tags($this->options->getName());
        }

        return $this->options->getName();
    }

    /**
     * @return string
     */
    public function getHeadTitle()
    {
        return $this->options->getHeadTitle();
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->options->getDescription();
    }

    /**
     * @return string
     */
    public function getLogo()
    {
        return $this->options->getLogo();
    }

    /**
     * @param bool $stripTags
     * @return string
     */
    public function getSlogan($stripTags = false)
    {
        if ($stripTags) {
            return strip_tags($this->options->getSlogan());
        }

        return $this->options->getSlogan();
    }
}
