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
namespace User\Form;

use Csrf\Form\Element\CsrfToken;
use Zend\Form\Element\Email;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Textarea;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class SettingsForm extends Form
{
    public function __construct($entityManager, $dontValidate = false)
    {
        parent::__construct('settings');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');
        $filter = new InputFilter();
        $this->setInputFilter($filter);

        $this->add(
            (new Email('email'))
                ->setAttribute('id', 'email')
                ->setLabel('Email:')
        );
        $this->add(
            (new Textarea('description'))
                ->setAttribute('id', 'description')
                ->setLabel('About me:')
        );

        $this->add(
            (new Submit('submit'))
                ->setValue('Update')
                ->setAttribute('class', 'btn btn-success pull-right')
        );

        if (!$dontValidate) {
            $filter->add([
                'name' => 'email',
                'required' => true,
                'validators' => [
                    [
                        'name' => 'EmailAddress',
                    ],
                    [
                        'name' => 'User\Validator\UniqueUser',
                        'options' => [
                            'object_repository' => $entityManager->getRepository(
                                'User\Entity\User'
                            ),
                            'fields' => ['email'],
                            'object_manager' => $entityManager,
                        ],
                    ],
                ],
            ]);
        }
    }
}
