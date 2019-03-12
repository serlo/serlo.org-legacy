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
namespace Page\Form;

use Common\Form\Element\CsrfToken;
use Common\Form\Element\EditorState;
use Common\Form\Element\Title;
use License\Entity\LicenseInterface;
use License\Form\AgreementFieldset;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Textarea;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class RevisionForm extends Form
{
    public function __construct(LicenseInterface $license)
    {
        parent::__construct('createRepository');
        $this->add(new CsrfToken());

        $filter = new InputFilter();

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'form-horizontal');
        $this->setInputFilter($filter);

        $this->add(new Title());

        $textarea = new EditorState('content');
        $textarea->setLabel('Content:');
        $this->add($textarea);

        $this->add(new AgreementFieldset($license));

        $submit = new Submit('submit');
        $submit->setValue('Save')->setAttribute('class', 'btn btn-success pull-right');
        $this->add($submit);

        $filter->add(['name' => 'content', 'required' => true]);

        $this->setInputFilter($filter);
    }
}
