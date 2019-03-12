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
namespace Metadata\Manager;

use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Persistence\ObjectManager;
use Metadata\Exception;
use Uuid\Entity\UuidInterface;

class MetadataManager implements MetadataManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;

    protected $inMemoryKeys = [];

    public function __construct(ClassResolverInterface $classResolver, ObjectManager $objectManager)
    {
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
    }

    public function addMetadata(UuidInterface $object, $key, $value)
    {
        if (!is_string($key)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 2 to be string but got %s',
                gettype($key)
            ));
        }
        if (!is_string($value)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 3 to be string but got %s',
                gettype($value)
            ));
        }

        try {
            $metadata = $this->findMetadataByObjectAndKeyAndValue($object, $key, $value);
            if ($metadata->getValue() === $value) {
                throw new Exception\DuplicateMetadata(sprintf(
                    'Object %s already has metadata with key `%s` and value `%s`',
                    $object->getId(),
                    $key,
                    $value
                ));
            }
        } catch (Exception\MetadataNotFoundException $e) {
        }

        /* @var $entity \Metadata\Entity\MetadataInterface */
        $entity = $this->getClassResolver()->resolve('Metadata\Entity\MetadataInterface');
        $key    = $this->findKeyByName($key);
        $entity->setObject($object);
        $entity->setKey($key);
        $entity->setValue($value);
        $this->getObjectManager()->persist($entity);

        return $entity;
    }

    public function findMetadataByObject(UuidInterface $object)
    {
        $className = $this->getClassResolver()->resolveClassName('Metadata\Entity\MetadataInterface');
        $criteria  = ['object' => $object->getId()];
        return $this->getObjectManager()->getRepository($className)->findBy($criteria);
    }

    public function findMetadataByObjectAndKey(UuidInterface $object, $key)
    {
        if (!is_string($key)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 2 to be string but got %s',
                gettype($key)
            ));
        }

        $key       = $this->findKeyByName($key);
        $className = $this->getClassResolver()->resolveClassName('Metadata\Entity\MetadataInterface');
        $criteria  = [
            'object' => $object->getId(),
            'key'    => $key->getId(),
        ];
        return $this->getObjectManager()->getRepository($className)->findBy($criteria);
    }

    public function findMetadataByObjectAndKeyAndValue(UuidInterface $object, $key, $value)
    {
        if (!is_string($key)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 2 to be string but got %s',
                gettype($key)
            ));
        }
        if (!is_string($value)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 3 to be string but got %s',
                gettype($value)
            ));
        }

        $key       = $this->findKeyByName($key);
        $className = $this->getClassResolver()->resolveClassName('Metadata\Entity\MetadataInterface');
        $criteria  = [
            'object' => $object->getId(),
            'key'    => $key->getId(),
            'value'  => $value,
        ];
        $entity    = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (!is_object($entity)) {
            throw new Exception\MetadataNotFoundException(sprintf(
                'Could not find metadata by object `%s`, key `%s` and value `%s`',
                $object->getId(),
                $key,
                $value
            ));
        }

        return $entity;
    }

    public function getMetadata($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Metadata\Entity\MetadataInterface');
        $entity    = $this->getObjectManager()->find($className, $id);

        if (!is_object($entity)) {
            throw new Exception\MetadataNotFoundException(sprintf('Could not find metadata by id `%s`', $id));
        }

        return $entity;
    }

    public function removeMetadata($id)
    {
        $metadata = $this->getMetadata($id);
        $this->getObjectManager()->remove($metadata);
    }

    /**
     * @param string $name
     * @return \Metadata\Entity\MetadataInterface
     */
    protected function findKeyByName($name)
    {
        $className = $this->getClassResolver()->resolveClassName('Metadata\Entity\MetadataKeyInterface');
        $criteria  = ['name' => $name];
        $entity    = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (!is_object($entity)) {
            if (!isset($this->inMemoryKeys[$name])) {
                /* @var $entity \Metadata\Entity\MetadataKeyInterface */
                $entity = $this->getClassResolver()->resolve('Metadata\Entity\MetadataKeyInterface');
                $entity->setName($name);
                $this->getObjectManager()->persist($entity);
                $this->inMemoryKeys[$name] = $entity;
            } else {
                $entity = $this->inMemoryKeys[$name];
            }
        }

        return $entity;
    }
}
