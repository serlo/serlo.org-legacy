<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace AdminTest\Controller;

use AtheneTest\TestCase\AbstractHttpControllerTestCase;
use Common\Helper\FetchInterface;
use CommonTest\Stub\Helper\FetchStub;
use Exception;
use UserTest\Stub\Entity\UserStub;
use UserTest\Stub\Manager\UserManagerStub;

class HydraConsentControllerTest extends AbstractHttpControllerTestCase
{
    protected $modules = ['Authentication', 'User'];

    /** @var FetchStub */
    protected $fetch;
    /** @var UserManagerStub */
    protected $userManager;

    public function setUp()
    {
        parent::setUp();

        $serviceManager = $this->getApplicationServiceLocator();

        $this->fetch = new FetchStub();
        $serviceManager->setService(FetchInterface::class, $this->fetch);

        $this->userManager = new UserManagerStub();
        $serviceManager->setService(
            'User\Manager\UserManager',
            $this->userManager
        );
    }

    /**
     * If the request is missing the consent_challenge query param, Hydra will respond with an error.
     * In this case, we will respond with an 400 error code.
     *
     * @throws Exception
     */
    public function testMissingConsentChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getConsentUrl('') => json_encode([
                    'error' => 'invalid_request',
                ]),
            ],
        ]);
        $this->dispatch('/auth/hydra/consent');
        $this->assertResponseStatusCode(400);
        $this->assertJsonResponse(
            ['error' => 'invalid_request'],
            $this->getResponse()
        );
    }

    /**
     * If the request contains an invalid consent_challenge query param, Hydra will respond with an error.
     * In this case, we will respond with an 400 error code.
     *
     * @throws Exception
     */
    public function testInvalidConsentChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getConsentUrl('invalid') => json_encode([
                    'error' => 'Not Found',
                ]),
            ],
        ]);
        $this->dispatch('/auth/hydra/consent?consent_challenge=invalid');
        $this->assertResponseStatusCode(400);
        $this->assertJsonResponse(
            ['error' => 'Not Found'],
            $this->getResponse()
        );
    }

    /**
     * If the challenge is valid, we will directly accept the consent challenge.
     *
     * @throws Exception
     */
    public function testValidConsentChallenge()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getConsentUrl() => $this->getSuccessfulConsentResponse(
                    false,
                    '1'
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
            '/auth/hydra/consent?consent_challenge=' .
                $this->getConsentChallenge()
        );
        $requests = $this->fetch->getRequestsTo($this->getAcceptUrl());
        $this->assertCount(1, $requests);
        $request = $requests[0];
        $this->assertEquals('PUT', $request['method']);
        $this->assertEquals(
            [
                'grant_scope' => $this->getScope(),
                'grant_access_token_audience' => $this->getAudience(),
                'remember' => true,
                'remember_for' => 3600,
                'session' => [
                    'id_token' => [
                        'id' => 1,
                        'username' => 'username',
                    ],
                ],
            ],
            json_decode($request['body'], true)
        );
        $this->assertResponseStatusCode(302);
        $this->assertRedirectTo('redirect_to');
    }

    /**
     * If the email scope is requested, we will include the email in the ID token.
     *
     * @throws Exception
     */
    public function testValidConsentChallengeEmailScope()
    {
        $this->initStubs([
            'httpRequests' => [
                $this->getConsentUrl() => $this->getSuccessfulConsentResponse(
                    false,
                    '1',
                    ['email']
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
            '/auth/hydra/consent?consent_challenge=' .
                $this->getConsentChallenge()
        );
        $requests = $this->fetch->getRequestsTo($this->getAcceptUrl());
        $this->assertCount(1, $requests);
        $request = $requests[0];
        $this->assertEquals('PUT', $request['method']);
        $this->assertEquals(
            [
                'grant_scope' => $this->getScope(['email']),
                'grant_access_token_audience' => $this->getAudience(),
                'remember' => true,
                'remember_for' => 3600,
                'session' => [
                    'id_token' => [
                        'id' => 1,
                        'username' => 'username',
                        'email' => 'email',
                        'email_verified' => true,
                    ],
                ],
            ],
            json_decode($request['body'], true)
        );
        $this->assertResponseStatusCode(302);
        $this->assertRedirectTo('redirect_to');
    }

    protected function initStubs(array $options)
    {
        $fetchStubs = array_key_exists('httpRequests', $options)
            ? $options['httpRequests']
            : [];
        $usersStubs = array_key_exists('users', $options)
            ? $options['users']
            : [];
        $authenticatedUser = array_key_exists('authenticatedUser', $options)
            ? $options['authenticatedUser']
            : null;

        $this->fetch->init($fetchStubs);
        $this->userManager->init($usersStubs, $authenticatedUser);
    }

    protected function getConsentUrl($consentChallenge = null)
    {
        $challenge = $consentChallenge ?? $this->getConsentChallenge();
        return 'http://hydra:4445/oauth2/auth/requests/consent?' .
            ($challenge ? 'consent_challenge=' . $challenge : '');
    }

    protected function getSuccessfulConsentResponse(
        $skip,
        $subject,
        $additionalScopes = []
    ) {
        return json_encode([
            'skip' => $skip,
            'subject' => $subject,
            'challenge' => $this->getConsentChallenge(),
            'client' => [
                'client_id' => 'client',
            ],
            'request_url' => 'request_url',
            'requested_scope' => $this->getScope($additionalScopes),
            'requested_access_token_audience' => $this->getAudience(),
            'oidc_context' => [],
        ]);
    }

    protected function getAcceptUrl($consentChallenge = null)
    {
        $challenge = $consentChallenge ?? $this->getConsentChallenge();
        return 'http://hydra:4445/oauth2/auth/requests/consent/accept?consent_challenge=' .
            $challenge;
    }

    protected function getSuccessfulAcceptResponse($redirectTo)
    {
        return json_encode([
            'redirect_to' => $redirectTo,
        ]);
    }

    protected function getConsentChallenge()
    {
        return '07769590d7d9496a9b4f2f156d33c712';
    }

    protected function getScope($additionalScopes = [])
    {
        return array_merge(['openid', 'foo'], $additionalScopes);
    }

    protected function getAudience()
    {
        return ['audience'];
    }
}
