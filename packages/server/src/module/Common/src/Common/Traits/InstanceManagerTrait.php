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

trait InstanceManagerTrait
{
    use \Zend\ServiceManager\ServiceLocatorAwareTrait, \ClassResolver\ClassResolverAwareTrait;

    /**
     * Array of all registered instances
     *
     * @var array
     */
    private $instances = [];

    private $checkClassInheritance = true;

    /**
     * @return boolean $checkClassInheritance
     */
    public function getCheckClassInheritance()
    {
        return $this->checkClassInheritance;
    }

    /**
     * @param boolean $checkClassInheritance
     * @return self
     */
    public function setCheckClassInheritance($checkClassInheritance)
    {
        $this->checkClassInheritance = $checkClassInheritance;

        return $this;
    }

    /**
     * Adds an instance.
     *
     * @param string $name
     * @param object $instance
     * @throws \Exception
     * @return self
     */
    protected function addInstance($name, $instance)
    {
        if (!is_object($instance)) {
            throw new \Exception('Please pass only objects.');
        }

        if ($this->hasInstance($name)) {
            if ($this->instances[$name] !== $instance) {
                $unsetInstance = $this->instances[$name];
                unset($unsetInstance);
                unset($this->instances[$name]);
            } else {
                return $this;
            }
        }

        $this->instances[$name] = $instance;

        return $this;
    }

    /**
     * Checks if an instance is already registered.
     *
     * @param string $name
     * @return boolean
     */
    protected function hasInstance($name)
    {
        return array_key_exists($name, $this->instances);
    }

    /**
     * Returns an instance.
     *
     * @param string $name
     * @throws \Exception
     * @return multitype:
     */
    protected function getInstance($name)
    {
        if (!$this->hasInstance($name)) {
            throw new \Exception('Instance `' . $name . '` not set.');
        }

        return $this->instances[$name];
    }

    /**
     * Creates an instance
     *
     * @param string $instanceClassName
     * @throws \InvalidArgumentException
     * @return $instanceClassName
     */
    protected function createInstance($class, $shared = false)
    {
        $class = $this->getClassResolver()->resolveClassName($class);
        $this->getServiceLocator()->setShared($class, $shared);
        $instance = $this->getServiceLocator()->get($class);

        if ($this->checkClassInheritance && !$instance instanceof $class) {
            throw new \InvalidArgumentException('Expeted ' . $class . ' but got ' . get_class(
                $instance
                ));
        }

        return $instance;
    }

    protected function getInstances()
    {
        return $this->instances;
    }

    public function removeInstance($name)
    {
        if ($this->hasInstance($name)) {
            unset($this->instances[$name]);
        }

        return $this;
    }
}
