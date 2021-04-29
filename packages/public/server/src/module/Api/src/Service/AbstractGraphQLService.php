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

abstract class AbstractGraphQLService
{
    abstract public function exec(string $query, array $variables);

    public function getCacheKey($path, $instance = 'de')
    {
        return $instance . '.serlo.org' . $path;
    }

    public function setCache($key, $value)
    {
        $query = <<<MUTATION
            mutation _setCache(\$key: String!, \$value: JSON!) {
                _cache {
                    setCache(input: { key: \$key, value: \$value }) {
                        success
                    }
                }
            }
MUTATION;
        $this->exec($query, [
            'key' => $key,
            'value' => $value,
        ]);
    }

    public function removeCache($key)
    {
        $query = <<<MUTATION
            mutation _removeCache(\$key: String!) {
                _cache {
                    removeCache(input: { key: \$key }) {
                        success
                    }
                }
            }
MUTATION;
        $this->exec($query, ['key' => $key]);
    }
}
