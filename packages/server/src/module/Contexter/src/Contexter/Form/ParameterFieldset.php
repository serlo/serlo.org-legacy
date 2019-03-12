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
namespace Contexter\Form;

use Zend\Form\Element\Checkbox;
use Zend\Form\Fieldset;
use Zend\InputFilter\InputFilterProviderInterface;

class ParameterFieldset extends Fieldset implements InputFilterProviderInterface
{
    protected $parameters;

    public function __construct(array $parameters)
    {
        $this->parameters = $parameters;

        parent::__construct('parameters');
        $this->setLabel('Which parameters should be matched?');

        foreach ($parameters as $key => $value) {
            if (is_array($value)) {
                $options = [];
                foreach ($value as $elem) {
                    $options[$elem] = $elem;
                }
                $this->add(
                    array(
                        'type'     => 'Zend\Form\Element\Select',
                        'options'  => array(
                            'disable_inarray_validator' => true,
                            'value_options'             => $options,
                            'empty_option'              => 'Ignore',
                            'label'                     => $key,
                        ),
                        'required' => false,
                        'name'     => $key,
                    )
                );
            } else {
                $this->add(
                    (new Checkbox($key))->setLabel('<strong>' . $key . ':</strong> ' . $value)->setAttribute(
                        'checked',
                        true
                    )->setCheckedValue($value)->setUncheckedValue('')
                );
            }
        }
    }

    /**
     * Expected to return \Zend\ServiceManager\Config object or array to
     * seed such an object.
     *
     * @return array|\Zend\ServiceManager\Config
     */
    public function getInputFilterSpecification()
    {
        $return = [];
        foreach ($this->parameters as $key => $value) {
            $return[$key] = [
                'required'    => false,
                'allow_empty' => true,
                'validators'  => [
                    [
                        'name'    => 'Regex',
                        'options' => [
                            'pattern' => '~^[a-zA-Z\-_\\\\/0-9]*$~',
                        ],
                    ],
                ],
            ];
        }

        return $return;
    }
}
