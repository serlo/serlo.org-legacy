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
namespace Page;

return [
    'zfc_rbac'        => [
        'assertion_manager' => [
            'factories' => [
                __NAMESPACE__ . '\Assertion\PageAssertion' => __NAMESPACE__ . '\Factory\PageAssertionFactory',
            ],
        ],
        'assertion_map'     => [
            'page.create'            => 'Authorization\Assertion\RequestInstanceAssertion',
            'page.purge'             => 'Authorization\Assertion\InstanceAssertion',
            'page.restore'           => 'Authorization\Assertion\InstanceAssertion',
            'page.trash'             => 'Authorization\Assertion\InstanceAssertion',
            'page.update'            => 'Authorization\Assertion\InstanceAssertion',
            'page.get'               => 'Authorization\Assertion\InstanceAssertion',
            'page.revision.purge'    => 'Authorization\Assertion\InstanceAssertion',
            'page.revision.checkout' => __NAMESPACE__ . '\Assertion\PageAssertion',
            'page.revision.create'   => __NAMESPACE__ . '\Assertion\PageAssertion',
            'page.revision.restore'  => __NAMESPACE__ . '\Assertion\PageAssertion',
            'page.revision.trash'    => __NAMESPACE__ . '\Assertion\PageAssertion',
        ],
    ],
    'taxonomy'        => [
        'types' => [
            'forum' => [
                'allowed_associations' => [
                    'Page\Entity\PageRepositoryInterface',
                ],
            ],
        ],
    ],
    'versioning'      => [
        'permissions' => [
            'Page\Entity\PageRepository' => [
                'commit'   => 'page.revision.create',
                'checkout' => 'page.revision.checkout',
                'reject'   => 'page.revision.trash',
            ],
        ],
    ],
    'uuid'            => [
        'permissions' => [
            'Page\Entity\PageRevision'   => [
                'trash'   => 'page.revision.trash',
                'restore' => 'page.revision.restore',
                'purge'   => 'page.revision.purge',
            ],
            'Page\Entity\PageRepository' => [
                'trash'   => 'page.trash',
                'restore' => 'page.restore',
                'purge'   => 'page.purge',
            ],
        ],
    ],
    'router'          => [
        'routes' => [
            'pages' => [
                'type' => 'literal',
                'may_terminate' => true,
                'options'       => [
                    'route'    => '/pages',
                    'defaults' => [
                        'controller' => 'Page\Controller\IndexController',
                        'action'     => 'index',
                    ],
                ],
            ],
            'page'  => [
                'type'         => 'literal',
                'options'      => [
                    'route'    => '/page',
                    'defaults' => [
                        'controller' => 'Page\Controller\IndexController',
                    ],
                ],
                'child_routes' => [
                    'create'   => [
                        'type'    => 'literal',
                        'options' => [
                            'route'    => '/create',
                            'defaults' => [
                                'action' => 'create',
                            ],
                        ],
                    ],
                    'update'   => [
                        'type'    => 'segment',
                        'options' => [
                            'route'       => '/update/:page',
                            'defaults'    => [
                                'action' => 'update',
                            ],
                            'constraints' => [
                                'page' => '[0-9]+',
                            ],
                        ],
                    ],
                    'view'     => [
                        'type'          => 'segment',
                        'may_terminate' => true,
                        'options'       => [
                            'route'       => '/view/:page',
                            'defaults'    => [
                                'action' => 'view',
                            ],
                            'constraints' => [
                                'page' => '[0-9]+',
                            ],
                        ],
                        'child_routes' => [
                            'convert'  => [
                                'type' => 'literal',
                                'options' => [
                                    'route' => '/convert',
                                    'defaults' => [
                                        'action' => 'view',
                                        'convert' => true,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'revision' => [
                        'type'         => 'segment',
                        'options'      => [
                            'route' => '/revision',
                        ],
                        'child_routes' => [
                            'view'     => [
                                'type'          => 'segment',
                                'may_terminate' => true,
                                'options'       => [
                                    'route'    => '/:revision',
                                    'defaults' => [
                                        'action' => 'viewRevision',
                                    ],
                                ],
                            ],
                            'checkout' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/:page/checkout/:revision',
                                    'defaults'    => [
                                        'action' => 'checkout',
                                    ],
                                    'constraints' => [
                                        'revision' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'view-all' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/revisions/:page',
                                    'defaults'    => [
                                        'action' => 'viewRevisions',
                                    ],
                                    'constraints' => [
                                        'page' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'create-old'   => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/create-old/:page[/:revision]',
                                    'defaults'    => [
                                        'action' => 'createRevision',
                                        'old'    => true,
                                    ],
                                    'constraints' => [
                                        'page'     => '[0-9]+',
                                        'revision' => '[0-9]*',
                                    ],
                                ],
                            ],
                            'create'   => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/create/:page[/:revision]',
                                    'defaults'    => [
                                        'action' => 'createRevision',
                                        'old'    => false,
                                    ],
                                    'constraints' => [
                                        'page'     => '[0-9]+',
                                        'revision' => '[0-9]*',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'class_resolver'  => [
        'Page\Entity\PageRepositoryInterface' => 'Page\Entity\PageRepository',
        'Page\Entity\PageRevisionInterface'   => 'Page\Entity\PageRevision',
        'Page\Entity\PageInterface'           => 'Page\Entity\Page',
    ],
    'service_manager' => [
        'factories' => [
            'Page\Form\RepositoryForm' => 'Page\Factory\RepositoryFormFactory',
            'Page\Form\RevisionForm' => 'Page\Factory\RevisionFormFactory',
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\IndexController',
        ],
        'definition'          => [
            'class' => [
                'Page\Controller\IndexController' => [],
                'Page\Manager\PageManager'        => [],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\PageManagerInterface' => __NAMESPACE__ . '\Manager\PageManager',
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
