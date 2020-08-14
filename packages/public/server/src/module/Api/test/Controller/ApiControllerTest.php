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

use Api\Controller\UserApiController;
use AtheneTest\TestCase\AbstractHttpControllerTestCase;
use User\Manager\UserManager;

class ApiControllerTest extends AbstractHttpControllerTestCase
{
    protected $modules = ['ApiTest'];

    public function testActiveAuthors()
    {
        $this->mockUserManager('getActiveAuthorIds', [1, 10]);

        $this->dispatch('/api/user/active-authors');
        $this->assertControllerName(UserApiController::class);
        $this->assertJsonResponse([1, 10], $this->getResponse());
    }

    public function testActiveReviewers()
    {
        $this->mockUserManager('getActiveReviewerIds', [1, 10]);

        $this->dispatch('/api/user/active-reviewers');
        $this->assertControllerName(UserApiController::class);
        $this->assertJsonResponse([1, 10], $this->getResponse());
    }

    protected function mockUserManager(string $method, array $idList)
    {
        $userManager = $this->getMockBuilder(UserManager::class)
            ->setMethods([$method])
            ->getMock();
        $userManager->method($method)->willReturn($idList);

        $this->getApplicationServiceLocator()->setService(
            UserManager::class,
            $userManager
        );
    }
}
