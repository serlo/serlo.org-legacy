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

use Instance\Manager\InstanceManagerAwareTrait;
use Link\Service\LinkServiceAwareTrait;
use Taxonomy\Controller\AbstractController;
use Taxonomy\Entity\TaxonomyTermInterface;

/**
 * Class TaxonomyTermControllerAdapter
 *
 * @package Contexter\Adapter
 */
class TaxonomyTermControllerAdapter extends AbstractAdapter
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
        $entity     = $controller->getTerm($params['term']);
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
     * @param TaxonomyTermInterface $term
     * @param array                 $array
     */
    protected function retrieveTerms(TaxonomyTermInterface $term, array &$array)
    {
        while ($term->hasParent()) {
            $name           = $term->getTaxonomy()->getName();
            $array[$name][] = $term->getName();
            $term           = $term->getParent();
        }
    }
}
