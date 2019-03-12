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

use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class RepositoryManagerListener extends AbstractListener
{
    /**
     * @var array
     */
    protected $listeners = [];

    public function attachShared(SharedEventManagerInterface $events)
    {
        $class = $this->getMonitoredClass();
        $events->attach($class, 'commit', [$this, 'onAddRevision'], 1);
        $events->attach($class, 'checkout', [$this, 'onCheckout'], -1);
        $events->attach($class, 'reject', [$this, 'onReject'], -1);
    }

    protected function getMonitoredClass()
    {
        return 'Versioning\RepositoryManager';
    }

    public function onAddRevision(Event $e)
    {
        $repository = $e->getParam('repository');
        $revision   = $e->getParam('revision');
        $instance   = $repository->getInstance();

        $this->logEvent(
            'entity/revision/add',
            $instance,
            $revision,
            [
                [
                    'name'  => 'repository',
                    'value' => $repository,
                ],
            ]
        );
    }

    public function onCheckout(Event $e)
    {
        $revision   = $e->getParam('revision');
        $repository = $e->getParam('repository');
        $reason     = $e->getParam('reason');
        $instance   = $repository->getInstance();

        $this->logEvent(
            'entity/revision/checkout',
            $instance,
            $revision,
            [
                [
                    'name'  => 'repository',
                    'value' => $repository,
                ],
                [
                    'name'  => 'reason',
                    'value' => $reason,
                ],
            ]
        );
    }

    public function onReject(Event $e)
    {
        $revision   = $e->getParam('revision');
        $repository = $e->getParam('repository');
        $instance   = $repository->getInstance();
        $reason     = $e->getParam('reason');

        $this->logEvent(
            'entity/revision/reject',
            $instance,
            $revision,
            [
                [
                    'name'  => 'repository',
                    'value' => $repository,
                ],
                [
                    'name'  => 'reason',
                    'value' => $reason,
                ],
            ]
        );
    }
}
