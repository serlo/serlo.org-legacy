<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Ads\Controller;

use Ads\Form\AdForm;
use Ads\Form\AdPageForm;
use Attachment\Exception\NoFileSent;
use Csrf\Form\CsrfForm;
use Instance\Manager\InstanceManagerAwareTrait;
use Page\Entity\PageRevisionInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class AdsController extends AbstractActionController
{
    use InstanceManagerAwareTrait;
    use \Common\Traits\ObjectManagerAwareTrait;
    use \User\Manager\UserManagerAwareTrait;
    use \Ads\Manager\AdsManagerAwareTrait;
    use \Attachment\Manager\AttachmentManagerAwareTrait;
    use \Page\Manager\PageManagerAwareTrait;
    use \Renderer\View\Helper\FormatHelperAwareTrait;

    public function indexAction()
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $this->assertGranted('ad.create', $instance);
        $ads  = $this->getAdsManager()->findAllAds($instance);
        $view = new ViewModel([
            'ads' => $ads,
            'form' => new CsrfForm('remove-ad'),
        ]);
        $view->setTemplate('ads/ads');

        return $view;
    }

    public function addAction()
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $user     = $this->getUserManager()->getUserFromAuthenticator();
        $form     = new AdForm();
        $this->assertGranted('ad.create', $instance);

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $data = array_merge(
                $data,
                $this->getRequest()->getFiles()->toArray()
            );

            $form->setData($data);
            if ($form->isValid()) {
                $array  = $form->getData();
                $upload = $this->getAttachmentManager()->attach($form);
                $array  = array_merge(
                    $array,
                    [
                        'attachment' => $upload,
                        'author'     => $user,
                        'instance'   => $instance,
                    ]
                );

                $this->getAdsManager()->createAd($array);
                $this->getAdsManager()->flush();

                return $this->redirect()->toRoute('ads');
            }
        }

        $view = new ViewModel([
            'form' => $form,
        ]);
        $view->setTemplate('ads/create');

        return $view;
    }

    public function deleteAction()
    {
        $id = $this->params('id');
        $ad = $this->getAdsManager()->getAd($id);
        $this->assertGranted('ad.remove', $ad);
        if ($this->getRequest()->isPost()) {
            $form = new CsrfForm('remove-ad');
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $this->getAdsManager()->removeAd($ad);
                $this->getAdsManager()->flush();
            } else {
                $this->flashMessenger()->addErrorMessage('The element could not be removed (validation failed)');
            }
        }
        return $this->redirect()->toRoute('ads');
    }

    public function editAction()
    {
        $form = new AdForm();
        $id   = $this->params('id');
        $ad   = $this->getAdsManager()->getAd($id);
        $this->assertGranted('ad.update', $ad);

        // todo: use hydrator instead
        $form->get('content')->setValue($ad->getContent());
        $form->get('title')->setValue($ad->getTitle());
        $form->get('frequency')->setValue($ad->getFrequency());
        $form->get('url')->setValue($ad->getUrl());
        $form->get('banner')->setValue($ad->getBanner());

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $data = array_merge(
                $data,
                $this->getRequest()->getFiles()->toArray()
            );

            $form->setData($data);
            if ($form->isValid()) {
                $array = $form->getData();

                // Try updating the upload
                try {
                    $upload              = $this->getAttachmentManager()->attach($form);
                    $array['attachment'] = $upload;
                } catch (NoFileSent $e) {
                    // No file has been sent, so we stick to the old one
                    $array['attachment'] = $ad->getAttachment();
                }

                $this->getAdsManager()->updateAd($array, $ad);
                $this->getAdsManager()->flush();
                $this->redirect()->toRoute('ads');
            }
        }

        $view = new ViewModel([
            'form' => $form,
        ]);
        $view->setTemplate('ads/update');

        return $view;
    }

    public function outAction()
    {
        $id = $this->params('id');
        $ad = $this->getAdsManager()->getAd($id);
        $this->getAdsManager()->clickAd($ad);
        $this->getAdsManager()->flush();
        return $this->redirect()->toUrl($ad->getUrl());
    }
}
