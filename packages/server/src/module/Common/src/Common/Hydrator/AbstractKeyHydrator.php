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
namespace Common\Hydrator;

use RuntimeException;
use Zend\Stdlib\ArrayUtils;
use Zend\Stdlib\Hydrator\HydratorInterface;

abstract class AbstractKeyHydrator implements HydratorInterface
{
    public function extract($object)
    {
        if (!$this->isValid($object)) {
            throw new RuntimeException();
        }

        $data = [];
        foreach ($this->getKeys() as $key) {
            $method      = 'get' . ucfirst($key);
            $data['key'] = $object->$method();
        }

        return $data;
    }

    public function hydrate(array $data, $object)
    {
        if (!$this->isValid($object)) {
            throw new RuntimeException();
        }

        $data = ArrayUtils::merge($this->extract($object), $data);

        foreach ($this->getKeys() as $key) {
            $method = 'set' . ucfirst($key);
            $value  = $this->getKey($data, $key);
            if ($value !== null) {
                $object->$method($value);
            }
        }

        return $object;
    }

    /**
     * @return array
     */
    abstract protected function getKeys();

    /**
     * @param mixed $object
     * @return bool
     */
    abstract protected function isValid($object);

    /**
     * @param array  $data
     * @param string $key
     * @return mixed
     */
    protected function getKey(array $data, $key)
    {
        return array_key_exists($key, $data) ? $data[$key] : null;
    }
}
