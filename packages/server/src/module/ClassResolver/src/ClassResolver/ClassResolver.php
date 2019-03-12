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
namespace ClassResolver;

class ClassResolver implements ClassResolverInterface
{
    use \Zend\ServiceManager\ServiceLocatorAwareTrait;

    /**
     * @var array
     */
    protected $registry;

    public function __construct($config = [])
    {
        foreach ($config as $from => $to) {
            $this->addClass($from, $to);
        }
    }

    protected function addClass($from, $to)
    {
        $this->registry[$this->getIndex($from)] = $to;

        return $this;
    }

    protected function getIndex($key)
    {
        return preg_replace('/[^a-z0-9]/i', '_', (string)$key);
    }

    protected function getClass($class)
    {
        if (!is_string($class)) {
            throw new Exception\InvalidArgumentException(sprintf('Argument is not a string.'));
        }

        $index = $this->getIndex($class);

        if (!array_key_exists($index, $this->registry)) {
            throw new Exception\RuntimeException(sprintf("Can't resolve %s (%s).", $class, $index));
        }
        if (!class_exists($this->registry[$index])) {
            throw new Exception\RuntimeException(sprintf(
                "Class `%s` not found, resolved from %s.",
                $this->registry[$index],
                $class
            ));
        }

        return $this->registry[$index];
    }

    public function resolveClassName($class)
    {
        return $this->getClass($class);
    }

    public function resolve($class, $userServiceLocator = false)
    {
        $className = $this->getClass($class);

        if ($userServiceLocator) {
            $instance = $this->getServiceLocator()->get($this->getClass($class));
        } else {
            $instance = new $className();
        }

        if (!$instance instanceof $class) {
            throw new Exception\RuntimeException(sprintf(
                'Class %s does not implement %s',
                get_class($instance),
                $class
            ));
        }

        return $instance;
    }
}
