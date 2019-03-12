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
namespace Authorization\Service;

use Authorization\Entity\ParametrizedPermissionInterface;
use Authorization\Entity\RoleInterface;
use Authorization\Exception\RoleNotFoundException;
use Authorization\Exception\RuntimeException;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Persistence\ObjectManager;
use User\Entity\Role;
use User\Entity\UserInterface;
use User\Manager\UserManagerAwareTrait;
use User\Manager\UserManagerInterface;
use Zend\Form\FormInterface;

class RoleService implements RoleServiceInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait, UserManagerAwareTrait, PermissionServiceAwareTrait,
        AuthorizationAssertionTrait;

    protected $interface = 'Authorization\Entity\RoleInterface';

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        ObjectManager $objectManager,
        PermissionServiceInterface $permissionService,
        UserManagerInterface $userManager
    ) {
        $this->authorizationService = $authorizationService;
        $this->classResolver        = $classResolver;
        $this->objectManager        = $objectManager;
        $this->userManager          = $userManager;
        $this->permissionService    = $permissionService;
    }

    public function createRole(FormInterface $form)
    {
        $this->assertGranted('authorization.role.create');

        if (!$form->isValid()) {
            throw new RuntimeException(print_r($form->getMessages(), true));
        }

        $processingForm = clone $form;
        $data           = $processingForm->getData(FormInterface::VALUES_AS_ARRAY);
        $processingForm->bind(new Role());
        $processingForm->setData($data);

        if (!$processingForm->isValid()) {
            throw new RuntimeException(print_r($processingForm->getMessages(), true));
        }

        $this->objectManager->persist($processingForm->getObject());
        return $processingForm->getObject();
    }

    public function findAllRoles()
    {
        $className = $this->getClassResolver()->resolveClassName($this->interface);
        return $this->getObjectManager()->getRepository($className)->findAll();
    }

    public function findRoleByName($name)
    {
        $className = $this->getClassResolver()->resolveClassName($this->interface);
        return $this->getObjectManager()->getRepository($className)->findOneBy(['name' => $name]);
    }

    public function flush()
    {
        $this->getObjectManager()->flush();
    }

    public function getRole($id)
    {
        $className = $this->getClassResolver()->resolveClassName($this->interface);
        $role      = $this->getObjectManager()->find($className, $id);
        if (!is_object($role)) {
            throw new RoleNotFoundException(sprintf('Role `%d` not found', $id));
        }

        return $role;
    }

    public function grantIdentityRole($role, $user)
    {
        if (!$role instanceof RoleInterface) {
            $role = $this->getRole($role);
        }

        if (!$user instanceof UserInterface) {
            $user = $this->getUserManager()->getUser($user);
        }

        $this->assertGranted('authorization.identity.grant.role', $role);

        if (!$user->hasRole($role)) {
            $role->addUser($user);
        }
    }

    public function grantRolePermission($role, $permission)
    {
        $this->assertGranted('authorization.role.grant.permission');

        if (!$role instanceof RoleInterface) {
            $role = $this->getRole($role);
        }

        if (!$permission instanceof ParametrizedPermissionInterface) {
            $permission = $this->getPermissionService()->getParametrizedPermission($permission);
        }

        $role->addPermission($permission);
    }

    public function removeIdentityRole($role, $user)
    {
        $role = $this->getRole($role);
        $this->assertGranted('authorization.identity.revoke.role', $role);
        $user = $this->getUserManager()->getUser($user);
        if ($user->hasRole($role)) {
            $role->removeUser($user);
        }
    }

    public function removeRolePermission($role, $permission)
    {
        $this->assertGranted('authorization.role.revoke.permission');
        $permission = $this->getPermissionService()->getParametrizedPermission($permission);
        $role       = $this->getRole($role);
        $role->removePermission($permission);
    }
}
