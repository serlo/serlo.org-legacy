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

use Common\Helper\FetchInterface;

class HydraService
{
    /** @var string */
    protected $baseUrl;
    /** @var FetchInterface */
    protected $fetch;

    /**
     * @param string $baseUrl
     * @param FetchInterface $fetch
     */
    public function __construct($baseUrl, FetchInterface $fetch)
    {
        $this->baseUrl = $baseUrl;
        $this->fetch = $fetch;
    }

    /**
     * Helper for sending request to hydra
     * @param string $flow - can be 'login' or 'consent'
     * @param string $challenge
     * @return mixed
     */
    protected function get($flow, $challenge)
    {
        $result = $this->fetch->fetch(
            $this->baseUrl .
                '/oauth2/auth/requests/' .
                $flow .
                '?' .
                http_build_query([$flow . '_challenge' => $challenge]),
            [
                'headers' => ['X-Forwarded-Proto: https'],
            ]
        );
        return json_decode($result, true);
    }

    /**
     * Helper for sending request to hydra
     *
     * @param string $flow - can be 'login' or 'consent'
     * @param string $action - can be 'accept' or 'reject'
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    protected function put($flow, $action, $challenge, $body)
    {
        $result = $this->fetch->fetch(
            $this->baseUrl .
                '/oauth2/auth/requests/' .
                $flow .
                '/' .
                $action .
                '?' .
                http_build_query([$flow . '_challenge' => $challenge]),
            [
                'method' => 'PUT',
                'headers' => [
                    'Accept: application/json',
                    'Content-Type: application/json',
                    'X-Forwarded-Proto: https',
                ],
                'body' => json_encode($body),
            ]
        );
        return json_decode($result, true);
    }

    /**
     * Fetches information on a login request
     *
     * @param string $challenge
     * @return mixed
     */
    public function getLoginRequest($challenge)
    {
        return $this->get('login', $challenge);
    }

    /**
     * Accepts a login request
     *
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
     *
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    public function rejectLoginRequest($challenge, $body)
    {
        return $this->put('login', 'reject', $challenge, $body);
    }

    /**
     * Fetches information on a logout request.
     *
     * @param string $challenge
     * @return mixed
     */
    public function getLogoutRequest($challenge)
    {
        return $this->get('logout', $challenge);
    }

    /**
     * Accepts a logout request.
     *
     * @param string $challenge
     * @param mixed $body
     * @return mixed
     */
    public function acceptLogoutChallenge($challenge)
    {
        return $this->put('logout', 'accept', $challenge, []);
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
