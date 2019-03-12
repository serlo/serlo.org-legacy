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
namespace Alias;

use Alias\Entity\AliasInterface;
use Alias\Exception;
use Alias\Options\ManagerOptions;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Filter\Shortify;
use Common\Filter\Slugify;
use Common\Traits;
use DateTime;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Entity\InstanceInterface;
use Token\TokenizerAwareTrait;
use Token\TokenizerInterface;
use Uuid\Entity\UuidInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\Cache\Storage\StorageInterface;
use Zend\Mvc\Router\RouteInterface;

class AliasManager implements AliasManagerInterface
{
    use Traits\ObjectManagerAwareTrait, ClassResolverAwareTrait;
    use TokenizerAwareTrait, Traits\RouterAwareTrait;

    const CACHE_NONEXISTENT = '~nonexistent~';

    /**
     * @var ManagerOptions
     */
    protected $options;

    /**
     * @var StorageInterface
     */
    protected $storage;

    /**
     * @var array|AliasInterface[]
     */
    protected $inMemoryAliases = [];

    public function __construct(
        ClassResolverInterface $classResolver,
        ManagerOptions $options,
        ObjectManager $objectManager,
        RouteInterface $router,
        StorageInterface $storage,
        TokenizerInterface $tokenizer
    ) {
        $this->classResolver = $classResolver;
        $this->tokenizer     = $tokenizer;
        $this->objectManager = $objectManager;
        $this->router        = $router;
        $this->storage       = $storage;
        $this->options       = $options;
    }

