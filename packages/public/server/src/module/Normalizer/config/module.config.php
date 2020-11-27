<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Normalizer;

use Normalizer\Controller\SignpostController;
use Normalizer\Controller\SitemapController;
use Normalizer\Factory\NormalizeHelperFactory;
use Normalizer\Factory\NormalizerFactory;

return [
    'view_helpers' => [
        'factories' => [
            'normalize' => NormalizeHelperFactory::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            Normalizer::class => NormalizerFactory::class,
        ],
    ],
    'di' => [
        'allowed_controllers' => [
            SignpostController::class,
            SitemapController::class,
        ],
        'definition' => [
            'class' => [
                SignpostController::class => [
                    'setUuidManager' => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance' => [
            'preferences' => [
                NormalizerInterface::class => Normalizer::class,
            ],
        ],
    ],
    'console' => [
        'router' => [
            'routes' => [
                'sitemap' => [
                    'options' => [
                        'route' => 'sitemap',
                        'defaults' => [
                            'controller' => SitemapController::class,
                            'action' => 'index',
                        ],
                    ],
                ],
            ],
        ],
    ],
    'router' => [
        'routes' => [
            'meta' => [
                'type' => 'segment',
                'options' => [
                    'route' => '/meta/:id',
                    'defaults' => [
                        'controller' => SignpostController::class,
                        'action' => 'meta',
                    ],
                ],
            ],
            'normalizer' => [
                'type' => 'segment',
                'options' => [
                    'route' => '',
                ],
                'child_routes' => [
                    'signpost' => [
                        'type' => 'segment',
                        'options' => [
                            'route' => '/ref/:object',
                            'defaults' => [
                                'controller' => SignpostController::class,
                                'action' => 'ref',
                            ],
                        ],
                    ],
                ],
            ],
            'sitemap' => [
                'type' => 'literal',
                'options' => [
                    'route' => '/sitemap',
                    'defaults' => [
                        'controller' => SitemapController::class,
                    ],
                ],
                'child_routes' => [
                    'uuid' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/uuid.xml',
                            'defaults' => [
                                'action' => 'uuid',
                            ],
                        ],
                    ],
                    'navigation' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/nav.xml',
                            'defaults' => [
                                'action' => 'index',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
