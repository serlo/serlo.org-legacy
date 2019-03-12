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
namespace User\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use Common\Paginator\DoctrinePaginatorFactory;
use Common\Traits\AuthenticationServiceAwareTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use User\Exception\UserNotFoundException;
use User\Exception;
use User\Hydrator\UserHydrator;

class UserManager implements UserManagerInterface
{
    use ClassResolverAwareTrait, ObjectManagerAwareTrait;
    use AuthenticationServiceAwareTrait, AuthorizationAssertionTrait;

    /**
     * @var UserHydrator
     */
    protected $hydrator;

    public function getUser($id)
    {
        $user = $this->getObjectManager()->find(
            $this->getClassResolver()->resolveClassName('User\Entity\UserInterface'),
            $id
        );
        if (!$user) {
            throw new UserNotFoundException(sprintf('User %s not found', $id));
        }

        return $user;
    }

    public function getUserFromAuthenticator()
    {
        if ($this->getAuthenticationService()->hasIdentity()) {
            $user = $this->getAuthenticationService()->getIdentity();
            try {
                $user = $this->getUser($user->getId());
                if (!$this->getAuthorizationService()->isGranted('login')) {
                    $this->getAuthenticationService()->clearIdentity();
                } else {
                    return $user;
                }
            } catch (UserNotFoundException $e) {
                $this->getAuthenticationService()->clearIdentity();
            }
        }

        return null;
    }

    public function findUserByToken($username)
    {
        $user = $this->getUserEntityRepository()->findOneBy(
            [
                'token' => $username,
            ]
        );

        if (!$user) {
            throw new UserNotFoundException(sprintf('User %s not found', $username));
        }

        return $user;
    }

    public function findUserByUsername($username)
    {
        $user = $this->getUserEntityRepository()->findOneBy(
            [
                'username' => $username,
            ]
        );

        if (!$user) {
            throw new UserNotFoundException(sprintf('User %s not found', $username));
        }

        return $user;
    }

    public function findUserByEmail($email)
    {
        $user = $this->getUserEntityRepository()->findOneBy(
            [
                'email' => $email,
            ]
        );

        if (!$user) {
            throw new UserNotFoundException(sprintf('User with email %s not found', $email));
        }

        return $user;
    }

    public function createUser(array $data)
    {
        $this->assertGranted('user.create');

        $user = $this->getClassResolver()->resolve('User\Entity\UserInterface');
        $this->getHydrator()->hydrate($data, $user);
        $this->getObjectManager()->persist($user);

        return $user;
    }

    public function findAllUsers($page = 0, $limit = 50)
    {
        $className = $this->getClassResolver()->resolveClassName('User\Entity\UserInterface');
        $dql       = 'SELECT u FROM ' . $className . ' u ' . 'ORDER BY u.id DESC';
        $paginator = new DoctrinePaginatorFactory($this->objectManager);
        $paginator = $paginator->createPaginator($dql, $page, $limit);
        return $paginator;
    }

    public function updateUserPassword($id, $password)
    {
        $user = $this->getUser($id);
        $user->setPassword($password);
        $this->getObjectManager()->persist($user);
    }

    public function generateUserToken($id)
    {
        $user = $this->getUser($id);
        $user->generateToken();
        $this->getObjectManager()->persist($user);
    }

    public function flush()
    {
        $this->getObjectManager()->flush();

        return $this;
    }

    protected function getUserEntityRepository()
    {
        return $this->getObjectManager()->getRepository(
            $this->getClassResolver()->resolveClassName('User\Entity\UserInterface')
        );
    }

    /**
     * @return UserHydrator
     */
    public function getHydrator()
    {
        return $this->hydrator;
    }

    /**
     * @param UserHydrator $hydrator
     * @return self
     */
    public function setHydrator(UserHydrator $hydrator)
    {
        $this->hydrator = $hydrator;

        return $this;
    }

    public function persist($object)
    {
        $this->getObjectManager()->persist($object);

        return $this;
    }
}
