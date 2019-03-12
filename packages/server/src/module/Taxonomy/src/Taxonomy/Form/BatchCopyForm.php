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
namespace Taxonomy\Form;

use Common\Form\Element\CsrfToken;
use Zend\Form\Element\MultiCheckbox;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class BatchCopyForm extends Form
{
    public function __construct(array $associations = [])
    {
        parent::__construct('taxonomyTerm');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $filter = new InputFilter();
        $this->setInputFilter($filter);

        $this->add(
            (new Text('destination'))
                ->setAttribute('id', 'destination')
                ->setAttribute('placeholder', 'ID (12345)')
                ->setLabel('Copy to:')
        );

        $multiCheckbox = new MultiCheckbox('associations');
        $multiCheckbox->setLabel('Elements')->setAttribute('id', 'associations');
        $multiCheckbox->setValueOptions($associations);
        $this->add($multiCheckbox);

        $this->add((new Submit('submit'))->setValue('Save')->setAttribute('class', 'btn btn-success pull-right'));

        $filter->add(
            [
                'name'        => 'destination',
                'required'    => true,
                'allow_empty' => false,
                'filters'     => [
                    ['name' => 'Int'],
                ],
                'validators'  => [
                    ['name' => 'Digits'],
                ],
            ]
        );
    }
}
