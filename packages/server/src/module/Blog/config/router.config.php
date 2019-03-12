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
namespace Blog;

return [
    'router' => [
        'routes' => [
            'blog' => [
                'type'    => 'literal',
                'options'       => [
                    'route'    => '/blog',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\BlogController',
                        'action'     => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes'  => [
                    'view-all' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/view-all/:id',
                            'defaults' => [
                                'action' => 'viewAll',
                            ],
                        ],
                    ],
                    'view'     => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/view/:id',
                            'defaults' => [
                                'action' => 'view',
                            ],
                        ],
                    ],
                    'post'     => [
                        'type'    => 'literal',
                        'options'      => [
                            'route' => '/post',
                        ],
                        'child_routes' => [
                            'create' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/create/:id',
                                    'defaults' => [
                                        'action' => 'create',
                                    ],
                                ],
                            ],
                            'view'   => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/view/:post',
                                    'defaults' => [
                                        'action' => 'viewPost',
                                    ],
                                ],
                            ],
                            'update' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/update/:post',
                                    'defaults' => [
                                        'action' => 'update',
                                    ],
                                ],
                            ],
                            'trash'  => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'    => '/trash/:post',
                                    'defaults' => [
                                        'action' => 'trash',
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
