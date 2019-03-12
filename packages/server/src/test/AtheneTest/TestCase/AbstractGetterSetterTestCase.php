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

namespace AtheneTest\TestCase;

use PHPUnit\Framework\TestCase;

/**
 * abstract class for auto-testing getter and setter methods.
 *
 * usage: extend this class, override getData() and call setObject($objectToTest) in your PHPUnit setUp() method;
 *
 * All get- and set-methods specified via getData() will be tested automatically.
 *
 * @package AtheneTest\TestCase
 */
abstract class AbstractGetterSetterTestCase extends TestCase
{

    /**
     * example: for auto testing getTitle() and setTitle($title) return array("title" => "title")
     *
     * @return array data for get- and set-methods (key: name of get/set-method, value: value)
     */
    abstract protected function getData();

    private $object;
    private $data;

    /**
     * @return mixed $reference
     */
    protected function getObject()
    {
        return $this->object;
    }

    /**
     * @param mixed $objectToTest
     * @return $this
     */
    protected function setObject($objectToTest)
    {
        $this->object = $objectToTest;
        return $this;
    }


    protected function inject()
    {
        if (!is_array($this->data)) {
            $this->data = $this->getData();
        }

        foreach ($this->data as $key => $value) {
            $method = 'set' . ucfirst($key);
            $this->assertSame($this->getObject(), $this->getObject()
                ->$method($value));
        }
        return $this;
    }


    public function testSetter()
    {
        $this->object = $this->getObject();
        $this->inject();
    }

    public function testGetter()
    {
        $object = $this->getObject();
        $this->inject();
        foreach ($this->data as $key => $value) {
            $method = 'get' . ucfirst($key);
            if (is_object($object->$method())) {
                $this->assertSame($value, $object->$method(), $method);
            } else {
                $this->assertEquals($value, $object->$method(), $method);
            }
        }
    }
}
