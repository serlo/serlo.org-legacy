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

use Common\Controller\AbstractAPIAwareActionController;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Form\TermForm;
use Taxonomy\Manager\TaxonomyManagerAwareTrait;
use Taxonomy\Manager\TaxonomyManagerInterface;

class AbstractController extends AbstractAPIAwareActionController
{
    use TaxonomyManagerAwareTrait;
    use InstanceManagerAwareTrait;

    /**
     * @var \Taxonomy\Form\TermForm
     */
    protected $termForm;

    /**
     * @param InstanceManagerInterface $instanceManager
     * @param TaxonomyManagerInterface $taxonomyManager
     * @param TermForm                 $termForm
     */
    public function __construct(
        InstanceManagerInterface $instanceManager,
        TaxonomyManagerInterface $taxonomyManager,
        TermForm $termForm
    ) {
        $this->instanceManager = $instanceManager;
        $this->taxonomyManager = $taxonomyManager;
        $this->termForm        = $termForm;
    }

    /**
     * @param null|int $id
     * @return TaxonomyTermInterface
     */
    public function getTerm($id = null)
    {
        $id = $id ? : $this->params('id', $id);
        $id = $id ? : $this->params('term', $id);
        if ($id === null) {
            $instance = $this->getInstanceManager()->getInstanceFromRequest();
            $root     = $this->getTaxonomyManager()->findTaxonomyByName('root', $instance)->getChildren()->first();
            if (!is_object($root)) {
                $root = $this->getTaxonomyManager()->createRoot($this->termForm);
                $this->getTaxonomyManager()->flush();
            }
            return $root;
        }
        return $this->getTaxonomyManager()->getTerm($id);
    }
}
