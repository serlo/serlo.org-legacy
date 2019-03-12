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

use Entity\Form\MoveForm;
use Entity\Options\ModuleOptionsAwareTrait;
use Link\Service\LinkServiceAwareTrait;
use Zend\View\Model\ViewModel;

class LinkController extends AbstractController
{
    use LinkServiceAwareTrait, ModuleOptionsAwareTrait;

    public function moveAction()
    {
        $entity = $this->getEntity();

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $type = $this->params('type');
        $form = new MoveForm();
        $view = new ViewModel(['form' => $form]);

        $this->assertGranted('entity.link.create', $entity);
        $this->assertGranted('entity.link.purge', $entity);

        if ($this->getRequest()->isPost()) {
            $form->setData($this->params()->fromPost());
            if ($form->isValid()) {
                // todo this really should be done in a hydrator or similar
                $data        = $form->getData();
                $from        = $this->getEntityManager()->getEntity($this->params('from'));
                $to          = $this->getEntityManager()->getEntity($data['to']);
                $fromType    = $from->getType()->getName();
                $fromOptions = $this->getModuleOptions()->getType($fromType)->getComponent($type);
                $toType      = $to->getType()->getName();
                $toOptions   = $this->getModuleOptions()->getType($toType)->getComponent($type);

                $this->getLinkService()->dissociate($from, $entity, $fromOptions);
                $this->getLinkService()->associate($to, $entity, $toOptions);
                $this->getEntityManager()->getObjectManager()->flush();
                $this->flashMessenger()->addSuccessMessage('Your changes have been saved.');
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }

        $view->setTemplate('entity/link/move');
        $this->layout('layout/1-col');
        return $view;
    }

    public function orderChildrenAction()
    {
        $entity = $this->getEntity();
        $scope  = $this->params('type');
        $this->assertGranted('entity.link.order', $entity);

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost()['sortable'];
            $data = $this->prepareDataForOrdering($data);

            $this->getLinkService()->sortChildren($entity, $scope, $data);
            $this->getEntityManager()->flush();
            $this->flashMessenger()->addSuccessMessage('Your changes have been saved.');
            return $this->redirect()->toUrl($this->referer()->fromStorage());
        } else {
            $this->referer()->store();
        }

        $children = $entity->getValidChildren($scope);
        $view     = new ViewModel(['entity' => $entity, 'children' => $children, 'scope' => $scope]);
        $view->setTemplate('entity/link/order');
        $this->layout('layout/1-col');
        return $view;
    }

    protected function prepareDataForOrdering($data)
    {
        $return = [];
        foreach ($data as $child) {
            $return[] = $child['id'];
        }
        return $return;
    }
}
