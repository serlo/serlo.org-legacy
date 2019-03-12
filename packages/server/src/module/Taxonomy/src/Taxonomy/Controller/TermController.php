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
namespace Taxonomy\Controller;

use Common\Form\CsrfForm;
use Entity\Manager\EntityManagerAwareTrait;
use Entity\Manager\EntityManagerInterface;
use Versioning\Filter\HasHeadCollectionFilter;
use Instance\Manager\InstanceManagerInterface;
use Taxonomy\Form\BatchCopyForm;
use Taxonomy\Form\BatchMoveForm;
use Taxonomy\Form\TermForm;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Uuid\Filter\NotTrashedCollectionFilter;
use Zend\View\Model\ViewModel;
use ZfcRbac\Exception\UnauthorizedException;
use Zend\Filter\FilterChain;

class TermController extends AbstractController
{
    use EntityManagerAwareTrait;

    /**
     * @param InstanceManagerInterface $instanceManager
     * @param EntityManagerInterface   $entityManager
     * @param TaxonomyManagerInterface $taxonomyManager
     * @param TermForm                 $termForm
     */
    public function __construct(
        InstanceManagerInterface $instanceManager,
        EntityManagerInterface $entityManager,
        TaxonomyManagerInterface $taxonomyManager,
        TermForm $termForm
    ) {
        $this->instanceManager = $instanceManager;
        $this->taxonomyManager = $taxonomyManager;
        $this->termForm        = $termForm;
        $this->entityManager   = $entityManager;
    }

    public function createAction()
    {
        $this->assertGranted('taxonomy.term.create');
        $form = $this->termForm;

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $data = array_merge(
                $data,
                [
                    'taxonomy' => $this->params('taxonomy'),
                    'parent'   => $this->params('parent', null),

                ]
            );
            $form->setData($data);
            if ($form->isValid()) {
                $this->getTaxonomyManager()->createTerm($form);
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage('The node has been added successfully!');
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }
        $view = new ViewModel(['form' => $form, 'isUpdating' => false]);
        $this->layout('editor/layout');
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
            $data = array_merge(
                $data,
                [
                    'taxonomy' => $this->params('taxonomy'),
                    'parent'   => $this->params('parent', null),
                ]
            );
            $form->setData($data);
            if ($form->isValid()) {
                $data        = $form->getData();
                $destination = $this->getTaxonomyManager()->getTerm($data['destination']);
                foreach ($data['associations'] as $element) {
                    $entity = $this->getEntityManager()->getEntity($element);
                    $this->getTaxonomyManager()->associateWith($destination, $entity);
                    $this->getTaxonomyManager()->removeAssociation($term, $entity);
                }
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage('Items moved successfully!');
                return $this->redirect()->toRoute('taxonomy/term/get', ['term' => $destination->getId()]);
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
            $data = array_merge(
                $data,
                [
                    'taxonomy' => $this->params('taxonomy'),
                    'parent'   => $this->params('parent', null),
                ]
            );
            $form->setData($data);
            if ($form->isValid()) {
                $data        = $form->getData();
                $destination = $this->getTaxonomyManager()->getTerm($data['destination']);
                foreach ($data['associations'] as $element) {
                    $entity = $this->getEntityManager()->getEntity($element);
                    $this->getTaxonomyManager()->associateWith($destination, $entity);
                }
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage('Items copied successfully!');
                return $this->redirect()->toRoute('taxonomy/term/get', ['term' => $destination->getId()]);
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

        $options  = [];
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
        $term        = $this->getTerm($this->params('term'));
        $this->assertGranted('taxonomy.term.associated.sort', $term);

        if ($this->getRequest()->isPost()) {
            $associations = $this->params()->fromPost('sortable', []);
            $i            = 0;

            foreach ($associations as $a) {
                $term->positionAssociatedObject($a['id'], $i, $association);
                $i++;
            }

            $this->getTaxonomyManager()->flush();

            return true;
        }

        $associations = $term->getAssociated($association);
        $view         = new ViewModel([
            'term'         => $term,
            'associations' => $associations,
            'association'  => $association,
        ]);
        $view->setTemplate('taxonomy/term/order-associated');
        return $view;
    }

    public function organizeAction()
    {
        $term = $this->getTerm();
        if ($this->assertGranted('taxonomy.term.create', $term)
            || $this->assertGranted(
                'taxonomy.term.update',
                $term
            )
        ) {
            throw new UnauthorizedException;
        }
        $view = new ViewModel(['orderForm' => new CsrfForm('taxonomy-sort'), 'term' => $term]);
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
            $post = $this->getRequest()->getPost();
            $form->setData($post);
            if ($form->isValid()) {
                $this->getTaxonomyManager()->updateTerm($form);
                $this->getTaxonomyManager()->flush();
                $this->flashMessenger()->addSuccessMessage('Your changes have been saved!');
                return $this->redirect()->toUrl($this->referer()->fromStorage());
            }
        } else {
            $this->referer()->store();
        }

        $view = new ViewModel(['form' => $form]);
        $this->layout('editor/layout');
        $view->setTemplate('taxonomy/term/update');
        return $view;
    }

    protected function iterWeight($terms, $parent = null, $csrf)
    {
        $position = 1;
        $form     = $this->termForm;
        foreach ($terms as $term) {
            $entity = $this->getTaxonomyManager()->getTerm($term['id']);
            $data   = $form->getHydrator()->extract($entity);
            $data   = array_merge($data, ['parent' => $parent, 'position' => $position, 'csrf' => $csrf]);
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
