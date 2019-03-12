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

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Common\Validator;

use Zend\Validator\AbstractValidator;
use RuntimeException;

class ReCaptchaValidator extends AbstractValidator
{
    /**
     * Error codes
     *
     * @const string
     */
    const INVALID_TOKEN = 'invalidToken';

    /**
     * Error messages
     *
     * @var array
     */
    protected $messageTemplates = [
        self::INVALID_TOKEN => 'The provided token was invalid',
    ];


    /**
     * ReCaptcha Secret for validator
     *
     * @var string
     */
    private $secret;

    /**
     * Sets validator options
     *
     * @param  mixed $options
     */
    public function __construct($options)
    {
        parent::__construct($options);
        $this->setSecret($options['secret']);
    }

    public function setSecret($secret)
    {
        $this->secret = $secret;
    }
    /**
     * Returns true if and only if a token has been set and the provided value
     * matches that token.
     *
     * @param  mixed $value
     * @param  array $context
     * @return bool
     * @throws RuntimeException if the token doesn't exist in the context array
     */
    public function isValid($value, array $context = null)
    {
        $this->setValue($value);
        $url = 'https://www.google.com/recaptcha/api/siteverify';

        $httpHeader = array(
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded',
        );

        $data = array(
            'secret' => $this->secret,
            'response' => $value,
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = json_decode(curl_exec($ch), true);
        curl_close($ch);

        if (!$result['success']) {
            $this->error(self::INVALID_TOKEN);
        }

        return $result['success'];
    }
}
