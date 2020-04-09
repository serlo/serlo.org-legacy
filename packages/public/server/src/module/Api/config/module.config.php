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
use Api\Factory\AliasManagerListenerFactory;
use Api\Factory\ApiControllerFactory;
use Api\Factory\ApiManagerFactory;
use Api\Factory\LicenseManagerListenerFactory;
use Api\Factory\PageManagerListenerFactory;
use Api\Factory\RepositoryManagerListenerFactory;
use Api\Factory\TaxonomyManagerListenerFactory;
use Api\Factory\UserManagerListenerFactory;
use Api\Factory\UuidManagerListenerFactory;
use Api\Listener\AliasManagerListener;
use Api\Listener\RepositoryManagerListener;
use Api\Listener\LicenseManagerListener;
use Api\Listener\PageManagerListener;
use Api\Listener\TaxonomyManagerListener;
use Api\Listener\UserManagerListener;
use Api\Listener\UuidManagerListener;

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
        ],
    ],
    'service_manager' => [
        'factories' => [
            ApiManager::class => ApiManagerFactory::class,
            AliasManagerListener::class => AliasManagerListenerFactory::class,
            RepositoryManagerListener::class => RepositoryManagerListenerFactory::class,
            LicenseManagerListener::class => LicenseManagerListenerFactory::class,
            PageManagerListener::class => PageManagerListenerFactory::class,
            TaxonomyManagerListener::class => TaxonomyManagerListenerFactory::class,
            UserManagerListener::class => UserManagerListenerFactory::class,
            UuidManagerListener::class => UuidManagerListenerFactory::class,
        ],
    ],
];
