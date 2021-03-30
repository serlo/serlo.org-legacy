<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Api\Service;

use DateTime;
use Zend\Cache\Storage\StorageInterface;

class GraphQLMockService extends AbstractGraphQLService
{
    /** @var StorageInterface */
    protected $storage;

    protected $key = ':GRAPHQL:';

    public function __construct(StorageInterface $storage)
    {
        $this->storage = $storage;
        if (!$this->storage->hasItem($this->key)) {
            $this->storage->setItem($this->key, []);
        }
    }

    public function exec(string $query, array $variables)
    {
        $list = $this->get();
        $list[] = [
            'timestamp' => (new DateTime())->format(DateTime::ATOM),
            'query' => $query,
            'variables' => $variables,
        ];
        $this->storage->setItem($this->key, $list);
    }

    public function get()
    {
        return $this->storage->getItem($this->key);
    }

    public function clear()
    {
        $this->storage->setItem($this->key, []);
    }
}
