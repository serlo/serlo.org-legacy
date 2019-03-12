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
namespace Taxonomy\Manager;

use Common\ObjectManager\Flushable;
use Doctrine\Common\Collections\Collection;
use Instance\Entity\InstanceInterface;
use Taxonomy\Entity\TaxonomyInterface;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Form\TermForm;
use Zend\EventManager\EventManagerAwareInterface;
use Zend\Form\FormInterface;

interface TaxonomyManagerInterface extends Flushable, EventManagerAwareInterface
{
    /**
     * @param int|TaxonomyTermInterface  $term
     * @param TaxonomyTermAwareInterface $with
     * @param int|null                   $position
     * @return self
     */
    public function associateWith($term, TaxonomyTermAwareInterface $with, $position = null);

    /**
     * @param TermForm $termForm
     * @return TaxonomyTermInterface
     */
    public function createRoot(TermForm $termForm);

    /**
     * @param FormInterface $form
     * @return mixed
     */
    public function createTerm(FormInterface $form);

    /**
     * @param bool $bypassInstanceIsolation
     * @return TaxonomyTermInterface[]|Collection
     */
    public function findAllTerms($bypassInstanceIsolation = false);

    /**
     * @param string            $name
     * @param InstanceInterface $instance
     * @return TaxonomyInterface
     */
    public function findTaxonomyByName($name, InstanceInterface $instance);

    /**
     * @param InstanceInterface $instance
     * @return TaxonomyInterface[]
     */
    public function findAllTaxonomies(InstanceInterface $instance);

    /**
     * @param TaxonomyInterface $taxonomy
     * @param array             $ancestors
     * @return TaxonomyTermInterface
     */
    public function findTermByName(TaxonomyInterface $taxonomy, array $ancestors);

    /**
     * @param int $id
     * @return TaxonomyInterface
     */
    public function getTaxonomy($id);

    /**
     * @param int $id
     * @return TaxonomyTermInterface
     */
    public function getTerm($id);

    /**
     * @param int|TaxonomyTermInterface  $term
     * @param TaxonomyTermAwareInterface $object
     * @return mixed
     */
    public function isAssociableWith($term, TaxonomyTermAwareInterface $object);

    /**
     * @param int|TaxonomyTermInterface  $term
     * @param TaxonomyTermAwareInterface $object
     */
    public function removeAssociation($term, TaxonomyTermAwareInterface $object);

    /**
     * @param FormInterface $form
     * @return mixed
     */
    public function updateTerm(FormInterface $form);
}
