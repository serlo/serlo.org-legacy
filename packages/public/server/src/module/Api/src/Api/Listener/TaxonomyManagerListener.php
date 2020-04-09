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
        /** @var UuidInterface $object */
        $object = $e->getParam('object');
        $this->getApiManager()->setUuid($object);

        /** @var TaxonomyTermInterface $term */
        $term = $e->getParam('term');
        $this->getApiManager()->setTaxonomyTerm($term);
    }

    public function onChange(Event $e)
    {
        /** @var TaxonomyTermInterface $term */
        $term = $e->getParam('term');
        $this->getApiManager()->setTaxonomyTerm($term);
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'associate',
            [
                $this,
                'onAssociationChange',
            ],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'dissociate',
            [
                $this,
                'onAssociationChange',
            ],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'create',
            [
                $this,
                'onChange',
            ],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'update',
            [
                $this,
                'onChange',
            ],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return TaxonomyManager::class;
    }
}
