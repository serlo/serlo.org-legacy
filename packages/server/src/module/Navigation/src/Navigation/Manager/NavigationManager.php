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
namespace Navigation\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use Authorization\Service\AuthorizationService;
use ClassResolver\ClassResolverInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceManagerInterface;
use Navigation\Entity\ContainerInterface;
use Navigation\Entity\PageInterface;
use Navigation\Entity\ParameterInterface;
use Navigation\Entity\ParameterKeyInterface;
use Navigation\Exception\ContainerNotFoundException;
use Navigation\Exception\PageNotFoundException;
use Navigation\Exception\ParameterNotFoundException;
use Navigation\Exception\RuntimeException;
use Type\Entity\TypeInterface;
use Type\TypeManagerInterface;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\Form\FormInterface;

class NavigationManager implements NavigationManagerInterface
{
    use AuthorizationAssertionTrait, EventManagerAwareTrait;

    /**
     * @var ObjectManager
     */
    protected $objectManager;

    /**
     * @var TypeManagerInterface
     */
    protected $typeManager;

    /**
     * @var InstanceManagerInterface
     */
    protected $instanceManager;

    /**
     * @var ClassResolverInterface
     */
    protected $classResolver;

    /**
     * @var array
     */
    protected $interfaces = [
        'container' => 'Navigation\Entity\ContainerInterface',
        'page'      => 'Navigation\Entity\PageInterface',
        'parameter' => 'Navigation\Entity\ParameterInterface',
        'key'       => 'Navigation\Entity\ParameterKeyInterface',
    ];

