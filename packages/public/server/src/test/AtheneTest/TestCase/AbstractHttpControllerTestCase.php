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

namespace AtheneTest\TestCase;

use InstanceTest\Stub\Manager\InstanceManagerStubAwareTrait;
use Zend\Http\Response;
use Zend\Stdlib\ResponseInterface;

abstract class AbstractHttpControllerTestCase extends \Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase
{
    use InstanceManagerStubAwareTrait;

    /** @var array Modules to load */
    protected $modules;

    /**
     * Get the application response object
     * @return Response
     */
    public function getResponse()
    {
        /** @var Response $response */
        $response = parent::getResponse();
        return $response;
    }

    public function assertJsonResponse($expected, ResponseInterface $response)
    {
        /** @var Response $response */
        $this->assertResponseStatusCode(200);

        $headers = $response->getHeaders();
        $this->assertEquals('application/json; charset=utf-8', $headers->get('Content-Type')->getFieldValue());

        $body = json_decode($response->getBody(), true);
        $this->assertEquals($expected, $body);
    }

    protected function setUp()
    {
        $config = include __DIR__ . '/../../../config/application.config.php';
        $config['modules'] = array_merge(
            $this->modules,
            [
                'Common',
                'Log',
                'Ui',
            ]
        );
        $this->setApplicationConfig($config);

        parent::setUp();

        $this->setUpInstanceManager();

        $serviceManager = $this->getApplicationServiceLocator();
        $serviceManager->setAllowOverride(true);

        // Ui module depends on default_navigation
        $serviceManager->setService('default_navigation', []);

        // Override layout so we can test the template in isolation
        $view = $serviceManager->get('ViewRenderer');
        $view->layout('layout/partials/main');
    }
}
