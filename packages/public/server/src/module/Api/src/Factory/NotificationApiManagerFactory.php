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

namespace Api\Factory;

use Api\Manager\NotificationApiManager;
use Api\Service\AuthorizationService;
use Api\Service\GraphQLService;
use ClassResolver\ClassResolver;
use Common\Factory\AbstractControllerFactory;
use Common\Factory\EntityManagerFactoryTrait;
use Event\EventManager;
use Event\EventManagerInterface;
use Notification\NotificationManager;
use Notification\NotificationManagerInterface;
use User\Manager\UserManager;
use User\Manager\UserManagerInterface;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class NotificationApiManagerFactory implements FactoryInterface
{
    use EntityManagerFactoryTrait;

    public function createService(ServiceLocatorInterface $serviceManager)
    {
        /** @var EventManagerInterface $eventManager */
        $eventManager = $serviceManager->get(EventManager::class);
        /** @var NotificationManagerInterface $notificationManager */
        $notificationManager = $serviceManager->get(NotificationManager::class);
        /** @var UserManagerInterface $userManager */
        $userManager = $serviceManager->get(UserManager::class);
        /** @var GraphQLService $graphql */
        $graphql = $serviceManager->get(GraphQLService::class);
        $sentry = $serviceManager->get('Log\Sentry');

        $manager = new NotificationApiManager(
            $eventManager,
            $notificationManager,
            $userManager,
            $graphql,
            $sentry
        );

        $manager->setEntityManager($this->getEntityManager($serviceManager));
        $manager->setClassResolver($serviceManager->get(ClassResolver::class));

        return $manager;
    }
}
