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
namespace Taxonomy\Controller;

use Csrf\Form\CsrfForm;
use Entity\Manager\EntityManagerAwareTrait;
use Entity\Manager\EntityManagerInterface;
use FeatureFlags\Service as FeatureFlagsService;
use Versioning\Filter\HasHeadCollectionFilter;
use Instance\Manager\InstanceManagerInterface;
use Taxonomy\Form\BatchCopyForm;
use Taxonomy\Form\BatchMoveForm;
use Taxonomy\Form\TermForm;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Uuid\Filter\NotTrashedCollectionFilter;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use ZfcRbac\Exception\UnauthorizedException;
use Zend\Filter\FilterChain;

class TermController extends AbstractController
{
    use EntityManagerAwareTrait;

    /**
     * @var FeatureFlagsService
     */
    protected $featureFlags;

    /**
     * @param InstanceManagerInterface $instanceManager
     * @param EntityManagerInterface   $entityManager
     * @param TaxonomyManagerInterface $taxonomyManager
     * @param TermForm                 $termForm
     * @param FeatureFlagsService      $featureFlags
     */
    public function __construct(
        InstanceManagerInterface $instanceManager,
        EntityManagerInterface $entityManager,
        TaxonomyManagerInterface $taxonomyManager,
        TermForm $termForm,
        FeatureFlagsService $featureFlags
    ) {
        $this->instanceManager = $instanceManager;
        $this->taxonomyManager = $taxonomyManager;
        $this->termForm = $termForm;
        $this->entityManager = $entityManager;
        $this->featureFlags = $featureFlags;
    }

    public function createAction()
    {
        $this->assertGranted('taxonomy.term.create');
        $form = $this->termForm;

        if ($this->getRequest()->isPost()) {
            $data = json_decode($this->getRequest()->getContent(), true);
            $data = array_merge($data, [
                'taxonomy' => $this->params('taxonomy'),
                'parent' => $this->params('parent', null),
            ]);
            $form->setData($data);
            if ($form->isValid()) {
                $this->getTaxonomyManager()->createTerm($form);
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage(
                    'The node has been added successfully!'
                );
                $redirectUrl = $this->referer()->fromStorage();
                return new JsonModel([
                    'success' => true,
                    'redirect' => $redirectUrl,
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'errors' => $form->getMessages(),
                ]);
            }
        } else {
            $this->referer()->store();
        }
        $data = [
            'term' => [
                'name' => '',
            ],
            'description' => '',
        ];

        $state = htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8');
        $view = new ViewModel(['state' => $state]);
        $view->setTemplate('taxonomy/term/create');
        return $view;
    }

    public function batchMoveAction()
    {
        // TODO Currently only with entities...
        $term = $this->getTaxonomyManager()->getTerm($this->params('term'));
        $options = $this->batchElementsArray($term);
        $form = new BatchMoveForm($options);

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $data = array_merge($data, [
                'taxonomy' => $this->params('taxonomy'),
                'parent' => $this->params('parent', null),
            ]);
            $form->setData($data);
            if ($form->isValid()) {
                $data = $form->getData();
                $destination = $this->getTaxonomyManager()->getTerm(
                    $data['destination']
                );
                foreach ($data['associations'] as $element) {
                    $entity = $this->getEntityManager()->getEntity($element);
                    $this->getTaxonomyManager()->associateWith(
                        $destination,
                        $entity
                    );
                    $this->getTaxonomyManager()->removeAssociation(
                        $term,
                        $entity
                    );
                }
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage(
                    'Items moved successfully!'
                );
                return $this->redirect()->toRoute('taxonomy/term/get', [
                    'term' => $destination->getId(),
                ]);
            }
        }

