<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace AdminTest\Controller;

use Admin\Controller\DebuggerController;
use Authorization\Service\AssertGrantedServiceInterface;
use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;

class DebuggerControllerTest extends AbstractHttpControllerTestCase
{
    public function setUp()
    {
        $config = include __DIR__ . '/../../../../../config/application.config.php';
        $config['modules'] = ['Admin', 'Ui'];
        $this->setApplicationConfig($config);
        parent::setUp();
    }

    public function testIndexAction()
    {
        $serviceManager = $this->getApplicationServiceLocator();
        $serviceManager->setAllowOverride(true);
        $serviceManager->setService('default_navigation', []);

        $assertGrantedService = $this
            ->getMockBuilder(AssertGrantedServiceInterface::class)
            ->setMethods(['assert'])
            ->getMock();
        $assertGrantedService
            ->expects($this->once())
            ->method('assert')
            ->with($this->equalTo('debugger.use'));
        $serviceManager->setService(AssertGrantedServiceInterface::class, $assertGrantedService);

        $view = $serviceManager->get('ViewRenderer');
        $view->layout('layout/partials/main');

        $this->dispatch('/debugger');
        $this->assertControllerName(DebuggerController::class);
        $this->assertQueryContentRegex('h1', '/Debugger/');
        $this->assertResponseStatusCode(200);
    }
}
