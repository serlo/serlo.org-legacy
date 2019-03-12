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
namespace Type;

use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;

class TypeManager implements TypeManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;

    public function __construct(ClassResolverInterface $classResolver, ObjectManager $objectManager)
    {
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
    }

    public function getType($id)
    {
        $className = $this->getEntityClassName();
        $type      = $this->getObjectManager()->find($className, $id);
        if (!is_object($type)) {
            throw new Exception\TypeNotFoundException(sprintf('Type "%d" not found.', $id));
        }
        return $type;
    }

    public function findAllTypes()
    {
        $className  = $this->getEntityClassName();
        $repository = $this->getObjectManager()->getRepository($className);
        return new ArrayCollection($repository->findAll());
    }

    public function findTypeByName($name)
    {
        $className  = $this->getEntityClassName();
        $repository = $this->getObjectManager()->getRepository($className);
        $type       = $repository->findOneBy(['name' => $name]);

        if (!is_object($type)) {
            throw new Exception\TypeNotFoundException(sprintf('Type "%s" not found.', $name));
        }

        return $type;
    }

    public function findTypesByNames(array $names)
    {
        $className  = $this->getEntityClassName();
        $repository = $this->getObjectManager()->getRepository($className);
        return new ArrayCollection($repository->findBy(['name' => $names]));
    }

    protected function getEntityClassName()
    {
        return $this->getClassResolver()->resolveClassName('Type\Entity\TypeInterface');
    }
}
