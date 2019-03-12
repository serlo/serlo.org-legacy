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
namespace Uuid\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Util\ClassUtils;
use Doctrine\ORM\Query;
use Event\Entity\EventLog;
use Instance\Manager\InstanceAwareEntityManager;
use Uuid\Entity\UuidInterface;
use Uuid\Exception;
use Uuid\Exception\NotFoundException;
use Uuid\Options\ModuleOptions;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\Paginator\Adapter\ArrayAdapter;
use Zend\Paginator\Paginator;
use ZfcRbac\Service\AuthorizationService;

class UuidManager implements UuidManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;
    use EventManagerAwareTrait, FlushableTrait;
    use AuthorizationAssertionTrait;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @param AuthorizationService       $authorizationService
     * @param ClassResolverInterface     $classResolver
     * @param ModuleOptions              $moduleOptions
     * @param InstanceAwareEntityManager $objectManager
     */
    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        ModuleOptions $moduleOptions,
        InstanceAwareEntityManager $objectManager
    ) {
        $this->authorizationService = $authorizationService;
        $this->classResolver        = $classResolver;
        $this->objectManager        = $objectManager;
        $this->moduleOptions        = $moduleOptions;
    }

    /**
     * {@inheritDoc}
     */
    public function findAll()
    {
        $className = $this->getClassResolver()->resolveClassName('Uuid\Entity\UuidInterface');
        $entities  = $this->getObjectManager()->getRepository($className)->findAll();
        return new ArrayCollection($entities);
    }

    /**
     * {@inheritDoc}
     */
    public function findTrashed($page)
    {
        $className = $this->getClassResolver()->resolveClassName('Uuid\Entity\UuidInterface');
        $eventLogClassName = $this->getClassResolver()->resolveClassName('Event\Entity\EventLogInterface');
        $eventTypeClassName = $this->getClassResolver()->resolveClassName('Event\Entity\EventInterface');
        $results = $this->objectManager->createQueryBuilder()->select('u')->addSelect('MAX(e.date) AS date')->from($className, 'u')
            ->leftJoin($eventLogClassName, 'e', 'WITH', 'e.uuid = u')
            ->leftJoin($eventTypeClassName, 't', 'WITH', 'e.event = t')
            ->where('u.trashed = :trashed')->andWhere('t.name = :type')
            ->groupBy('u')
            ->orderBy('date', 'DESC')
            ->setParameter('trashed', true)->setParameter('type', 'uuid/trash')
            ->getQuery()->getResult();

        $purified = [];
        foreach ($results as $result) {
            $purified[] = [
                "entity" => $result[0],
                "date"   => new \DateTime($result["date"]),
            ];
        }
        $paginator = new Paginator(new ArrayAdapter($purified));
        $paginator->setCurrentPageNumber($page);
        $paginator->setItemCountPerPage(100);
        return $paginator;
    }

    /**
     * {@inheritDoc}
     */
    public function getUuid($key, $bypassIsolation = false)
    {
        $previous = $this->objectManager->getBypassIsolation();
        $this->objectManager->setBypassIsolation($bypassIsolation);

        $className = $this->getClassResolver()->resolveClassName('Uuid\Entity\UuidInterface');
        $entity    = $this->getObjectManager()->find($className, $key);
        $this->objectManager->setBypassIsolation($previous);

        if (!is_object($entity)) {
            throw new NotFoundException(sprintf('Could not find %s', $key));
        }

        return $entity;
    }

    /**
     * {@inheritDoc}
     */
    public function purgeUuid($id)
    {
        $uuid       = $this->getUuid($id);
        $class      = ClassUtils::getClass($uuid);
        $permission = $this->moduleOptions->getPermission($class, 'purge');
        $this->assertGranted($permission, $uuid);
        $this->getObjectManager()->remove($uuid);
        $this->getEventManager()->trigger('purge', $this, ['object' => $uuid]);
    }

    /**
     * {@inheritDoc}
     */
    public function restoreUuid($id)
    {
        $uuid       = $this->getUuid($id);
        $class      = ClassUtils::getClass($uuid);
        $permission = $this->moduleOptions->getPermission($class, 'restore');
        $this->assertGranted($permission, $uuid);

        if (!$uuid->isTrashed()) {
            return;
        }

        $uuid->setTrashed(false);
        $this->getObjectManager()->persist($uuid);

        $this->getEventManager()->trigger('restore', $this, ['object' => $uuid]);
    }

    /**
     * {@inheritDoc}
     */
    public function trashUuid($id)
    {
        $uuid       = $this->getUuid($id);
        $class      = ClassUtils::getClass($uuid);
        $permission = $this->moduleOptions->getPermission($class, 'trash');
        $this->assertGranted($permission, $uuid);

        if ($uuid->isTrashed()) {
            return;
        }

        $uuid->setTrashed(true);
        $this->getObjectManager()->persist($uuid);

        $this->getEventManager()->trigger('trash', $this, ['object' => $uuid]);
    }

    /**
     * @param int|UuidInterface $idOrObject
     * @return UuidInterface
     * @throws \Uuid\Exception\InvalidArgumentException
     */
    protected function ambiguousToUuid($idOrObject)
    {
        $uuid = null;

        if (is_int($idOrObject)) {
            $uuid = $this->getUuid($idOrObject);
        } elseif ($idOrObject instanceof UuidInterface) {
            $uuid = $idOrObject;
        } else {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected int, UuidInterface or UuidInterface but got "%s"',
                (is_object($idOrObject) ? get_class($idOrObject) : gettype($idOrObject))
            ));
        }

        return $uuid;
    }
}
