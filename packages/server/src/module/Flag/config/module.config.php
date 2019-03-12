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
namespace Flag;

return [
    'zfc_rbac'        => [
        'assertion_map' => [
            'flag.create' => 'Authorization\Assertion\RequestInstanceAssertion',
            'flag.get'    => 'Authorization\Assertion\InstanceAssertion',
            'flag.purge' => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'flag'            => [
        'types' => [
            'spam',
            'offensive',
            'other',
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
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Options\ModuleOptions' => __NAMESPACE__ . '\Factory\ModuleOptionsFactory',
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\FlagController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Manager\FlagManager'       => [],
                __NAMESPACE__ . '\Controller\FlagController' => [],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\FlagManagerInterface' => __NAMESPACE__ . '\Manager\FlagManager',
            ],
        ],
    ],
    'class_resolver'  => [
        __NAMESPACE__ . '\Entity\FlagInterface'         => __NAMESPACE__ . '\Entity\Flag',
        __NAMESPACE__ . '\Entity\TypeInterface'         => __NAMESPACE__ . '\Entity\Type',
        __NAMESPACE__ . '\Service\FlagServiceInterface' => __NAMESPACE__ . '\Service\FlagService',
    ],
    'router'          => [
        'routes' => [
            'flag' => [
                'type'    => 'literal',
                'options'      => [
                    'route'    => '/flag',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\FlagController',
                    ],
                ],
                'child_routes' => [
                    'manage' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/manage[/:type]',
                            'defaults' => [
                                'action' => 'manage',
                            ],
                        ],
                    ],
                    'add'    => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/add/:id',
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
