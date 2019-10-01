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
use Instance\Manager\InstanceManagerAwareTrait;
use Renderer\View\Helper\FormatHelperAwareTrait;
use Uuid\Filter\NotTrashedCollectionFilter;
use Uuid\Manager\UuidManagerAwareTrait;
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
    use InstanceManagerAwareTrait;
    use RepositoryManagerAwareTrait;
    use FormatHelperAwareTrait;
    use UuidManagerAwareTrait;

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
                return $this->handleAddRevisionPost($entity, $form->getData());
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

        if ($this->getRequest()->isPost()) {
            $data = json_decode($this->getRequest()->getContent(), true);
            $validated = $this->checkData($data, [
                'changes' => $data['changes'],
                'controls' => $data['controls'],
                'csrf' => $data['csrf'],
                'license' => [
                    'agreement' => 1,
                ],
            ], $entity->getType()->getName());

            if ($validated['valid']) {
                $redirectUrl = '';
                foreach ($validated['elements'] as $el) {
                    $redirectUrl = $this->handleAddRevisionPost($el['entity'], $el['data']);
                }
                return new JsonModel([ 'success' => true, 'redirect' => $redirectUrl]);
            } else {
                return new JsonModel([ 'success' => false, 'errors' => $validated['messages']]);
            }
        }

        $state = htmlspecialchars(json_encode($this->getData($entity, $this->params('revision'))), ENT_QUOTES, 'UTF-8');
        $view = new ViewModel(['state' => $state, 'type' => $entity->getType()->getName()]);
        $this->layout('layout/3-col');
        $view->setTemplate('entity/repository/update-revision');
        return $view;
    }

    /**
     * Recursivly checks if the provided data is valid for this entity and all of its children
     * @param array $data submitted data in json
     * @param array $merges data to be merged into all data of children (e.g. changes, csrf, license agreement)
     * @param string $type type of the entity used to get the correct form for validation
     * @return array with 'valid' set to true or false, and in the latter case 'messages' with form validation errors
     */
    protected function isValid($data, $merges, $type)
    {
        $validChildren = true;
        $messages = [];
        $data = array_merge($data, $merges);

        // check children
        $validateChild = function ($child, $merges, $childType) use (&$messages, &$validChildren) {
            $validated = $this->isValid($child, $merges, $childType);
            if ($validated['valid']) {
            } else {
                $validChildren = false;
                $messages = array_merge($messages, $validated['messages']);
            }
        };

        $this->iterateOverChildren($data, $merges, $type, $validateChild);

        $form = $this->getFormFromType($type);
        $form->setData($data);
        $valid = $form->isValid();
        if ($valid && $validChildren) {
            return ['valid' => true];
        } else {
            $messages = array_merge($messages, $form->getMessages());
            return ['valid' => false, 'messages' => $messages];
        }
    }

    /**
     * Recursivly looks through $data to fetch the specified entities or create new ones if they don't exist yet.
     * Additionally this will add the data for the revision, if it differs from the current revision.
     * @param array $data with 'id' if entity already exists
     * @param array $merges data to be merged into all data of children (e.g. changes, csrf, license agreement). Will be ignored when identifying changes.
     * @param string $type type of the entity to (possibly) create
     * @param int|null $parentId id of the entity link parent. If data['id'] isn't set, then parentId needs to be specified for creating a new one.
     * @return array list of ['entity' =>(created or existing), 'data' => (revision data for the entity)] where new revisions need to be created
     */
    protected function createEntitiesAndGetRevisionData($data, $merges, $type, $parentId = null)
    {
        $elements = [];
        $data = array_merge($data, $merges);
        $id = $data['id']; // might be 0, then create a new entity.

        $form = $this->getFormFromType($type);
        $form->setData($data);
        $valid = $form->isValid();
        if ($valid) {
            // get the relevant data of this form and compare it to the previous data (ignoring $merges)
            $dataPartNext = $form->getData();

            $entity = $id ? $this->getEntity($data['id']) : $this->createOrRecycleEntity($type, $parentId);

            if ($entity->hasCurrentRevision()) {
                // check for changes with previous revision data, ignoring $merges
                $revision = $entity->getCurrentRevision();
                $dataPartPrevious = $this->getRevisionData($revision);
                // only check equality (==) not identity (===) to ignore different key order
                if (array_merge($dataPartPrevious, $merges) != array_merge($dataPartNext, $merges)) {
                    $elements[] = ['entity' => $entity, 'data' => $dataPartNext];
                }
            } else {
                $elements[] = ['entity' => $entity, 'data' => $dataPartNext];
            }
            $id = $entity->getId();
        }

        $createRevisionChild = function ($child, $merges, $type) use (&$elements, $id) {
            $childElements = $this->createEntitiesAndGetRevisionData($child, $merges, $type, $id);
            $elements = array_merge($elements, $childElements);
        };

        $this->iterateOverChildren($data, $merges, $type, $createRevisionChild);
        return $elements;
    }

    /**
     * Create an entity link child if the parrent allows multiple, or otherwise reuse an existing child.
     * @param $type
     * @param $parentId
     * @return EntityInterface
     */
    protected function createOrRecycleEntity($type, $parentId)
    {
        $parent = $this->getEntity($parentId);
        $parentType = $parent->getType()->getName();
        $existingChildren = $parent->getChildren('link', $type);
        if ($existingChildren->count() > 0) {
            // Check if the parent allows multiple entities, otherwise use the existing and restore it if necessary.
            if ($this->moduleOptions->getType($type)->hasComponent('link')) {
                /** @var LinkOptions $linkOptions */
                $linkOptions = $this->moduleOptions->getType($parentType)->getComponent('link');
                if (!$linkOptions->allowsManyChildren($type)) {
                    /** @var EntityInterface $child */
                    $child = $existingChildren->first();
                    if ($child->isTrashed()) {
                        $this->getUuidManager()->restoreUuid($child->getId());
                        $this->getUuidManager()->flush();
                        return $child;
                    }
                }
            }
        }

        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $entity   = $this->getEntityManager()->createEntity(
            $type,
            ['link' => [
                'type' => 'link',
                'child' => $parentId,
            ]],
            $instance
        );
        $this->getEntityManager()->flush();
        return $entity;
    }

    /**
     * Helper function iterating through $data using children specified in component link config
     * @param array $data
     * @param array $merges
     * @param string $type
     * @param callable $cb Callback, accepting the child data, merges and type
     */
    private function iterateOverChildren($data, $merges, $type, $cb)
    {
        $data = array_merge($data, $merges);

        if ($this->moduleOptions->getType($type)->hasComponent('link')) {
            /** @var LinkOptions $linkOptions */
            $linkOptions = $this->moduleOptions->getType($type)->getComponent('link');
            foreach ($linkOptions->getAllowedChildren() as $allowedChild) {
                if (isset($data[$allowedChild]) && $data[$allowedChild]) {
                    if ($linkOptions->allowsManyChildren($allowedChild)) {
                        foreach ($data[$allowedChild] as $child) {
                            $cb($child, $merges, $allowedChild);
                        }
                    } else {
                        $cb($data[$allowedChild], $merges, $allowedChild);
                    }
                }
            }
        }
    }

    /**
     * Checks data for validity, creates missing entities if all data is valid and returns the entities
     * and associated revision data
     * @param array $data
     * @param array $merges
     * @param string $type
     * @return array
     */
    protected function checkData($data, $merges, $type)
    {
        $validated = $this->isValid($data, $merges, $type);
        if ($validated['valid']) {
            return ['valid' => true, 'elements' => $this->createEntitiesAndGetRevisionData($data, $merges, $type)];
        } else {
            return $validated;
        }
    }

    protected function handleAddRevisionPost(EntityInterface $entity, $data)
    {
        $mayCheckout = $this->isGranted('entity.revision.checkout', $entity);
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
        $form = $this->getFormFromType($type);
        $revision = $this->getRevision($entity, $id);

        if (is_object($revision)) {
            $data = $this->getRevisionData($revision);
            $form->setData($data);
        }

        $license   = $entity->getLicense();
        $agreement = $license->getAgreement() ? $license->getAgreement() : $license->getTitle();
        $form->get('license')->get('agreement')->setLabel($agreement);
        $form->get('changes')->setValue('');


        return $form;
    }

    /**
     * @param string $type
     * @return Form
     */
    protected function getFormFromType($type)
    {
        $form = $this->moduleOptions->getType($type)->getComponent('repository')->getForm();
        return $this->getServiceLocator()->get($form);
    }

    protected function getRevisionData(RevisionInterface $revision)
    {
        $data = [];
        /** @var RevisionField $field */
        foreach ($revision->getFields() as $field) {
            $data[$field->getName()] = $field->getValue();
        }
        return $data;
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
            $data = array_merge($data, $this->getRevisionData($revision));
        }

        if ($this->moduleOptions->getType($type)->hasComponent('link')) {
            // add children
            /** @var LinkOptions $linkOptions */
            $linkOptions = $this->moduleOptions->getType($type)->getComponent('link');
            foreach ($linkOptions->getAllowedChildren() as $allowedChild) {
                $filter = new NotTrashedCollectionFilter();
                $children = $filter->filter($entity->getChildren('link', $allowedChild));

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
