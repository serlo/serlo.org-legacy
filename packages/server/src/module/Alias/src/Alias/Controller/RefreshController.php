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
namespace Alias\Controller;

use Alias\AliasManagerInterface;
use Entity\Manager\EntityManagerInterface;
use Normalizer\NormalizerInterface;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Uuid\Filter\NotTrashedCollectionFilter;
use Versioning\Filter\HasCurrentRevisionCollectionFilter;
use Zend\Console\Adapter\AdapterInterface;
use Zend\Console\Console;
use Zend\Mvc\Controller\AbstractConsoleController;

/**
 * A controller for controlling the index.
 */
class RefreshController extends AbstractConsoleController
{
    /**
     * @var AliasManagerInterface
     */
    protected $aliasManager;

    /**
     * @var TaxonomyManagerInterface
     */
    protected $taxonomyManager;

    /**
     * @var EntityManagerInterface
     */
    protected $entityManager;

    /**
     * @var NormalizerInterface
     */
    protected $normalizer;

    /**
     * @param AliasManagerInterface $aliasManager
     * @param TaxonomyManagerInterface $taxonomyManager
     * @param EntityManagerInterface $entityManager
     * @param NormalizerInterface $normalizer
     */
    public function __construct(
        AliasManagerInterface $aliasManager,
        TaxonomyManagerInterface $taxonomyManager,
        EntityManagerInterface $entityManager,
        NormalizerInterface $normalizer
    ) {
        $this->aliasManager = $aliasManager;
        $this->taxonomyManager = $taxonomyManager;
        $this->entityManager = $entityManager;
        $this->normalizer = $normalizer;
    }

    public function refreshAction()
    {
        $console = $this->getServiceLocator()->get('console');
        $percentile = $this->params()->fromRoute('percentile', 10);
        $skipTerms = $this->params()->fromRoute('skip-terms', false);
        $skipEntities = $this->params()->fromRoute('skip-entities', false);

        if (!$skipTerms) {
            $this->refreshTerms($console, $percentile);
        }
        if (!$skipEntities) {
            $this->refreshEntities($console, $percentile);
        }

        $this->aliasManager->flush();
        return "All done!\n";
    }

    protected function refreshTerms(AdapterInterface $console, $percentile)
    {
        $filter = new NotTrashedCollectionFilter();
        $terms = $this->taxonomyManager->findAllTerms(true);
        $terms = $filter->filter($terms);
        foreach ($terms as $term) {
            if (rand(0, 100) > $percentile) {
                continue;
            }
            $instance = $term->getInstance();
            $normalizer = $this->normalizer->normalize($term);
            $routeName = $normalizer->getRouteName();
            $routeParams = $normalizer->getRouteParams();
            $router = $this->aliasManager->getRouter();
            $url = $router->assemble($routeParams, ['name' => $routeName]);
            $alias = $this->aliasManager->autoAlias('taxonomyTerm', $url, $term, $instance);
            $console->writeLine('Updated taxonomy term ' . $term->getName() . ' (' . $term->getId() . '): ' . $alias->getAlias());
        }
    }

    protected function refreshEntities(AdapterInterface $console, $percentile)
    {
        $entities = $this->entityManager->findAll(true);
        $filter = new HasCurrentRevisionCollectionFilter();
        $entities = $filter->filter($entities);
        $filter = new NotTrashedCollectionFilter();
        $entities = $filter->filter($entities);
        foreach ($entities as $entity) {
            if (rand(0, 100) > $percentile) {
                continue;
            }
            $instance = $entity->getInstance();
            $url = $this->aliasManager->getRouter()->assemble(
                ['entity' => $entity->getId()],
                ['name' => 'entity/page']
            );
            $alias = $this->aliasManager->autoAlias('entity', $url, $entity, $instance);
            $console->writeLine('Updated entity ' . $entity->getId() . ': ' . $alias->getAlias());
        }
    }
}
