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

use AtheneTest\TestCase\AbstractHttpControllerTestCase;
use AuthenticationTest\Stub\Service\AuthenticationServiceStub;
use Common\Helper\FetchInterface;
use CommonTest\Stub\Helper\FetchStub;
use Csrf\CsrfTokenContainer;
use Exception;
use UserTest\Stub\Entity\UserStub;
use UserTest\Stub\Manager\UserManagerStub;

class HydraConsentLogoutTest extends AbstractHttpControllerTestCase
{
    protected $modules = ['Authentication', 'User'];

    /** @var AuthenticationServiceStub */
    protected $authenticationService;
    /** @var FetchStub */
    protected $fetch;
    /** @var UserManagerStub */
    protected $userManager;

    public function setUp()
    {
        parent::setUp();

        $serviceManager = $this->getApplicationServiceLocator();

        $this->authenticationService = new AuthenticationServiceStub();
        $serviceManager->setService(
            'Zend\Authentication\AuthenticationService',
            $this->authenticationService
        );

        $this->fetch = new FetchStub();
        $serviceManager->setService(FetchInterface::class, $this->fetch);

        $this->userManager = new UserManagerStub();
        $serviceManager->setService(
            'User\Manager\UserManager',
            $this->userManager
        );
    }

    /**
     * If the request is missing the logout_challenge query param, Hydra will respond with an error.
     * In this case, we will respond with an 400 error code.
     *
     * @throws Exception
     */
    public function testMissingLogoutChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getLogoutUrl('') => json_encode([
                    'error' => 'invalid_request',
                ]),
            ],
        ]);
        $this->dispatch('/auth/hydra/logout');
        $this->assertResponseStatusCode(400);
        $this->assertJsonResponse(
            ['error' => 'invalid_request'],
            $this->getResponse()
        );
    }

    /**
     * If the request contains an invalid logout_challenge query param, Hydra will respond with an error.
     * In this case, we will respond with an 400 error code.
     *
     * @throws Exception
     */
    public function testInvalidLogoutChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getLogoutUrl('invalid') => json_encode([
                    'error' => 'Not Found',
                ]),
            ],
        ]);
        $this->dispatch('/auth/hydra/logout?logout_challenge=invalid');
        $this->assertResponseStatusCode(400);
        $this->assertJsonResponse(
            ['error' => 'Not Found'],
            $this->getResponse()
        );
    }

    /**
     * If the challenge is valid, we will directly accept the logout challenge.
     *
     * @throws Exception
     */
    public function testValidLogoutChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getLogoutUrl() => $this->getSuccessfulLogoutResponse(
                    '1'
                ),
                $this->getAcceptUrl() => $this->getSuccessfulAcceptResponse(
                    'redirect_to'
                ),
            ],
        ]);
        $this->dispatch(
            '/auth/hydra/logout?logout_challenge=' . $this->getLogoutChallenge()
        );
        $requests = $this->fetch->getRequestsTo($this->getAcceptUrl());
        $this->assertEquals(1, count($requests));
        $request = $requests[0];
        $this->assertEquals('PUT', $request['method']);
        $this->assertEquals([], json_decode($request['body'], true));
        $this->assertResponseStatusCode(302);
        $this->assertRedirectTo('redirect_to');
    }

    protected function initStubs(array $options)
    {
        $authenticationStubs = array_key_exists(
            'authenticationRequests',
            $options
        )
            ? $options['authenticationRequests']
            : [];
        $fetchStubs = array_key_exists('httpRequests', $options)
            ? $options['httpRequests']
            : [];
        $usersStubs = array_key_exists('users', $options)
            ? $options['users']
            : [];
        $authenticatedUser = array_key_exists('authenticatedUser', $options)
            ? $options['authenticatedUser']
            : null;

        $this->authenticationService->init($authenticationStubs);
        $this->fetch->init($fetchStubs);
        $this->userManager->init($usersStubs, $authenticatedUser);
    }

    protected function getLogoutUrl($consentChallenge = null)
    {
        $challenge = $consentChallenge ?? $this->getLogoutChallenge();
        return 'http://hydra:4445/oauth2/auth/requests/logout?' .
            ($challenge ? 'logout_challenge=' . $challenge : '');
    }

    protected function getSuccessfulLogoutResponse($subject)
    {
        return json_encode([
            'subject' => $subject,
            'sid' => 'sid',
            'request_url' => 'request_url',
            'rp_initiated' => true,
        ]);
    }

    protected function getAcceptUrl($logoutChallenge = null)
    {
        $challenge = $logoutChallenge ?? $this->getLogoutChallenge();
        return 'http://hydra:4445/oauth2/auth/requests/logout/accept?logout_challenge=' .
            $challenge;
    }

    protected function getSuccessfulAcceptResponse($redirectTo)
    {
        return json_encode([
            'redirect_to' => $redirectTo,
        ]);
    }

    protected function getLogoutChallenge()
    {
        return '07769590d7d9496a9b4f2f156d33c712';
    }
}
