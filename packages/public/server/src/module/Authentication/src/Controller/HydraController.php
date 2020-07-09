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
namespace Authentication\Controller;

use Authentication\Service\AuthenticationServiceInterface;
use Authentication\Service\HydraService;
use User\Form\Login;
use User\Manager\UserManagerAwareTrait;
use User\Manager\UserManagerInterface;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\I18n\Translator;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class HydraController extends AbstractActionController
{
    use UserManagerAwareTrait;

    /** @var AuthenticationServiceInterface */
    protected $authenticationService;
    /** @var HydraService */
    protected $hydraService;
    /** @var Translator */
    protected $translator;

    public function __construct(
        HydraService $hydraService,
        AuthenticationServiceInterface $authenticationService,
        UserManagerInterface $userManager,
        Translator $translator
    ) {
        $this->hydraService = $hydraService;
        $this->authenticationService = $authenticationService;
        $this->userManager = $userManager;
        $this->translator = $translator;
    }

    public function loginAction()
    {
        $challenge = '';
        if (!$this->getRequest()->isPost()) {
            $challenge = $this->params()->fromQuery('login_challenge');

            $loginResponse = $this->hydraService->getLoginRequest($challenge);

            if (array_key_exists('error', $loginResponse)) {
                $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
                return new JsonModel([
                    'error' => $loginResponse['error'],
                ]);
            }

            // if hydra knows the user already, accept without login
            if ($loginResponse['skip']) {
                $acceptResponse = $this->hydraService->acceptLoginRequest(
                    $challenge,
                    [
                        // All we need to do is to confirm that we indeed want to log in the user.
                        'subject' => $loginResponse['subject'],
                    ]
                );

                return $this->redirect()->toUrl($acceptResponse['redirect_to']);
            }

            // if user is already logged in, accept request
            $user = $this->getUserManager()->getUserFromAuthenticator();
            if ($user) {
                $acceptResponse = $this->hydraService->acceptLoginRequest(
                    $challenge,
                    [
                        'subject' => '' . $user->getId(),
                    ]
                );

                return $this->redirect()->toUrl($acceptResponse['redirect_to']);
            }
        }

        $form = new Login($this->translator);
        $messages = [];

        if ($this->getRequest()->isPost()) {
            // post data is from login action. Check if login was successful
            $post = $this->params()->fromPost();
            $challenge = $post['login_challenge'];
            $form->setData($post);

            if ($form->isValid()) {
                $data = $form->getData();

                // TODO: does this even work correctly?
                // No it does not for some reason!
                $result = $this->authenticationService->authenticateWithData(
                    $data['email'],
                    $data['password'],
                    $data['remember']
                );

                if ($result->isValid()) {
                    $user = $this->getUserManager()->getUser(
                        $result->getIdentity()->getId()
                    );

                    $user->updateLoginData();
                    $this->getUserManager()->persist($user);
                    $this->getUserManager()->flush();

                    // accepted login, tell hydra
                    $acceptResponse = $this->hydraService->acceptLoginRequest(
                        $challenge,
                        [
                            'subject' => '' . $user->getId(),
                            'remember' => $data['remember'] == 1,
                            'remember_for' => 60 * 60, // seconds
                        ]
                    );
                    return $this->redirect()->toUrl(
                        $acceptResponse['redirect_to']
                    );
                }
                $messages = $result->getMessages();
            }
        }

        // show login form if GET and no skip or if post and failed login

        $view = new ViewModel([
            'form' => $form,
            'errorMessages' => $messages,
            'loginChallenge' => $challenge,
        ]);

        $this->layout('layout/1-col');
        $view->setTemplate('authentication/login');

        return $view;
    }

    public function logoutAction()
    {
        // Skip consent because OAuth only used internally at the moment
        $challenge = $this->params()->fromQuery('logout_challenge');

        $logoutResponse = $this->hydraService->getLogoutRequest($challenge);
        if (array_key_exists('error', $logoutResponse)) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel([
                'error' => $logoutResponse['error'],
            ]);
        }

        $this->authenticationService->clearIdentity();

        $acceptResponse = $this->hydraService->acceptLogoutChallenge(
            $challenge
        );

        return $this->redirect()->toUrl($acceptResponse['redirect_to']);
    }

    public function consentAction()
    {
        // Skip consent because OAuth only used internally at the moment
        $challenge = $this->params()->fromQuery('consent_challenge');

        $consentResponse = $this->hydraService->getConsentRequest($challenge);
        if (array_key_exists('error', $consentResponse)) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel([
                'error' => $consentResponse['error'],
            ]);
        }

        $user = $this->getUserManager()->getUser(
            (int) $consentResponse['subject']
        );
        $requestedScope = $consentResponse['requested_scope'];

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
                        in_array('email', $requestedScope)
                            ? [
                                'email' => $user->getEmail(),
                                'email_verified' => true, // if email were not verified, then login wouldn't work
                            ]
                            : []
                    ),
                ],
            ]
        );

        return $this->redirect()->toUrl($acceptResponse['redirect_to']);
    }
}
