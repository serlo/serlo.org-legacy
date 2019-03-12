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
namespace Contexter\Adapter;

use Entity\Controller\AbstractController;
use Entity\Entity\EntityInterface;
use Instance\Manager\InstanceManagerAwareTrait;
use Link\Service\LinkServiceAwareTrait;

/**
 * Class EntityControllerAdapter
 *
 * @package Contexter\Adapter
 *          @method
 */
class EntityControllerAdapter extends AbstractAdapter
{
    use InstanceManagerAwareTrait, LinkServiceAwareTrait;

    /**
     * @return array
     */
    public function getProvidedParams()
    {
        /* @var $controller AbstractController */
        $params     = $this->getRouteParams();
        $controller = $this->getAdaptee();
        $entity     = $controller->getEntity($params['entity']);
        $array      = [
            'type'     => $entity->getType()->getName(),
            'instance' => $entity->getInstance()->getName(),
        ];

        $this->retrieveTerms($entity, $array);

        return $array;
    }

    /**
     * @param object $controller
     * @return bool
     */
    public function isValidController($controller)
    {
        return $controller instanceof AbstractController;
    }

    /**
     * @param EntityInterface $entity
     * @param array           $array
     */
    protected function retrieveTerms(EntityInterface $entity, array &$array)
    {
        foreach ($entity->getTaxonomyTerms() as $term) {
            while ($term->hasParent()) {
                $name           = $term->getTaxonomy()->getName();
                $array[$name][] = $term->getName();
                $term           = $term->getParent();
            }
        }

        $this->retrieveTermsThroughParents($entity, $array);
    }

    /**
     * @todo improve logic
     * @param EntityInterface $entity
     * @param array           $array
     */
    protected function retrieveTermsThroughParents(EntityInterface $entity, array &$array)
    {
        foreach ($entity->getParentLinks() as $link) {
            if ($link->getType()->getName() == 'link') {
                /* @var $parent EntityInterface */
                $parent = $link->getParent();
                $this->retrieveTerms($parent, $array);
            }
        }
    }
}
