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
 * @author      Jakob Pfab (jakob.pfab@serlo.org)
 * @author      Aeneas Rekkas (aeneas.rekkas@serlo.org)
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace Page\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use Authorization\Service\RoleServiceAwareTrait;
use Authorization\Service\RoleServiceInterface;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Entity\InstanceInterface;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use License\Manager\LicenseManagerAwareTrait;
use License\Manager\LicenseManagerInterface;
use Page\Entity\PageRepositoryInterface;
use Page\Exception\InvalidArgumentException;
use Page\Exception\PageNotFoundException;
use Page\Exception\RuntimeException;
use User\Entity\UserInterface;
use User\Manager\UserManagerAwareTrait;
use User\Manager\UserManagerInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Versioning\RepositoryManagerAwareTrait;
use Versioning\RepositoryManagerInterface;
use Zend\Form\FormInterface;
use ZfcRbac\Service\AuthorizationService;

class PageManager implements PageManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;
    use InstanceManagerAwareTrait, AuthorizationAssertionTrait;
    use LicenseManagerAwareTrait, RepositoryManagerAwareTrait;
    use RoleServiceAwareTrait, UserManagerAwareTrait;
    use FlushableTrait;

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceManagerInterface $instanceManager,
        LicenseManagerInterface $licenseManager,
        ObjectManager $objectManager,
        RepositoryManagerInterface $repositoryManager,
        RoleServiceInterface $roleService,
        UserManagerInterface $userManager
    ) {
        $this->setAuthorizationService($authorizationService);
        $this->classResolver     = $classResolver;
        $this->instanceManager   = $instanceManager;
        $this->licenseManager    = $licenseManager;
        $this->objectManager     = $objectManager;
        $this->repositoryManager = $repositoryManager;
        $this->roleService       = $roleService;
        $this->userManager       = $userManager;
    }

    /**
     * {@inheritDoc}
     * @see \Page\Manager\PageManagerInterface::createPageRepository()
     */
    public function createPageRepository(FormInterface $form)
    {
        $formClone = clone $form;
        if (!$formClone->isValid()) {
            throw new RuntimeException(print_r($formClone->getMessages(), true));
        }
        $data   = $formClone->getData(FormInterface::VALUES_AS_ARRAY);
        $entity = $formClone->getObject();
        $formClone->setData($data);
        $formClone->isValid();
        $this->assertGranted('page.create', $entity);
        $this->getObjectManager()->persist($entity);
        return $entity;
    }

    /**
     * {@inheritDoc}
     * @see \Page\Manager\PageManagerInterface::createRevision()
     */
    public function createRevision(PageRepositoryInterface $repository, array $data, UserInterface $user)
    {
        $this->assertGranted('page.revision.create', $repository);

        $revision = $this->getRepositoryManager()->commitRevision($repository, $data);

        $this->getRepositoryManager()->checkoutRevision($repository, $revision);
        $this->getObjectManager()->persist($revision);
        $this->getObjectManager()->persist($repository);

        return $repository;
    }

    /**
     * {@inheritDoc}
     * @see \Page\Manager\PageManagerInterface::editPageRepository()
     */
    public function editPageRepository(FormInterface $form)
    {
        $page = $form->getObject();
        if (!$form->isValid()) {
            throw new RuntimeException(print_r($form->getMessages(), true));
        }
        $data      = $form->getData(FormInterface::VALUES_AS_ARRAY);
        $formClone = clone $form;
        $formClone->bind($page);
        $formClone->setData($data);
        $formClone->isValid();
        $this->assertGranted('page.update', $page);
        $this->getObjectManager()->persist($page);
        return $page;
    }

    public function findAllRepositories(InstanceInterface $instance)
    {
        $this->assertGranted('page.get', $instance);
        $className    = $this->getClassResolver()->resolveClassName('Page\Entity\PageRepositoryInterface');
        $params       = ['instance' => $instance->getId(), 'trashed' => false];
        $repositories = $this->getObjectManager()->getRepository($className)->findBy($params);
        return $repositories;
    }

    public function findAllRoles()
    {
        return $this->getRoleService()->findAllRoles();
    }

    /**
     * {@inheritDoc}
     * @see \Page\Manager\PageManagerInterface::getPageRepository()
     */
    public function getPageRepository($id)
    {
        if (!is_numeric($id)) {
            throw new InvalidArgumentException(sprintf('Expected numeric but got %s', gettype($id)));
        }

        $className      = $this->getClassResolver()->resolveClassName('Page\Entity\PageRepositoryInterface');
        $pageRepository = $this->getObjectManager()->find($className, $id);

        if (!is_object($pageRepository)) {
            throw new PageNotFoundException(sprintf('Page Repository "%d" not found.', $id));
        } elseif ($pageRepository->isTrashed()) {
            throw new PageNotFoundException(sprintf('Page Repository "%d" is trashed.', $id));
        }

        $this->assertGranted('page.get', $pageRepository);

        return $pageRepository;
    }

    /**
     * {@inheritDoc}
     * @see \Page\Manager\PageManagerInterface::getRevision()
     */
    public function getRevision($id)
    {
        if (!is_numeric($id)) {
            throw new InvalidArgumentException(sprintf('Expected numeric but got %s', gettype($id)));
        }

        $className = $this->getClassResolver()->resolveClassName('Page\Entity\PageRevisionInterface');
        $revision  = $this->getObjectManager()->find($className, $id);
        $this->assertGranted('page.get', $revision);

        if (!$revision) {
            throw new PageNotFoundException(sprintf('Page Revision %s not found', $id));
        } else {
            if ($revision->isTrashed()) {
                throw new PageNotFoundException(sprintf('Page Revision %s is trashed', $id));
            }
        }

        return $revision;
    }

    protected function countRoles()
    {
        $roles = $this->findAllRoles();
        return count($roles);
    }

    protected function setRoles(array $data, PageRepositoryInterface $pageRepository)
    {
        $pageRepository->setRoles(new ArrayCollection());
        for ($i = 0; $i <= $this->countRoles(); $i++) {
            if (array_key_exists($i, $data['roles'])) {
                $role = $this->getRoleService()->getRole($data['roles'][$i]);
                if ($role != null) {
                    $pageRepository->addRole($role);
                }
            }
        }
    }
}
