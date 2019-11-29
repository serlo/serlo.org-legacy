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

namespace Csrf;

use Exception;
use Zend\Http\Header\SetCookie;
use Zend\Http\Request;
use Zend\Http\Response;
use Zend\Session\Config\SessionConfig;
use Zend\Stdlib\RequestInterface;
use Zend\Stdlib\ResponseInterface;

class CsrfTokenCookie
{
    /** @var SessionConfig */
    private $sessionConfig;
    /** @var Request */
    private $request;
    /** @var Response */
    private $response;

    public function __construct(SessionConfig $sessionConfig, RequestInterface $request, ResponseInterface $response)
    {
        $this->sessionConfig = $sessionConfig;
        $this->request = $request;
        $this->response = $response;
    }

    /**
     * Adds the CSRF token as a cookie if needed
     *
     * @throws Exception
     */
    public function init()
    {
        // Abort when request is not an HTTP request
        if (!$this->request instanceof Request || !$this->response instanceof Response) {
            return;
        }

        if (!$this->shouldCreateCookie()) {
            return;
        }

        $lifetime = (int)$this->sessionConfig->getCookieLifetime();
        $expires = $lifetime !== 0 ? time() + $lifetime : null;
        $lifetime = $lifetime !== 0 ? $lifetime : null;
        $token = CsrfTokenContainer::getToken();
        $cookie = new SetCookie(
            'CSRF',
            $token,
            $expires,
            '/',
            null,
            null,
            false,
            $lifetime,
            null
        );
        $this->response->getHeaders()->addHeader($cookie);
    }

    /**
     * Tells us whether we need to create the cookie for the CSRF token
     *
     * @return bool
     * @throws Exception
     */
    private function shouldCreateCookie()
    {
        $cookie = $this->request->getCookie();
        if (!is_object($cookie)) {
            return true;
        }
        if (!$cookie->offsetExists('CSRF')) {
            return true;
        }
        $value = $cookie->offsetGet('CSRF');
        return $value !== CsrfTokenContainer::getToken();
    }
}
