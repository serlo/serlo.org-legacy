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
namespace User\Form;

use Common\Form\Element\CsrfToken;
use Common\Form\Element\ReCaptcha;
use Doctrine\ORM\EntityManager;
use Zend\Form\Element\Checkbox;
use Zend\Form\Element\Password;
use Zend\Form\Element\Select;
use Zend\Form\Element\Text;
use Zend\Form\Form;
use Zend\Mvc\I18n\Translator;

class Register extends Form
{
    public function __construct(EntityManager $entityManager, Translator $translator, $config)
    {
        parent::__construct('signUp');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');
        $filter = new RegisterFilter($entityManager);
        $this->setInputFilter($filter);

        $this->add((new Text('username'))
            ->setLabel('Username:')
            ->setAttribute('required', 'required')
            ->setAttribute('placeholder', $translator->translate('Enter username')));

        $this->add((new Text('email'))
            ->setAttribute('type', 'email')
            ->setLabel('Email:')
            ->setAttribute('required', 'required')
            ->setAttribute('placeholder', $translator->translate('Enter email address')));

        $this->add((new Password('password'))
            ->setLabel('Password:')
            ->setAttribute('required', 'required')
            ->setAttribute('placeholder', $translator->translate('Enter password')));

        $this->add((new Password('passwordConfirm'))
            ->setLabel('Confirm password:')
            ->setAttribute('required', 'required')
            ->setAttribute('placeholder', $translator->translate('Confirm password')));

        $this->add((new Text('firstName'))
            ->setLabel('First name (optional):')
            ->setAttribute('placeholder', $translator->translate('Enter first name')));

        $this->add((new Text('lastName'))
            ->setLabel('Last name (optional):')
            ->setAttribute('placeholder', $translator->translate('Enter last name')));

        $this->add((new Checkbox('newsletterOptIn'))
            ->setLabel('I agree that Serlo Education e.V. may contact me via email.'));

        $this->add((new Select('interests'))
            ->setAttribute('required', false)
            ->setValueOptions(array(
                'dec9a97288' => $translator->translate('Parent'),
                '05a5ab768a' => $translator->translate('Teacher'),
                'bbffc7a064' => $translator->translate('Pupil'),
                'ebff3b63f6' => $translator->translate('University student'),
                'd251aad97e' => $translator->translate('Other'),
            ))
            ->setEmptyOption('')
            ->setLabel('I am here as…'));

        $recaptcha = (new ReCaptcha($config['recaptcha_options']))
            ->setLabel('Sign up');
        $this->add($recaptcha);
    }
}
