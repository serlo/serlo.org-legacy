<?php
/**
 * This file is part of Serlo.org.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace MessageQueue;

class Producer
{

    /** @var string|null */
    private $host;

    /**
     * @param $host string|null
     */
    public function __construct($host)
    {
        $this->host = $host;
    }

    public function send(string $topic, $value)
    {
        if (!isset($this->host)) {
            return false;
        }
        $httpHeader = [
            'Accept: application/vnd.kafka.v2+json, application/vnd.kafka+json, application/json',
            'Content-Type: application/vnd.kafka.json.v2+json',
        ];
        $body = [
            'records' => [
                [
                    'value' => $value,
                ],
            ],
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($ch, CURLOPT_URL, $this->host . '/topics/' . $topic);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_ENCODING, '');
        $response = curl_exec($ch);
        return $response != false;
    }
}