    /**
     * @var array
     */
    protected $types = [
        'default',
        'footer-left',
        'footer-right',
        'top-left',
        'top-right',
        'social',
        'subject-nav',
    ];

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceManagerInterface $instanceManager,
        ObjectManager $objectManager,
        TypeManagerInterface $typeManager
    ) {
        $this->objectManager        = $objectManager;
        $this->typeManager          = $typeManager;
        $this->instanceManager      = $instanceManager;
        $this->classResolver        = $classResolver;
        $this->authorizationService = $authorizationService;
    }

    /**
     * @param FormInterface $form
     * @return ContainerInterface
     */
    public function createContainer(FormInterface $form)
    {
        /* @var $entity FormInterface */
        $entity = $this->classResolver->resolve($this->interfaces['container']);
        $this->getEventManager()->trigger('container.create', $this);
        return $this->bind($entity, $form);
    }

    /**
     * @param FormInterface $form
     * @return PageInterface
     */
    public function createPage(FormInterface $form)
    {
        /* @var $entity PageInterface */
        $entity = $this->classResolver->resolve($this->interfaces['page']);
        $this->getEventManager()->trigger('page.create', $this);
        return $this->bind($entity, $form);
    }

    /**
     * @param FormInterface $form
     * @return ParameterInterface
     */
    public function createParameter(FormInterface $form)
    {
        /* @var $entity ParameterInterface */
        $entity = $this->classResolver->resolve($this->interfaces['parameter']);
        $this->getEventManager()->trigger('parameter.create', $this);
        return $this->bind($entity, $form);
    }

    /**
     * @param FormInterface $form
     * @return ParameterKeyInterface
     */
    public function createParameterKey(FormInterface $form)
    {
        /* @var $entity ParameterKeyInterface */
        $entity = $this->classResolver->resolve($this->interfaces['key']);
        $this->getEventManager()->trigger('parameter.key.create', $this);
        return $this->bind($entity, $form);
    }

    /**
     * @param string            $name
     * @param InstanceInterface $instance
     * @throws ContainerNotFoundException
     * @return ContainerInterface
     */
    public function findContainerByNameAndInstance($name, InstanceInterface $instance)
    {
        $className  = $this->classResolver->resolveClassName($this->interfaces['container']);
        $repository = $this->objectManager->getRepository($className);
        $type       = $this->typeManager->findTypeByName($name);
        $container  = $repository->findOneBy(
            [
                'type'     => $type->getId(),
                'instance' => $instance->getId(),
            ]
        );

        if (!is_object($container)) {
            throw new ContainerNotFoundException(sprintf("Container %s, %s not found", $type, $instance));
        }

        return $container;
    }

    /**
     * @param InstanceInterface $instance
     * @return ContainerInterface[]
     */
    public function findContainersByInstance(InstanceInterface $instance)
    {
        $className  = $this->classResolver->resolveClassName($this->interfaces['container']);
        $repository = $this->objectManager->getRepository($className);

        return $repository->findBy(
            [
                'instance' => $instance->getId(),
            ]
        );
    }

    /**
     * @return void
     */
    public function flush()
    {
        $this->objectManager->flush();
    }

    /**
     * @param int $id
     * @return ContainerInterface
     * @throws ContainerNotFoundException
     */
    public function getContainer($id)
    {
        $className = $this->classResolver->resolveClassName($this->interfaces['container']);
        $container = $this->objectManager->find($className, $id);

        if (!is_object($container)) {
            throw new ContainerNotFoundException(sprintf("Container %s not found", $id));
        }

        $this->assertGranted('navigation.manage', $container);

        return $container;
    }

    /**
     * @param int $id
     * @return PageInterface
     * @throws PageNotFoundException
     */
    public function getPage($id)
    {
        $className = $this->classResolver->resolveClassName($this->interfaces['page']);
        $page      = $this->objectManager->find($className, $id);

        if (!is_object($page)) {
            throw new PageNotFoundException(sprintf("Container %s not found", $id));
        }
        $this->assertGranted('navigation.manage', $page);

        return $page;
    }

    /**
     * @param int $id
     * @return ParameterInterface
     * @throws ParameterNotFoundException
     */
    public function getParameter($id)
    {
        $className = $this->classResolver->resolveClassName($this->interfaces['parameter']);
        $parameter = $this->objectManager->find($className, $id);

        if (!is_object($parameter)) {
            throw new ParameterNotFoundException(sprintf("Container %s not found", $id));
        }

        $this->assertGranted('navigation.manage', $parameter);

        return $parameter;
    }

    /**
     * @return ParameterKeyInterface[]
     */
    public function getParameterKeys()
    {
        $className = $this->classResolver->resolveClassName($this->interfaces['key']);
        return $this->objectManager->getRepository($className)->findAll();
    }

    /**
     * @return TypeInterface[]
     */
    public function getTypes()
    {
        $return = [];
        $types  = $this->typeManager->findAllTypes();

        foreach ($types as $type) {
            if (in_array($type->getName(), $this->types)) {
                $return[] = $type;
            }
        }

        return $return;
    }

    /**
     * @param int $id
     * @throws ContainerNotFoundException
     * @return void
     */
    public function removeContainer($id)
    {
        $container = $this->getContainer($id);
        $this->assertGranted('navigation.manage', $container);
        $this->objectManager->remove($container);
        $this->getEventManager()->trigger('container.remove', $this);
    }

    /**
     * @param int $id
     * @return void
     */
    public function removePage($id)
    {
        $page = $this->getPage($id);
        $this->assertGranted('navigation.manage', $page);
        $this->objectManager->remove($page);
        $this->getEventManager()->trigger('page.remove', $this);
    }

    /**
     * @param int $id
     * @return void
     */
    public function removeParameter($id)
    {
        $parameter = $this->getParameter($id);
        $this->assertGranted('navigation.manage', $parameter);
        $this->objectManager->remove($parameter);
        $this->getEventManager()->trigger('parameter.remove', $this);
    }

    /**
     * @param FormInterface $form
     * @return void
     * @throws RuntimeException
     */
    public function updatePage(FormInterface $form)
    {
        $object = $form->getObject();
        $this->assertGranted('navigation.manage', $object);

        if (!$form->isValid()) {
            throw new RuntimeException(print_r($form->getMessages()));
        }

        $this->objectManager->persist($object);
        $this->getEventManager()->trigger('page.update', $this);
    }

    /**
     * @param FormInterface $form
     * @return void
     * @throws RuntimeException
     */
    public function updateParameter(FormInterface $form)
    {
        $object = $form->getObject();

        $this->assertGranted('navigation.manage', $object);

        if (!$form->isValid()) {
            throw new RuntimeException(print_r($form->getMessages()));
        }

        $this->objectManager->persist($object);
        $this->getEventManager()->trigger('parameter.update', $this);
    }

    /**
     * @param object        $object
     * @param FormInterface $form
     * @return object
     * @throws RuntimeException
     */
    protected function bind($object, FormInterface $form)
    {
        $processingForm = clone $form;
        $data           = $processingForm->getData(FormInterface::VALUES_AS_ARRAY);

        $processingForm->bind($object);
        $processingForm->setData($data);

        if (!$processingForm->isValid()) {
            throw new RuntimeException(print_r($processingForm->getMessages(), true));
        }

        if ($object instanceof ParameterKeyInterface) {
            $instance = $this->instanceManager->getInstanceFromRequest();
        } else {
            $instance = $object;
        }

        $this->assertGranted('navigation.manage', $instance);
        $this->objectManager->persist($object);
        return $object;
    }
}
