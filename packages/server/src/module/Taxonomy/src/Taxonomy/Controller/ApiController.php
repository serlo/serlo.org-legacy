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
namespace Taxonomy\Controller;

use Taxonomy\Entity\TaxonomyTermInterface;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractController
{
    public function typesAction()
    {
        $instance   = $this->getInstanceManager()->getInstanceFromRequest();
        $taxonomies = $this->getTaxonomyManager()->findAllTaxonomies($instance);
        $data       = [];
        foreach ($taxonomies as $taxonomy) {
            $data[] = [
                'name'     => $taxonomy->getName(),
                'instance' => $taxonomy->getInstance()->getId(),
                'id'       => $taxonomy->getId(),
            ];
        }
        $view = new JsonModel($data);
        return $view;
    }

    public function typeAction()
    {
        $type     = $this->params('type');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $taxonomy = $this->getTaxonomyManager()->findTaxonomyByName($type, $instance);
        $data     = [
            'name'     => $taxonomy->getName(),
            'instance' => $taxonomy->getInstance()->getId(),
            'id'       => $taxonomy->getId(),
        ];
        $view     = new JsonModel($data);
        return $view;
    }

    public function termsAction()
    {
        $type     = $this->params('type');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $taxonomy = $this->getTaxonomyManager()->findTaxonomyByName($type, $instance);
        $data     = [];
        foreach ($taxonomy->getTerms() as $term) {
            $data[] = $this->ajaxify($term);
        }
        $view = new JsonModel($data);
        return $view;
    }

    public function termAction()
    {
        $type     = $this->params('id');
        $taxonomy = $this->getTaxonomyManager()->getTerm($type);
        $view     = new JsonModel($this->ajaxify($taxonomy));
        return $view;
    }

    public function saplingsAction()
    {
        $type     = $this->params('type');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $taxonomy = $this->getTaxonomyManager()->findTaxonomyByName($type, $instance);
        $data     = [];
        foreach ($taxonomy->getChildren() as $term) {
            $data[] = $this->ajaxify($term);
        }
        $view = new JsonModel($data);
        return $view;
    }

    protected function ajaxify(TaxonomyTermInterface $term)
    {
        $data = [
            'id'           => $term->getId(),
            'name'         => $term->getName(),
            'taxonomy'     => $term->getTaxonomy()->getId(),
            'url'          => $this->url()->fromRoute('uuid/get', ['uuid' => $term->getId()]),
            'parent'       => $term->hasParent() ? $term->getParent()->getId() : null,
            'children'     => [],
            'items'        => [],
        ];

        foreach ($term->getChildren() as $child) {
            $data['children'][] = $this->ajaxify($child);
        }

        foreach ($term->getAssociated('entities') as $child) {
            $data['items'][] = [
                'id'   => $child->getId(),
                'type' => 'entity',
            ];
        }

        return $data;
    }
}
