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
namespace Common\Traits;

use Zend\Stdlib\ArrayUtils;

trait ConfigAwareTrait
{
    abstract protected function getDefaultConfig();

    protected $config = [];

    /**
     * @return array $config
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * @param array $config
     * @return self
     */
    public function setConfig(array $config)
    {
        $this->config = ArrayUtils::merge($this->getDefaultConfig(), $config);

        $array = [
            $this->getDefaultConfig(),
            $config,
            $this->config,
        ];

        return $this;
    }

    public function appendConfig(array $config)
    {
        $this->config = ArrayUtils::merge($this->config, $config);

        return $this;
    }

    public function getOption($key)
    {
        if (array_key_exists($key, $this->getConfig())) {
            return $this->getConfig()[$key];
        } else {
            $this->setConfig([]);
            if (array_key_exists($key, $this->getConfig())) {
                return $this->getConfig()[$key];
            } else {
                return null;
            }
        }
    }
}
