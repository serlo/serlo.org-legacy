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
namespace Ads\Hydrator;

use Ads\Entity\AdInterface;
use Ads\Exception;
use Zend\Stdlib\ArrayUtils;
use Zend\Stdlib\Hydrator\HydratorInterface;

class AdHydrator implements HydratorInterface
{
    protected $keys = [
        'author',
        'title',
        'content',
        'attachment',
        'instance',
        'frequency',
        'url',
        'banner',
    ];

    public function extract($object)
    {
        $data = [];
        foreach ($this->keys as $key) {
            $method      = 'get' . ucfirst($key);
            $data['key'] = $object->$method();
        }

        return $data;
    }

    public function hydrate(array $data, $object)
    {
        $data = ArrayUtils::merge($this->extract($object), $data);

        if (!$object instanceof AdInterface) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected object to be AdInterface but got "%s"',
                get_class($object)
            ));
        }

        foreach ($this->keys as $key) {
            $method = 'set' . ucfirst($key);
            $value  = $this->getKey($data, $key);
            if ($value !== null) {
                $object->$method($value);
            }
        }

        return $object;
    }

    protected function getKey(array $data, $key)
    {
        return array_key_exists($key, $data) ? $data[$key] : null;
    }
}
