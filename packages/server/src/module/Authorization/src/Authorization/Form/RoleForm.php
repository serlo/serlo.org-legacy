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
use Doctrine\Common\Persistence\ObjectManager;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class RoleForm extends Form
{
    public function __construct(ObjectManager $objectManager)
    {
        parent::__construct('role');
        $this->add(new CsrfToken());

        $inputFilter = new InputFilter();

        $this->setInputFilter($inputFilter);
        $this->setHydrator(new DoctrineHydrator($objectManager));

        $this->add(
            [
                'type'    => 'DoctrineModule\Form\Element\ObjectMultiCheckbox',
                'name'    => 'children',
                'options' => [
                    'label'          => 'Inherits permissions from (be very careful!):',
                    'object_manager' => $objectManager,
                    'target_class'   => 'User\Entity\Role',
                    'property'       => 'name',
                ],
            ]
        );

        $this->add((new Text('name'))->setLabel('Name:'));

        $this->add(
            (new Submit('submit'))->setValue('Add')->setAttribute('class', 'btn btn-success pull-right')
        );

        $inputFilter->add(
            [
                'name'     => 'name',
                'required' => true,
            ]
        );
        $inputFilter->add(
            [
                'name'     => 'children',
                'required' => false,
            ]
        );
    }
}
