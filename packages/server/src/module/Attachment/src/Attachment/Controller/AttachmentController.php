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
namespace Attachment\Controller;

use Attachment\Entity\ContainerInterface;
use Attachment\Form\AttachmentForm;
use Attachment\Manager\AttachmentManagerAwareTrait;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class AttachmentController extends AbstractActionController
{
    use AttachmentManagerAwareTrait;

    public function attachAction()
    {
        if ($this->params('append')) {
            $attachment = $this->getAttachmentManager()->getAttachment($this->params('append'));
            $this->assertGranted('attachment.append', $attachment);
        } else {
            $this->assertGranted('attachment.create');
        }

        $form = new AttachmentForm();
        $view = new ViewModel(['form' => $form]);
        $view->setTemplate('upload/form');

        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getFiles()->toArray();
            $post = array_merge($post, $request->getPost()->toArray());

            $form->setData($post);
            if ($form->isValid()) {
                $data       = $form->getData();
                $attachment = $this->getAttachmentManager()->attach($form, $data['type'], $this->params('append'));
                $this->getAttachmentManager()->flush();

                return $this->createJsonResponse($attachment);
            }
        }

        return $view;
    }

    public function fileAction()
    {
        $upload = $this->getAttachmentManager()->getFile($this->params('id'), $this->params('file'));
        $this->assertGranted('attachment.get', $upload);
        $this->redirect()->toUrl($upload->getLocation());

        return false;
    }

    public function infoAction()
    {
        $attachment = $this->getAttachmentManager()->getAttachment($this->params('id'));
        $this->assertGranted('attachment.get', $attachment);

        return $this->createJsonResponse($attachment);
    }

    protected function createJsonResponse(ContainerInterface $attachment)
    {
        $files = [];

        foreach ($attachment->getFiles() as $file) {
            $files[] = [
                'location' => $file->getLocation(),
                'size'     => $file->getSize(),
                'id'       => $file->getId(),
                'type'     => $file->getType(),
                'filename' => $file->getFilename(),
            ];
        }

        return new JsonModel([
            'success' => true,
            'id'      => $attachment->getId(),
            'type'    => $attachment->getType()->getName(),
            'files'   => $files,
        ]);
    }
}
