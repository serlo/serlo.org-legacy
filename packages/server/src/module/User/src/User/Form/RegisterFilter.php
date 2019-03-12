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

use Common\Traits\ObjectManagerAwareTrait;
use Zend\InputFilter\InputFilter;
use DoctrineModule\Validator\UniqueObject;
use Zend\Validator\GreaterThan;
use Zend\Validator\Regex;

class RegisterFilter extends InputFilter
{
    use ObjectManagerAwareTrait;

    public function __construct($objectManager)
    {
        $this->add(
            [
                'name'       => 'email',
                'required'   => true,
                'validators' => [
                    [
                        'name'    => 'EmailAddress',
                        'options' => [
                            'message' =>
                                'This does not appear to be a valid email address. Please use a different one.',
                        ],
                    ],
                    [
                        'name'    => 'User\Validator\UniqueUser',
                        'options' => [
                            'object_repository' => $objectManager->getRepository('User\Entity\User'),
                            'fields'            => ['email'],
                            'object_manager'    => $objectManager,
                            'messages'          => [
                                UniqueObject::ERROR_OBJECT_NOT_UNIQUE =>
                                    t('This email address is already in use. Please use a different one.'),
                            ],
                        ],
                    ],
                ],
            ]
        );

        $this->add(
            [
                'name'       => 'username',
                'required'   => true,
                'validators' => [
                    [
                        'name'    => 'User\Validator\UniqueUser',
                        'options' => [
                            'object_repository' => $objectManager->getRepository('User\Entity\User'),
                            'fields'            => ['username'],
                            'object_manager'    => $objectManager,
                            'messages'          => [
                                UniqueObject::ERROR_OBJECT_NOT_UNIQUE =>
                                    t('This username is already taken. Please use a different one.'),
                            ],
                        ],
                    ],
                    [
                        'name'    => 'Regex',
                        'options' => [
                            'pattern'  => '~^[a-zA-Z\-\_0-9]+$~',
                            'messages' => [
                                Regex::NOT_MATCH =>
                                    t(
                                        'Your username may only contain'
                                        . ' letters, digits, underscores (_) and hyphens (-).'
                                        . ' Please use a different one.'
                                    ),
                            ],
                        ],
                    ],
                ],
            ]
        );

        $this->add(
            [
                'name'       => 'passwordConfirm',
                'required'   => true,
                'validators' => [
                    [
                        'name'    => 'StringLength',
                        'options' => [
                            'min'     => 6,
                            'message' => t('Your password needs to be at least 6 characters long.'),
                        ],
                    ],
                    [
                        'name'    => 'Identical',
                        'options' => [
                            'token'   => 'password',
                            'message' => t(
                                'The password entered does not match the confirmation password. '
                                . 'Ensure the passwords entered are identical.'
                            ),
                        ],
                    ],
                ],
            ]
        );

        $this->add(
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

        $this->add(
            [
                'name' => 'interests',
                'required' => false,
            ]
        );
    }
}
