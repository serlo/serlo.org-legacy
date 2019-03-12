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
namespace Authorization;

return [
    'zfc_rbac'           => [
        'guard_manager'     => [
            'factories' => [
                __NAMESPACE__ . '\Guard\HydratableControllerGuard' => __NAMESPACE__ . '\Factory\HydratableControllerGuardFactory',
            ],
        ],
        'assertion_manager' => [
            'factories' => [
                'Authorization\Assertion\RoleAssertion'            => __NAMESPACE__ . '\Factory\RoleAssertionFactory',
                'Authorization\Assertion\InstanceAssertion'        => __NAMESPACE__ . '\Factory\InstanceAssertionFactory',
                'Authorization\Assertion\RequestInstanceAssertion' => __NAMESPACE__ . '\Factory\RequestInstanceAssertionFactory',
            ],
        ],
        'assertion_map'     => [
            'authorization.identity.grant.role'  => 'Authorization\Assertion\RoleAssertion',
            'authorization.identity.revoke.role' => 'Authorization\Assertion\RoleAssertion',
        ],
    ],
    'service_manager'    => [
        'factories' => [
            'Authorization\Service\RoleService'        => __NAMESPACE__ . '\Factory\RoleServiceFactory',
            'Authorization\Service\PermissionService'  => __NAMESPACE__ . '\Factory\PermissionServiceFactory',
            'ZfcRbac\Service\AuthorizationService'     => __NAMESPACE__ . '\Factory\AuthorizationServiceFactory',
            'ZfcRbac\Assertion\AssertionPluginManager' => __NAMESPACE__ . '\Factory\AssertionPluginManagerFactory',
            'Authorization\Form\RoleForm'              => __NAMESPACE__ . '\Factory\RoleFormFactory',
        ],
    ],
    'controller_plugins' => [
        'invokables' => [
            'assertGranted' => 'Authorization\Controller\Plugin\AssertGranted',
        ],
    ],
    'controllers'        => [
        'factories'  => [
            __NAMESPACE__ . '\Controller\RoleController' => __NAMESPACE__ . '\Factory\RoleControllerFactory',
        ],
        'invokables' => [
            __NAMESPACE__ . '\Controller\ForbiddenController' => __NAMESPACE__ . '\Controller\ForbiddenController',
        ],
    ],
    'class_resolver'     => [
        __NAMESPACE__ . '\Entity\RoleInterface'                   => 'User\Entity\Role',
        __NAMESPACE__ . '\Entity\PermissionInterface'             => 'User\Entity\PermissionKey',
        __NAMESPACE__ . '\Entity\ParametrizedPermissionInterface' => 'User\Entity\Permission',
    ],
    'di'                 => [
        'instance' => [
            'preferences' => [
                __NAMESPACE__ . '\Service\RoleServiceInterface' => __NAMESPACE__ . '\Service\RoleService',
            ],
        ],
    ],
    'router'             => [
        'routes' => [
            'authorization' => [
                'type'    => 'literal',
                'options'      => [
                    'route' => '/authorization',
                ],
                'child_routes' => [
                    'forbidden' => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/forbidden',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\ForbiddenController',
                                'action'     => 'index',
                            ],
                        ],
                    ],
                    'roles'     => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/roles',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\RoleController',
                                'action'     => 'roles',
                            ],
                        ],
                    ],
                    'role'      => [
                        'type'    => 'literal',
                        'options'      => [
                            'route'    => '/role',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\RoleController',
                            ],
                        ],
                        'child_routes' => [
                            'show'       => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/show/:role',
                                    'defaults' => [
                                        'action' => 'show',
                                    ],
                                ],
                            ],
                            'create'     => [
                                'type'    => 'literal',
                                'options' => [
                                    'route'    => '/create',
                                    'defaults' => [
                                        'action' => 'createRole',
                                    ],
                                ],
                            ],
                            'all'        => [
                                'type'    => 'literal',
                                'options' => [
                                    'route'    => '/all',
                                    'defaults' => [
                                        'action' => 'all',
                                    ],
                                ],
                            ],
                            'user'       => [
                                'type'    => 'literal',
                                'options'      => [
                                    'route' => '/user',
                                ],
                                'child_routes' => [
                                    'add'    => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/add/:role',
                                            'defaults' => [
                                                'action' => 'addUser',
                                            ],
                                        ],
                                    ],
                                    'remove' => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/remove/:role',
                                            'defaults' => [
                                                'action' => 'removeUser',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'permission' => [
                                'type'         => 'segment',
                                'options'      => [
                                    'route' => '/permission',
                                ],
                                'child_routes' => [
                                    'add'    => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/add/:role',
                                            'defaults' => [
                                                'action' => 'addPermission',
                                            ],
                                        ],
                                    ],
                                    'remove' => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/remove/:role/:permission',
                                            'defaults' => [
                                                'action' => 'removePermission',
                                            ],
                                        ],
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
