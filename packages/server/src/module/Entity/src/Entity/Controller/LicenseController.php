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

use Instance\Manager\InstanceManagerAwareTrait;
use License\Form\UpdateLicenseForm;
use License\Manager\LicenseManagerAwareTrait;
use Zend\View\Model\ViewModel;

class LicenseController extends AbstractController
{
    use LicenseManagerAwareTrait;

    public function updateAction()
    {
        $licenses = $this->getLicenseManager()->findAllLicenses();
        $entity   = $this->getEntity();

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->assertGranted('entity.license.update', $entity);

        $form = new UpdateLicenseForm($licenses);
        $view = new ViewModel(['form' => $form]);
        $view->setTemplate('entity/license/update');

        if ($this->getRequest()->isPost()) {
            $form->setData($this->params()->fromPost());
            if ($form->isValid()) {
                $data    = $form->getData();
                $license = $this->getLicenseManager()->getLicense((int)$data['license']);
                $this->getLicenseManager()->injectLicense($entity, $license);
                $this->getLicenseManager()->flush();
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }

        return $view;
    }
}
