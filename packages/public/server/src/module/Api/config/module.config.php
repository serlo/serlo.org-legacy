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

namespace Api;

use Api\Controller\ApiController;
use Api\Controller\CacheApiController;
use Api\Controller\NavigationApiController;
use Api\Controller\NotificationApiController;
use Api\Controller\UserApiController;
use Api\Factory\ApiControllerFactory;
use Api\Factory\ApiManagerFactory;
use Api\Factory\AuthorizationServiceFactory;
use Api\Factory\CacheApiControllerFactory;
use Api\Factory\DiscussionManagerListenerFactory;
use Api\Factory\GraphQLServiceFactory;
use Api\Factory\LicenseManagerListenerFactory;
use Api\Factory\LinkServiceListenerFactory;
use Api\Factory\NavigationApiControllerFactory;
use Api\Factory\NotificationApiControllerFactory;
use Api\Factory\NotificationApiManagerFactory;
use Api\Factory\NotificationManagerListenerFactory;
use Api\Factory\PageManagerListenerFactory;
use Api\Factory\RepositoryManagerListenerFactory;
use Api\Factory\TaxonomyManagerListenerFactory;
use Api\Factory\UserApiControllerFactory;
use Api\Factory\UserManagerListenerFactory;
use Api\Factory\UuidManagerListenerFactory;
use Api\Listener\DiscussionManagerListener;
use Api\Listener\LicenseManagerListener;
use Api\Listener\LinkServiceListener;
use Api\Listener\NotificationManagerListener;
use Api\Listener\PageManagerListener;
use Api\Listener\RepositoryManagerListener;
use Api\Listener\TaxonomyManagerListener;
use Api\Listener\UserManagerListener;
use Api\Listener\UuidManagerListener;
use Api\Manager\NotificationApiManager;
use Api\Service\AuthorizationService;
use Api\Service\GraphQLService;

return [
    'controllers' => [
        'factories' => [
            ApiController::class => ApiControllerFactory::class,
            CacheApiController::class => CacheApiControllerFactory::class,
            NavigationApiController::class =>
                NavigationApiControllerFactory::class,
            NotificationApiController::class =>
                NotificationApiControllerFactory::class,
            UserApiController::class => UserApiControllerFactory::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            ApiManager::class => ApiManagerFactory::class,
            AuthorizationService::class => AuthorizationServiceFactory::class,
            GraphQLService::class => GraphQLServiceFactory::class,
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
            TaxonomyManagerListener::class =>
                TaxonomyManagerListenerFactory::class,
            UserManagerListener::class => UserManagerListenerFactory::class,
            UuidManagerListener::class => UuidManagerListenerFactory::class,
        ],
    ],
    'router' => [
        'routes' => [
            'api' => [
                'type' => 'segment',
                'options' => [
                    'route' => '/api',
                    'defaults' => [
                        'controller' => ApiController::class,
                    ],
                ],
                'child_routes' => [
                    'active-authors' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/user/active-authors',
                            'defaults' => [
                                'controller' => UserApiController::class,
                                'action' => 'getActiveAuthorIds',
                            ],
                        ],
                    ],
                    'active-reviewers' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/user/active-reviewers',
                            'defaults' => [
                                'controller' => UserApiController::class,
                                'action' => 'getActiveReviewerIds',
                            ],
                        ],
                    ],
                    'alias' => [
                        'type' => 'Common\Router\Slashable',
                        'options' => [
                            'route' => '/alias/:alias',
                            'defaults' => [
                                'action' => 'alias',
                            ],
                            'constraints' => [
                                'alias' => '(.)+',
                            ],
                        ],
                    ],
                    'cache' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/cache-keys',
                            'defaults' => [
                                'controller' => CacheApiController::class,
                                'action' => 'index',
                            ],
                        ],
                    ],
                    'license' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/license/:id',
                            'defaults' => [
                                'action' => 'license',
                            ],
                        ],
                    ],
                    'navigation' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/navigation',
                            'defaults' => [
                                'controller' => NavigationApiController::class,
                                'action' => 'index',
                            ],
                        ],
                    ],
                    'notification' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '',
                            'defaults' => [
                                'controller' =>
                                    NotificationApiController::class,
                            ],
                        ],
                        'child_routes' => [
                            'notifications-by-user' => [
                                'type' => 'segment',
                                'options' => [
                                    'route' => '/notifications/:user-id',
                                    'defaults' => [
                                        'action' => 'notificationsByUser',
                                    ],
                                ],
                            ],
                            'event' => [
                                'type' => 'segment',
                                'options' => [
                                    'route' => '/event/:id',
                                    'defaults' => [
                                        'action' => 'event',
                                    ],
                                ],
                            ],
                            'set-notification-state' => [
                                'type' => 'segment',
                                'options' => [
                                    'route' => '/set-notification-state/:id',
                                    'defaults' => [
                                        'action' => 'setNotificationState',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'subscriptions' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/subscriptions/:user-id',
                            'defaults' => [
                                'action' => 'subscriptions',
                            ],
                        ],
                    ],
                    'threads' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/threads/:id',
                            'defaults' => [
                                'action' => 'threads',
                            ],
                        ],
                    ],
                    'uuid' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/uuid/:id',
                            'defaults' => [
                                'action' => 'uuid',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
