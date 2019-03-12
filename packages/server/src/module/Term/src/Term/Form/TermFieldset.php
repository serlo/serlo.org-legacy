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
namespace Term\Form;

use Zend\Form\Element\Text;
use Zend\Form\Fieldset;
use Zend\InputFilter\InputFilterProviderInterface;
use Zend\Validator\NotEmpty;
use Zend\Validator\Regex;

class TermFieldset extends Fieldset implements InputFilterProviderInterface
{
    public function __construct()
    {
        parent::__construct('term');

        $this->add((new Text('name'))->setAttribute('id', 'term[name]')->setLabel('Name:'));
    }

    public function getInputFilterSpecification()
    {
        return [
            'name' => [
                'required' => true,
                'filters' => [
                    [
                        'name' => 'StripTags',
                    ],
                ],
                'validators' => [
                    [
                        'name'    => 'NotEmpty',
                        'options' => [
                            'messages' => [
                                NotEmpty::IS_EMPTY => 'The title can\'t be empty',
                            ],
                        ],
                    ],
                    [
                        'name'    => 'Regex',
                        'options' => [
                            'pattern' => '~^[a-zA-Z\-_ 0-9äöüÄÖÜß,\:\.]*$~',
                            'messages' => [
                                Regex::NOT_MATCH => 'Title should not contain special characters',
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
