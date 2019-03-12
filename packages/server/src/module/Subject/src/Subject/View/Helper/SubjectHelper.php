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
namespace Subject\View\Helper;

use Common\Filter\Slugify;
use Subject\Options\ModuleOptions;
use Taxonomy\Entity\TaxonomyTermInterface;
use Zend\View\Helper\AbstractHelper;

class SubjectHelper extends AbstractHelper
{

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @var Slugify
     */
    protected $filter;

    public function __construct()
    {
        $this->filter = new Slugify();
    }

    /**
     * @return self
     */
    public function __invoke()
    {
        return $this;
    }

    /**
     * @param TaxonomyTermInterface $subject
     * @return \Subject\Options\SubjectOptions
     */
    public function getOptions(TaxonomyTermInterface $subject)
    {
        return $this->getModuleOptions()->getInstance($subject->getName(), $subject->getInstance()->getName());
    }

    /**
     * @return ModuleOptions
     */
    public function getModuleOptions()
    {
        return $this->moduleOptions;
    }

    /**
     * @param ModuleOptions $moduleOptions
     */
    public function setModuleOptions(ModuleOptions $moduleOptions)
    {
        $this->moduleOptions = $moduleOptions;
    }

    /**
     * @param TaxonomyTermInterface $term
     * @param string                $parent
     * @return string
     */
    public function slugify(TaxonomyTermInterface $term, $parent = 'subject')
    {
        return $this->filter->filter(substr($this->processSlugs($term, $parent), 0, -1));
    }

    /**
     * @param TaxonomyTermInterface $term
     * @param string                $parent
     * @return string
     */
    protected function processSlugs(TaxonomyTermInterface $term, $parent)
    {
        return ($term->getTaxonomy()->getName() != $parent) ? $this->processSlugs(
            $term->getParent(),
            $parent
            ) . $term->getName() . '/' : '';
    }
}
