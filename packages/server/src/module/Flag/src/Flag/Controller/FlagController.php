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
namespace Flag\Controller;

use Common\Form\CsrfForm;
use Flag\Form\FlagForm;
use Flag\Manager\FlagManagerAwareTrait;
use Flag\Manager\FlagManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class FlagController extends AbstractActionController
{
    use FlagManagerAwareTrait;

    public function __construct(FlagManagerInterface $flagManager)
    {
        $this->flagManager = $flagManager;
    }

    public function addAction()
    {
        $this->assertGranted('flag.create');

        $types = $this->getFlagManager()->findAllTypes();
        $form  = new FlagForm($types);
        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $uuid = $this->params('id');
                $this->getFlagManager()->addFlag((int)$data['type'], $data['content'], $uuid);
                $this->getFlagManager()->flush();
                $this->flashMessenger()->addSuccessMessage('The content has been flagged.');
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }

        $view = new ViewModel(['form' => $form]);
        $view->setTemplate('flag/add');

        return $view;
    }

    public function detailAction()
    {
        $id   = (int)$this->params('id');
        $flag = $this->getFlagManager()->getFlag($id);
        $view = new ViewModel(['flag' => $flag]);
        $view->setTemplate('flag/detail');
        return $view;
    }

    public function manageAction()
    {
        $flags = $this->getFlagManager()->findAllFlags();
        $view  = new ViewModel(['flags' => $flags, 'form' => new CsrfForm('remove-flag')]);
        $view->setTemplate('flag/manage');
        return $view;
    }

    public function removeAction()
    {
        $form = new CsrfForm('remove-flag');
        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $id = $this->params('id');
                $this->getFlagManager()->removeFlag((int)$id);
                $this->getFlagManager()->flush();
                $this->flashMessenger()->addSuccessMessage('Your action was successfull.');
            } else {
                $this->flashMessenger()->addErrorMessage('The flag could not be removed (validation failed)');
            }
        }
        return $this->redirect()->toReferer();
    }
}
