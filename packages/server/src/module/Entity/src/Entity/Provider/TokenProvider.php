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
namespace Entity\Provider;

use Doctrine\Common\Collections\Collection;
use Entity\Entity\EntityInterface;
use Normalizer\NormalizerAwareTrait;
use Normalizer\NormalizerInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Strategy\BranchDecisionMakerStrategy;
use Taxonomy\Strategy\ShortestBranchDecisionMaker;
use Token\Provider\AbstractProvider;
use Token\Provider\ProviderInterface;
use Zend\ServiceManager\ServiceLocatorAwareTrait;

class TokenProvider extends AbstractProvider implements ProviderInterface
{
    use ServiceLocatorAwareTrait, NormalizerAwareTrait;

    /**
     * @var BranchDecisionMakerStrategy
     */
    protected $strategy;

    public function __construct(NormalizerInterface $normalizer, BranchDecisionMakerStrategy $strategy = null)
    {
        if (!$strategy) {
            $strategy = new ShortestBranchDecisionMaker();
        }
        $this->normalizer = $normalizer;
        $this->strategy   = $strategy;
    }

    public function getData()
    {
        $term = $this->strategy->findBranch($this->getObject()->getTaxonomyTerms());

        $path = $this->getObject()->getId();

        if ($term) {
            $path = $this->createPathFromTerm($term);
        } else {
            /** @var Collection|EntityInterface[] $parents */
            $parents = $this->getObject()->getParents('link');
            if ($parents->count()) {
                $term = $this->strategy->findBranch($parents->first()->getTaxonomyTerms());
                if ($term) {
                    $path = $this->createPathFromTerm($term);
                    $normalizedParent = $this->getNormalizer()->normalize($parents->first());
                    $path = $path . '/' . $normalizedParent->getTitle();
                }
            }
        }

        $normalized = $this->getNormalizer()->normalize($this->getObject());
        $title      = $normalized->getTitle();

        return [
            'path'  => $path,
            'title' => $title,
            'id'    => $this->getObject()->getId(),
        ];
    }

    private function createPathFromTerm(TaxonomyTermInterface $term)
    {
        $path = [];
        while ($term->hasParent()) {
            $path[] = $term->getName();
            $term = $term->getParent();
        }
        $path = array_reverse($path);
        $path = implode('/', $path);
        return $path;
    }

    protected function isValid(EntityInterface $object)
    {
    }

    protected function validObject($object)
    {
        $this->isValid($object);
    }
}
