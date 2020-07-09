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

class HydraLoginControllerTest extends AbstractHttpControllerTestCase
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
     * If the request is missing the login_challenge query param, Hydra will respond with an error.
     * In this case, we will respond with an 400 error code.
     *
     * @throws Exception
     */
    public function testMissingLoginChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getLoginUrl('') => json_encode([
                    'error' => 'invalid_request',
                ]),
            ],
        ]);
        $this->dispatch('/auth/hydra/login');
        $this->assertResponseStatusCode(400);
        $this->assertJsonResponse(
            ['error' => 'invalid_request'],
            $this->getResponse()
        );
    }

    /**
     * If the request contains an invalid login_challenge query param, Hydra will respond with an error.
     * In this case, we will respond with an 400 error code.
     *
     * @throws Exception
     */
    public function testInvalidLoginChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getLoginUrl('invalid') => json_encode([
                    'error' => 'Not Found',
                ]),
            ],
        ]);
        $this->dispatch('/auth/hydra/login?login_challenge=invalid');
        $this->assertResponseStatusCode(400);
        $this->assertJsonResponse(
            ['error' => 'Not Found'],
            $this->getResponse()
        );
    }

    /**
     * If the user isn't already authenticated, we will show a login form.
     *
     * @throws Exception
     */
    public function testValidLoginChallengeNotAuthenticated()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getLoginUrl() => $this->getSuccessfulLoginResponse(
                    false,
                    ''
                ),
            ],
        ]);
        $this->dispatch(
            '/auth/hydra/login?login_challenge=' . $this->getLoginChallenge()
        );
        $this->assertResponseStatusCode(200);
        $this->assertQueryContentRegex('h1', '/Log in/');
        $this->assertQuery(
            'input[name="login_challenge"][value="' .
                $this->getLoginChallenge() .
                '"]'
        );
    }

    /**
     * Submitting the login form also accepts the login challenge.
     *
     * @throws Exception
     */
    public function testValidLoginChallengeNotAuthenticatedPost()
    {
        $this->initStubs([
            'authenticationRequests' => [
                'email' => [
                    'id' => 1,
                    'password' => 'password',
                ],
            ],
            'httpRequests' => [
                $this->getLoginUrl() => $this->getSuccessfulLoginResponse(
                    false,
                    ''
                ),
                $this->getAcceptUrl() => $this->getSuccessfulAcceptResponse(
                    'redirect_to'
                ),
            ],
            'users' => [
                1 => new UserStub(1),
            ],
        ]);
        $this->dispatch(
            '/auth/hydra/login?login_challenge=' . $this->getLoginChallenge(),
            'POST',
            [
                'csrf' => CsrfTokenContainer::getToken(),
                'email' => 'email',
                'password' => 'password',
                'submit' => 'Login',
                'remember' => true,
                'login_challenge' => $this->getLoginChallenge(),
            ]
        );
        $requests = $this->fetch->getRequestsTo($this->getAcceptUrl());
        $this->assertCount(1, $requests);
        $request = $requests[0];
        $this->assertEquals('PUT', $request['method']);
        $this->assertEquals(
            [
                'subject' => '1',
                'remember' => true,
                'remember_for' => 3600,
            ],
            json_decode($request['body'], true)
        );
        $this->assertResponseStatusCode(302);
        $this->assertRedirectTo('redirect_to');
    }

    /**
     * The login form should validate the CSRF token.
     *
     * @throws Exception
     */
    public function testValidLoginChallengeNotAuthenticatedPostCsrfValidation()
    {
        $this->initStubs([
            'authenticationRequests' => [
                'email' => [
                    'id' => 1,
                    'password' => 'password',
                ],
            ],
            'httpRequests' => [
                $this->getLoginUrl() => $this->getSuccessfulLoginResponse(
                    false,
                    ''
                ),
                $this->getAcceptUrl() => $this->getSuccessfulAcceptResponse(
                    'redirect_to'
                ),
            ],
            'users' => [
                1 => new UserStub(1),
            ],
        ]);
        $this->dispatch(
            '/auth/hydra/login?login_challenge=' . $this->getLoginChallenge(),
            'POST',
            [
                'csrf' => 'wrong csrf',
                'email' => 'email',
                'password' => 'password',
                'submit' => 'Login',
                'remember' => true,
                'login_challenge' => $this->getLoginChallenge(),
            ]
        );
        $this->assertResponseStatusCode(200);
    }

    /**
     * If the user is already authenticated, we will directly accept the login challenge.
     *
     * @throws Exception
     */
    public function testValidLoginChallengeAuthenticated()
    {
        $this->initStubs([
            'authenticationRequests' => [
                'email' => [
                    'id' => 1,
                    'password' => 'password',
                ],
            ],
            'httpRequests' => [
                $this->getLoginUrl() => $this->getSuccessfulLoginResponse(
                    false,
                    ''
                ),
                $this->getAcceptUrl() => $this->getSuccessfulAcceptResponse(
                    'redirect_to'
                ),
            ],
            'users' => [
                1 => new UserStub(1),
            ],
            'authenticatedUser' => 1,
        ]);
        $this->dispatch(
            '/auth/hydra/login?login_challenge=' . $this->getLoginChallenge()
        );
        $requests = $this->fetch->getRequestsTo($this->getAcceptUrl());
        $this->assertCount(1, $requests);
        $request = $requests[0];
        $this->assertEquals('PUT', $request['method']);
        $this->assertEquals(
            [
                'subject' => '1',
            ],
            json_decode($request['body'], true)
        );
        $this->assertResponseStatusCode(302);
        $this->assertRedirectTo('redirect_to');
    }

    /**
     * If Hydra already knows the user, we will directly accept the login challenge.
     *
     * @throws Exception
     */
    public function testValidLoginChallengeSkip()
    {
        $this->initStubs([
            'authenticationRequests' => [
                'email' => [
                    'id' => 1,
                    'password' => 'password',
                ],
            ],
            'httpRequests' => [
                $this->getLoginUrl() => $this->getSuccessfulLoginResponse(
                    true,
                    '1'
                ),
                $this->getAcceptUrl() => $this->getSuccessfulAcceptResponse(
                    'redirect_to'
                ),
            ],
        ]);
        $this->dispatch(
            '/auth/hydra/login?login_challenge=' . $this->getLoginChallenge()
        );
        $requests = $this->fetch->getRequestsTo($this->getAcceptUrl());
        $this->assertCount(1, $requests);
        $request = $requests[0];
        $this->assertEquals('PUT', $request['method']);
        $this->assertEquals(
            [
                'subject' => '1',
            ],
            json_decode($request['body'], true)
        );
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

    protected function getLoginUrl($loginChallenge = null)
    {
        $challenge = $loginChallenge ?? $this->getLoginChallenge();
        return 'http://hydra:4445/oauth2/auth/requests/login?' .
            ($challenge ? 'login_challenge=' . $challenge : '');
    }

    protected function getSuccessfulLoginResponse($skip, $subject)
    {
        return json_encode([
            'skip' => $skip,
            'subject' => $subject,
            'challenge' => $this->getLoginChallenge(),
            'client' => [
                'client_id' => 'client',
            ],
            'request_url' => 'request_url',
            'requested_scope' => ['openid'],
            'oidc_context' => [],
        ]);
    }

    protected function getAcceptUrl($loginChallenge = null)
    {
        $challenge = $loginChallenge ?? $this->getLoginChallenge();
        return 'http://hydra:4445/oauth2/auth/requests/login/accept?login_challenge=' .
            $challenge;
    }

    protected function getSuccessfulAcceptResponse($redirectTo)
    {
        return json_encode([
            'redirect_to' => $redirectTo,
        ]);
    }

    protected function getLoginChallenge()
    {
        return '07769590d7d9496a9b4f2f156d33c712';
    }
}
