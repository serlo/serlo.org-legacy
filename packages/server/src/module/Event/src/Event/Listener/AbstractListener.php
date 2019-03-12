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
namespace Event\Listener;

use Common\Listener\AbstractSharedListenerAggregate;
use Event\EventManagerAwareTrait;
use Event\EventManagerInterface;
use Event\Exception\RuntimeException;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use User\Manager\UserManagerAwareTrait;
use User\Manager\UserManagerInterface;
use Uuid\Entity\UuidInterface;

abstract class AbstractListener extends AbstractSharedListenerAggregate
{
    use EventManagerAwareTrait, InstanceManagerAwareTrait, UserManagerAwareTrait;

    public function __construct(
        EventManagerInterface $eventManager,
        InstanceManagerInterface $instanceManager,
        UserManagerInterface $userManager
    ) {
        if (!class_exists($this->getMonitoredClass())) {
            throw new RuntimeException(sprintf(
                'The class you are trying to attach to does not exist: %s',
                $this->getMonitoredClass()
            ));
        }
        $this->eventManager    = $eventManager;
        $this->instanceManager = $instanceManager;
        $this->userManager     = $userManager;
    }

    public function logEvent($name, InstanceInterface $instance, $uuid, array $params = [])
    {
        $this->getEventManager()->logEvent($name, $instance, $uuid, $params);
    }
}
