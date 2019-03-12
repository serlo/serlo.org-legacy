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
namespace License;

return [
    'zfc_rbac'        => [
        'assertion_map' => [
            'license.create' => 'Authorization\Assertion\RequestInstanceAssertion',
            'license.update' => 'Authorization\Assertion\InstanceAssertion',
            'license.purge'  => 'Authorization\Assertion\InstanceAssertion',
            'license.get'    => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'service_manager' => [
        'factories' => [],
    ],
    'class_resolver'  => [
        __NAMESPACE__ . '\Entity\LicenseInterface' => __NAMESPACE__ . '\Entity\License',
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\LicenseController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Manager\LicenseManager'         => [],
                __NAMESPACE__ . '\Controller\LicenseController'   => [],
                __NAMESPACE__ . '\Listener\EntityManagerListener' => [
                    'setLicenseManager' => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\LicenseManagerInterface' => __NAMESPACE__ . '\Manager\LicenseManager',
            ],
        ],
    ],
    'doctrine'        => [
        'driver'          => [
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
        'entity_resolver' => [
            'orm_default' => [
                'resolvers' => [
                    __NAMESPACE__ . '\Entity\LicenseInterface' => __NAMESPACE__ . '\Entity\License',
                ],
            ],
        ],
    ],
    'router'          => [
        'routes' => [
            'license' => [
                'type'    => 'literal',
                'options'      => [
                    'route'    => '/license',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\LicenseController',
                    ],
                ],
                'child_routes' => [
                    'manage' => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/manage',
                            'defaults' => [
                                'action' => 'manage',
                            ],
                        ],
                    ],
                    'add'    => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/add',
                            'defaults' => [
                                'action' => 'add',
                            ],
                        ],
                    ],
                    'detail' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/detail/:id',
                            'defaults' => [
                                'action' => 'detail',
                            ],
                        ],
                    ],
                    'update' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/update/:id',
                            'defaults' => [
                                'action' => 'update',
                            ],
                        ],
                    ],
                    'remove' => [
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
];
