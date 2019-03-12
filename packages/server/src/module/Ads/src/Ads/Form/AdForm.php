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
namespace Ads\Form;

use Attachment\Form\AttachmentFieldset;
use Attachment\Form\AttachmentFieldsetProvider;
use Common\Form\Element\CsrfToken;
use Zend\Form\Element\Checkbox;
use Zend\Form\Element\Select;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;
use Zend\Form\Element\Url;
use Zend\Form\Form;

class AdForm extends Form implements AttachmentFieldsetProvider
{
    public function __construct()
    {
        parent::__construct('createAd');
        $this->add(new CsrfToken());

        $this->setAttribute('class', 'clearfix');
        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'form-horizontal');

        $this->add((new Text('title'))->setLabel('Title:'))->setAttribute('required', 'required');
        $this->add((new Url('url'))->setLabel('Url:'))->setAttribute('required', 'required');
        $this->add((new Textarea('content'))->setLabel('Content:'))->setAttribute('required', 'required');
        $this->add(
            (new Select('frequency'))->setValueOptions(
                [
                    '0' => 'Never',
                    '1' => 'Less',
                    '2' => 'Normal',
                    '3' => 'More',
                ]
            )->setAttribute('required', 'required')->setLabel('frequency')
        );
        $this->add((new Checkbox('banner'))->setLabel('Banner'))->setAttribute('required', 'required');
        $this->add(new AttachmentFieldset(false));
        $this->add(
            (new Submit('submit'))->setValue('Save')->setAttribute('class', 'btn btn-success pull-right')
        );

        $filter = new AdFilter();
        $this->setInputFilter($filter);
    }
}
