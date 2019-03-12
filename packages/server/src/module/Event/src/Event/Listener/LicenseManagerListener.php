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

use Instance\Entity\InstanceProviderInterface;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class LicenseManagerListener extends AbstractListener
{
    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach($this->getMonitoredClass(), 'inject', [$this, 'onInject']);
    }

    protected function getMonitoredClass()
    {
        return 'License\Manager\LicenseManager';
    }

    public function onInject(Event $e)
    {
        $object = $e->getParam('object');
        if ($object instanceof InstanceProviderInterface && $object instanceof UuidInterface) {
            $this->logEvent('license/object/set', $object->getInstance(), $object);
        }
    }
}
