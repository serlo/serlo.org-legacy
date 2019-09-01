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

namespace Notification\Controller;

use Notification\NotificationWorker;
use Zend\Log\LoggerInterface;
use Zend\Mvc\Controller\AbstractActionController;

class WorkerController extends AbstractActionController
{
    /**
     * @var NotificationWorker
     */
    protected $notificationWorker;
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var string
     */
    protected $secret;

    /**
     * @param LoggerInterface $logger
     * @param NotificationWorker $notificationWorker
     */
    public function __construct(
        LoggerInterface $logger,
        NotificationWorker $notificationWorker,
        string $secret
    ) {
        $this->logger = $logger;
        $this->notificationWorker = $notificationWorker;
        $this->secret = $secret;
    }

    public function runAction()
    {
        $response = $this->response;
        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            if ($data['secret'] === $this->secret) {
                $this->logger->info('Notification worker started.');
                $user = $data['user'];
                try {
                    $this->notificationWorker->run($user);
                    $this->notificationWorker->getObjectManager()->flush();
                    $this->logger->info('Notification worker finished successfully.');
                    $response->setStatusCode(200);
                } catch (\Exception $e) {
                    $this->logger->err('Notification worker failed with message ' . $e->getMessage());
                    $response->setStatusCode(500);
                }
            } else {
                $response->setStatusCode(401);
            }
        } else {
            $response->setStatusCode(404);
        }
        return $response;
    }
}
