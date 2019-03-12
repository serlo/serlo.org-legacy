<?php
/**
 * This file is part of Athene2.
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
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace Notification\Controller;

use Notification\Exception\RuntimeException;
use Notification\SubscriptionManagerInterface;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use ZfcRbac\Exception\UnauthorizedException;
use ZfcRbac\Service\AuthorizationService;

class SubscriptionController extends AbstractActionController
{

    /**
     * @var SubscriptionManagerInterface
     */
    protected $subscriptionManager;

    /**
     * @var UuidManagerInterface
     */
    protected $uuidManager;

    /**
     * @var AuthorizationService
     */
    protected $authorizationService;

    public function __construct(
        AuthorizationService $authorizationService,
        UuidManagerInterface $uuidManager,
        SubscriptionManagerInterface $subscriptionManager
    ) {
        $this->subscriptionManager  = $subscriptionManager;
        $this->uuidManager          = $uuidManager;
        $this->authorizationService = $authorizationService;
    }

    public function manageAction()
    {
        if ($this->authorizationService->getIdentity() === null) {
            throw new UnauthorizedException;
        }

        $user          = $this->authorizationService->getIdentity();
        $subscriptions = $this->subscriptionManager->findSubscriptionsByUser($user);
        $view          = new ViewModel(['subscriptions' => $subscriptions]);
        $view->setTemplate('notification/subscription/manage');
        return $view;
    }

    public function subscribeAction()
    {
        if (!$this->authorizationService->getIdentity()) {
            throw new UnauthorizedException;
        }

        $object = $this->params('object');
        $email  = $this->params('email');
        $user   = $this->authorizationService->getIdentity();

        try {
            $object = $this->uuidManager->getUuid($object);
        } catch (NotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->subscriptionManager->subscribe($user, $object, $email);
        $this->subscriptionManager->flush();
        $this->flashMessenger()->addSuccessMessage('You are now receiving notifications for this content.');
        return $this->redirect()->toReferer();
    }

    public function updateAction()
    {
        if (!$this->authorizationService->getIdentity()) {
            throw new UnauthorizedException;
        }

        $object = $this->params('object');
        $email  = $this->params('email', false);
        $user   = $this->authorizationService->getIdentity();

        try {
            $object = $this->uuidManager->getUuid($object);
            $this->subscriptionManager->update($user, $object, $email);
            $this->subscriptionManager->flush();
            $this->flashMessenger()->addSuccessMessage('Your subscription has been updated successfully.');
        } catch (NotFoundException $e) {
            $this->flashMessenger()->addErrorMessage('The object you are trying to subscribe to does not exist.');
        } catch (RuntimeException $e) {
            $this->flashMessenger()->addErrorMessage(
                'You can\'t update your subscription because you did not subscribe to this object.'
            );
        }

        return $this->redirect()->toReferer();
    }

    public function unsubscribeAction()
    {
        if (!$this->authorizationService->getIdentity()) {
            throw new UnauthorizedException;
        }

        $object = $this->params('object');
        $user   = $this->authorizationService->getIdentity();

        try {
            $object = $this->uuidManager->getUuid($object);
        } catch (NotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->subscriptionManager->unSubscribe($user, $object);
        $this->subscriptionManager->flush();
        $this->flashMessenger()->addSuccessMessage('You are no longer receiving notifications for this content.');
        return $this->redirect()->toReferer();
    }
}
