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
namespace RelatedContent\Controller;

use Common\Form\CsrfForm;
use RelatedContent\Exception\NotFoundException;
use RelatedContent\Form\CategoryForm;
use RelatedContent\Form\ExternalForm;
use RelatedContent\Form\InternalForm;
use RelatedContent\Manager\RelatedContentManagerAwareTrait;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class RelatedContentController extends AbstractActionController
{
    use RelatedContentManagerAwareTrait;

    public function addCategoryAction()
    {
        $this->assertGranted('related.content.create');

        $form = new CategoryForm();
        $view = new ViewModel(['form' => $form]);

        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $this->getRelatedContentManager()->addCategory((int)$this->params('id'), $data['title']);
                $this->getRelatedContentManager()->getObjectManager()->flush();
                $this->redirect()->toRoute('related-content/manage', ['id' => $this->params('id')]);
            }
        }
        $view->setTemplate('related-content/add-category');
        $this->layout('layout/1-col');
        return $view;
    }

    public function addExternalAction()
    {
        $container  = $this->getContainer();
        if (!$container) {
            return false;
        }

        $form      = new ExternalForm();
        $view      = new ViewModel(['form' => $form]);
        $this->assertGranted('related.content.create', $container);

        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $this->getRelatedContentManager()->addExternal($container->getId(), $data['title'], $data['url']);
                $this->getRelatedContentManager()->getObjectManager()->flush();
                $this->redirect()->toRoute('related-content/manage', ['id' => $this->params('id')]);
            }
        }
        $view->setTemplate('related-content/add-external');
        $this->layout('layout/1-col');
        return $view;
    }

    public function addInternalAction()
    {
        $container  = $this->getContainer();
        if (!$container) {
            return false;
        }

        $form      = new InternalForm();
        $view      = new ViewModel(['form' => $form]);
        $this->assertGranted('related.content.create', $container);

        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $this->getRelatedContentManager()->addInternal(
                    $container->getId(),
                    $data['title'],
                    $data['reference']
                );
                $this->getRelatedContentManager()->getObjectManager()->flush();
                $this->redirect()->toRoute('related-content/manage', ['id' => $this->params('id')]);
            }
        }
        $view->setTemplate('related-content/add-internal');
        $this->layout('layout/1-col');
        return $view;
    }

    public function getContainer($id = null)
    {
        $id = $id ? : $this->params('id');
        try {
            return $this->getRelatedContentManager()->getContainer($id);
        } catch (NotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }
    }

    public function manageAction()
    {
        $container  = $this->getContainer();
        if (!$container) {
            return false;
        }

        $aggregated = $this->getRelatedContentManager()->aggregateRelatedContent($this->params('id'));
        $view       = new ViewModel([
            'aggregated' => $aggregated,
            'container'  => $container,
            'form'       => new CsrfForm('remove-related-element'),
        ]);
        $view->setTemplate('related-content/manage');
        $this->layout('layout/1-col');
        return $view;
    }

    public function orderAction()
    {
        $position = 1;
        if ($this->getRequest()->isPost()) {
            foreach ($this->params()->fromPost('sortable', []) as $holder) {
                $this->getRelatedContentManager()->positionHolder((int)$holder['id'], (int)$position);
                $position++;
            }
        }
        $this->getRelatedContentManager()->getObjectManager()->flush();

        return false;
    }

    public function removeAction()
    {
        if ($this->getRequest()->isPost()) {
            $form = new CsrfForm('remove-related-element');
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $this->getRelatedContentManager()->removeRelatedContent((int)$this->params('id'));
                $this->getRelatedContentManager()->getObjectManager()->flush();
            } else {
                $this->flashMessenger()->addErrorMessage('The element could not be removed (validation failed)');
            }
        }
        return $this->redirect()->toReferer();
    }
}
