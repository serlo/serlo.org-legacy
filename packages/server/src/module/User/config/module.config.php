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
namespace User;

/**
 * @codeCoverageIgnore
 */
return [
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Manager\UserManager' => __NAMESPACE__ . '\Factory\UserManagerFactory',
            __NAMESPACE__ . '\Form\Register'       => __NAMESPACE__ . '\Factory\RegisterFormFactory',
        ],
    ],
    'class_resolver'  => [
        'User\Entity\UserInterface' => 'User\Entity\User',
        'User\Entity\RoleInterface' => 'User\Entity\Role',
    ],
    'view_helpers'    => [
        'factories' => [
            'user' => __NAMESPACE__ . '\Factory\UserHelperFactory',
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\UsersController',
            __NAMESPACE__ . '\Controller\UserController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Controller\UsersController' => [
                    'setUserManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Hydrator\UserHydrator'      => [
                    'setUuidManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\UserController'  => [
                    'setUserManager'           => [
                        'required' => true,
                    ],
                    'setAuthenticationService' => [
                        'required' => true,
                    ],
                    'setInstanceManager'       => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\UserManagerInterface' => __NAMESPACE__ . '\Manager\UserManager',
            ],
        ],
    ],
    'router'          => [
        'routes' => [
            'users' => [
                'type'    => 'literal',
                'may_terminate' => true,
                'options'       => [
                    'route'    => '/users',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\UsersController',
                        'action'     => 'users',
                    ],
                ],
            ],
            'user'  => [
                'type'    => 'literal',
                'may_terminate' => false,
                'options'       => [
                    'route'    => '/user',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\UserController',
                        'action'     => 'profile',
                    ],
                ],
                'child_routes'  => [
                    'me'       => [
                        'type'    => 'literal',
                        'may_terminate' => true,
                        'options'       => [
                            'route'    => '/me',
                            'defaults' => [
                                'action' => 'me',
                            ],
                        ],
                    ],
                    'public' => [
                        'type' => 'literal',
                        'may_terminate' => true,
                        'options' => [
                            'route' => '/public',
                            'defaults' => [
                                'action' => 'public',
                            ],
                        ],
                    ],
                    'profile'  => [
                        'type'          => 'segment',
                        'may_terminate' => true,
                        'options'       => [
                            'route'    => '/profile/:id',
                            'defaults' => [
                                'action' => 'profile',
                            ],
                        ],
                    ],
                    'register' => [
                        'type'    => 'literal',
                        'may_terminate' => true,
                        'options'       => [
                            'route'    => '/register',
                            'defaults' => [
                                'action' => 'register',
                            ],
                        ],
                    ],
                    'settings' => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/settings',
                            'defaults' => [
                                'action' => 'settings',
                            ],
                        ],
                    ],
                    'remove'   => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/remove/:id',
                            'defaults' => [
                                'action' => 'remove',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'uuid'            => [
        'permissions' => [
            'User\Entity\User' => [
                'trash'   => 'user.trash',
                'restore' => 'user.restore',
                'purge'   => 'user.purge',
            ],
        ],
    ],
    'doctrine'        => [
        'driver' => [
            __NAMESPACE__ . '_driver' => [
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Entity',
                ],
            ],
            'orm_default'             => [
                'drivers' => [
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
                ],
            ],
        ],
    ],
];
