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
use Entity\Options\RedirectOptions;
use Zend\View\Model\ViewModel;

class PageController extends AbstractController
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
        $this->setupAPI();
        $entity = $this->getEntity();
        if (!$entity) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $type = $this->moduleOptions->getType($entity->getType()->getName());
        if ($type->hasComponent('redirect') && !$this->getRequest()->isXmlHttpRequest()) {
            /* @var $redirect RedirectOptions */
            $redirect = $type->getComponent('redirect');

            if ($redirect->getToType() === 'parent') {
                $parent = $entity->getParents('link')->first();
                if (!$parent->isTrashed() && $parent->hasCurrentRevision()) {
                    return $this->redirect()->toRoute('uuid/get', ['uuid' => $parent->getId()]);
                }
            } else {
                foreach ($entity->getChildren('link', $redirect->getToType()) as $child) {
                    if (!$child->isTrashed() && $child->hasCurrentRevision()) {
                        return $this->redirect()->toRoute('uuid/get', ['uuid' => $child->getId()]);
                    }
                }
            }
        }

        $model = new ViewModel(['entity' => $entity, 'convert' => $this->params('convert', false)]);
        $model->setTemplate('entity/page/default');

        if ($this->params('isXmlHttpRequest', false)) {
            $model->setTemplate('entity/view/default');
        }

        $this->layout('layout/3-col');

        if (!$entity->hasCurrentRevision()) {
            $model->setTemplate('entity/page/pending');
        }

        return $model;
    }
}
