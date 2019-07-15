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

namespace Ui\View\Helper;

use Zend\View\Helper\AbstractHelper;

class Encrypt extends AbstractHelper
{
    protected $key = 'iuLG8vrTq48aoK7G';
    protected $method = 'aes-256-cbc';

    public function __invoke($string)
    {
        return base64_encode(
            openssl_encrypt($string, $this->method, md5($this->key), 0, $this->getIv())
        );
    }

    public function decrypt($encrypted)
    {
        return openssl_decrypt(base64_decode($encrypted), $this->method, md5($this->key), 0, $this->getIv());
    }

    private function getIv()
    {
        return substr(md5(md5($this->key)), 0, openssl_cipher_iv_length($this->method));
    }
}
