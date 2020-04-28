<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Subject;

use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\Stdlib\ArrayUtils;

class Module implements ConfigProviderInterface
{
    public function getConfig()
    {
        return ArrayUtils::merge(include __DIR__ . '/../config/module.config.php', $this->getInstanceConfig());
    }

    public function getInstanceConfig()
    {
        $instances = [__DIR__ . '/../config/instances.config.php'];
        $config    = [];
        foreach ($instances as $instance) {
            $config = ArrayUtils::merge($config, include $instance);
        }

        return $config;
    }
}
