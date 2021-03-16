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

namespace Api\Controller;

use Api\Manager\E2ETestsHelperApiManager;
use Api\Manager\NotificationApiManager;
use Common\Traits\ControllerHelperTrait;
use Event\Entity\EventLogInterface;
use Zend\Cache\Storage\StorageInterface;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class E2ETestsHelperApiController extends AbstractActionController
{
    /** @var NotificationApiManager */
    protected $notificationApiManager;
    /** @var E2ETestsHelperApiManager */
    protected $e2eManager;
    /** @var  StorageInterface */
    protected $storage;
    /** @var bool */
    protected $isActive;
    protected $lastEventIdKey = 'last-event-id';

    use ControllerHelperTrait;

    public function __construct(
        bool $isActive,
        NotificationApiManager $notificationApiManager,
        E2ETestsHelperApiManager $e2eManager,
        StorageInterface $storage
    ) {
        $this->isActive = $isActive;
        $this->notificationApiManager = $notificationApiManager;
        $this->e2eManager = $e2eManager;
        $this->storage = $storage;

        if (
            $this->isActive &&
            !$this->storage->hasItem($this->lastEventIdKey)
        ) {
            $this->setUp();
        }
    }

    protected function setUp()
    {
        $this->storage->setItem(
            $this->lastEventIdKey,
            $this->e2eManager->getLastEvent()->getId()
        );
    }

    public function setUpAction()
    {
        if ($this->isActive) {
            $this->setUp();

            $this->getResponse()->setStatusCode(Response::STATUS_CODE_200);
            return $this->getResponse();
        } else {
            return $this->notFoundResponse();
        }
    }

    public function eventsSinceSetUpAction()
    {
        if (
            !$this->isActive ||
            !$this->storage->hasItem($this->lastEventIdKey)
        ) {
            return $this->notFoundResponse();
        }

        $lastEventId = $this->storage->getItem($this->lastEventIdKey);
        $events = $this->e2eManager->getEventsAfter($lastEventId);

        return new JsonModel([
            'events' => array_map(function (EventLogInterface $event) {
                return $this->notificationApiManager->getEventDataById(
                    $event->getId()
                );
            }, $events),
        ]);
    }
}
