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
use AtheneTest\TestCase\AbstractHttpControllerTestCase;
use Authorization\Permission;
use Authorization\Service\AssertGrantedServiceInterface;
use Csrf\CsrfTokenContainer;
use Ui\View\Helper\Encrypt;

class DebuggerControllerTest extends AbstractHttpControllerTestCase
{
    protected $modules = ['Admin'];

    public function setUp()
    {
        parent::setUp();

        $serviceManager = $this->getApplicationServiceLocator();
        $serviceManager->setAllowOverride(true);

        // Verify that we check permission `debugger.use`
        $assertGrantedService = $this
            ->getMockBuilder(AssertGrantedServiceInterface::class)
            ->setMethods(['assert'])
            ->getMock();
        $assertGrantedService
            ->expects($this->once())
            ->method('assert')
            ->with($this->equalTo(Permission::ADMIN_DEBUGGER_USE));
        $serviceManager->setService(AssertGrantedServiceInterface::class, $assertGrantedService);
    }

    public function testIndexActionGet()
    {
        $this->dispatch('/debugger');
        $this->assertControllerName(DebuggerController::class);
        $this->assertQueryContentRegex('h1', '/Debugger/');
        $this->assertResponseStatusCode(200);
    }

    public function testIndexActionPost()
    {
        $helper = new Encrypt();
        $this->dispatch('/debugger', 'POST', [
            'message' => $helper('message'),
            'csrf' => CsrfTokenContainer::getToken(),
        ]);
        $this->assertControllerName(DebuggerController::class);
        $this->assertQueryContentRegex('html', '/message/');
        $this->assertResponseStatusCode(200);
    }

    public function testIndexActionPostCsrfValidation()
    {
        $helper = new Encrypt();
        $message = $helper('message');
        $this->dispatch('/debugger', 'POST', [
            'message' => $message,
            'csrf' => 'wrong csrf',
        ]);
        $this->assertControllerName(DebuggerController::class);
        $this->assertQueryContentContains('textarea', $message);
        $this->assertResponseStatusCode(200);
    }
}
