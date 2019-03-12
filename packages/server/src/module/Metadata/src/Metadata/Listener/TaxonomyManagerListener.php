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
namespace Metadata\Listener;

use Metadata\Exception\DuplicateMetadata;
use Metadata\Exception\MetadataNotFoundException;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class TaxonomyManagerListener extends AbstractListener
{
    public function onCreate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term = $e->getParam('term');

        if ($term->hasParent()) {
            $parent = $term->getParent();
            $this->addMetadata($parent, $term);
        }
    }

    protected function addMetadata(UuidInterface $object, TaxonomyTermInterface $term)
    {
        while ($term->hasParent()) {
            try {
                $this->getMetadataManager()->addMetadata(
                    $object,
                    $term->getTaxonomy()->getName(),
                    $term->getName()
                );
            } catch (DuplicateMetadata $e) {
            }
            $term = $term->getParent();
        }
    }

    public function onUpdate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term = $e->getParam('term');

        if ($term->hasParent()) {
            $parent = $term->getParent();
            $this->addMetadata($parent, $term);
        }
    }

    public function onAssociate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term   = $e->getParam('term');
        $object = $e->getParam('object');

        if ($object instanceof TaxonomyTermAwareInterface && $object instanceof UuidInterface) {
            $this->addMetadata($object, $term);
        }
    }

    public function onDissociate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term   = $e->getParam('term');
        $object = $e->getParam('object');

        if ($object instanceof TaxonomyTermAwareInterface && $object instanceof UuidInterface) {
            $this->removeMetadata($object, $term);
        }
    }

    protected function removeMetadata($object, TaxonomyTermInterface $term)
    {
        while ($term->hasParent()) {
            try {
                $metadata = $this->getMetadataManager()->findMetadataByObjectAndKeyAndValue(
                    $object,
                    $term->getTaxonomy()->getName(),
                    $term->getName()
                );
                $this->getMetadataManager()->removeMetadata($metadata->getId());
            } catch (MetadataNotFoundException $e) {
            }
            $term = $term->getParent();
        }
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $monitoredClass = $this->getMonitoredClass();
        $events->attach($monitoredClass, 'create', [$this, 'onCreate']);
        $events->attach($monitoredClass, 'update', [$this, 'onUpdate']);
        $events->attach($monitoredClass, 'associate', [$this, 'onAssociate']);
        $events->attach($monitoredClass, 'dissociate', [$this, 'onDissociate']);
    }

    protected function getMonitoredClass()
    {
        return 'Taxonomy\Manager\TaxonomyManager';
    }
}
