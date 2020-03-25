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

namespace ApiCache\Listener;

use Alias\AliasManager;
use Alias\Entity\AliasInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class AliasManagerListener extends AbstractListener
{
    public function onCreate(Event $e)
    {
        /** @var AliasInterface $alias */
        $alias = $e->getParam('alias');
        $this->cache->purge($alias->getInstance()->getSubdomain() . '.serlo.org/api/alias/' . $alias->getAlias());
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'create',
            [
                $this,
                'onCreate',
            ],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return AliasManager::class;
    }
}
