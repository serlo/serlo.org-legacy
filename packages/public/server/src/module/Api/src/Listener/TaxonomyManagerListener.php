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

use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Manager\TaxonomyManager;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class TaxonomyManagerListener extends AbstractListener
{
    public function onAssociationChange(Event $e)
    {
        /** @var UuidInterface $uuid */
        $uuid = $e->getParam('object');

        // `setUuid` and `setTaxonomyTerm` don't work for newly created entities. Instead, this update logic is
        // handled in `LicenseManagerListener#onInject`
        $newlyCreated = !$uuid->getId();
        if ($newlyCreated) {
            return;
        }

        $this->getApiManager()->removeUuid($uuid);

        /** @var TaxonomyTermInterface $term */
        $term = $e->getParam('term');
        $this->getApiManager()->setUuid($term);
    }

    public function onChange(Event $e)
    {
        /** @var TaxonomyTermInterface $term */
        $term = $e->getParam('term');
        $this->getApiManager()->setUuid($term);
    }

    public function onParentChange(Event $e)
    {
        /** @var TaxonomyTermInterface|null $term */
        $from = $e->getParam('from');
        if ($from) {
            $this->getApiManager()->setUuid($from);
        }

        /** @var TaxonomyTermInterface|null $term */
        $to = $e->getParam('to');
        if ($to) {
            $this->getApiManager()->setUuid($from);
        }
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'associate',
            [$this, 'onAssociationChange'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'dissociate',
            [$this, 'onAssociationChange'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'create',
            [$this, 'onChange'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'update',
            [$this, 'onChange'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'parent.change',
            [$this, 'onParentChange'],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return TaxonomyManager::class;
    }
}
