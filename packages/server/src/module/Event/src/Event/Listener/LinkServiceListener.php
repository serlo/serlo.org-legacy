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

class LinkServiceListener extends AbstractListener
{
    public function onLink(Event $e)
    {
        $entity   = $e->getParam('entity');
        $user     = $this->getUserManager()->getUserFromAuthenticator();
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        $params = [
            [
                'name'  => 'parent',
                'value' => $e->getParam('parent'),
            ],
        ];

        $this->logEvent('entity/link/create', $instance, $entity, $params);
    }

    public function onUnLink(Event $e)
    {
        $entity   = $e->getParam('entity');
        $user     = $this->getUserManager()->getUserFromAuthenticator();
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        $params = [
            [
                'name'  => 'parent',
                'value' => $e->getParam('parent'),
            ],
        ];

        $this->logEvent('entity/link/remove', $instance, $entity, $params);
    }

    public function attachShared(\Zend\EventManager\SharedEventManagerInterface $events)
    {
        $this->listeners[] = $events->attach(
            $this->getMonitoredClass(),
            'unlink',
            [
                $this,
                'onUnlink',
            ]
        );

        $this->listeners[] = $events->attach(
            $this->getMonitoredClass(),
            'link',
            [
                $this,
                'onLink',
            ]
        );
    }

    protected function getMonitoredClass()
    {
        return 'Link\Service\LinkService';
    }
}
