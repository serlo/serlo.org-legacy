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
namespace Contexter\Form;

use Zend\Form\Element\Select;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Element;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class ContextForm extends Form
{
    public function __construct(array $parameters, array $types)
    {
        parent::__construct('context');
        $inputFilter = new InputFilter();

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');
        $this->setInputFilter($inputFilter);

        $values = [];
        foreach ($types as $type) {
            $values[$type] = $type;
        }

        $this->add(['name' => 'route', 'type' => 'Hidden']);
        $this->add((new Select('type'))->setLabel('Select a type:')->setValueOptions($values));
        $this->add((new Text('title'))->setLabel('Title:'));
        $this->add((new Text('object'))->setLabel('Object-ID:'));
        $this->add(new ParameterFieldset($parameters));
        $this->add(
            (new Submit('submit'))->setValue('Save')->setAttribute('class', 'btn btn-success pull-right')
        );

        $inputFilter->add(
            [
                'name'       => 'title',
                'required'   => true,
                'filters'    => [
                    [
                        'name' => 'StripTags',
                    ],
                ],
                'validators' => [
                    [
                        'name'    => 'Regex',
                        'options' => [
                            'pattern' => '~^[a-zA-Z\- 0-9üöäÜÖÄ!]+$~',
                        ],
                    ],
                ],

            ]
        );

        $inputFilter->add(
            [
                'name'        => 'object',
                'required'    => true,
                'allow_empty' => false,
                'validators'  => [
                    [
                        'name' => 'NotEmpty',
                    ],
                    [
                        'name' => 'Digits',
                    ],
                ],
            ]
        );

        $inputFilter->add(
            [
                'name'       => 'type',
                'required'   => true,
                'validators' => [
                    [
                        'name'    => 'Regex',
                        'options' => [
                            'pattern' => '~^[a-zA-Z]*$~',
                        ],
                    ],
                ],
            ]
        );
    }
}
