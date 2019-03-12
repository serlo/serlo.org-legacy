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
namespace Discussion\Form;

use Common\Form\Element\CsrfToken;
use Common\Hydrator\HydratorPluginAwareDoctrineObject;
use Doctrine\Common\Persistence\ObjectManager;
use Notification\Form\OptInHiddenFieldset;
use Zend\Form\Element\Hidden;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Textarea;
use Zend\InputFilter\InputFilter;

class DiscussionForm extends AbstractForm
{
    public function __construct(HydratorPluginAwareDoctrineObject $hydrator, ObjectManager $objectManager)
    {
        parent::__construct('discussion');
        $this->add(new CsrfToken());
        $inputFilter = new InputFilter('discussion');

        $this->setInputFilter($inputFilter);
        $this->setHydrator($hydrator);
        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');

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
        $this->add(
            [
                'type'    => 'Common\Form\Element\ObjectHidden',
                'name'    => 'object',
                'options' => [
                    'object_manager' => $objectManager,
                    'target_class'   => 'Uuid\Entity\Uuid',
                ],
            ]
        );
        $this->add(
            [
                'type'    => 'Common\Form\Element\ObjectHidden',
                'name'    => 'instance',
                'options' => [
                    'object_manager' => $objectManager,
                    'target_class'   => 'Instance\Entity\Instance',
                ],
            ]
        );
        $this->add(new Hidden('terms'));

        $this->add(new OptInHiddenFieldset());

        $this->add(
            (new Textarea('content'))
                ->setAttribute('placeholder', t('Ask a question or suggest an improvement'))
                ->setAttribute('class', 'discussion-content autosize')
                ->setAttribute('rows', '1')
        );
        $this->add(
            (new Submit('start'))->setValue(t('Submit'))->setAttribute('class', 'btn btn-success pull-right discussion-submit')
        );

        $inputFilter->add(['name' => 'instance', 'required' => true]);
        $inputFilter->add(['name' => 'content', 'required' => true]);
    }
}
