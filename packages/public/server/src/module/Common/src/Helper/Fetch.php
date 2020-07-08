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

namespace Common\Helper;

class Fetch implements FetchInterface
{
    public function fetch($url, $init = [])
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if (array_key_exists('method', $init)) {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $init['method']);
        }
        if (array_key_exists('headers', $init)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $init['headers']);
        }
        if (array_key_exists('body', $init)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $init['body']);
        }
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}
