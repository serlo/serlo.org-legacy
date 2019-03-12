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
namespace Authorization\Form;

use Common\Form\Element\CsrfToken;
use Zend\Form\Element\Select;
use Zend\Form\Element\Submit;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class PermissionForm extends Form
{
    public function __construct($permissions, $instances)
    {
        parent::__construct('add-permission');
        $this->add(new CsrfToken());

        $inputFilter = new InputFilter('article');

        $values = [];
        foreach ($permissions as $permission) {
            $values[$permission->getId()] = $permission->getName();
        }

        $this->add((new Select('permission'))->setLabel('Permission:')->setValueOptions($values));

        $values = [
            -1 => 'Global',
        ];
        foreach ($instances as $instance) {
            $values[$instance->getId()] = $instance->getName();
        }

        $this->add((new Select('instance'))->setLabel('Instance:')->setValueOptions($values));

        $this->add(
            (new Submit('submit'))->setValue('Add')->setAttribute('class', 'btn btn-success pull-right')
        );

        $inputFilter->add(
            [
                'name'     => 'permission',
                'required' => true,
            ]
        );

        $this->setInputFilter($inputFilter);
    }
}
