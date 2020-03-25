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

namespace ApiCache;

class Cache
{
    private $options;

    public function __construct(array $options)
    {
        $this->options = $options;
    }

    public function purge(string $cacheKey)
    {
        $options = $this->options;
        if (!isset($options['token']) || !isset($options['account']) || !isset($options['namespace'])) {
            return null;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.cloudflare.com/client/v4/accounts/' . $options['account'] . '/storage/kv/namespaces/' . $options['namespace'] . '/values/' . $cacheKey);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $options['token'],
        ]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = json_decode(curl_exec($ch), true);
        curl_close($ch);

        return $result['success'];
    }
}
