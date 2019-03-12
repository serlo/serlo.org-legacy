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
namespace StaticPage;

return [
    'di' => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\DatenschutzController',
            __NAMESPACE__ . '\Controller\SpendenController',
        ],
        'definition' => [
            'class' => [
                __NAMESPACE__ . '\Controller\DatenschutzController' => [],
                __NAMESPACE__ . '\Controller\SpendenController' => [],
            ],
        ],
    ],
    'router' => [
        'routes' => [
            'deutsch' => [
                'type' => 'hostname',
                'options' => [
                    'route' => ':subdomain.:domain.:tld',
                    'constraints' => [
                        'subdomain' => 'de',
                        'domain' => '.*?',
                        'tld' => '.*?',
                    ],
                ],
                'child_routes' => [
                    'datenschutz' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/datenschutz',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\DatenschutzController',
                                'action' => 'index',
                            ],
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'archiv' => [
                                'type' => 'literal',
                                'options' => [
                                    'route' => '/archiv',
                                    'defaults' => [
                                        'action' => 'archiveIndex',
                                    ],
                                ],
                                'may_terminate' => true,
                                'child_routes' => [
                                    'view' => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'    => '/:revision',
                                            'defaults' => [
                                                'action' => 'archiveView',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'json' => [
                                'type'         => 'literal',
                                'options'      => [
                                    'route' => '/json',
                                    'defaults' => [
                                        'action' => 'json',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'spenden' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/spenden',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\SpendenController',
                                'action' => 'index',
                            ],
                        ],
                        'may_terminate' => true,
                    ],
                ],
            ],
        ],
    ],
    'datenschutz' => [
        'revisions' => [
            '20181201',
            '20181017',
        ],
    ],
];
