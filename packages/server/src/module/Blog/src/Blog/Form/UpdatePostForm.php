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
namespace Blog\Form;

use Common\Form\Element\CsrfToken;
use Doctrine\Common\Persistence\ObjectManager;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;
use Zend\Form\Element\Date;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class UpdatePostForm extends Form
{
    public function __construct(ObjectManager $objectManager)
    {
        parent::__construct('post');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');

        $hydrator    = new DoctrineHydrator($objectManager);
        $inputFilter = new InputFilter('post');

        $this->setInputFilter($inputFilter);
        $this->setHydrator($hydrator);

        $this->add(
            [
                'type'    => 'Common\Form\Element\ObjectHidden',
                'name'    => 'author',
                'options' => [
                    'object_manager' => $objectManager,
                    'target_class'   => 'User\Entity\User',
                ],
            ]
        );

        $this->add((new Text('title'))->setAttribute('id', 'title')->setLabel('Title:'));
        $this->add((new Textarea('content'))->setAttribute('id', 'content')->setLabel('Content:'));
        $this->add(
            (new Date('publish'))->setAttribute('id', 'publish')->setAttribute('type', 'text')->setAttribute(
                'class',
                'datepicker'
            )->setLabel('Publish date:')
        );
        $this->add((new Submit('submit'))->setValue('Save')->setAttribute('class', 'btn btn-success pull-right'));

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
                            'pattern' => '~^[a-zA-Z\-_ 0-9äöüÄÖÜß/&\.\,\!\?]+$~',
                        ],
                    ],
                ],
            ]
        );

        $inputFilter->add(
            [
                'name'     => 'author',
                'required' => true,
            ]
        );

        $inputFilter->add(
            [
                'name'     => 'content',
                'required' => true,
            ]
        );
    }
}