    public function autoAlias($name, $source, UuidInterface $object, InstanceInterface $instance)
    {
        if (!is_string($name) || !is_string($source)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected name and source to be string but got "%s" and "%s"',
                gettype($name),
                gettype($source)
            ));
        }

        if (!array_key_exists($name, $this->getOptions()->getAliases())) {
            throw new Exception\RuntimeException(sprintf('No configuration found for "%s"', $name));
        }

        $options        = $this->getOptions()->getAliases()[$name];
        $provider       = $options['provider'];
        $tokenString    = $options['tokenize'];
        $fallbackString = $options['fallback'];
        $alias          = $this->getTokenizer()->transliterate($provider, $object, $tokenString);
        $aliasFallback  = $this->getTokenizer()->transliterate($provider, $object, $fallbackString);

        return $this->createAlias($source, $alias, $aliasFallback, $object, $instance);
    }

    public function createAlias($source, $alias, $aliasFallback, UuidInterface $object, InstanceInterface $instance)
    {
        if (!is_string($alias)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 2 to be string, but got %s',
                gettype($alias)
            ));
        }

        if (!is_string($source)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 1 to be string, but got %s',
                gettype($source)
            ));
        }

        if ($alias == $source) {
            throw new Exception\RuntimeException(sprintf(
                'Alias and source should not be equal: %s, %s',
                $alias,
                $source
            ));
        }

        $old = $this->objectManager->getBypassIsolation();
        $this->objectManager->setBypassIsolation(true);
        $alias = $this->findUniqueAlias($alias, $aliasFallback, $object, $instance);
        $this->objectManager->setBypassIsolation($old);
        if ($alias instanceof AliasInterface) {
            // Found existing alias, no need to create new one
            return $alias;
        }

        /* @var $class Entity\AliasInterface */
        $class = $this->getClassResolver()->resolve('Alias\Entity\AliasInterface');
        $class->setSource($source);
        $class->setInstance($instance);
        $class->setObject($object);
        $class->setAlias($alias);
        $this->getObjectManager()->persist($class);
        $this->inMemoryAliases[] = $class;

        return $class;
    }

    public function findAliasByObject(UuidInterface $uuid)
    {
        /* @var $entity Entity\AliasInterface */
        $criteria = ['uuid' => $uuid->getId()];
        $order    = ['timestamp' => 'DESC'];
        $results  = $this->getAliasRepository()->findBy($criteria, $order, 1);
        $entity   = current($results);

        if (!is_object($entity)) {
            throw new Exception\AliasNotFoundException();
        }

        return $entity;
    }

    public function findAliasBySource($source, InstanceInterface $instance)
    {
        if (!is_string($source)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected string but got %s',
                gettype($source)
            ));
        }

        $key = 'alias:by:source:' . $instance->getId() . ':' . $source;
        if ($this->storage->hasItem($key)) {
            $item = $this->storage->getItem($key);
            // The item is null so it didn't get found.
            if ($item === self::CACHE_NONEXISTENT) {
                throw new Exception\AliasNotFoundException(sprintf('Cache says: no alias for `%s` found.', $source));
            }
            return $item;
        }

        $criteria = ['source' => $source, 'instance' => $instance->getId()];
        $order    = ['timestamp' => 'DESC'];
        $results  = $this->getAliasRepository()->findBy($criteria, $order, 1);
        $entity   = current($results);

        if (!is_object($entity)) {
            // Set it to null so we know that this doesn't exist
            $this->storage->setItem($key, self::CACHE_NONEXISTENT);
            throw new Exception\AliasNotFoundException(sprintf('No alias for `%s` found.', $source));
        }

        $router = $this->getRouter();
        $alias  = $router->assemble(['alias' => $entity->getAlias()], ['name' => 'alias']);
        $this->storage->setItem($key, $alias);

        return $alias;
    }

    public function findCanonicalAlias($alias, InstanceInterface $instance)
    {
        /* @var $entity Entity\AliasInterface */
        $criteria = ['alias' => $alias, 'instance' => $instance->getId()];
        $order    = ['timestamp' => 'DESC'];
        $results  = $this->getAliasRepository()->findBy($criteria, $order, 1);
        $entity   = current($results);

        if (!is_object($entity)) {
            throw new Exception\CanonicalUrlNotFoundException(sprintf('No canonical url found'));
        }

        $canonical = $this->findAliasByObject($entity->getObject());

        if ($canonical !== $entity) {
            $router = $this->getRouter();
            $url    = $router->assemble(['alias' => $canonical->getAlias()], ['name' => 'alias']);
            if ($url !== $alias) {
                return $url;
            }
        }

        throw new Exception\CanonicalUrlNotFoundException(sprintf('No canonical url found'));
    }

    public function findSourceByAlias($alias, InstanceInterface $instance, $useCache = false)
    {
        if (!is_string($alias)) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected alias to be string but got "%s"',
                gettype($alias)
            ));
        }

        $key = 'source:by:alias:' . $instance->getId() . ':' . $alias;
        if ($useCache && $this->storage->hasItem($key)) {
            // The item is null so it didn't get found.
            $item = $this->storage->getItem($key);
            if ($item === self::CACHE_NONEXISTENT) {
                throw new Exception\AliasNotFoundException(sprintf('Alias `%s` not found.', $alias));
            }
            return $item;
        }

        /* @var $entity Entity\AliasInterface */
        $criteria = ['alias' => $alias, 'instance' => $instance->getId()];
        $order    = ['timestamp' => 'DESC'];
        $results  = $this->getAliasRepository()->findBy($criteria, $order, 1);
        $entity   = current($results);

        if (!is_object($entity)) {
            $this->storage->setItem($key, self::CACHE_NONEXISTENT);
            throw new Exception\AliasNotFoundException(sprintf('Alias `%s` not found.', $alias));
        }

        $source = $entity->getSource();
        if ($useCache) {
            $this->storage->setItem($key, $source);
        }

        return $source;
    }

    public function flush($object = null)
    {
        if ($object === null) {
            $this->inMemoryAliases = [];
        }
        $this->getObjectManager()->flush($object);
    }

    /**
     * @return ManagerOptions $options
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param ManagerOptions $options
     * @return void
     */
    public function setOptions(ManagerOptions $options)
    {
        $this->options = $options;
    }

    /**
     * @param $alias,
     * @param InstanceInterface $instance
     * @return Entity\AliasInterface[]
     */
    protected function findAliases($alias, InstanceInterface $instance)
    {
        $className = $this->getEntityClassName();
        $criteria  = ['alias' => $alias, 'instance' => $instance->getId()];
        $order     = ['timestamp' => 'DESC'];
        $aliases   = $this->getObjectManager()->getRepository($className)->findBy($criteria, $order);
        foreach ($this->inMemoryAliases as $memoryAlias) {
            if ($memoryAlias->getAlias() == $alias) {
                $aliases[] = $memoryAlias;
            }
        }

        return $aliases;
    }

    protected function findUniqueAlias($alias, $fallback, UuidInterface $object, InstanceInterface $instance)
    {
        $alias   = $this->slugify($alias);
        $aliases = $this->findAliases($alias, $instance);
        foreach ($aliases as $entity) {
            if ($entity->getObject() === $object) {
                // Alias exists and its the same object -> update timestamp
                $entity->setTimestamp(new DateTime());
                $this->objectManager->persist($entity);
                return $entity;
            }
            return $this->findUniqueAlias($fallback, $fallback . '-' . uniqid(), $object, $instance);
        }
        return $alias;
    }

    protected function getAliasRepository()
    {
        return $this->getObjectManager()->getRepository($this->getEntityClassName());
    }

    protected function getEntityClassName()
    {
        return $this->getClassResolver()->resolveClassName('Alias\Entity\AliasInterface');
    }

    protected function slugify($text)
    {
        $slugify   = new Slugify();
        $shortify  = new Shortify();
        $slugified = [];

        $text = $shortify->filter($text);

        foreach (explode('/', $text) as $token) {
            $token = $slugify->filter($token);
            if (empty($token)) {
                continue;
            }

            $slugified[] = $token;
        }

        $text = implode('/', $slugified);

        return $text;
    }
}
