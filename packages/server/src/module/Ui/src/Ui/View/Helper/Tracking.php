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
use Ui\Options\TrackingHelperOptions;
use Zend\View\Helper\AbstractHelper;

class Tracking extends AbstractHelper
{
    /**
     * @var TrackingHelperOptions
     */
    protected $options;

    /**
     * @var InstanceManagerInterface
     */
    protected $instanceManager;

    /**
     * @param InstanceManagerInterface $instanceManager
     * @param TrackingHelperOptions    $options
     */
    public function __construct(InstanceManagerInterface $instanceManager, TrackingHelperOptions $options)
    {
        $this->instanceManager = $instanceManager;
        $instance              = $instanceManager->getInstanceFromRequest();
        $name                  = strtolower($instance->getName());
        $this->options         = $options->getInstance($name);
    }

    /**
     * @return $this
     */
    public function __invoke()
    {
        return $this;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->options->getCode();
    }
}
