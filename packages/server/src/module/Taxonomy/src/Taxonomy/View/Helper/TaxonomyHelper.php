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
namespace Taxonomy\View\Helper;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Taxonomy\Entity\TaxonomyInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Exception;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Taxonomy\Options\ModuleOptions;
use Uuid\Filter\NotTrashedCollectionFilter;
use Zend\View\Helper\AbstractHelper;

class TaxonomyHelper extends AbstractHelper
{
    /**
     * @var \Taxonomy\Manager\TaxonomyManagerInterface
     */
    protected $taxonomyManager;
    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @param ModuleOptions            $moduleOptions
     * @param TaxonomyManagerInterface $taxonomyManager
     */
    public function __construct(ModuleOptions $moduleOptions, TaxonomyManagerInterface $taxonomyManager)
    {
        $this->moduleOptions   = $moduleOptions;
        $this->taxonomyManager = $taxonomyManager;
    }

    /**
     * @return self
     */
    public function __invoke()
    {
        return $this;
    }

    /**
     * @param TaxonomyTermInterface|TaxonomyInterface $object
     * @return TaxonomyTermInterface
     * @throws \Taxonomy\Exception\InvalidArgumentException
     */
    public function getAllowedChildren($object)
    {
        if ($object instanceof TaxonomyInterface) {
            $name = $object->getName();
        } elseif ($object instanceof TaxonomyTermInterface) {
            $name = $object->getTaxonomy()->getName();
        } else {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected $nameOrObject to be TaxonomyInterface, TaxonomyTermInterface or string but got "%s"',
                is_object($object) ? get_class($object) : gettype($object)
            ));
        }

        $taxonomies = [];
        $children   = $this->moduleOptions->getType($name)->getAllowedChildren();
        $instance   = $object->getInstance();
        foreach ($children as $child) {
            $taxonomies[] = $this->taxonomyManager->findTaxonomyByName($child, $instance);
        }

        return $taxonomies;
    }

    /**
     * @param TaxonomyTermInterface $term
     * @param string $type
     * @return string
     */
    public function getAncestorName(TaxonomyTermInterface $term, $type)
    {
        try {
            return $term->findAncestorByTypeName($type)->getName();
        } catch (Exception\TermNotFoundException $e) {
            return '';
        }
    }

    /**
     * @param TaxonomyTermInterface $term
     * @param string                $filter
     * @return int
     * @throws \Taxonomy\Exception\RuntimeException
     */
    public function countAssociations(TaxonomyTermInterface $term, $filter)
    {
        if ($filter === 'NotTrashed') {
            $filter = new NotTrashedCollectionFilter();
            return $term->countAssociations(null, $filter);
        } else {
            throw new Exception\RuntimeException();
        }
    }

    /**
     * @param TaxonomyInterface|TaxonomyTermInterface|string $nameOrObject
     * @throws Exception\InvalidArgumentException
     * @return \Taxonomy\Options\TaxonomyOptions
     */
    public function getOptions($nameOrObject)
    {
        if ($nameOrObject instanceof TaxonomyInterface) {
            $name = $nameOrObject->getName();
        } elseif ($nameOrObject instanceof TaxonomyTermInterface) {
            $name = $nameOrObject->getTaxonomy()->getName();
        } elseif (is_string($nameOrObject)) {
            $name = $nameOrObject;
        } else {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected $nameOrObject to be TaxonomyInterface, TaxonomyTermInterface or string but got "%s"',
                is_object($nameOrObject) ? get_class($nameOrObject) : gettype($nameOrObject)
            ));
        }

        return $this->moduleOptions->getType($name);
    }

    /**
     * @param TaxonomyTermInterface $term
     * @return TaxonomyTermInterface[]
     */
    public function flattenAncestors(TaxonomyTermInterface $term)
    {
        $ancestors = [];
        $current = $term;
        $i=0;
        while ($current->hasParent() && $current->getParent()->hasParent()) {
            $current = $current->getParent();
            $ancestors[$i] = $current;
            $i++;
        }
        return $ancestors;
    }
}
