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

namespace Api;

use Api\Controller\GraphQLMockController;
use Api\Factory\ApiManagerFactory;
use Api\Factory\DiscussionManagerListenerFactory;
use Api\Factory\GraphQLMockControllerFactory;
use Api\Factory\GraphQLMockStorageFactory;
use Api\Factory\GraphQLServiceFactory;
use Api\Factory\LicenseManagerListenerFactory;
use Api\Factory\LinkServiceListenerFactory;
use Api\Factory\NotificationApiManagerFactory;
use Api\Factory\NotificationManagerListenerFactory;
use Api\Factory\PageManagerListenerFactory;
use Api\Factory\RepositoryManagerListenerFactory;
use Api\Factory\SubscriptionManagerListenerFactory;
use Api\Factory\TaxonomyManagerListenerFactory;
use Api\Factory\UserManagerListenerFactory;
use Api\Factory\UuidManagerListenerFactory;
use Api\Listener\DiscussionManagerListener;
use Api\Listener\LicenseManagerListener;
use Api\Listener\LinkServiceListener;
use Api\Listener\NotificationManagerListener;
use Api\Listener\PageManagerListener;
use Api\Listener\RepositoryManagerListener;
use Api\Listener\SubscriptionManagerListener;
use Api\Listener\TaxonomyManagerListener;
use Api\Listener\UserManagerListener;
use Api\Listener\UuidManagerListener;
use Api\Manager\NotificationApiManager;
use Api\Service\AbstractGraphQLService;

return [
    'controllers' => [
        'factories' => [
            GraphQLMockController::class => GraphQLMockControllerFactory::class,
        ],
    ],
    'router' => [
        'routes' => [
            'api' => [
                'type' => 'literal',
                'options' => [
                    'route' => '/graphql',
                    'defaults' => [
                        'controller' => GraphQLMockController::class,
                    ],
                ],
                'child_routes' => [
                    'list' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/list',
                            'defaults' => [
                                'action' => 'list',
                            ],
                        ],
                    ],
                    'clear' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/clear',
                            'defaults' => [
                                'action' => 'clear',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'service_manager' => [
        'factories' => [
            ApiManager::class => ApiManagerFactory::class,
            AbstractGraphQLService::class => GraphQLServiceFactory::class,
            __NAMESPACE__ .
            '\Storage\GraphQLMockStorage' => GraphQLMockStorageFactory::class,
            DiscussionManagerListener::class =>
                DiscussionManagerListenerFactory::class,
            NotificationApiManager::class =>
                NotificationApiManagerFactory::class,
            NotificationManagerListener::class =>
                NotificationManagerListenerFactory::class,
            RepositoryManagerListener::class =>
                RepositoryManagerListenerFactory::class,
            LicenseManagerListener::class =>
                LicenseManagerListenerFactory::class,
            LinkServiceListener::class => LinkServiceListenerFactory::class,
            PageManagerListener::class => PageManagerListenerFactory::class,
            SubscriptionManagerListener::class =>
                SubscriptionManagerListenerFactory::class,
            TaxonomyManagerListener::class =>
                TaxonomyManagerListenerFactory::class,
            UserManagerListener::class => UserManagerListenerFactory::class,
            UuidManagerListener::class => UuidManagerListenerFactory::class,
        ],
    ],
];
