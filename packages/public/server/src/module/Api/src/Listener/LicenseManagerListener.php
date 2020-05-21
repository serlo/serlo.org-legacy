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

use License\Entity\LicenseInterface;
use License\Manager\LicenseManager;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class LicenseManagerListener extends AbstractListener
{
    public function onInjectLicense(Event $e)
    {
        /** @var UuidInterface $uuid */
        $uuid = $e->getParam('object');
        $this->getApiManager()->setUuid($uuid);

        $newlyCreated = $e->getParam('newlyCreated');
        if ($newlyCreated) {
            $taxonomyTerms = $uuid->getTaxonomyTerms()->toArray();
            foreach ($taxonomyTerms as $term) {
                $this->getApiManager()->setTaxonomyTerm($term);
            }
        }
    }

    public function onChange(Event $e)
    {
        /** @var LicenseInterface $license */
        $license = $e->getParam('license');
        $this->getApiManager()->setLicense($license);
    }

    public function onRemove(Event $e)
    {
        /** @var LicenseInterface $license */
        $license = $e->getParam('license');
        $this->getApiManager()->removeLicense($license->getId());
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'inject',
            [$this, 'onInjectLicense'],
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
            'remove',
            [$this, 'onRemove'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'update',
            [$this, 'onChange'],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return LicenseManager::class;
    }
}
