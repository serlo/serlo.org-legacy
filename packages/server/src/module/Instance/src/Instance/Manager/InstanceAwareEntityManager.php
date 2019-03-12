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
namespace Instance\Manager;

use Doctrine\Common\EventManager;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\ORMException;
use Instance\Entity\InstanceInterface;
use Instance\Entity\InstanceProviderInterface;
use Traversable;
use Zend\EventManager\EventManager as ZendEventManager;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\EventManager\EventManagerInterface;

class InstanceAwareEntityManager extends EntityManager
{
    /**
     * @var EventManagerInterface
     */
    protected $events;
    /**
     * @var InstanceInterface
     */
    protected $instance;
    /**
     * @var string
     */
    protected $instanceAwareRepositoryClassName = 'Instance\Repository\InstanceAwareRepository';
    /**
     * @var string
     */
    protected $instanceProviderRepositoryClassName = 'Instance\Repository\InstanceProviderRepository';
    /**
     * @var string
     */
    protected $instanceField = 'instance';
    /**
     * @var bool
     */
    protected $bypassIsolation = false;

    /**
     * Return self instead of hardcoded EntityManager
     * {@inheritDoc}
     */
    public static function create($conn, Configuration $config, EventManager $eventManager = null)
    {
        if (!$config->getMetadataDriverImpl()) {
            throw ORMException::missingMappingDriverImpl();
        }

        if (is_array($conn)) {
            $conn = DriverManager::getConnection($conn, $config, ($eventManager ? : new EventManager()));
        } else {
            if ($conn instanceof Connection) {
                if ($eventManager !== null && $conn->getEventManager() !== $eventManager) {
                    throw ORMException::mismatchedEventManager();
                }
            } else {
                throw new \InvalidArgumentException("Invalid argument: " . $conn);
            }
        }

        return new self($conn, $config, $conn->getEventManager());
    }

    /**
     * {@inheritDoc}
     */
    public function find($entityName, $id, $lockMode = null, $lockVersion = null)
    {
        $entity = parent::find($entityName, $id, $lockMode, $lockVersion);
        if ($entity instanceof InstanceProviderInterface) {
            if ($entity->getInstance() === $this->getInstance()) {
                return $entity;
            }
            if ($this->bypassIsolation) {
                $this->getZendEventManager()->trigger('isolationBypassed', $entity);
            }
            return null;
        }
        return $entity;
    }

    /**
     * @return boolean
     */
    public function getBypassIsolation()
    {
        return $this->bypassIsolation;
    }

    /**
     * @param boolean $bypassIsolation
     */
    public function setBypassIsolation($bypassIsolation)
    {
        $this->bypassIsolation = $bypassIsolation;
    }

    /**
     * @return InstanceInterface
     */
    public function getInstance()
    {
        return $this->instance;
    }

    /**
     * @param InstanceInterface $instance
     */
    public function setInstance(InstanceInterface $instance)
    {
        $this->instance = $instance;
    }

    /**
     * Check if $entity implements InstanceProviderInterface
     * If it does, return InstanceAwareEntityRepository
     * {@inheritDoc}
     */
    public function getRepository($entityName)
    {
        if ($this->bypassIsolation) {
            return parent::getRepository($entityName);
        }

        $entityName = ltrim($entityName, '\\');
        if (isset($this->repositories[$entityName])) {
            return $this->repositories[$entityName];
        }

        $metadata = $this->getClassMetadata($entityName);
        $customRepositoryClassName = $metadata->customRepositoryClassName;
        $instanceProviderInterface = 'Instance\\Entity\\InstanceProviderInterface';
        $instanceAwareInterface = 'Instance\\Entity\\InstanceAwareInterface';

        if ($customRepositoryClassName !== null) {
            $repository = new $customRepositoryClassName($this, $metadata);
            if ($this->instance && $metadata->reflClass->implementsInterface($instanceAwareInterface)) {
                $repository->setInstanceField($this->instanceField);
            }
        } elseif ($this->instance && $metadata->reflClass->implementsInterface($instanceAwareInterface)) {
            $repository = new $this->instanceAwareRepositoryClassName($this, $metadata);
            $repository->setInstanceField($this->instanceField);
        } elseif ($this->instance && $metadata->reflClass->implementsInterface($instanceProviderInterface)) {
            $repository = new $this->instanceProviderRepositoryClassName($this, $metadata);
        } else {
            $repository = new EntityRepository($this, $metadata);
        }

        $this->repositories[$entityName] = $repository;

        return $repository;
    }

    /**
     * Retrieve the event manager
     * Lazy-loads an EventManager instance if none registered.
     *
     * @return EventManagerInterface
     */
    public function getZendEventManager()
    {
        if (!$this->events instanceof EventManagerInterface) {
            $this->setZendEventManager(new ZendEventManager());
        }
        return $this->events;
    }

    /**
     * Sets the default  multi tenant repo class
     *
     * @param    string        Classname to use
     */
    public function setInstanceAwareRepositoryClassName($class)
    {
        $this->instanceAwareRepositoryClassName = $class;
    }

    public function setInstanceField($field)
    {
        $this->instanceField = $field;
    }

    /**
     * Set the event manager instance used by this context.
     * For convenience, this method will also set the class name / LSB name as
     * identifiers, in addition to any string or array of strings set to the
     * $this->eventIdentifier property.
     *
     * @param  EventManagerInterface $events
     * @return mixed
     */
    public function setZendEventManager(EventManagerInterface $events)
    {
        $identifiers = array(__CLASS__, get_class($this));
        if (isset($this->eventIdentifier)) {
            if ((is_string($this->eventIdentifier)) || (is_array(
                $this->eventIdentifier
                )) || ($this->eventIdentifier instanceof Traversable)
            ) {
                $identifiers = array_unique(array_merge($identifiers, (array)$this->eventIdentifier));
            } elseif (is_object($this->eventIdentifier)) {
                $identifiers[] = $this->eventIdentifier;
            }
            // silently ignore invalid eventIdentifier types
        }
        $events->setIdentifiers($identifiers);
        $this->events = $events;
        if (method_exists($this, 'attachDefaultListeners')) {
            $this->attachDefaultListeners();
        }
        return $this;
    }
}
