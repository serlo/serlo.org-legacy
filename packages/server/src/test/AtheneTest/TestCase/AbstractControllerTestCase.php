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

use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;

/**
 * @TODO please implement me if needed
 *
 * @package AtheneTest\TestCase
 */
abstract class AbstractControllerTestCase extends AbstractHttpControllerTestCase
{
    /**
     * @var \Zend\Mvc\Controller\AbstractActionController
     */
    protected $controller;

    public function setUp()
    {
//        $this->setApplicationConfig(
//            include __DIR__ . '/../../../config/application.config.php'
//        );

        parent::setUp();
    }

    protected function preparePluginManager()
    {
        if ($this->controller->getPluginManager() instanceof \PHPUnit_Framework_MockObject_MockObject) {
            return $this->controller->getPluginManager();
        }

        $pluginManager = $this->createMock('Zend\Mvc\Controller\PluginManager');
        $this->controller->setPluginManager($pluginManager);

        return $pluginManager;
    }
}
