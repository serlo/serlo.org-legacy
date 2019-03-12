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
namespace Instance\Repository;

use Doctrine\DBAL\LockMode;
use Doctrine\ORM\EntityRepository;
use Instance\Entity\InstanceProviderInterface;
use Instance\Exception\RuntimeException;
use Instance\Manager\InstanceAwareEntityManager;

class InstanceProviderRepository extends EntityRepository
{
    /**
     * @var bool
     */
    protected $instanceFiltering = true;

    /**
     * {@inheritDoc}
     */
    public function find($id, $lockMode = LockMode::NONE, $lockVersion = null)
    {
        $result = parent::find($id, $lockMode, $lockVersion);
        return $this->filter($result);
    }

    /**
     * {@inheritDoc}
     */
    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
    {
        $result = parent::findBy($criteria, $orderBy, $limit, $offset);
        return $this->filter($result);
    }

    /**
     * {@inheritDoc}
     */
    public function findOneBy(array $criteria)
    {
        $result = parent::findOneBy($criteria);
        return $this->filter($result);
    }

    public function setInstanceFiltering($flag = true)
    {
        $this->instanceFiltering = $flag;
    }

    /**
     * @param $entities
     * @return array|InstanceProviderInterface|null
     * @throws \Instance\Exception\RuntimeException
     */
    protected function filter($entities)
    {
        /* @var $entityManager InstanceAwareEntityManager */
        $entityManager = $this->_em;
        $result        = null;
        if ($this->instanceFiltering and $entityManager->getInstance()) {
            if (is_array($entities)) {
                $result = [];
                foreach ($entities as $entity) {
                    if (!$entity instanceof InstanceProviderInterface) {
                        throw new RuntimeException(sprintf(
                            '%s does not implement InstanceProviderInterface.',
                            get_class($entity)
                        ));
                    }
                    if ($entity->getInstance() === $entityManager->getInstance()) {
                        $result[] = $entity;
                    }
                }
            } elseif (is_object($entities)) {
                $entity = $entities;
                if (!$entity instanceof InstanceProviderInterface) {
                    throw new RuntimeException(sprintf(
                        '%s does not implement InstanceProviderInterface.',
                        get_class($entity)
                    ));
                }
                if ($entity->getInstance() === $entityManager->getInstance()) {
                    $result = $entity;
                }
            }
        } else {
            return $entities;
        }

        return $result;
    }
}
