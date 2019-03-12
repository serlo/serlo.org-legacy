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
namespace Term\Manager;

use ClassResolver\ClassResolverAwareTrait;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Instance\Entity\InstanceInterface;
use Term\Entity\TermEntityInterface;
use Term\Exception\TermNotFoundException;

class TermManager implements TermManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;
    use FlushableTrait;

    /**
     * @var TermEntityInterface[]
     */
    protected $terms = [];

    public function createTerm($name, InstanceInterface $instance)
    {
        try {
            return $this->findTermByName($name, $instance);
        } catch (TermNotFoundException $e) {
        }

        /* @var $entity TermEntityInterface */
        $entity        = $this->getClassResolver()->resolve('Term\Entity\TermEntityInterface');
        $this->terms[] = $entity;

        $entity->setName($name);
        $entity->setInstance($instance);
        $this->getObjectManager()->persist($entity);

        return $entity;
    }

    public function findTermByName($name, InstanceInterface $instance)
    {
        $className = $this->getClassResolver()->resolveClassName('Term\Entity\TermEntityInterface');
        $criteria  = ['name' => $name, 'instance' => $instance->getId()];
        $entity    = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (!is_object($entity)) {
            foreach ($this->terms as $term) {
                if ($term->getName() == $name && $term->getInstance() === $instance) {
                    return $term;
                }
            }
        }

        if (!is_object($entity)) {
            throw new TermNotFoundException(sprintf('Term %s with instance %s not found', $name, $instance->getId()));
        }

        // Since we can not search case sensitive in mysql (without side effects) we need to do this manually.
        if ($entity->getName() != $name && strcasecmp($entity->getName(), $name) == 0) {
            $entity->setName($name);
            $this->persist($entity);
            $this->flush($entity);
        }

        return $entity;
    }

    public function getTerm($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Term\Entity\TermEntityInterface');
        $instance  = $this->getObjectManager()->find($className, $id);

        if (!is_object($instance)) {
            throw new TermNotFoundException($id);
        }

        return $instance;
    }
}
