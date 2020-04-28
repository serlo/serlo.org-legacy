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

namespace Csrf;

use Exception;
use Zend\Session\Container;

class CsrfTokenContainer
{
    /**
     * Returns the CSRF token associated with the current session
     *
     * @return string CSRF token
     * @throws Exception
     */
    public static function getToken()
    {
        $container = new Container('csrf');
        if (!isset($container->token)) {
            $container->token = CsrfTokenContainer::generateToken();
        }
        return $container->token;
    }

    /**
     * Generates as pseudorandom token
     *
     * @return string Pseudorandom token
     * @throws Exception
     */
    private static function generateToken()
    {
        $bytes = random_bytes(16);
        return bin2hex($bytes);
    }
}
