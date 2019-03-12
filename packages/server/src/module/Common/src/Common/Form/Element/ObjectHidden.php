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
namespace Common\Form\Element;

use DoctrineModule\Form\Element\Proxy;
use Zend\Form\Element\Hidden as HiddenElement;
use Zend\Form\Element;
use Zend\Form\ElementInterface;

class ObjectHidden extends HiddenElement
{

    /**
     * @var Proxy
     */
    protected $proxy;

    /**
     * {@inheritdoc}
     */
    public function getValueOptions()
    {
        if (empty($this->valueOptions)) {
            $this->setValueOptions($this->getProxy()
                ->getValueOptions());
        }

        return $this->valueOptions;
    }

    /**
     * @param array|\Traversable $options
     * @return Element|ElementInterface
     */
    public function setOptions($options)
    {
        $this->getProxy()->setOptions($options);

        return parent::setOptions($options);
    }

    /**
     * {@inheritdoc}
     */
    public function setValue($value)
    {
        return parent::setValue($this->getProxy()->getValue($value));
    }

    /**
     * @return Proxy
     */
    public function getProxy()
    {
        if (null === $this->proxy) {
            $this->proxy = new Proxy();
        }

        return $this->proxy;
    }
}
