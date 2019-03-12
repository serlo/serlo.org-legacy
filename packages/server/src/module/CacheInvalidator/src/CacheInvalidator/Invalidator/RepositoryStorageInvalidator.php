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
namespace CacheInvalidator\Invalidator;

use Doctrine\Common\Collections\Collection;
use Entity\Entity\EntityInterface;
use Page\Entity\PageRepositoryInterface;
use StrokerCache\Service\CacheService;
use Taxonomy\Entity\TaxonomyTermInterface;
use Zend\Cache\Storage\FlushableInterface;
use Zend\Cache\Storage\StorageInterface;
use Zend\EventManager\Event;

class RepositoryStorageInvalidator implements InvalidatorInterface
{

    /**
     * @var StorageInterface
     */
    protected $storage;

    /**
     * @var CacheService
     */
    protected $cacheService;


    /**
     * @param CacheService     $cacheService
     * @param StorageInterface $storage
     */
    public function __construct(CacheService $cacheService, StorageInterface $storage)
    {
        $this->storage      = $storage;
        $this->cacheService = $cacheService;
    }

    /**
     * @param Event  $e
     * @param string $class
     * @param string $event
     * @return void
     */
    public function invalidate(Event $e, $class, $event)
    {
        $repository = $e->getParam('repository');
        $result     = false;
        if ($repository instanceof EntityInterface) {
            $result = $this->cacheService->clearByTags(['route_entity/page', 'param_entity_' . $repository->getId()]);
            $this->clearTaxonomyTerms($repository->getTaxonomyTerms());
        } elseif ($repository instanceof PageRepositoryInterface) {
            $result = $this->cacheService->clearByTags(['route_page/view', 'param_page_' . $repository->getId()]);
        }
        if ($this->storage instanceof FlushableInterface && !$result) {
            $this->storage->flush();
        }
    }

    protected function clearTaxonomyTerms(Collection $collection)
    {
        foreach ($collection as $term) {
            if ($term instanceof TaxonomyTermInterface) {
                $this->cacheService->clearByTags(['route_taxonomy/term/get', 'param_term_' . $term->getId()]);
            }
        }
    }
}
