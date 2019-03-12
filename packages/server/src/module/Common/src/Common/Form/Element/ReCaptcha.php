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

namespace Common\Form\Element;

use Zend\Form\Element\Submit;
use Zend\InputFilter\InputProviderInterface;

class ReCaptcha extends Submit implements InputProviderInterface
{
    private $secret;

    public function __construct($recaptcha_options)
    {
        parent::__construct('g-recaptcha-response');
        $this->setAttribute('class', 'g-recaptcha btn btn-success pull-right');
        $this->setAttribute('data-sitekey', $recaptcha_options['api_key']);

        $this->secret = $recaptcha_options['secret'];
    }

    /**
     * Should return an array specification compatible with
     * {@link Zend\InputFilter\Factory::createInputFilter()}.
     *
     * @return array
     */
    public function getInputSpecification()
    {
        return [
            'name' => $this->getName(),
            'required' => true,
            'validators' => [
                [
                    'name' => 'Common\Validator\ReCaptchaValidator',
                    'options' => [
                        'secret' => $this->secret,
                    ],
                ],
            ],
        ];
    }
}
