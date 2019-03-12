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
namespace Subject\Options;

use Subject\Exception;
use Zend\Stdlib\AbstractOptions;

class ModuleOptions extends AbstractOptions
{

    /**
     * @var array
     */
    protected $instances = [];

    /**
     * @param string $name
     * @param string $instance
     * @throws Exception\RuntimeException
     * @return SubjectOptions
     */
    public function getInstance($name, $instance)
    {
        $name = strtolower($name);
        $instance = strtolower($instance);

        if (!array_key_exists($instance, $this->instances)) {
            throw new Exception\RuntimeException(sprintf('Instance "%s" unknown.', $instance));
        }

        if (!array_key_exists($name, $this->instances[$instance])) {
            throw new Exception\RuntimeException(sprintf('Subject "%s" unknown.', $name));
        }

        $options = $this->instances[$instance][$name];
        return new SubjectOptions($options);
    }

    /**
     * @param array $instances
     * @return self
     */
    public function setInstances(array $instances)
    {
        $this->instances = $instances;
        return $this;
    }
}
