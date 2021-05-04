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

namespace Api\Listener;

use Link\Service\LinkService;
use Taxonomy\Entity\TaxonomyTermInterface;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class LinkServiceListener extends AbstractListener
{
    public function onLinkChange(Event $e)
    {
        /** @var UuidInterface $uuid */
        $child = $e->getParam('entity');
        // Only update child when it is not newly created
        if ($child->getId()) {
            $this->getApiManager()->setUuid($child);
        }

        /** @var UuidInterface $uuid */
        $parent = $e->getParam('parent');
        $this->getApiManager()->setUuid($parent);
    }

    public function onChange(Event $e)
    {
        /** @var TaxonomyTermInterface $term */
        $term = $e->getParam('term');
        $this->getApiManager()->setUuid($term);
    }

    public function onSortChildren(Event $e)
    {
        /** @var UuidInterface $parent */
        $parent = $e->getParam('parent');
        $this->getApiManager()->removeUuid($parent->getId());
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'unlink',
            [$this, 'onLinkChange'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'link',
            [$this, 'onLinkChange'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'sortChildren',
            [$this, 'onSortChildren'],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return LinkService::class;
    }
}
