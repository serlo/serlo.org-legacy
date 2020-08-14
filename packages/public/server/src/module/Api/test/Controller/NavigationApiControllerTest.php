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

namespace ApiTest\Controller;

use Api\Controller\NavigationApiController;
use AtheneTest\TestCase\AbstractHttpControllerTestCase;
use Navigation\Exception\ContainerNotFoundException;
use Navigation\Service\NavigationService;
use PHPUnit_Framework_MockObject_Stub_Return;
use Zend\Stdlib\ResponseInterface;

class NavigationApiControllerTest extends AbstractHttpControllerTestCase
{
    protected $modules = ['ApiTest'];

    public function testContainerDoesNotExist()
    {
        $navigationService = $this->getMockBuilder(NavigationService::class)
            ->setMethods(['getNavigation'])
            ->getMock();
        $navigationService
            ->method('getNavigation')
            ->willThrowException(new ContainerNotFoundException());
        $this->getApplicationServiceLocator()->setService(
            NavigationService::class,
            $navigationService
        );

        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance([], $this->getResponse());
    }

    public function testEmptyNavigation()
    {
        $this->stubNavigationService([]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance([], $this->getResponse());
    }

    public function testOneSubject()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'Mathematik',
                    'route' => 'page/view',
                    'params.page' => '19767',
                ],
                'children' => [],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance(
            [
                [
                    'label' => 'Mathematik',
                    'id' => 19767,
                ],
            ],
            $this->getResponse()
        );
    }

    public function testOneSubjectWithTaxonomy()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'Mathematik',
                    'route' => 'page/view',
                    'params.page' => '19767',
                ],
                'children' => [
                    [
                        'parameters' => [
                            'label' => 'Alle Themen',
                            'options.parent.slug' => 'mathe',
                            'options.parent.type' => 'subject',
                            'options.types.0' => 'topic',
                            'options.instance' => 'deutsch',
                            'params.term' => '5',
                            'route' => 'taxonomy/term/get',
                        ],
                        'children' => [],
                    ],
                ],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance(
            [
                [
                    'label' => 'Mathematik',
                    'id' => 19767,
                    'children' => [
                        [
                            'label' => 'Alle Themen',
                            'id' => 5,
                        ],
                    ],
                ],
            ],
            $this->getResponse()
        );
    }

    public function testRouter()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'License API',
                    'route' => 'api/license',
                    'params.id' => '1',
                ],
                'children' => [],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance(
            [
                [
                    'label' => 'License API',
                    'url' => '/api/license/1',
                ],
            ],
            $this->getResponse()
        );
    }

    public function testDropdown()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'Bei Serlo mitarbeiten',
                    'uri' => '#',
                ],
                'children' => [
                    [
                        'parameters' => [
                            'label' => 'Taxonomie bearbeiten',
                            'uri' => '/taxonomy/term/organize/25712',
                        ],
                        'children' => [],
                    ],
                ],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance(
            [
                [
                    'label' => 'Bei Serlo mitarbeiten',
                    'children' => [
                        [
                            'label' => 'Taxonomie bearbeiten',
                            'id' => 25712,
                        ],
                    ],
                ],
            ],
            $this->getResponse()
        );
    }

    public function testId()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'Gymnasium',
                    'uri' => '/16042 ',
                ],
                'children' => [],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance(
            [
                [
                    'label' => 'Gymnasium',
                    'id' => 16042,
                ],
            ],
            $this->getResponse()
        );
    }

    public function testUri()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'Ungeprüfte Bearbeitungen',
                    'uri' => '/entity/unrevised',
                ],
                'children' => [],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance(
            [
                [
                    'label' => 'Ungeprüfte Bearbeitungen',
                    'url' => '/entity/unrevised',
                ],
            ],
            $this->getResponse()
        );
    }

    public function testVisibility()
    {
        $this->stubNavigationService([
            [
                'parameters' => [
                    'label' => 'Ungeprüfte Bearbeitungen',
                    'uri' => '/entity/unrevised',
                    'visible' => 'false',
                ],
                'children' => [],
            ],
        ]);
        $this->dispatch('/api/navigation');
        $this->assertControllerName(NavigationApiController::class);
        $this->assertJsonResponseWithInstance([], $this->getResponse());
    }

    protected function stubNavigationService(array $data)
    {
        $navigationService = $this->getMockBuilder(NavigationService::class)
            ->setMethods(['getNavigation'])
            ->getMock();
        $navigationService
            ->method('getNavigation')
            ->will(new PHPUnit_Framework_MockObject_Stub_Return($data));
        $this->getApplicationServiceLocator()->setService(
            NavigationService::class,
            $navigationService
        );
    }

    protected function assertJsonResponseWithInstance(
        $expected,
        ResponseInterface $response
    ) {
        $this->assertJsonResponse(
            [
                'instance' => 'de',
                'data' => $expected,
            ],
            $response
        );
    }
}
