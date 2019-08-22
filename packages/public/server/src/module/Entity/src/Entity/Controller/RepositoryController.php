<?php
/**
 * This file is part of Serlo.org.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/**
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author      Aeneas Rekkas (aeneas.rekkas@serlo.org)
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace Entity\Controller;

use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionField;
use Entity\Options\LinkOptions;
use Entity\Options\ModuleOptions;
use Renderer\View\Helper\FormatHelperAwareTrait;
use function Sodium\crypto_sign_verify_detached;
use Versioning\Entity\RevisionInterface;
use Versioning\Exception\RevisionNotFoundException;
use Versioning\RepositoryManagerAwareTrait;
use Zend\Filter\StripTags;
use Zend\Form\Form;
use Zend\Mvc\I18n\Translator;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class RepositoryController extends AbstractController
{
    use RepositoryManagerAwareTrait;
    use FormatHelperAwareTrait;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    public function addLegacyRevisionAction()
    {
        $entity = $this->getEntity();

        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->assertGranted('entity.revision.create', $entity);

        /* @var $form \Zend\Form\Form */
        $form = $this->getForm($entity, $this->params('revision'));
        $view = new ViewModel(['entity' => $entity, 'form' => $form]);

        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                return $this->handleAddRevisionPost($entity, $form);
            }
        }

        $this->layout('legacy-editor');
        $view->setTemplate('entity/repository/update-revision-legacy');
        return $view;
    }

    public function addRevisionAction()
    {
        $entity = $this->getEntity();
        if (!$entity || $entity->isTrashed()) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->assertGranted('entity.revision.create', $entity);

        $state = htmlspecialchars(json_encode($this->getData($entity, $this->params('revision'))), ENT_QUOTES, 'UTF-8');
//        var_dump($json);
//        exit();
        $view = new ViewModel(['state' => $state, 'type' => $entity->getType()->getName()]);

        if ($this->getRequest()->isPost()) {
//            error_log(json_encode($this->getRequest()->getContent()));

            $data = json_decode($this->getRequest()->getContent(), true);
            $validated = $this->checkData($data, [
                "controls" => $data['controls'],
                "csrf" => $data['csrf'],
                "license" => [
                    "agreement" => 1,
                ],
            ]);

//            error_log($form->isValid());
            if ($validated['valid']) {
                $redirectUrl = '';
                foreach ($validated['elements'] as $el) {
                    $redirectUrl = $this->handleAddRevisionPost($el['entity'], $el['form']);
                }
                return new JsonModel([ 'success' => true, 'redirect' => $redirectUrl]);
            } else {
                return new JsonModel([ 'success' => false, 'errors' => $validated['messages']]);
            }
        }

        $this->layout('layout/3-col');
        $view->setTemplate('entity/repository/update-revision');
        return $view;
    }

    /**
     * @param array $data
     * @param array $merges
     * @return array
     */
    protected function checkData($data, $merges)
    {
        $validChildren = true;
        $elements = [];
        $messages = [];
        $data = array_merge($data, $merges);

        $entity = $this->getEntity($data['id']);
        $type = $entity->getType()->getName();

        if ($this->moduleOptions->getType($type)->hasComponent('link')) {
            // check children
            /** @var LinkOptions $linkOptions */
            $linkOptions = $this->moduleOptions->getType($type)->getComponent('link');
            foreach ($linkOptions->getAllowedChildren() as $allowedChild) {
                if (isset($data[$allowedChild])) {
                    if ($linkOptions->allowsManyChildren($allowedChild)) {
                        /* TODO: create entity for new children (e.g. course page)*/
                        foreach ($data[$allowedChild] as $child) {
                            $validated = $this->checkData($child, $merges);
                            if ($validated['valid']) {
                                $elements = array_merge($elements, $validated['elements']);
                            } else {
                                $validChildren = false;
                                $messages = array_merge($messages, $validated['messages']);
                            }
                        }
                    } else {
                        $validated = $this->checkData($data[$allowedChild], $merges);
                        if ($validated['valid']) {
                            $elements = array_merge($elements, $validated['elements']);
                        } else {
                            $validChildren = false;
                            $messages = array_merge($messages, $validated['messages']);
                        }
                    }
                }
            }
        }

        // check if the data is valid for the entity
        // and check if the data did change
        $form = $this->getForm($entity);
        // validation needs to be executed, for getData.
        $form->isValid();
        $dataPartPrevious = $form->getData();
        $form->setData($data);
        if ($form->isValid() && $validChildren) {
            // get the relevant data of this form and compare it to the previous data (ignoring the $merges)
            $dataPartNext = $form->getData();
            if (array_merge($dataPartPrevious, $merges) != array_merge($dataPartNext, $merges)) {
                $elements[] = ['entity' => $entity, 'form' => $form];
            }
            return [ 'valid' => true, 'elements' => $elements];
        } else {
            $messages = array_merge($messages, $form->getMessages());
            return [ 'valid' => false, 'messages' => $messages];
        }
    }

    protected function handleAddRevisionPost(EntityInterface $entity, Form $form)
    {
        $mayCheckout = $this->isGranted('entity.revision.checkout', $entity);
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

        if ($this->getRequest()->isXmlHttpRequest()) {
            return $this->plugin('url')->fromRoute($route, ['entity' => $entity->getId()]);
        }

        return $this->redirect()->toRoute($route, ['entity' => $entity->getId()]);
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

    protected function getData(EntityInterface $entity, $id = null)
    {
        $type = $entity->getType()->getName();
        $license = $entity->getLicense();

        $data = [
            'id' => $entity->getId(),
            'license' => [
                'id' => $license->getId(),
                'title' => $license->getTitle(),
                'agreement' => $license->getAgreement(),
                'url' => $license->getUrl(),
                'iconHref' => $license->getIconHref(),
            ],
        ];


        // add revision data
        $revision = $this->getRevision($entity, $id);
        if (is_object($revision)) {
            /** @var RevisionField $field */
            foreach ($revision->getFields() as $field) {
                $data[$field->getName()] = $field->getValue();
            }
        }

        if ($this->moduleOptions->getType($type)->hasComponent('link')) {
            // add children
            /** @var LinkOptions $linkOptions */
            $linkOptions = $this->moduleOptions->getType($type)->getComponent('link');
            foreach ($linkOptions->getAllowedChildren() as $allowedChild) {
                $children = $entity->getChildren('link', $allowedChild);

                if ($children->count()) {
                    if ($linkOptions->allowsManyChildren($allowedChild)) {
                        $data[$allowedChild] = [];
                        foreach ($children as $child) {
                            /* TODO: select correct revision id */
                            $data[$allowedChild][] = $this->getData($child);
                        }
                    } else {
                        $data[$allowedChild] = $this->getData($children->first());
                    }
                }
            }
        }
        return $data;
    }

    /**
     * @param EntityInterface $entity
     * @param string          $id
     * @return RevisionInterface|null
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
