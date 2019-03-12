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
namespace Flag\Form;

use Common\Form\Element\CsrfToken;
use Doctrine\Common\Collections\Collection;
use Zend\Form\Element\Select;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Textarea;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class FlagForm extends Form
{
    public function __construct(Collection $types)
    {
        parent::__construct('context');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');
        $inputFilter = new InputFilter('context');
        $this->setInputFilter($inputFilter);

        $values = [];
        /* @var $type \Type\Entity\TypeInterface */
        foreach ($types as $type) {
            $values[$type->getId()] = $type->getName();
        }

        $this->add(
            (new Select('type'))->setLabel('Type:')->setOptions(
                [
                    'value_options' => $values,
                ]
            )
        );

        $this->add((new Textarea('content'))->setLabel('Content:'));

        $this->add(
            (new Submit('submit'))->setValue('Report')->setAttribute('class', 'btn btn-success pull-right')
        );

        $inputFilter->add(
            [
                'name'     => 'content',
                'required' => true,
                'filters'  => [
                    [
                        'name' => 'StripTags',
                    ],
                ],
            ]
        );

        $inputFilter->add(
            [
                'name'     => 'type',
                'required' => true,
            ]
        );
    }
}