        $view = new ViewModel([
            'form' => $form,
        ]);
        $view->setTemplate('taxonomy/term/batch-move');
        return $view;
    }

    public function batchCopyAction()
    {
        // TODO Currently only with entities...
        $term = $this->getTaxonomyManager()->getTerm($this->params('term'));
        $options = $this->batchElementsArray($term);
        $form = new BatchCopyForm($options);

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $data = array_merge($data, [
                'taxonomy' => $this->params('taxonomy'),
                'parent' => $this->params('parent', null),
            ]);
            $form->setData($data);
            if ($form->isValid()) {
                $data = $form->getData();
                $destination = $this->getTaxonomyManager()->getTerm(
                    $data['destination']
                );
                foreach ($data['associations'] as $element) {
                    $entity = $this->getEntityManager()->getEntity($element);
                    $this->getTaxonomyManager()->associateWith(
                        $destination,
                        $entity
                    );
                }
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage(
                    'Items copied successfully!'
                );
                return $this->redirect()->toRoute('taxonomy/term/get', [
                    'term' => $destination->getId(),
                ]);
            }
        }

        $view = new ViewModel([
            'form' => $form,
        ]);
        $view->setTemplate('taxonomy/term/batch-copy');
        return $view;
    }

    private function batchElementsArray($term)
    {
        $chain = new FilterChain();
        $chain->attach(new NotTrashedCollectionFilter());
        $chain->attach(new HasHeadCollectionFilter());
        $elements = $term->getAssociated('entities');
        $notTrashedElements = $chain->filter($elements);

        $options = [];
        foreach ($notTrashedElements as $element) {
            $options[$element->getId()] = $element;
        }

        return $options;
    }

    public function orderAction()
    {
        $term = $this->getTaxonomyManager()->getTerm($this->params('term'));
        $this->assertGranted('taxonomy.term.update', $term);
        $data = $this->params()->fromPost('sortable', []);
        $csrf = $this->params()->fromPost('csrf', '');
        $this->iterWeight($data, $this->params('term'), $csrf);
        $this->getTaxonomyManager()->flush();
        return true;
    }

    public function orderAssociatedAction()
    {
        $association = $this->params('association');
        $term = $this->getTerm($this->params('term'));
        $this->assertGranted('taxonomy.term.associated.sort', $term);

        if ($this->getRequest()->isPost()) {
            $associations = $this->params()->fromPost('sortable', []);
            $i = 0;

            foreach ($associations as $a) {
                $term->positionAssociatedObject($a['id'], $i, $association);
                $i++;
            }

            $this->getTaxonomyManager()->flush();

            return true;
        }

        $associations = $term->getAssociated($association);
        $view = new ViewModel([
            'term' => $term,
            'associations' => $associations,
            'association' => $association,
        ]);
        $view->setTemplate('taxonomy/term/order-associated');
        return $view;
    }

    public function organizeAction()
    {
        $term = $this->getTerm();
        if (
            $this->assertGranted('taxonomy.term.create', $term) ||
            $this->assertGranted('taxonomy.term.update', $term)
        ) {
            throw new UnauthorizedException();
        }
        $view = new ViewModel([
            'orderForm' => new CsrfForm('taxonomy-sort'),
            'term' => $term,
        ]);
        $view->setTemplate('taxonomy/term/organize');
        return $view;
    }

    public function updateAction()
    {
        $term = $this->getTerm();
        $form = $this->termForm;
        $this->assertGranted('taxonomy.term.update', $term);
        $form->bind($term);

        if ($this->getRequest()->isPost()) {
            $data = json_decode($this->getRequest()->getContent(), true);
            $form->setData($data);
            if ($form->isValid()) {
                $this->getTaxonomyManager()->updateTerm($form);
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage(
                    'Your changes have been saved!'
                );
                $redirectUrl = $this->referer()->fromStorage();
                return new JsonModel([
                    'success' => true,
                    'redirect' => $redirectUrl,
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'errors' => $form->getMessages(),
                ]);
            }
        } else {
            $this->referer()->store();
        }

        $data = [
            'id' => $term->getId(),
            'term' => [
                'name' => $term->getName(),
            ],
            'taxonomy' => $term->getTaxonomy()->getId(),
            'parent' => $term->getParent()->getId(),
            'position' => $term->getPosition(),
            'description' => $term->getDescription(),
        ];
        $state = htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8');
        $view = new ViewModel(['state' => $state]);
        $view->setTemplate('taxonomy/term/update');
        return $view;
    }

    protected function iterWeight($terms, $parent = null, $csrf)
    {
        $position = 1;
        $form = $this->termForm;
        foreach ($terms as $term) {
            $entity = $this->getTaxonomyManager()->getTerm($term['id']);
            $data = $form->getHydrator()->extract($entity);
            $data = array_merge($data, [
                'parent' => $parent,
                'position' => $position,
                'csrf' => $csrf,
            ]);
            $form->bind($entity);
            $form->setData($data);
            $this->getTaxonomyManager()->updateTerm($form);
            if (isset($term['children'])) {
                $this->iterWeight($term['children'], $term['id'], $csrf);
            }
            $position++;
        }
        return true;
    }
}
