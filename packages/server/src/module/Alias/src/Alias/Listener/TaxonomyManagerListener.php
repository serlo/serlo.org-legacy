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
namespace Alias\Listener;

use Alias\AliasManagerInterface;
use Normalizer\NormalizerInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class TaxonomyManagerListener extends AbstractListener
{
    /**
     * @var NormalizerInterface
     */
    protected $normalizer;

    /**
     * @param AliasManagerInterface $aliasManager
     * @param NormalizerInterface   $normalizer
     */
    public function __construct(AliasManagerInterface $aliasManager, NormalizerInterface $normalizer)
    {
        $this->normalizer = $normalizer;
        parent::__construct($aliasManager);
    }

    /**
     * Attach one or more listeners
     * Implementors may add an optional $priority argument; the SharedEventManager
     * implementation will pass this to the aggregate.
     *
     * @param SharedEventManagerInterface $events
     * @return void
     */
    public function attachShared(SharedEventManagerInterface $events)
    {
        $class = $this->getMonitoredClass();
        $events->attach($class, 'create', [$this, 'doAliases']);
        $events->attach($class, 'update', [$this, 'doAliases']);
    }

    /**
     * @param Event $e
     * @return void
     */
    public function doAliases(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term = $e->getParam('term');
        $this->process($term);
    }

    /**
     * Returns the class, this listener is listening on
     *
     * @return string
     */
    protected function getMonitoredClass()
    {
        return 'Taxonomy\Manager\TaxonomyManager';
    }

    protected function process(TaxonomyTermInterface $term)
    {
        if (!$term->hasParent()) {
            return;
        }

        if ($term->getId() === null) {
            $this->getAliasManager()->flush($term);
        }

        $instance    = $term->getInstance();
        $normalizer  = $this->normalizer->normalize($term);
        $routeName   = $normalizer->getRouteName();
        $routeParams = $normalizer->getRouteParams();
        $router      = $this->getAliasManager()->getRouter();
        $url         = $router->assemble($routeParams, ['name' => $routeName]);
        $this->getAliasManager()->autoAlias('taxonomyTerm', $url, $term, $instance);

        foreach ($term->getChildren() as $child) {
            $this->process($child);
        }
    }
}
