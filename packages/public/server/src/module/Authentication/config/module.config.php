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
namespace Authentication;

use Authentication\Adapter\UserAuthAdapter;
use Authentication\Controller\HydraConsentController;
use Authentication\Controller\HydraLoginController;
use Authentication\Controller\HydraLogoutController;
use Authentication\Factory\HydraConsentControllerFactory;
use Authentication\Factory\HydraLoginControllerFactory;
use Authentication\Factory\HydraLogoutControllerFactory;
use Authentication\Factory\HydraServiceFactory;
use Authentication\Factory\UserAuthAdapterFactory;
use Authentication\Service\HydraService;

return [
    'service_manager' => [
        'factories' => [
            'Zend\Authentication\AuthenticationService' =>
                __NAMESPACE__ . '\Factory\AuthenticationServiceFactory',
            __NAMESPACE__ . '\Storage\UserSessionStorage' =>
                __NAMESPACE__ . '\Factory\UserSessionStorageFactory',
            __NAMESPACE__ . '\HashService' =>
                __NAMESPACE__ . '\Factory\HashServiceFactory',
            HydraService::class => HydraServiceFactory::class,
            UserAuthAdapter::class => UserAuthAdapterFactory::class,
        ],
    ],
    'controllers' => [
        'factories' => [
            __NAMESPACE__ . '\Controller\AuthenticationController' =>
                __NAMESPACE__ . '\Factory\AuthenticationControllerFactory',
            HydraConsentController::class =>
                HydraConsentControllerFactory::class,
            HydraLoginController::class => HydraLoginControllerFactory::class,
            HydraLogoutController::class => HydraLogoutControllerFactory::class,
        ],
    ],
    'di' => [
        'instance' => [
            'preferences' => [
                __NAMESPACE__ . '\HashServiceInterface' =>
                    __NAMESPACE__ . '\HashService',
                __NAMESPACE__ . '\Adapter\AdapterInterface' =>
                    __NAMESPACE__ . '\Adapter\UserAuthAdapter',
            ],
        ],
    ],
    'router' => [
        'routes' => [
            'authentication' => [
                'type' => 'literal',
                'options' => [
                    'route' => '/auth',
                    'defaults' => [
                        'controller' =>
                            __NAMESPACE__ .
                            '\Controller\AuthenticationController',
                    ],
                ],
                'child_routes' => [
                    'login' => [
                        'type' => 'literal',
                        'may_terminate' => true,
                        'options' => [
                            'route' => '/login',
                            'defaults' => [
                                'action' => 'login',
                            ],
                        ],
                    ],
                    'logout' => [
                        'type' => 'literal',
                        'may_terminate' => true,
                        'options' => [
                            'route' => '/logout',
                            'defaults' => [
                                'action' => 'logout',
                            ],
                        ],
                    ],
                    'activate' => [
                        'type' => 'segment',
                        'may_terminate' => true,
                        'options' => [
                            'route' => '/activate[/:token]',
                            'defaults' => [
                                'action' => 'activate',
                            ],
                        ],
                    ],
                    'password' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/password',
                        ],
                        'child_routes' => [
                            'change' => [
                                'type' => 'literal',
                                'may_terminate' => true,
                                'options' => [
                                    'route' => '/change',
                                    'defaults' => [
                                        'action' => 'changePassword',
                                    ],
                                ],
                            ],
                            'restore' => [
                                'type' => 'segment',
                                'may_terminate' => true,
                                'options' => [
                                    'route' => '/restore[/:token]',
                                    'defaults' => [
                                        'action' => 'restorePassword',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'hydra' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/hydra',
                        ],
                        'child_routes' => [
                            'login' => [
                                'type' => 'literal',
                                'options' => [
                                    'route' => '/login',
                                    'defaults' => [
                                        'controller' =>
                                            HydraLoginController::class,
                                        'action' => 'index',
                                    ],
                                ],
                            ],
                            'logout' => [
                                'type' => 'literal',
                                'options' => [
                                    'route' => '/logout',
                                    'defaults' => [
                                        'controller' =>
                                            HydraLogoutController::class,
                                        'action' => 'index',
                                    ],
                                ],
                            ],
                            'consent' => [
                                'type' => 'literal',
                                'options' => [
                                    'route' => '/consent',
                                    'defaults' => [
                                        'controller' =>
                                            HydraConsentController::class,
                                        'action' => 'index',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
