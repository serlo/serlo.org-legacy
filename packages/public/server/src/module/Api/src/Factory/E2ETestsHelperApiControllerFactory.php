<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Api\Factory;

use Api\Controller\E2ETestsHelperApiController;
use Api\Manager\E2ETestsHelperApiManager;
use Api\Manager\NotificationApiManager;
use Common\Factory\AbstractControllerFactory;
use Zend\Cache\StorageFactory;
use Zend\ServiceManager\ServiceLocatorInterface;

class E2ETestsHelperApiControllerFactory extends AbstractControllerFactory
{
    public function createController(ServiceLocatorInterface $serviceManager)
    {
        /** @var NotificationApiManager $notificationApiManager */
        $notificationApiManager = $serviceManager->get(
            NotificationApiManager::class
        );
        /** @var E2ETestsHelperApiManager $e2eManager */
        $e2eManager = $serviceManager->get(E2ETestsHelperApiManager::class);
        /** @var bool $isActive */
        $isActive = $serviceManager->get('config')['is_development_env'];
        $storage = StorageFactory::factory([
            'adapter' => [
                'name' => 'apc',
                'options' => [
                    'namespace' => E2ETestsHelperApiController::class,
                    'ttl' => 60 * 60,
                ],
            ],
            'plugins' => [
                'exception_handler' => [
                    'throw_exceptions' => false,
                ],
                'serializer',
            ],
        ]);
        return new E2ETestsHelperApiController(
            $isActive,
            $notificationApiManager,
            $e2eManager,
            $storage
        );
    }
}
