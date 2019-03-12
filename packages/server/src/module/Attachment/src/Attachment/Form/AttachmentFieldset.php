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

namespace Attachment\Form;

use Zend\Form\Element\File;
use Zend\Form\Fieldset;
use Zend\InputFilter\InputFilterProviderInterface;

class AttachmentFieldset extends Fieldset implements InputFilterProviderInterface
{
    /**
     * @var bool
     */
    protected $required;

    public function __construct($required = true)
    {
        parent::__construct('attachment');
        $this->add((new File('file'))->setLabel('Attach file:'));
        $this->required = $required;
    }

    /**
     * Should return an array specification compatible with
     * {@link Zend\InputFilter\Factory::createInputFilter()}.
     *
     * @return array
     */
    public function getInputFilterSpecification()
    {
        return [
            [
                'name'       => 'file',
                'required'   => $this->required,
                'validators' => [
                    [
                        'name'    => 'Zend\Validator\File\Size',
                        'options' => [
                            'max' => '4MB',
                        ],
                    ],
                    [
                        'name'    => 'Zend\Validator\File\Extension',
                        'options' => [
                            'jpg',
                            'jpeg',
                            'png',
                            'pdf',
                            'ggb',
                            'gif',
                            'tif',
                            'tiff',
                            'svg',
                            'xml',
                        ],
                    ],
                ],
            ],
        ];
    }
}
