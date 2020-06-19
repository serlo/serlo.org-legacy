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
namespace Entity\Factory;

use Entity\Controller\RepositoryController;
use Entity\Manager\EntityManagerInterface;
use Entity\Options\ModuleOptions;
use Entity\Manager\EntityManager;
use FeatureFlags\Service as FeatureFlagsService;
use Instance\Manager\InstanceManager;
use Instance\Manager\InstanceManagerInterface;
use Renderer\View\Helper\FormatHelper;
use Uuid\Manager\UuidManager;
use Uuid\Manager\UuidManagerInterface;
use Versioning\RepositoryManager;
use Versioning\RepositoryManagerInterface;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class RepositoryControllerFactory implements FactoryInterface
{
    public function createService(
        ServiceLocatorInterface $serviceLocator
    ): RepositoryController {
        /** @var AbstractPluginManager $parentLocator */
        $parentLocator = $serviceLocator->getServiceLocator();

        /** @var FeatureFlagsService $featureFlags */
        $featureFlags = $parentLocator->get(FeatureFlagsService::class);
        /** @var EntityManagerInterface $entityManager */
        $entityManager = $parentLocator->get(EntityManager::class);
        /** @var FormatHelper $formatHelper */
        $formatHelper = $parentLocator->get(FormatHelper::class);
        /** @var InstanceManagerInterface $instanceManager */
        $instanceManager = $parentLocator->get(InstanceManager::class);
        /** @var RepositoryManagerInterface $repositoryManager */
        $repositoryManager = $parentLocator->get(RepositoryManager::class);
        /** @var ModuleOptions $moduleOptions */
        $moduleOptions = $parentLocator->get(ModuleOptions::class);
        /** @var UuidManagerInterface $uuidManager */
        $uuidManager = $parentLocator->get(UuidManager::class);

        $result = new RepositoryController($featureFlags);

        $result->setEntityManager($entityManager);
        $result->setFormatHelper($formatHelper);
        $result->setInstanceManager($instanceManager);
        $result->setRepositoryManager($repositoryManager);
        $result->setModuleOptions($moduleOptions);
        $result->setUuidManager($uuidManager);

        return $result;
    }
}
