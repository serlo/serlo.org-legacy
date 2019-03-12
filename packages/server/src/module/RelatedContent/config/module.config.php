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
namespace RelatedContent;

return [
    'zfc_rbac'        => [
        'assertion_map' => [
            'related.content.create' => 'Authorization\Assertion\RequestInstanceAssertion',
            'related.content.update' => 'Authorization\Assertion\InstanceAssertion',
            'related.content.purge'  => 'Authorization\Assertion\InstanceAssertion',
            'related.content.get'    => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Manager\RelatedContentManager' => __NAMESPACE__ . '\Factory\RelatedContentManagerFactory',
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\RelatedContentController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Controller\RelatedContentController' => [
                    'setRelatedContentManager' => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\RelatedContentManagerInterface' => __NAMESPACE__ . '\Manager\RelatedContentManager',
                'Zend\Mvc\Router\RouteInterface'                          => 'Router',
            ],
        ],
    ],
    'class_resolver'  => [
        __NAMESPACE__ . '\Entity\ContainerInterface' => __NAMESPACE__ . '\Entity\Container',
        __NAMESPACE__ . '\Entity\ExternalInterface'  => __NAMESPACE__ . '\Entity\External',
        __NAMESPACE__ . '\Entity\InternalInterface'  => __NAMESPACE__ . '\Entity\Internal',
        __NAMESPACE__ . '\Entity\CategoryInterface'  => __NAMESPACE__ . '\Entity\Category',
        __NAMESPACE__ . '\Entity\HolderInterface'    => __NAMESPACE__ . '\Entity\Holder',
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
    'router'          => [
        'routes' => [
            'related-content' => [
                'type'         => 'segment',
                'options'      => [
                    'route'    => '/related-content',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\RelatedContentController',
                    ],
                ],
                'child_routes' => [
                    'manage'       => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/:id',
                            'defaults' => [
                                'action' => 'manage',
                            ],
                        ],
                    ],
                    'add-internal' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/add-internal/:id',
                            'defaults' => [
                                'action' => 'addInternal',
                            ],
                        ],
                    ],
                    'add-category' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/add-category/:id',
                            'defaults' => [
                                'action' => 'addCategory',
                            ],
                        ],
                    ],
                    'add-external' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/add-external/:id',
                            'defaults' => [
                                'action' => 'addExternal',
                            ],
                        ],
                    ],
                    'remove'       => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/remove-internal/:id',
                            'defaults' => [
                                'action' => 'remove',
                            ],
                        ],
                    ],
                    'order'        => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/order',
                            'defaults' => [
                                'action' => 'order',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'view_helpers'    => [
        'factories' => [
            'related' => __NAMESPACE__ . '\Factory\RelatedContentHelperFactory',
        ],
    ],
];
