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

namespace Notification\Controller;

use FeatureFlags\Service;
use Notification\NotificationManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use ZfcRbac\Exception\UnauthorizedException;
use ZfcRbac\Service\AuthorizationService;

class NotificationController extends AbstractActionController
{
    /** @var Service */
    protected $featureFlags;
    /** @var NotificationManagerInterface */
    protected $notificationManager;
    /** @var AuthorizationService */
    protected $authorizationService;

    public function __construct(
        NotificationManagerInterface $notificationManager,
        AuthorizationService $authorizationService,
        Service $featureFlags
    ) {
        $this->notificationManager = $notificationManager;
        $this->authorizationService = $authorizationService;
        $this->featureFlags = $featureFlags;
    }

    public function readAction()
    {
        $user = $this->authorizationService->getIdentity();
        if ($user) {
            $this->notificationManager->markRead($user);
            $this->notificationManager->flush();
        }
        return new JsonModel([]);
    }

    public function meAction()
    {
        if (!$this->featureFlags->isEnabled('notifications')) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $user = $this->authorizationService->getIdentity();
        if (!isset($user)) {
            throw new UnauthorizedException;
        }

        $view = new ViewModel([]);
        $view->setTemplate('notification/me');
        return $view;
    }
}
