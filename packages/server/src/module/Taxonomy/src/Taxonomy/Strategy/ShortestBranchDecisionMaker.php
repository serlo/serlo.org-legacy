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
namespace Taxonomy\Strategy;

use Doctrine\Common\Collections\Collection;
use Taxonomy\Entity\TaxonomyTermInterface;

class ShortestBranchDecisionMaker implements BranchDecisionMakerStrategy
{
    /**
     * @param Collection|TaxonomyTermInterface[] $collection
     * @return TaxonomyTermInterface|null
     */
    public function findBranch(Collection $collection)
    {
        if (empty($collection)) {
            return null;
        }

        $maxDepth = 9999;
        $item     = $collection->first();
        foreach ($collection as $term) {
            $depth = $this->iterBranch($term, $maxDepth);
            if ($depth < $maxDepth) {
                $maxDepth = $depth;
                $item     = $term;
            }
        }
        return $item;
    }

    protected function iterBranch(TaxonomyTermInterface $term, $maxDepth)
    {
        $currDepth = 0;
        while ($term->hasParent()) {
            if ($term->isTrashed()) {
                return $maxDepth;
            }

            $term = $term->getParent();
            $currDepth++;

            if ($currDepth >= $maxDepth) {
                return $currDepth;
            }
        }
        return $currDepth;
    }
}
