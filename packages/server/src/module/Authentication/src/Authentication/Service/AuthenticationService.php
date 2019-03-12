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
namespace Authentication\Service;

use Zend\Authentication\Adapter;
use Zend\Authentication\AuthenticationService as ZendAuthenticationService;
use Zend\Authentication\Exception;
use Zend\Authentication\Storage;
use Zend\Http\Header\SetCookie;
use Zend\Http\Request;
use Zend\Http\Response;
use Zend\Session\Config\SessionConfig;
use Zend\Stdlib\RequestInterface;
use Zend\Stdlib\ResponseInterface;

class AuthenticationService extends ZendAuthenticationService
{

    /**
     * @var SessionConfig
     */
    protected $sessionConfig;

    /**
     * @var Response
     */
    protected $response;

    /**
     * @var Request
     */
    protected $request;

    /**
     * @var string
     */
    protected $cookieName = 'authenticated';

    /**
     * @var string
     */
    protected $cookiePath = '/';

    public function __construct(
        Storage\StorageInterface $storage = null,
        Adapter\AdapterInterface $adapter = null,
        SessionConfig $sessionConfig,
        ResponseInterface $response,
        RequestInterface $request
    ) {
        parent::__construct($storage, $adapter);

        if (!$response instanceof Response) {
            $response = new Response;
        }

        if (!$request instanceof Request) {
            $request = new Request;
        }

        $this->response      = $response;
        $this->request       = $request;
        $this->sessionConfig = $sessionConfig;
    }

    public function authenticate(Adapter\AdapterInterface $adapter = null)
    {
        $result = parent::authenticate($adapter);

        if ($result->isValid()) {
            // Set authentication indicator cookie
            $lifetime = (int)$this->sessionConfig->getCookieLifetime();
            $expires  = $lifetime !== 0 ? time() + $lifetime : null;
            $lifetime = $lifetime !== 0 ? $lifetime : null;
            $this->setCookie(true, $expires, $lifetime);
        }

        return $result;
    }

    public function clearIdentity()
    {
        parent::clearIdentity();

        // Remove authentication indicator cookie
        $expires = time() - 3600;
        $this->setCookie('', $expires);
    }

    public function getIdentity()
    {
        $return = parent::getIdentity();
        if ($return !== null && !$this->hasIndicator()) {
            $this->clearIdentity();
            return null;
        }
        return $return;
    }

    public function hasIdentity()
    {
        $return = parent::hasIdentity();
        if ($return && !$this->hasIndicator()) {
            $this->clearIdentity();
            return false;
        }
        return $return;
    }

    protected function hasIndicator()
    {
        $cookie = $this->request->getCookie();
        if (!is_object($cookie)) {
            return false;
        }

        if ($cookie->offsetExists($this->cookieName) && $cookie->offsetGet($this->cookieName)) {
            return true;
        }

        $cookies = $this->response->getCookie();
        if (!is_array($cookies)) {
            return false;
        }

        foreach ($cookies as $cookie) {
            if ($cookie->getName() === $this->cookieName && $cookie->getValue() === true) {
                return true;
            }
        }
        return false;
    }

    protected function setCookie($value, $expires = null, $lifetime = null)
    {
        $cookie = new SetCookie(
            (string)$this->cookieName,
            $value,
            $expires,
            $this->cookiePath,
            null,
            null,
            true,
            $lifetime,
            null
        );
        $this->response->getHeaders()->addHeader($cookie);
    }
}
