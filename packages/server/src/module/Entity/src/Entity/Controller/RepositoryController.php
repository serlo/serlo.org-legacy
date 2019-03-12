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

/**
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author      Aeneas Rekkas (aeneas.rekkas@serlo.org)
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace Entity\Controller;

use Common\Form\CsrfForm;
use Entity\Entity\EntityInterface;
use Entity\Options\ModuleOptions;
use Versioning\Entity\RevisionInterface;
use Versioning\Exception\RevisionNotFoundException;
use Versioning\RepositoryManagerAwareTrait;
use Zend\Filter\StripTags;
use Zend\Form\Form;
use Zend\Mvc\Exception;
use Zend\Mvc\I18n\Translator;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class RepositoryController extends AbstractController
{
    use RepositoryManagerAwareTrait;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;


    public function addRevisionAction()
    {
        $entity = $this->getEntity();

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->assertGranted('entity.revision.create', $entity);
        $mayCheckout = $this->isGranted('entity.revision.checkout', $entity);

        /* @var $form \Zend\Form\Form */
        $form = $this->getForm($entity, $this->params('revision'));
        $view = new ViewModel(['entity' => $entity, 'form' => $form]);

        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $revision = $this->getRepositoryManager()->commitRevision($entity, $data);
                /** @var Translator $translator */
                $translator = $this->serviceLocator->get('MvcTranslator');
                if ($mayCheckout) {
                    $this->getRepositoryManager()->checkoutRevision($entity, $revision);
                    $successMessage = $translator->translate('Your revision has been saved and is available');
                    $route = 'entity/page';
                } else {
                    $successMessage = $translator->translate('Your revision has been saved, it will be available once it gets approved');
                    $route = 'entity/repository/history';
                }
                $this->getEntityManager()->flush();
                $this->flashMessenger()->addSuccessMessage($successMessage);

                return $this->redirect()->toRoute($route, ['entity' => $entity->getId()]);
            }
        }

        if ($this->params('old', false)) {
            $this->layout('athene2-editor');
            $view->setTemplate('entity/repository/update-revision');
        } else {
            $this->layout('layout/3-col');
            $view->setTemplate('entity/repository/update-revision-ory');
        }
        return $view;
    }

    public function checkoutAction()
    {
        $entity = $this->getEntity();
        $reason = $this->params()->fromPost('reason', '');
        $reason = (new StripTags())->filter($reason);

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->assertGranted('entity.revision.checkout', $entity);

        $this->getRepositoryManager()->checkoutRevision($entity, $this->params('revision'), $reason);
        $this->getRepositoryManager()->flush();

        return $this->redirect()->toRoute('entity/page', ['entity' => $entity->getId()]);
    }

    public function compareAction()
    {
        $entity = $this->getEntity();

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $revision = $this->getRevision($entity, $this->params('revision'));
        $currentRevision = $this->getRevision($entity);
        $previousRevision = $this->getPreviousRevision($entity, $revision);

        if (!$revision) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $view = new ViewModel([
            'currentRevision' => $currentRevision,
            'compareRevision' => $previousRevision,
            'revision'        => $revision,
            'entity'          => $entity,
        ]);

        $view->setTemplate('entity/repository/compare-revision');
        $this->layout('layout/1-col');

        return $view;
    }

    public function historyAction()
    {
        $entity = $this->getEntity();

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $currentRevision = $entity->hasCurrentRevision() ? $entity->getCurrentRevision() : null;
        $this->assertGranted('entity.repository.history', $entity);

        $view = new ViewModel([
            'entity'          => $entity,
            'revisions'       => $entity->getRevisions(),
            'currentRevision' => $currentRevision,
        ]);

        $view->setTemplate('entity/repository/history');
        return $view;
    }

    public function rejectAction()
    {
        $entity = $this->getEntity();
        $reason = $this->params()->fromPost('reason', '');
        $reason = (new StripTags())->filter($reason);

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->assertGranted('entity.revision.trash', $entity);
        $this->getRepositoryManager()->rejectRevision($entity, $this->params('revision'), $reason);
        $this->getRepositoryManager()->flush();

        return $this->redirect()->toReferer();
    }

    /**
     * @param ModuleOptions $moduleOptions
     * @return void
     */
    public function setModuleOptions(ModuleOptions $moduleOptions)
    {
        $this->moduleOptions = $moduleOptions;
    }

    /**
     * @param EntityInterface $entity
     * @return Form
     */
    protected function getForm(EntityInterface $entity, $id = null)
    {
        // Todo: Unhack

        $type = $entity->getType()->getName();
        $form = $this->moduleOptions->getType($type)->getComponent('repository')->getForm();
        $form = $this->getServiceLocator()->get($form);
        $revision = $this->getRevision($entity, $id);

        if (is_object($revision)) {
            $data = [];
            foreach ($revision->getFields() as $field) {
                $data[$field->getName()] = $field->getValue();
            }
            $form->setData($data);
        }

        $license   = $entity->getLicense();
        $agreement = $license->getAgreement() ? $license->getAgreement() : $license->getTitle();
        $form->get('license')->get('agreement')->setLabel($agreement);
        $form->get('changes')->setValue('');


        return $form;
    }

    /**
     * @param EntityInterface $entity
     * @param string          $id
     * @return \Versioning\Entity\RevisionInterface|null
     */
    protected function getRevision(EntityInterface $entity, $id = null)
    {
        try {
            if ($id === null) {
                return $entity->getCurrentRevision();
            } else {
                return $this->getRepositoryManager()->findRevision($entity, $id);
            }
        } catch (RevisionNotFoundException $e) {
            return null;
        }
    }

    /**
     * @param EntityInterface $entity
     * @param RevisionInterface $revision
     * @return RevisionInterface
     */
    protected function getPreviousRevision(EntityInterface $entity, RevisionInterface $revision)
    {
        return $this->getRepositoryManager()->findPreviousRevision($entity, $revision);
    }
}
