<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace User\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use Common\Paginator\DoctrinePaginatorFactory;
use Common\Traits\AuthenticationServiceAwareTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use User\Entity\UserInterface;
use User\Exception\UserNotFoundException;
use User\Exception;
use User\Hydrator\UserHydrator;
use Zend\EventManager\EventManagerAwareTrait;

class UserManager implements UserManagerInterface
{
    use ClassResolverAwareTrait, ObjectManagerAwareTrait;
    use AuthenticationServiceAwareTrait, AuthorizationAssertionTrait;
    use EventManagerAwareTrait;

    /**
     * @var UserHydrator
     */
    protected $hydrator;

    /**
     * @var string
     */
    protected $mysql_timestamp_for_active_community;

    public function setMysqlTimestampForActiveCommunity(string $timestamp)
    {
        $this->mysql_timestamp_for_active_community = $timestamp;
    }

    public function getUser($id)
    {
        $user = $this->getObjectManager()->find(
            $this->getClassResolver()->resolveClassName(
                'User\Entity\UserInterface'
            ),
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
        $user = $this->getUserEntityRepository()->findOneBy([
            'token' => $username,
        ]);

        if (!$user) {
            throw new UserNotFoundException(
                sprintf('User %s not found', $username)
            );
        }

        return $user;
    }

    public function findUserByUsername($username)
    {
        $user = $this->getUserEntityRepository()->findOneBy([
            'username' => $username,
        ]);

        if (!$user) {
            throw new UserNotFoundException(
                sprintf('User %s not found', $username)
            );
        }

        return $user;
    }

    public function findUserByEmail($email)
    {
        $user = $this->getUserEntityRepository()->findOneBy([
            'email' => $email,
        ]);

        if (!$user) {
            throw new UserNotFoundException(
                sprintf('User with email %s not found', $email)
            );
        }

        return $user;
    }

    public function createUser(array $data)
    {
        $this->assertGranted('user.create');

        /** @var UserInterface $user */
        $user = $this->getClassResolver()->resolve('User\Entity\UserInterface');
        $user->setDate(new \DateTime());
        $this->getHydrator()->hydrate($data, $user);
        $this->getObjectManager()->persist($user);

        if (!$user->getId()) {
            $this->getObjectManager()->flush($user);
        }

        $this->getEventManager()->trigger('create', $this, [
            'user' => $user,
        ]);

        return $user;
    }

    public function getActiveAuthorIds()
    {
        return $this->getIds(
            'SELECT user.id as id, count(event_log.event_id) AS edit_counts ' .
                'FROM user JOIN event_log on user.id = event_log.actor_id ' .
                'WHERE event_log.event_id = 5 and event_log.date > DATE_SUB(' .
                $this->mysql_timestamp_for_active_community .
                ', Interval 90 day) ' .
                'GROUP BY user.id ' .
                'HAVING edit_counts > 10'
        );
    }

    public function getActiveReviewerIds()
    {
        return $this->getIds(
            'SELECT user.id AS id, user.username, count(e1.event_id) AS edit_counts ' .
                'FROM event_log AS e1 ' .
                'JOIN event_log AS e2 ON e1.uuid_id = e2.uuid_id AND (e1.event_id = 6 or e1.event_id = 11) ' .
                'AND e2.event_id = 5 AND e1.date >= e2.date AND e1.actor_id != e2.actor_id ' .
                'JOIN user ON user.id = e1.actor_id ' .
                'WHERE e1.date > DATE_SUB(' .
                $this->mysql_timestamp_for_active_community .
                ', Interval 90 day) ' .
                'GROUP BY user.id ' .
                'HAVING edit_counts > 10'
        );
    }

    protected function getIds(string $sql): array
    {
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        $queryResultNested = $q->fetchAll();
        $result = [];
        foreach ($queryResultNested as $queryResult) {
            $result[] = $queryResult['id'];
        }
        return array_map(function ($x) {
            return (int) $x;
        }, $result);
    }

    public function findAllUsers($page = 0, $limit = 50)
    {
        $className = $this->getClassResolver()->resolveClassName(
            'User\Entity\UserInterface'
        );
        $dql = 'SELECT u FROM ' . $className . ' u ' . 'ORDER BY u.id DESC';
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

    /**
     * @inheritDoc
     */
    public function mergeFields($user, $data)
    {
        foreach ($data as $key => $value) {
            if (is_string($key) && is_string($value)) {
                $user->setField($key, $value);
            }
        }
        $this->persist($user);
    }

    public function flush()
    {
        $this->getObjectManager()->flush();
        return $this;
    }

    protected function getUserEntityRepository()
    {
        return $this->getObjectManager()->getRepository(
            $this->getClassResolver()->resolveClassName(
                'User\Entity\UserInterface'
            )
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
        $this->getEventManager()->trigger('update', $this, [
            'user' => $object,
        ]);
        return $this;
    }
}
