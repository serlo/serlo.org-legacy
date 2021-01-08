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
namespace Authentication\Controller;

use Authentication\Exception\HydraException;
use Authentication\Service\HydraService;
use User\Manager\UserManagerInterface;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class HydraConsentController extends AbstractActionController
{
    /** @var HydraService */
    protected $hydraService;
    /** @var UserManagerInterface */
    protected $userManager;

    public function __construct(
        HydraService $hydraService,
        UserManagerInterface $userManager
    ) {
        $this->hydraService = $hydraService;
        $this->userManager = $userManager;
    }

    public function indexAction()
    {
        // Skip consent because OAuth only used internally at the moment
        $challenge = $this->params()->fromQuery('consent_challenge');

        try {
            $consentResponse = $this->hydraService->getConsentRequest(
                $challenge
            );
            $user = $this->userManager->getUser(
                (int) $consentResponse['subject']
            );
            $scopes = $consentResponse['requested_scope'];
            $acceptResponse = $this->hydraService->acceptConsentRequest(
                $challenge,
                [
                    'grant_scope' => $consentResponse['requested_scope'],
                    'grant_access_token_audience' =>
                        $consentResponse['requested_access_token_audience'],
                    'remember' => true,
                    'remember_for' => 60 * 60, // seconds
                    'session' => [
                        'id_token' => array_merge(
                            [
                                'id' => $user->getId(),
                                'username' => $user->getUsername(),
                            ],
                            in_array('email', $scopes)
                                ? [
                                    'email' => $user->getEmail(),
                                    'email_verified' => true,
                                ]
                                : []
                        ),
                    ],
                ]
            );
            return $this->redirect()->toUrl($acceptResponse['redirect_to']);
        } catch (HydraException $exception) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel([
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
