<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Navigation\Form;

use Csrf\Form\Element\CsrfToken;
use Doctrine\ORM\EntityManager;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as ObjectHydrator;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class ParameterKeyForm extends Form
{
    public function __construct(EntityManager $entityManager)
    {
        parent::__construct('parameterKey');
        $this->add(new CsrfToken());

        $hydrator = new ObjectHydrator($entityManager);
        $filter = new InputFilter();

        $this->setHydrator($hydrator);
        $this->setInputFilter($filter);

        $this->add(new Text('name'));

        $this->add(
            (new Submit('submit'))
                ->setValue('Save')
                ->setAttribute('class', 'btn btn-success pull-right')
        );

        $filter->add([
            'name' => 'name',
            'required' => true,
        ]);
    }
}
