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
use Api\Controller\NavigationApiController;
use Api\Controller\NotificationApiController;
use Api\Factory\AliasManagerListenerFactory;
use Api\Factory\ApiControllerFactory;
use Api\Factory\ApiManagerFactory;
use Api\Factory\AuthorizationServiceFactory;
use Api\Factory\GraphQLServiceFactory;
use Api\Factory\LicenseManagerListenerFactory;
use Api\Factory\NavigationApiControllerFactory;
use Api\Factory\NotificationApiControllerFactory;
use Api\Factory\PageManagerListenerFactory;
use Api\Factory\RepositoryManagerListenerFactory;
use Api\Factory\TaxonomyManagerListenerFactory;
use Api\Factory\UserManagerListenerFactory;
use Api\Factory\UuidManagerListenerFactory;
use Api\Listener\AliasManagerListener;
use Api\Listener\LicenseManagerListener;
use Api\Listener\PageManagerListener;
use Api\Listener\RepositoryManagerListener;
use Api\Listener\TaxonomyManagerListener;
use Api\Listener\UserManagerListener;
use Api\Listener\UuidManagerListener;
use Api\Service\AuthorizationService;
use Api\Service\GraphQLService;

return [
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
    'controllers' => [
        'factories' => [
            ApiController::class => ApiControllerFactory::class,
            NavigationApiController::class =>
                NavigationApiControllerFactory::class,
            NotificationApiController::class =>
                NotificationApiControllerFactory::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            AliasManagerListener::class => AliasManagerListenerFactory::class,
            ApiManager::class => ApiManagerFactory::class,
            AuthorizationService::class => AuthorizationServiceFactory::class,
            GraphQLService::class => GraphQLServiceFactory::class,
            RepositoryManagerListener::class =>
                RepositoryManagerListenerFactory::class,
            LicenseManagerListener::class =>
                LicenseManagerListenerFactory::class,
            PageManagerListener::class => PageManagerListenerFactory::class,
            TaxonomyManagerListener::class =>
                TaxonomyManagerListenerFactory::class,
            UserManagerListener::class => UserManagerListenerFactory::class,
            UuidManagerListener::class => UuidManagerListenerFactory::class,
        ],
    ],
];
