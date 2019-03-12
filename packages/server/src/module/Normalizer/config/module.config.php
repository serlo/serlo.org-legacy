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

/**
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author      Aeneas Rekkas (aeneas.rekkas@serlo.org]
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright   Copyright (c] 2013 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/]
 */
namespace Normalizer;

return [
    'view_helpers'    => [
        'factories' => [
            'normalize' => __NAMESPACE__ . '\Factory\NormalizeHelperFactory',
        ],
    ],
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Normalizer'      => __NAMESPACE__ . '\Factory\NormalizerFactory',
            __NAMESPACE__ . '\Storage\Storage' => __NAMESPACE__ . '\Factory\NormalizerStorageFactory',
        ],
    ],
    'normalizer'      => [
        'strategies' => [
            __NAMESPACE__ . '\Strategy\AttachmentStrategy'     => [],
            __NAMESPACE__ . '\Strategy\CommentStrategy'        => [],
            __NAMESPACE__ . '\Strategy\EntityRevisionStrategy' => [],
            __NAMESPACE__ . '\Strategy\EntityStrategy'         => [],
            __NAMESPACE__ . '\Strategy\PageRepositoryStrategy' => [],
            __NAMESPACE__ . '\Strategy\PageRevisionStrategy'   => [],
            __NAMESPACE__ . '\Strategy\PostStrategy'           => [],
            __NAMESPACE__ . '\Strategy\TaxonomyTermStrategy'   => [],
            __NAMESPACE__ . '\Strategy\UserStrategy'           => [],
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\SignpostController',
            __NAMESPACE__ . '\Controller\SitemapController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Controller\SignpostController' => [
                    'setNormalizer'  => [
                        'required' => true,
                    ],
                    'setUuidManager' => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\NormalizerInterface' => __NAMESPACE__ . '\Normalizer',
            ],
        ],
    ],
    'console'         => [
        'router' => [
            'routes' => [
                'sitemap' => [
                    'options' => [
                        'route'    => 'sitemap',
                        'defaults' => [
                            'controller' => __NAMESPACE__ . '\Controller\SitemapController',
                            'action'     => 'index',
                        ],
                    ],
                ],
            ],
        ],
    ],
    'router'          => [
        'routes' => [
            'meta' => [
                'type'    => 'segment',
                'options' => [
                    'route'    => '/meta/:id',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\SignpostController',
                        'action'     => 'meta',
                    ],
                ],
            ],
            'normalizer' => [
                'type'         => 'segment',
                'options'      => [
                    'route' => '',
                ],
                'child_routes' => [
                    'signpost' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/ref/:object',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\SignpostController',
                                'action'     => 'ref',
                            ],
                        ],
                    ],
                ],
            ],
            'sitemap'    => [
                'type'    => 'literal',
                'options' => [
                    'route'    => '/sitemap',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\SitemapController',
                    ],
                ],
                'child_routes' => [
                    'uuid' => [
                        'type'    => 'literal',
                        'options'  => [
                            'route'    => '/uuid.xml',
                            'defaults'    => [
                                'action'     => 'uuid',
                            ],
                        ],
                    ],
                    'navigation' => [
                        'type'    => 'literal',
                        'options'  => [
                            'route'    => '/nav.xml',
                            'defaults'    => [
                                'action'     => 'index',
                            ],
                        ],
                    ],
                ],
            ],
            'uuid'       => [
                'child_routes' => [
                    'get' => [
                        'type'     => 'segment',
                        'priority' => -9000,
                        'options'  => [
                            'route'       => '/:uuid',
                            'defaults'    => [
                                'controller' => __NAMESPACE__ . '\Controller\SignpostController',
                                'action'     => 'index',
                            ],
                            'constraints' => [
                                'uuid' => '[0-9]+',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
