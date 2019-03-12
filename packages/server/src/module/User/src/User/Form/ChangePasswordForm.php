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
namespace User\Form;

use Common\Form\Element\CsrfToken;
use Zend\Form\Element\Password;
use Zend\Form\Element\Submit;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class ChangePasswordForm extends Form
{
    public function __construct()
    {
        parent::__construct('settings');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');

        $inputFilter = new InputFilter();
        $this->setInputFilter($inputFilter);

        $this->add((new Password('currentPassword'))->setLabel('Current password:'));
        $this->add((new Password('password'))->setLabel('New password:'));
        $this->add((new Password('passwordConfirm'))->setLabel('Confirm password:'));

        $this->add(
            (new Submit('submit'))->setValue('Update')->setAttribute('class', 'btn btn-success pull-right')
        );


        $inputFilter->add(
            [
                'name'       => 'passwordConfirm',
                'required'   => true,
                'validators' => [
                    [
                        'name'    => 'stringLength',
                        'options' => [
                            'min' => 6,
                        ],
                    ],
                    [
                        'name'    => 'identical',
                        'options' => [
                            'token' => 'password',
                        ],
                    ],
                ],
            ]
        );

        $inputFilter->add(
            [
                'name'     => 'password',
                'required' => true,
                'filters'  => [
                    [
                        'name' => 'Authentication\HashFilter',
                    ],
                ],
            ]
        );
    }
}
