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
namespace Entity\Controller;

use Entity\Options\ModuleOptions;
use Zend\View\Model\ViewModel;

class TOCController extends AbstractController
{

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    public function setModuleOptions(ModuleOptions $moduleOptions)
    {
        $this->moduleOptions = $moduleOptions;
    }

    public function indexAction()
    {
        $entity = $this->getEntity();
        $type = $this->moduleOptions->getType($entity->getType()->getName());

        if (!$entity || $entity->isTrashed() || !$type->hasComponent('tableOfContents')) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $view = new ViewModel([
            'entity' => $entity,
        ]);

        $view->setTemplate('entity/view/toc/default');

        $this->layout('layout/3-col');

        if (!$entity->hasCurrentRevision()) {
            $this->layout('layout/2-col');
            $view->setTemplate('entity/page/pending');
        }

        return $view;
    }
}
