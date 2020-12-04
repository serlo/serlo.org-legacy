<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Alias\Factory;

use Alias\AliasManager;
use Normalizer\Normalizer;
use Normalizer\NormalizerInterface;
use User\Manager\UserManager;
use User\Manager\UserManagerInterface;
use Uuid\Manager\UuidManager;
use Uuid\Manager\UuidManagerInterface;
use Zend\Console\Console;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AliasManagerFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $objectManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $classResolver = $serviceLocator->get('ClassResolver\ClassResolver');
        /** @var UuidManagerInterface $uuidManager */
        $uuidManager = $serviceLocator->get(UuidManager::class);
        /** @var UserManagerInterface */
        $userManager = $serviceLocator->get(UserManager::class);
        /** @var NormalizerInterface $normalizer */
        $normalizer = $serviceLocator->get(Normalizer::class);
        $storage = $serviceLocator->get('Alias\Storage\AliasStorage');
        $isConsole = Console::isConsole();
        $router = $isConsole ? 'HttpRouter' : 'Router';
        $router = $serviceLocator->get($router);
        return new AliasManager(
            $classResolver,
            $objectManager,
            $uuidManager,
            $userManager,
            $normalizer,
            $router,
            $storage
        );
    }
}
