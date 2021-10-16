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
use Authentication\Service\AuthenticationServiceInterface;
use Authentication\Service\HydraService;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceManagerInterface;
use User\Form\Login;
use User\Manager\UserManagerInterface;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\I18n\Translator;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class HydraLoginController extends AbstractActionController
{
    /** @var AuthenticationServiceInterface */
    protected $authenticationService;
    /** @var HydraService */
    protected $hydraService;
    /** @var InstanceManagerInterface */
    protected $instanceManager;
    /** @var UserManagerInterface */
    protected $userManager;
    /** @var Translator */
    protected $translator;

    public function __construct(
        AuthenticationServiceInterface $authenticationService,
        HydraService                   $hydraService,
        InstanceManagerInterface       $instanceManager,
        UserManagerInterface           $userManager,
        Translator                     $translator
    )
    {
        $this->authenticationService = $authenticationService;
        $this->hydraService = $hydraService;
        $this->instanceManager = $instanceManager;
        $this->userManager = $userManager;
        $this->translator = $translator;
    }

    public function indexAction()
    {
        $challenge = $this->params()->fromQuery('login_challenge');

        try {
            if (!$this->getRequest()->isPost()) {
                $loginResponse = $this->hydraService->getLoginRequest(
                    $challenge
                );

                // Hydra knows the user already
                if ($loginResponse['skip']) {
                    return $this->acceptLoginRequest($loginResponse['subject']);
                }

                // User already authenticated
                $user = $this->userManager->getUserFromAuthenticator();
                if ($user) {
                    return $this->acceptLoginRequest((string)$user->getId());
                }

                $currentInstance = $this->instanceManager->getInstanceFromRequest();
                $desiredInstance = $this->getInstanceFromLoginResponse($loginResponse);
                if ($desiredInstance && $desiredInstance !== $currentInstance) {
                    return $this->redirectToInstance($desiredInstance);
                }
            }

            return $this->renderLoginForm();
        } catch (HydraException $exception) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel([
                'error' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * @param $loginResponse
     * @return InstanceInterface|null
     */
    protected function getInstanceFromLoginResponse($loginResponse) {
        $query = parse_url($loginResponse['request_url'], PHP_URL_QUERY);
        parse_str($query, $query);
        $redirectUri = $query['redirect_uri'];
        $host = parse_url($redirectUri, PHP_URL_HOST);
        $domain_parts = explode('.', $host);
        try {
            $subdomain = $domain_parts[0];
            return $this->instanceManager->findInstanceBySubDomain($subdomain);
        } catch (\Exception $exception) {
            // Request URL contains no instance (e.g. localhost) or we don't recognize the instance.
            return null;
        }
    }

    protected function redirectToInstance(InstanceInterface $desiredInstance): Response
    {
        $currentInstance = $this->instanceManager->getInstanceFromRequest();
        $currentUrl = $this->getRequest()->getUriString();
        $desiredUrl = str_replace(
            '//' . $currentInstance->getSubdomain() . '.', '//' . $desiredInstance->getSubdomain() . '.', $currentUrl);
        return $this->redirect()->toUrl($desiredUrl);
    }

    /**
     * @return Response|ViewModel
     * @throws HydraException
     */
    protected function renderLoginForm()
    {
        $form = new Login($this->translator);
        $messages = [];

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $form->setData($data);

            if ($form->isValid()) {
                $data = $form->getData();

                $result = $this->authenticationService->authenticateWithData(
                    $data['email'],
                    $data['password'],
                    $data['remember']
                );

                if ($result->isValid()) {
                    $user = $this->userManager->getUser(
                        $result->getIdentity()->getId()
                    );

                    $user->updateLoginData();
                    $this->userManager->persist($user);
                    $this->userManager->flush();
                    return $this->acceptLoginRequest((string)$user->getId(), [
                        'remember' => $data['remember'] == 1,
                        'remember_for' => 60 * 60, // seconds
                    ]);
                }
                $messages = $result->getMessages();
            }
        }

        // show login form if GET and no skip or if post and failed login

        $view = new ViewModel([
            'form' => $form,
            'errorMessages' => $messages,
            'loginChallenge' => $this->getChallenge(),
        ]);

        $this->layout('layout/1-col');
        $view->setTemplate('authentication/login');
        return $view;
    }

    /**
     * @param string $subject
     * @param array $extra
     * @return Response
     * @throws HydraException
     */
    protected function acceptLoginRequest($subject, array $extra = [])
    {
        $acceptResponse = $this->hydraService->acceptLoginRequest(
            $this->getChallenge(),
            array_merge(
                [
                    'subject' => $subject,
                ],
                $extra
            )
        );
        return $this->redirect()->toUrl($acceptResponse['redirect_to']);
    }

    protected function getChallenge()
    {
        return $this->params()->fromQuery('login_challenge');
    }
}
