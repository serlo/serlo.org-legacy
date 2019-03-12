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
namespace License\Controller;

use Common\Form\CsrfForm;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use License\Manager\LicenseManagerAwareTrait;
use License\Manager\LicenseManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class LicenseController extends AbstractActionController
{
    use LicenseManagerAwareTrait;

    /**
     * @param LicenseManagerInterface  $licenseManager
     */
    public function __construct(LicenseManagerInterface $licenseManager)
    {
        $this->licenseManager  = $licenseManager;
    }

    public function manageAction()
    {
        $this->assertGranted('license.create');
        $licenses = $this->getLicenseManager()->findAllLicenses();
        $view     = new ViewModel(['licenses' => $licenses, 'form' => new CsrfForm('remove-license')]);
        $view->setTemplate('license/manage');
        return $view;
    }

    public function detailAction()
    {
        $license = $this->getLicenseManager()->getLicense($this->params('id'));
        $view    = new ViewModel(['license' => $license]);
        $view->setTemplate('license/detail');
        return $view;
    }

    public function updateAction()
    {
        $license = $this->getLicenseManager()->getLicense($this->params('id'));
        $this->assertGranted('license.update', $license);

        $form = $this->getLicenseManager()->getLicenseForm($this->params('id'));
        $view = new ViewModel(['form' => $form]);
        $view->setTemplate('license/update');
        if ($this->getRequest()->isPost()) {
            $form->setData(
                $this->getRequest()->getPost()
            );
            if ($form->isValid()) {
                $this->getLicenseManager()->updateLicense($form);
                $this->getLicenseManager()->getObjectManager()->flush();
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }
        $this->layout('athene2-editor');

        return $view;
    }

    public function addAction()
    {
        $this->assertGranted('license.create');

        $form = $this->getLicenseManager()->getLicenseForm();
        $view = new ViewModel(['form' => $form]);
        $view->setTemplate('license/add');
        if ($this->getRequest()->isPost()) {
            $form->setData($this->params()->fromPost());
            if ($form->isValid()) {
                $this->getLicenseManager()->createLicense($form);
                $this->getLicenseManager()->getObjectManager()->flush();
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }

        return $view;
    }

    public function removeAction()
    {
        $license = $this->getLicenseManager()->getLicense($this->params('id'));
        $this->assertGranted('license.purge', $license);
        $form = new CsrfForm('remove-license');
        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $this->getLicenseManager()->removeLicense($this->params('id'));
                $this->getLicenseManager()->getObjectManager()->flush();
            } else {
                $this->flashMessenger()->addErrorMessage('The license could not be removed (validation failed)');
            }
        }
        return $this->redirect()->toReferer();
    }
}
