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
namespace Entity\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Entity\Exception;
use Instance\Entity\InstanceInterface;
use Type\TypeManagerAwareTrait;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\EventManager\EventManagerAwareTrait;
use Entity\Entity\Entity;

class EntityManager implements EntityManagerInterface
{
    use TypeManagerAwareTrait, ObjectManagerAwareTrait;
    use ClassResolverAwareTrait;
    use EventManagerAwareTrait, FlushableTrait;
    use AuthorizationAssertionTrait;

    public function createEntity($typeName, array $data = [], InstanceInterface $instance)
    {
        $this->assertGranted('entity.create', $instance);

        /* @var $entity EntityInterface */
        $entity = $this->getClassResolver()->resolve('Entity\Entity\EntityInterface');
        $type = $this->getTypeManager()->findTypeByName($typeName);

        $entity->setInstance($instance);
        $entity->setType($type);
        $this->getEventManager()->trigger('create', $this, [
            'entity' => $entity,
            'data' => $data,
        ]);
        $this->getObjectManager()->persist($entity);

        return $entity;
    }

    public function findAll($bypassInstanceIsolation = false)
    {
        $old = $this->objectManager->getBypassIsolation();
        $this->objectManager->setBypassIsolation($bypassInstanceIsolation);
        $className = $this->getClassResolver()->resolveClassName('Entity\Entity\EntityInterface');
        $results = $this->getObjectManager()
            ->getRepository($className)
            ->findAll();
        $this->objectManager->setBypassIsolation($old);
        return new ArrayCollection($results);
    }

    public function findEntitiesByTypeName($name, $bypassInstanceIsolation = false)
    {
        $old = $this->objectManager->getBypassIsolation();
        $this->objectManager->setBypassIsolation($bypassInstanceIsolation);
        $className = $this->getClassResolver()->resolveClassName('Entity\Entity\EntityInterface');
        $type = $this->getTypeManager()->findTypeByName($name);
        $results = $this->getObjectManager()
            ->getRepository($className)
            ->findBy([
            'type' => $type->getId(),
        ]);
        $this->objectManager->setBypassIsolation($old);
        return new ArrayCollection($results);
    }

    public function getEntity($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Entity\Entity\EntityInterface');
        $entity = $this->getObjectManager()->find($className, $id);

        if (! is_object($entity)) {
            throw new Exception\EntityNotFoundException(sprintf('Entity "%d" not found.', $id));
        }
        $this->assertGranted('entity.get', $entity);

        return $entity;
    }

    public function findAllUnrevisedRevisions()
    {
        $entityClassName = $this->getClassResolver()->resolveClassName('Entity\Entity\RevisionInterface');
        //TODO: unhack
        $sql = 'SELECT r.id AS id ' .
                'FROM entity_revision r ' .
                'INNER JOIN `uuid` u_r ON r.id = u_r.id ' .
                'INNER JOIN entity e ON e.id = r.repository_id ' .
                'INNER JOIN `uuid` u_e ON e.id = u_e.id ' .
                'WHERE ( e.current_revision_id IS NULL OR r.id > e.current_revision_id ) ' .
                'AND u_r.trashed = 0 AND u_e.trashed = 0';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        $unrevisedRevisionIdsNested = $q->fetchAll();
        $unrevisedRevisionIds = [];
        foreach ($unrevisedRevisionIdsNested as $unrevisedRevisionIdArray) {
            $unrevisedRevisionIds[] = $unrevisedRevisionIdArray["id"];
        }
        $results = $this->getObjectManager()->getRepository($entityClassName)->findBy([
            'id' => $unrevisedRevisionIds,
        ]);
        return new ArrayCollection($results);
    }
}
