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
namespace Navigation\Provider;

use Instance\Manager\InstanceManagerInterface;
use Navigation\Entity\PageInterface;
use Navigation\Entity\ParameterInterface;
use Navigation\Exception\ContainerNotFoundException;
use Navigation\Manager\NavigationManagerInterface;
use Zend\Cache\Storage\StorageInterface;

class ContainerRepositoryProvider implements ContainerProviderInterface
{
    /**
     * @var NavigationManagerInterface
     */
    protected $navigationManager;
    /**
     * @var InstanceManagerInterface
     */
    protected $instanceManager;

    /**
     * @var StorageInterface
     */
    protected $storage;

    public function __construct(
        InstanceManagerInterface $instanceManager,
        NavigationManagerInterface $navigationManager,
        StorageInterface $storage
    ) {
        $this->navigationManager = $navigationManager;
        $this->instanceManager   = $instanceManager;
        $this->storage           = $storage;
    }

    public function provide($container)
    {
        $instance = $this->instanceManager->getInstanceFromRequest();
        $pages    = [];

        try {
            $container = $this->navigationManager->findContainerByNameAndInstance($container, $instance);
        } catch (ContainerNotFoundException $e) {
            return [];
        }

        $key = hash('sha256', serialize($container));
        if ($this->storage->hasItem($key)) {
            return $this->storage->getItem($key);
        }

        foreach ($container->getPages() as $page) {
            $addPage = $this->buildPage($page);

            $hasUri      = isset($addPage['uri']);
            $hasMvc      = isset($addPage['action']) || isset($addPage['controller']) || isset($addPage['route']);
            $hasProvider = isset($addPage['provider']);

            if ($hasUri || $hasMvc || $hasProvider) {
                $pages[] = $addPage;
            }
        }

        $this->storage->setItem($key, $pages);

        return $pages;
    }

    protected function buildPage(PageInterface $page)
    {
        $config = [];

        foreach ($page->getParameters() as $parameter) {
            $config = array_merge($config, $this->buildParameter($parameter));
        }

        foreach ($page->getChildren() as $child) {
            $addPage = $this->buildPage($child);
            $hasUri      = isset($addPage['uri']);
            $hasMvc      = isset($addPage['action']) || isset($addPage['controller']) || isset($addPage['route']);
            $hasProvider = isset($addPage['provider']);

            if ($hasUri || $hasMvc || $hasProvider) {
                $config['pages'][] = $addPage;
            }
        }

        return $config;
    }

    protected function buildParameter(ParameterInterface $parameter, &$config = [])
    {
        $key = $parameter->getKey() !== null ? (string)$parameter->getKey() : $parameter->getId();

        if ($parameter->hasChildren()) {
            foreach ($parameter->getChildren() as $child) {
                $this->buildParameter($child, $config[$key]);
            }
        } else {
            $config[$key] = $parameter->getValue();
        }

        return $config;
    }
}
