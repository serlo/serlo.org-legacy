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
namespace Taxonomy;

return [
    'zfc_rbac'         => [
        'assertion_map' => [
            'taxonomy.get'                  => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.purge'                => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.create'               => 'Authorization\Assertion\RequestInstanceAssertion',
            'taxonomy.term.get'             => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.create'          => 'Authorization\Assertion\RequestInstanceAssertion',
            'taxonomy.term.update'          => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.trash'           => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.restore'         => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.sort'            => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.purge'           => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.associate'       => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.dissociate'      => 'Authorization\Assertion\InstanceAssertion',
            'taxonomy.term.associated.sort' => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'term_router'      => [
        'routes' => [],
    ],
    'class_resolver'   => [
        __NAMESPACE__ . '\Entity\TaxonomyTypeInterface' => __NAMESPACE__ . '\Entity\TaxonomyType',
        __NAMESPACE__ . '\Entity\TaxonomyInterface'     => __NAMESPACE__ . '\Entity\Taxonomy',
        __NAMESPACE__ . '\Entity\TaxonomyTermInterface' => __NAMESPACE__ . '\Entity\TaxonomyTerm',
    ],
    'view_helpers'     => [
        'factories' => [
            'taxonomy' => __NAMESPACE__ . '\Factory\TaxonomyHelperFactory',
        ],
    ],
    'hydrator_plugins' => [
        'factories' => [
            __NAMESPACE__ . '\Hydrator\TaxonomyTermHydratorPlugin' => __NAMESPACE__ . '\Factory\TaxonomyTermHydratorPluginFactory',
        ],
    ],
    'taxonomy'         => [
        'types' => [
            'root' => [
                'allowed_parents' => [],
                'rootable'        => true,
            ],
        ],
    ],
    'router'           => [
        'routes' => [
            'taxonomies' => [
                'type'         => 'literal',
                'options'      => [
                    'route'    => '/taxonomies',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\ApiController',
                    ],
                ],
                'child_routes' => [
                    'terms'    => [
                        'type'    => 'Segment',
                        'options' => [
                            'route'    => '/terms/:id',
                            'defaults' => [
                                'action' => 'term',
                            ],
                        ],
                    ],
                    'types' => [
                        'type'          => 'Segment',
                        'options'       => [
                            'route'    => '/types',
                            'defaults' => [
                                'action' => 'types',
                            ],
                        ],
                        'may_terminate' => true,
                        'child_routes'  => [
                            'type' => [
                                'type'          => 'Segment',
                                'options'       => [
                                    'route'    => '/:type',
                                    'defaults' => [
                                        'action' => 'type',
                                    ],
                                ],
                                'may_terminate' => true,
                                'child_routes'  => [
                                    'saplings' => [
                                        'type'    => 'Segment',
                                        'options' => [
                                            'route'    => '/saplings',
                                            'defaults' => [
                                                'action' => 'saplings',
                                            ],
                                        ],
                                    ],
                                    'terms'    => [
                                        'type'    => 'Segment',
                                        'options' => [
                                            'route'    => '/terms',
                                            'defaults' => [
                                                'action' => 'terms',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            'taxonomy'   => [
                'type'         => 'literal',
                'options'      => [
                    'route' => '/taxonomy',
                ],
                'child_routes' => [
                    'taxonomy' => [
                        'type'    => 'Segment',
                        'options' => [
                            'route'    => '/:action/:id',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\TaxonomyController',
                            ],
                        ],
                    ],
                    'term'     => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/term',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\TermController',
                            ],
                        ],
                        'child_routes' => [
                            'get'             => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'      => '/get/:term',
                                    'constrains' => ['term' => '[0-9]+'],
                                    'defaults'   => [
                                        'controller' => __NAMESPACE__ . '\Controller\GetController',
                                        'action'     => 'index',
                                    ],
                                ],
                            ],
                            'update'          => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/update/:term',
                                    'defaults' => [
                                        'action' => 'update',
                                    ],
                                ],
                            ],
                            'create'          => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/create/:taxonomy/:parent',
                                    'defaults' => [
                                        'action' => 'create',
                                    ],
                                ],
                            ],
                            'order'           => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/order/:term',
                                    'defaults' => [
                                        'action' => 'order',
                                    ],
                                ],
                            ],
                            'organize'        => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/organize/:term',
                                    'defaults' => [
                                        'action' => 'organize',
                                    ],
                                ],
                            ],
                            'organize-all'    => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/organize-all',
                                    'defaults' => [
                                        'action' => 'organize',
                                    ],
                                ],
                            ],
                            'sort-associated' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/sort/:association/:term',
                                    'defaults' => [
                                        'action' => 'orderAssociated',
                                    ],
                                ],
                            ],
                            'batch-copy' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/copy/batch/:term',
                                    'defaults' => [
                                        'action' => 'batchCopy',
                                    ],
                                ],
                            ],
                            'batch-move' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/move/batch/:term',
                                    'defaults' => [
                                        'action' => 'batchMove',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'service_manager'  => [
        'factories' => [
            __NAMESPACE__ . '\Options\ModuleOptions'       => __NAMESPACE__ . '\Factory\ModuleOptionsFactory',
            __NAMESPACE__ . '\Manager\TaxonomyManager'     => __NAMESPACE__ . '\Factory\TaxonomyManagerFactory',
            __NAMESPACE__ . '\Provider\NavigationProvider' => __NAMESPACE__ . '\Factory\NavigationProviderFactory',
        ],
    ],
    'di'               => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\TermController',
            __NAMESPACE__ . '\Controller\GetController',
            __NAMESPACE__ . '\Controller\ApiController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Listener\EntityManagerListener' => [
                    'setTaxonomyManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Form\TermForm'                  => [],
                __NAMESPACE__ . '\Controller\GetController'       => [],
                __NAMESPACE__ . '\Controller\ApiController'       => [],
                __NAMESPACE__ . '\Controller\TermController'      => [],
                __NAMESPACE__ . '\Hydrator\TaxonomyTermHydrator'  => [],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\TaxonomyManagerInterface' => __NAMESPACE__ . '\Manager\TaxonomyManager',
            ],
        ],
    ],
    'uuid'             => [
        'permissions' => [
            'Taxonomy\Entity\TaxonomyTerm' => [
                'trash'   => 'taxonomy.term.trash',
                'restore' => 'taxonomy.term.restore',
                'purge'   => 'taxonomy.term.purge',
            ],
        ],
    ],
    'doctrine'         => [
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
