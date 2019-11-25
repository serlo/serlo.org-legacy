<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Authentication\Controller;

use Authentication\Adapter\AdapterInterface;
use Authentication\Service\HydraService;
use Common\Traits\AuthenticationServiceAwareTrait;
use User\Form\Login;
use User\Manager\UserManagerAwareTrait;
use User\Manager\UserManagerInterface;
use Zend\Authentication\AuthenticationService;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class HydraController extends AbstractActionController
{
    use AuthenticationServiceAwareTrait;
    use UserManagerAwareTrait;
    /**
     * @var HydraService
     */
    protected $hydraService;


    public function __construct(
        HydraService $hydraService,
        AuthenticationService $authenticationService,
        UserManagerInterface $userManager
    ) {
        $this->hydraService = $hydraService;
        $this->authenticationService = $authenticationService;
        $this->userManager = $userManager;
    }

    public function loginAction()
    {
        $challenge = '';
        if (!$this->getRequest()->isPost()) {
            $challenge = $this->params()->fromQuery('login_challenge');

            $loginResponse = $this->hydraService->getLoginRequest($challenge);

            // if hydra knows the user already, accept without login
            if ($loginResponse['skip']) {
                $acceptResponse = $this->hydraService->acceptLoginRequest($challenge, [
                    // All we need to do is to confirm that we indeed want to log in the user.
                    'subject' => $loginResponse['subject'],
                ]);

                return $this->redirect()->toUrl($acceptResponse['redirect_to']);
            }

            // if user is already logged in, accept request
            $user = $this->getUserManager()->getUserFromAuthenticator();
            if ($user) {
                $acceptResponse = $this->hydraService->acceptLoginRequest($challenge, [
                    'subject' => "" . $user->getId(),
                ]);

                return $this->redirect()->toUrl($acceptResponse['redirect_to']);
            }
        }

        $form = new Login($this->getServiceLocator()->get('MvcTranslator'));
        $messages = [];

        if ($this->getRequest()->isPost()) {
            // post data is from login action. Check if login was successfull
            $post = $this->params()->fromPost();
            $challenge = $post['login_challenge'];
            $form->setData($post);

            if ($form->isValid()) {
                $data = $form->getData();

                $adapter = $this->getAuthenticationService()->getAdapter();
                $storage = $this->getAuthenticationService()->getStorage();

                $adapter->setIdentity($data['email']);
                $adapter->setCredential($data['password']);
                $storage->setRememberMe($data['remember']);

                $result = $this->getAuthenticationService()->authenticate();

                if ($result->isValid()) {
                    $user = $this->getUserManager()->getUser($result->getIdentity()->getId());

                    $user->updateLoginData();
                    $this->getUserManager()->persist($user);
                    $this->getUserManager()->flush();

                    // accepted login, tell hydra
                    $acceptResponse = $this->hydraService->acceptLoginRequest($challenge, [
                        'subject' => "" .$user->getId(),
                        'remember' => $data['remember'] == 1,
                        'remember_for' => 60 * 60, // seconds
                    ]);
                    return $this->redirect()->toUrl($acceptResponse['redirect_to']);
                }
                $messages = $result->getMessages();
            }
        }

        // show login form if GET and no skip or if post and failed login

        $view = new ViewModel([
            'form'          => $form,
            'errorMessages' => $messages,
            'loginChallenge' => $challenge,
        ]);

        $this->layout('layout/1-col');
        $view->setTemplate('authentication/login');

        return $view;
    }

    public function consentAction()
    {
        // skip consent because OAuth only used internally atm
        $challenge = $this->params()->fromQuery('consent_challenge');

        $consentResponse = $this->hydraService->getConsentRequest($challenge);

        $user = $this->getUserManager()->getUser($consentResponse['subject']);
        $requestedScope = $consentResponse['requested_scope'];

        $acceptResponse = $this->hydraService->acceptConsentRequest($challenge, [
            'grant_scope' => $consentResponse['requested_scope'],
            'grant_access_token_audience' => $consentResponse['requested_access_token_audience'],
            'remember' => true,
            'remember_for' => 60 * 60, // seconds
            'session' => [
                'id_token' => array_merge([
                    'id' => $user->getId(),
                    'username' => $user->getUsername(),
                ], in_array('email', $requestedScope) ? [
                    'email' => $user->getEmail(),
                    'email_verified' => true, // if email were not verified, then login wouldn't work
                ] : []),
            ],
        ]);

        return $this->redirect()->toUrl($acceptResponse['redirect_to']);
    }
}
