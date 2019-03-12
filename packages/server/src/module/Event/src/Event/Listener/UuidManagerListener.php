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

class UuidManagerListener extends AbstractListener
{
    public function onRestore(Event $e)
    {
        $object   = $e->getParam('object');
        $user     = $this->getUserManager()->getUserFromAuthenticator();
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        $this->logEvent('uuid/restore', $instance, $object);
    }

    public function onTrash(Event $e)
    {
        $object   = $e->getParam('object');
        $user     = $this->getUserManager()->getUserFromAuthenticator();
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        $this->logEvent('uuid/trash', $instance, $object);
    }

    public function attachShared(\Zend\EventManager\SharedEventManagerInterface $events)
    {
        $this->listeners[] = $events->attach(
            $this->getMonitoredClass(),
            'trash',
            [
                $this,
                'onTrash',
            ]
        );
        $this->listeners[] = $events->attach(
            $this->getMonitoredClass(),
            'restore',
            [
                $this,
                'onRestore',
            ]
        );
    }

    protected function getMonitoredClass()
    {
        return 'Uuid\Manager\UuidManager';
    }
}
