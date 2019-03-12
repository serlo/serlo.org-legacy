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
namespace Subject\Manager;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Instance\Entity\InstanceInterface;
use Normalizer\Normalizer;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Manager\TaxonomyManagerAwareTrait;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Versioning\Entity\RepositoryInterface;
use Zend\Cache\Storage\StorageInterface;
use Entity\Manager\EntityManagerInterface;

class SubjectManager implements SubjectManagerInterface
{
    use TaxonomyManagerAwareTrait;

    /**
     * @var StorageInterface
     */
    protected $storage;

    /**
     * @var Normalizer
     */
    protected $normalizer;

    /**
     * @var EntityManagerInterface
     */
    protected $entityManager;

    public function __construct(Normalizer $normalizer, StorageInterface $storage, TaxonomyManagerInterface $taxonomyManager, EntityManagerInterface $entityManager)
    {
        $this->taxonomyManager = $taxonomyManager;
        $this->storage = $storage;
        $this->normalizer = $normalizer;
        $this->entityManager = $entityManager;
    }

    public function findSubjectByString($name, InstanceInterface $instance)
    {
        $taxonomy = $this->getTaxonomyManager()->findTaxonomyByName('subject', $instance);
        $term = $this->getTaxonomyManager()->findTermByName($taxonomy, (array) $name);
        return $term;
    }

    public function findSubjectsByInstance(InstanceInterface $instance)
    {
        $taxonomy = $this->getTaxonomyManager()->findTaxonomyByName('subject', $instance);
        return $taxonomy->getChildren();
    }

    public function getSubject($id)
    {
        $term = $this->getTaxonomyManager()->getTerm($id);
        return $term;
    }

    public function getTrashedEntities(TaxonomyTermInterface $term)
    {
        $key = 'trashed:' . hash('sha256', serialize($term));
        if ($this->storage->hasItem($key)) {
            return $this->storage->getItem($key);
        }

        $entities = $this->getEntities($term);
        $collection = new ArrayCollection();
        $this->iterEntities($entities, $collection, 'isTrashed');
        $this->storage->setItem($key, $collection);
        return $collection;
    }

    protected function isTrashed(EntityInterface $entity, Collection $collection)
    {
        if ($entity->getTrashed()) {
            // Todo undirtify, this is needed because we can't cache doctrine models (where are your proxies now?)
            $normalized = $this->normalizer->normalize($entity);
            $collection->add($normalized);
        }
    }

    public function getUnrevisedRevisions(TaxonomyTermInterface $term)
    {
        $revisions = $this->entityManager->findAllUnrevisedRevisions();

        // collection for filtered entities by $term
        $filteredRevisions = new ArrayCollection();
        $recentTimestampsPerEntity = new ArrayCollection();

        // find all entities where $term matches (also in parents)
        foreach ($revisions as $revision) {
            if ($this->isInSubject($revision->getRepository(), $term)) {
                $normalized = $this->normalizer->normalize($revision);
                $filteredRevisions->add($revision);
                $entityId = $revision->getRepository()->getId();
                $recentTimestampsPerEntity->set(
                    $entityId,
                    max($normalized->getMetadata()->getCreationDate()->getTimestamp(), $recentTimestampsPerEntity->get($entityId))
                );
            }
        }

        $iterator = $filteredRevisions->getIterator();
        $iterator->uasort(function ($revisionA, $revisionB) use ($recentTimestampsPerEntity) {
            /**
             * @var RevisionInterface $revisionA
             * @var RevisionInterface $revisionB
             */
            $entityA = $revisionA->getRepository();
            $entityB = $revisionB->getRepository();
            if ($entityA !== $entityB) {
                return $recentTimestampsPerEntity->get($entityB->getId()) - $recentTimestampsPerEntity->get($entityA->getId());
            } else {
                return $revisionB->getId() - $revisionA->getId();
            }
        });
        $collection = new ArrayCollection(iterator_to_array($iterator));
        return $collection;
    }

    protected function isInSubject(EntityInterface $entity, TaxonomyTermInterface $term)
    {
        if (!$entity->getTaxonomyTerms()->isEmpty()) {
            foreach ($entity->getTaxonomyTerms() as $tempTerm) {
                if ($tempTerm->knowsAncestor($term)) {
                    return true;
                }
            }
        } else {
            foreach ($entity->getParents('link') as $parent) {
                if ($this->isInSubject($parent, $term)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected function getEntities(TaxonomyTermInterface $term)
    {
        return $term->getAssociatedRecursive('entities');
    }

    protected function iterEntities(Collection $entities, Collection $collection, $callback)
    {
        foreach ($entities as $entity) {
            // Todo undirtify, this is needed because we can't cache doctrine models (where are your proxies now?)
            $this->$callback($entity, $collection);
            $this->iterLinks($entity, $collection, $callback);
        }
    }

    protected function iterLinks(EntityInterface $entity, $collection, $callback)
    {
        $this->iterEntities($entity->getChildren('link'), $collection, $callback);
    }
}
