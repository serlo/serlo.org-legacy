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
namespace Authentication\Service;

class HydraService
{
    /**
     * @var string
     */
    protected $baseUrl;

    /**
     * @param string $baseUrl
     */
    public function __construct($baseUrl)
    {
        $this->baseUrl = $baseUrl;
    }

    /**
     * Helper for sending request to hydra
     * @param string $flow - can be 'login' or 'consent'
     * @param string $challenge
     * @return mixed
     */
    protected function get($flow, $challenge)
    {
        $url = $this->baseUrl . '/oauth2/auth/requests/' . $flow;

        $reqUrl =
            $url . '?' . http_build_query([$flow . '_challenge' => $challenge]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $reqUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Forwarded-Proto: https']);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    /**
     * Helper for sending request to hydra
     * @param string $flow - can be 'login' or 'consent'
     * @param string $action - can be 'accept' or 'reject'
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    protected function put($flow, $action, $challenge, $body)
    {
        $url =
            $this->baseUrl . '/oauth2/auth/requests/' . $flow . '/' . $action;
        $reqUrl =
            $url . '?' . http_build_query([$flow . '_challenge' => $challenge]);

        $httpHeader = [
            'Accept: application/json',
            'Content-Type: application/json',
            'X-Forwarded-Proto: https',
        ];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $reqUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    /**
     * Fetches information on a login request
     * @param string $challenge
     * @return mixed
     */
    public function getLoginRequest($challenge)
    {
        return $this->get('login', $challenge);
    }

    /**
     * Accepts a login request
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    public function acceptLoginRequest($challenge, $body)
    {
        return $this->put('login', 'accept', $challenge, $body);
    }

    /**
     * Rejects a login request
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    public function rejectLoginRequest($challenge, $body)
    {
        return $this->put('login', 'reject', $challenge, $body);
    }

    /**
     * Fetches information on a consent request.
     * @param string $challenge
     * @return mixed
     */
    public function getConsentRequest($challenge)
    {
        return $this->get('consent', $challenge);
    }

    /**
     * Accepts a consent request
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    public function acceptConsentRequest($challenge, $body)
    {
        return $this->put('consent', 'accept', $challenge, $body);
    }

    /**
     * Rejects a consent request
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    public function rejectConsentRequest($challenge, $body)
    {
        return $this->put('consent', 'reject', $challenge, $body);
    }

    //    /**
    //     * Fetches information on a logout request.
    //     * @param string $challenge
    //     * @return mixed
    //     */
    //    public function getLogoutRequest($challenge)
    //    {
    //        return $this->get('logout', $challenge);
    //    }
    //
    //    /**
    //     * Accepts a logout request.
    //     * @param string $challenge
    //     * @return mixed
    //     */
    //    public function acceptLogoutRequest($challenge)
    //    {
    //        return $this->put('logout', 'accept', $challenge, []);
    //      }
    //
    //    /**
    //     * Reject a logout request.
    //     * @param string $challenge
    //     * @return mixed
    //     */
    //    public function rejectLogoutRequest($challenge)
    //    {
    //        return $this->put('logout', 'reject', $challenge, []);
    //    }
}
