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
namespace Entity\Form;

use Common\Form\Element\CsrfToken;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class MoveForm extends Form
{
    public function __construct()
    {
        parent::__construct('move');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $filter = new InputFilter();
        $this->setInputFilter($filter);

        $this->add(
            [
                'name'       => 'to',
                'attributes' => [
                    'type'        => 'text',
                    'tabindex'    => 1,
                    'placeholder' => 'ID (e.g.: 123)',
                ],
                'options'    => [
                    'label' => 'Move to: ',
                ],
            ]
        );

        $this->add(
            [
                'name'       => 'submit',
                'attributes' => [
                    'type'     => 'submit',
                    'value'    => 'Move',
                    'tabindex' => 2,
                    'class'    => 'btn btn-success pull-right',
                ],
            ]
        );

        $filter->add(
            [
                'name'       => 'to',
                'required'   => true,
                'validators' => [
                    [
                        'name' => 'int',
                    ],
                ],
            ]
        );
    }
}
