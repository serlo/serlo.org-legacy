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

namespace User\Controller;

use FeatureFlags\Service as FeatureFlagsService;
use Instance\Manager\InstanceManagerAwareTrait;
use User\Exception\UserNotFoundException;
use User\Form\SettingsForm;
use Zend\Form\Form;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use ZfcRbac\Exception\UnauthorizedException;

class UserController extends AbstractUserController
{
    use InstanceManagerAwareTrait;

    protected $forms = [
        'register' => 'User\Form\Register',
        'login' => 'User\Form\Login',
        'user_select' => 'User\Form\SelectUserForm',
        'restore_password' => 'User\Form\LostPassword',
        'settings' => 'User\Form\SettingsForm',
    ];

    /**
     * @var FeatureFlagsService
     */
    protected $featureFlags;

    public function __construct(FeatureFlagsService $featureFlags)
    {
        $this->featureFlags = $featureFlags;
    }

    public function meAction()
    {
        $user = $this->getUserManager()->getUserFromAuthenticator();

        if (!$user) {
            throw new UnauthorizedException();
        }
        $view = new ViewModel(['user' => $user]);
        $view->setTemplate('user/user/profile');
        return $view;
    }

    public function profileAction()
    {
        try {
            $id = $this->params('id');
            if (is_numeric($id)) {
                $user = $this->getUserManager()->getUser($id);
            } else {
                $user = $this->getUserManager()->findUserByUsername($id);
            }
        } catch (UserNotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }
        $view = new ViewModel(['user' => $user]);
        $view->setTemplate('user/user/profile');
        return $view;
    }

    public function registerAction()
    {
        if ($this->getUserManager()->getUserFromAuthenticator()) {
            return $this->redirect()->toUrl($this->params('ref', '/'));
        }

        $this->layout('layout/1-col');
        $form = $this->getForm('register');

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $form->setData($data);
            if ($form->isValid()) {
                $data = $form->getData();
                $user = $this->getUserManager()->createUser($data);
                $this->getUserManager()->mergeFields($user, [
                    'interests' => $data['interests'],
                ]);

                $this->getEventManager()->trigger('register', $this, [
                    'user' => $user,
                    'instance' => $this->getInstanceManager()->getInstanceFromRequest(),
                    'data' => $data,
                ]);

                $this->getUserManager()->persist($user);
                $this->getUserManager()->flush();
                $this->flashMessenger()->addSuccessMessage(
                    'You have registered successfully and' .
                        ' will soon receive an email with instructions on' .
                        ' how to activate your account.'
                );
                return $this->redirect()->toUrl(
                    $this->params('ref', '/') . '#just-registered'
                );
            }
        }

        $view = new ViewModel([
            'form' => $form,
        ]);

        return $view;
    }

    public function getForm($name)
    {
        if (!is_object($this->forms[$name])) {
            $form = $this->forms[$name];
            if ($name === 'register') {
                $this->forms[$name] = $this->getServiceLocator()->get($form);
            } elseif ($name === 'settings') {
                $this->forms[$name] = new $form(
                    $this->getUserManager()->getObjectManager()
                );
            } elseif ($name === 'login') {
                $this->forms[$name] = new $form(
                    $this->getServiceLocator()->get('MvcTranslator')
                );
            } else {
                $this->forms[$name] = new $form();
            }
        }

        return $this->forms[$name];
    }

    /**
     * @param string $name
     * @param Form $form
     */
    public function setForm($name, Form $form)
    {
        $this->forms[$name] = $form;
    }

    public function settingsAction()
    {
        $user = $this->getUserManager()->getUserFromAuthenticator();
        if (!$user) {
            throw new UnauthorizedException();
        }

        if ($this->getRequest()->isPost()) {
            $data = json_decode($this->getRequest()->getContent(), true);
            $data = array_merge($data, [
                // TODO:,
                'email' => $user->getEmail(),
                'csrf' => $data['csrf'],
            ]);
            // TODO:
            $form = new SettingsForm(
                $this->getUserManager()->getObjectManager(),
                true /*, $data['email'] === $user->getEmail() */
            );
            $form->setData($data);
            if ($form->isValid()) {
                $data = $form->getData();
                // TODO:
                // $user->setEmail($data['email']);
                $user->setDescription($data['description']);
                $this->getUserManager()->persist($user);
                $this->getUserManager()->flush();
                $this->flashMessenger()->addSuccessMessage(
                    'Your profile has been saved'
                );
                $redirectUrl = $this->plugin('url')->fromRoute('user/me');
                return new JsonModel([
                    'success' => true,
                    'redirect' => $redirectUrl,
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'errors' => $form->getMessages(),
                ]);
            }
        }

        $data = [
            'description' => $user->getDescription(),
        ];
        $state = htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8');
        $view = new ViewModel(['state' => $state]);
        $view->setTemplate('user/user/settings');
        $this->layout('layout/3-col');
        return $view;
    }
}
