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
namespace Entity;

return [
    'router' => [
        'routes' => [
            'entities' => [
                'type'    => 'segment',
                'options' => [
                    'route'    => '/entities',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\ApiController',
                    ],
                ],
                'child_routes' => [
                    'entities' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/:entity',
                            'defaults' => [
                                'action' => 'entity',
                            ],
                        ],
                    ],
                ],
            ],
            'entity' => [
                'type'         => 'literal',
                'options'      => [
                    'route' => '/entity',
                ],
                'child_routes' => [
                    'api'        => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/api',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\ApiController',
                            ],
                        ],
                        'child_routes' => [
                            'json' => [
                                'type'         => 'literal',
                                'options'      => [
                                    'route' => '/json',
                                ],
                                'child_routes' => [
                                    'export' => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/export/:type',
                                            'defaults' => [
                                                'action' => 'export',
                                            ],
                                        ],
                                    ],
                                    'latest' => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/export/latest/:type/:age',
                                            'defaults' => [
                                                'action' => 'latest',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'rss'  => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/rss/:type/:age/feed.rss',
                                    'defaults' => [
                                        'action' => 'rss',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'create'     => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/create/:type',
                            'defaults' => [
                                'controller' => 'Entity\Controller\EntityController',
                                'action'     => 'create',
                            ],
                        ],
                    ],
                    'repository' => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/repository',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\RepositoryController',
                            ],
                        ],
                        'child_routes' => [
                            'checkout'     => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/checkout/:entity/:revision',
                                    'defaults'    => [
                                        'action' => 'checkout',
                                    ],
                                    'constraints' => [
                                        'entity'   => '[0-9]+',
                                        'revision' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'reject'       => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/reject/:entity/:revision',
                                    'defaults'    => [
                                        'action' => 'reject',
                                    ],
                                    'constraints' => [
                                        'entity'   => '[0-9]+',
                                        'revision' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'compare'      => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/compare/:entity/:revision',
                                    'defaults'    => [
                                        'action' => 'compare',
                                    ],
                                    'constraints' => [
                                        'entity'   => '[0-9]+',
                                        'revision' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'history'      => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/history/:entity',
                                    'defaults'    => [
                                        'action' => 'history',
                                    ],
                                    'constraints' => [
                                        'entity' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'add-revision-old' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/add-revision-old/:entity[/:revision]',
                                    'defaults'    => [
                                        'action' => 'addRevision',
                                        'old' => true,
                                    ],
                                    'constraints' => [
                                        'entity' => '[0-9]+',
                                        'revision' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'add-revision' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/add-revision/:entity[/:revision]',
                                    'defaults'    => [
                                        'action' => 'addRevision',
                                        'old' => false,
                                    ],
                                    'constraints' => [
                                        'entity' => '[0-9]+',
                                        'revision' => '[0-9]+',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'license'    => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/license',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\LicenseController',
                            ],
                        ],
                        'child_routes' => [
                            'update' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/update/:entity',
                                    'defaults'    => [
                                        'action' => 'update',
                                    ],
                                    'constraints' => [
                                        'entity' => '[0-9]+',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'link'       => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/link',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\LinkController',
                            ],
                        ],
                        'child_routes' => [
                            'order' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/order/:entity/:type',
                                    'defaults'    => [
                                        'action' => 'orderChildren',
                                    ],
                                    'constraints' => [
                                        'entity' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'move'  => [
                                'type'        => 'segment',
                                'options'     => [
                                    'route'    => '/move/:type/:entity/:from',
                                    'defaults' => [
                                        'action' => 'move',
                                    ],
                                ],
                                'constraints' => [
                                    'entity' => '[0-9]+',
                                ],
                            ],
                        ],
                    ],
                    'page'       => [
                        'type'    => 'segment',
                        'options' => [
                            'route'       => '/view/:entity',
                            'defaults'    => [
                                'controller' => __NAMESPACE__ . '\Controller\PageController',
                                'action'     => 'index',
                            ],
                            'constraints' => [
                                'entity' => '[0-9]+',
                            ],
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'tableOfContents' => [
                                'type'      => 'segment',
                                'options'   => [
                                    'route' => '/toc',
                                    'defaults' => [
                                        'controller' => __NAMESPACE__ . '\Controller\TOCController',
                                        'action'    => 'index',
                                    ],
                                ],
                            ],
                            'convert' => [
                                'type' => 'segment',
                                'options' => [
                                    'route' => '/convert',
                                    'defaults' => [
                                        'controller' => __NAMESPACE__ . '\Controller\PageController',
                                        'action' => 'index',
                                        'convert' => true,
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
                            'update' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/update/:entity',
                                    'defaults'    => [
                                        'controller' => __NAMESPACE__ . '\Controller\TaxonomyController',
                                        'action'     => 'update',
                                    ],
                                    'constraints' => [
                                        'entity' => '[0-9]+',
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
