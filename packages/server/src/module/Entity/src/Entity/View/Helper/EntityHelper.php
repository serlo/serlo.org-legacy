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
namespace Entity\View\Helper;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Entity\Exception;
use Entity\Options\ModuleOptionsAwareTrait;
use Zend\View\Helper\AbstractHelper;

class EntityHelper extends AbstractHelper
{
    use ModuleOptionsAwareTrait;

    public function __invoke()
    {
        return $this;
    }

    public function findSubject(EntityInterface $entity)
    {
        $subject = $this->findTaxonomyTerm($entity, 'subject');
        return $subject ? $subject->getName() : '';
    }

    public function findTaxonomyTerm(EntityInterface $entity, $type)
    {
        /* @var $term \Taxonomy\Entity\TaxonomyTermInterface */
        foreach ($entity->getTaxonomyTerms() as $term) {
            $ancestor = $term->findAncestorByTypeName($type);
            if ($ancestor) {
                return $ancestor;
            }
        }

        return null;
    }

    public function getVisible(Collection $entities)
    {
        return $entities->filter(
            function (EntityInterface $e) {
                if ($this->getView()->isGranted('login') && in_array($e->getType()->getName(), ['course', 'article', 'video', 'applet'])) {
                    $unrevised = ($e->hasHead() && $e->isUnrevised());
                    return !$e->isTrashed() && ($e->hasCurrentRevision() || $unrevised);
                } else {
                    return !$e->isTrashed() && $e->hasCurrentRevision();
                }
            }
        );
    }

    public function asTypeCollection(Collection $entities)
    {
        $types = [];
        foreach ($entities as $e) {
            $types[$e->getType()->getName()][] = $e;
        }

        return new ArrayCollection($types);
    }

    public function getOptions(EntityInterface $entity)
    {
        return $this->getModuleOptions()->getType(
            $entity->getType()->getName()
        );
    }

    public function isOryEditorFormat(RevisionInterface $revision)
    {
        $parsed = json_decode($revision->get('content'), true);
        return $parsed !== null && isset($parsed['cells']);
    }
}
