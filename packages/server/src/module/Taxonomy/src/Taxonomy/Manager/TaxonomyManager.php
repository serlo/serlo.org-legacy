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
namespace Taxonomy\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceManager;
use Taxonomy\Entity\TaxonomyInterface;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Exception;
use Taxonomy\Exception\RuntimeException;
use Taxonomy\Form\TermForm;
use Taxonomy\Hydrator\TaxonomyTermHydrator;
use Taxonomy\Options\ModuleOptions;
use Type\TypeManagerAwareTrait;
use Type\TypeManagerInterface;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\Form\FormInterface;
use ZfcRbac\Service\AuthorizationService;

class TaxonomyManager implements TaxonomyManagerInterface
{
    use ClassResolverAwareTrait, ObjectManagerAwareTrait;
    use TypeManagerAwareTrait, EventManagerAwareTrait;
    use FlushableTrait, AuthorizationAssertionTrait;

    /**
     * @var TaxonomyTermHydrator
     */
    protected $hydrator;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @var InstanceManager
     */
    protected $instanceManager;

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        ModuleOptions $moduleOptions,
        InstanceManager $instanceManager,
        ObjectManager $objectManager,
        TypeManagerInterface $typeManager
    ) {
        $this->classResolver = $classResolver;
        $this->moduleOptions = $moduleOptions;
        $this->objectManager = $objectManager;
        $this->typeManager   = $typeManager;
        $this->setAuthorizationService($authorizationService);
        $this->instanceManager = $instanceManager;
    }

    public function associateWith($term, TaxonomyTermAwareInterface $object, $position = null)
    {
        if (!$term instanceof TaxonomyTermInterface) {
            $term = $this->getTerm($term);
        }

        $this->assertGranted('taxonomy.term.associate', $term);

        if (!$this->isAssociableWith($term, $object)) {
            throw new Exception\RuntimeException(
                sprintf(
                    'Taxonomy "%s" can\'t be associated with "%s"',
                    $term->getTaxonomy()->getName(),
                    get_class($object)
                )
            );
        }

        if ($term->isAssociated($object)) {
            return;
        }

        $term->associateObject($object);

        try {
            if ($position !== null) {
                $term->positionAssociatedObject($object, (int)$position);
            } else {
                $field = $term->getAssociationFieldName($object);
                $term->positionAssociatedObject($object, $term->countAssociations($field) + 1);
            }
        } catch (Exception\SortingNotSupported $e) {
            // Sorting obviously not supported...nothing to do
        }
        $this->getEventManager()->trigger('associate', $this, ['object' => $object, 'term' => $term]);
        $this->getObjectManager()->persist($term);
    }

    /**
     * @param TermForm $termForm
     * @return TaxonomyTermInterface
     */
    public function createRoot(TermForm $termForm)
    {
        $instance = $this->instanceManager->getInstanceFromRequest();
        $termForm->setData(
            [
                'instance' => $instance,
                'term'     => [
                    'name' => 'root',
                ],
                'taxonomy' => $this->findTaxonomyByName('root', $instance),
            ]
        );
        return $this->createTerm($termForm);
    }

    public function createTerm(FormInterface $form)
    {
        $term = $this->getClassResolver()->resolve('Taxonomy\Entity\TaxonomyTermInterface');
        $this->bind($term, $form);
        $this->assertGranted('taxonomy.term.create', $term);
        $this->getEventManager()->trigger('create', $this, ['term' => $term]);
        return $term;
    }

    public function findAllTerms($bypassInstanceIsolation = false)
    {
        $old = $this->objectManager->getBypassIsolation();
        $this->objectManager->setBypassIsolation($bypassInstanceIsolation);
        $className = $this->getClassResolver()->resolveClassName('Taxonomy\Entity\TaxonomyTermInterface');
        $terms     = $this->getObjectManager()->getRepository($className)->findAll();
        $this->objectManager->setBypassIsolation($old);
        return new ArrayCollection($terms);
    }

    public function findAllTaxonomies(InstanceInterface $instance)
    {
        $className = $this->getClassResolver()->resolveClassName('Taxonomy\Entity\TaxonomyInterface');
        $criteria  = ['instance' => $instance->getId()];
        $entities  = $this->getObjectManager()->getRepository($className)->findBy($criteria);

        foreach ($entities as $entity) {
            $this->assertGranted('taxonomy.get', $entity);
        }
        return $entities;
    }

    public function findTaxonomyByName($name, InstanceInterface $instance)
    {
        $className = $this->getClassResolver()->resolveClassName('Taxonomy\Entity\TaxonomyInterface');
        $type      = $this->getTypeManager()->findTypeByName($name);
        $criteria  = ['type' => $type->getId(), 'instance' => $instance->getId()];
        $entity    = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (!is_object($entity)) {
            $this->assertGranted('taxonomy.create', $instance);

            /* @var $entity \Taxonomy\Entity\TaxonomyInterface */
            $entity = $this->getClassResolver()->resolve('Taxonomy\Entity\TaxonomyInterface');
            $entity->setInstance($instance);
            $entity->setType($type);

            if ($this->getObjectManager()->isOpen()) {
                $this->getObjectManager()->persist($entity);
                $this->getObjectManager()->flush($entity);
            }
        }

        $this->assertGranted('taxonomy.get', $entity);
        return $entity;
    }

    public function findTermByName(TaxonomyInterface $taxonomy, array $ancestors)
    {
        if (!count($ancestors)) {
            throw new Exception\RuntimeException('Ancestors are empty');
        }

        $terms          = $taxonomy->getChildren();
        $ancestorsFound = 0;
        $found          = false;
        foreach ($ancestors as &$element) {
            if (is_string($element) && strlen($element) > 0) {
                $element = strtolower($element);
                foreach ($terms as $term) {
                    $found = false;
                    if (strtolower($term->getName()) == strtolower($element)) {
                        $terms = $term->getChildren();
                        $found = $term;
                        $ancestorsFound++;
                        break;
                    }
                }
                if (!is_object($found)) {
                    break;
                }
            }
        }

        if (!is_object($found)) {
            throw new Exception\TermNotFoundException(
                sprintf(
                    'Could not find term with acestors: %s',
                    implode(',', $ancestors)
                )
            );
        }

        if ($ancestorsFound != count($ancestors)) {
            throw new Exception\TermNotFoundException(
                sprintf(
                    'Could not find term with acestors: %s. Ancestor ratio %s:%s does not equal 1:1',
                    implode(',', $ancestors),
                    $ancestorsFound,
                    count($ancestors)
                )
            );
        }

        return $found;
    }

    public function getModuleOptions()
    {
        return $this->moduleOptions;
    }

    public function setModuleOptions(ModuleOptions $moduleOptions)
    {
        $this->moduleOptions = $moduleOptions;
    }

    public function getTaxonomy($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Taxonomy\Entity\TaxonomyInterface');
        $entity    = $this->getObjectManager()->find($className, $id);

        if (!is_object($entity)) {
            throw new Exception\RuntimeException(sprintf('Term with id %s not found', $id));
        }
        return $entity;
    }

    public function getTerm($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Taxonomy\Entity\TaxonomyTermInterface');
        $entity    = $this->getObjectManager()->find($className, $id);

        if (!is_object($entity)) {
            throw new Exception\TermNotFoundException(sprintf('Term with id %s not found', $id));
        }
        $this->assertGranted('taxonomy.term.get', $entity);
        return $entity;
    }

    public function isAssociableWith($term, TaxonomyTermAwareInterface $object)
    {
        if (!$term instanceof TaxonomyTermInterface) {
            $term = $this->getTerm($term);
        }
        $taxonomy = $term->getTaxonomy();
        $this->assertGranted('taxonomy.term.associate', $term);

        if (!$this->getModuleOptions()->getType($taxonomy->getName())->isAssociationAllowed($object)) {
            return false;
        }
        return true;
    }

    public function removeAssociation($id, TaxonomyTermAwareInterface $object)
    {
        $term = $this->getTerm($id);
        if (!$term->isAssociated($object)) {
            return;
        }
        $this->assertGranted('taxonomy.term.dissociate', $term);
        $term->removeAssociation($object);
        $this->getEventManager()->trigger('dissociate', $this, ['object' => $object, 'term' => $term]);
        $this->getObjectManager()->persist($term);
    }

    public function updateTerm(FormInterface $form)
    {
        /* @var $objectManager EntityManager */
        $objectManager = $this->objectManager;
        $term          = $this->bind($form->getObject(), $form);
        $unitOfWork    = $objectManager->getUnitOfWork();

        $this->assertGranted('taxonomy.term.update', $term);
        $unitOfWork->computeChangeSets();

        $changeSet = $unitOfWork->getEntityChangeSet($term);

        if (!empty($changeSet)) {
            $this->getEventManager()->trigger('update', $this, ['term' => $term]);
            if (isset($changeSet['parent'])) {
                $this->getEventManager()->trigger(
                    'parent.change',
                    $this,
                    [
                        'term' => $term,
                        'from' => $changeSet['parent'][0]->getParent(),
                        'to'   => $changeSet['parent'][1]->getParent(),
                    ]
                );
            }
        }

        return $term;
    }

    /**
     * @param TaxonomyTermInterface $object
     * @param FormInterface         $form
     * @return TaxonomyTermInterface
     * @throws \Taxonomy\Exception\RuntimeException
     */
    protected function bind(TaxonomyTermInterface $object, FormInterface $form)
    {
        if (!$form->isValid()) {
            throw new RuntimeException(
                print_r(
                    [$form->getMessages(), $form->getData(FormInterface::VALUES_AS_ARRAY)],
                    true
                )
            );
        }
        $processingForm = clone $form;
        $data           = $form->getData(FormInterface::VALUES_AS_ARRAY);
        $processingForm->bind($object);
        $processingForm->setData($data);
        $processingForm->isValid();
        $this->objectManager->persist($object);
        return $object;
    }
}
