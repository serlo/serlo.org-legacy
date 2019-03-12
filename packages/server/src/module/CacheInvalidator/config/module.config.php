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
 * @author      Jakob Pfab (jakob.pfab@serlo.org]
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright   Copyright (c] 2013 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/]
 */
namespace CacheInvalidator;

return [
    'service_manager'   => [
        'factories' => [
            __NAMESPACE__ . '\Listener\CacheListener'         => __NAMESPACE__ . '\Factory\CacheListenerFactory',
            __NAMESPACE__ . '\Invalidator\InvalidatorManager' => __NAMESPACE__ . '\Factory\InvalidatorManagerFactory',
            __NAMESPACE__ . '\Options\CacheOptions'           => __NAMESPACE__ . '\Factory\CacheOptionsFactory',
        ],
    ],
//    'cache_invalidator' => [
//        'invalidators' => [
//            'factories' => [
//                __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator' => __NAMESPACE__ . '\Factory\NavigationStorageInvalidatorFactory',
//                __NAMESPACE__ . '\Invalidator\StrokerStorageInvalidator'    => __NAMESPACE__ . '\Factory\StrokerStorageInvalidatorFactory',
//                __NAMESPACE__ . '\Invalidator\RepositoryStorageInvalidator' => __NAMESPACE__ . '\Factory\RepositoryStorageInvalidatorFactory',
//                __NAMESPACE__ . '\Invalidator\TaxonomyStorageInvalidator'   => __NAMESPACE__ . '\Factory\TaxonomyStorageInvalidatorFactory'
//            ]
//        ],
//        'listens'      => [
//            'Versioning\RepositoryManager'         => [
//                'checkout' => [
//                    __NAMESPACE__ . '\Invalidator\RepositoryStorageInvalidator'
//                ]
//            ],
//            'Taxonomy\Manager\TaxonomyManager'     => [
//                'create' => [
//                    __NAMESPACE__ . '\Invalidator\TaxonomyStorageInvalidator'
//                ],
//                'update' => [
//                    __NAMESPACE__ . '\Invalidator\TaxonomyStorageInvalidator'
//                ]
//            ],
//            'Navigation\Manager\NavigationManager' => [
//                'page.create'      => [
//                    __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator',
//                ],
//                'page.update'      => [
//                    __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator'
//                ],
//                'page.remove'      => [
//                    __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator',
//                ],
//                'parameter.create' => [
//                    __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator',
//                ],
//                'parameter.update' => [
//                    __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator',
//                ],
//                'parameter.remove' => [
//                    __NAMESPACE__ . '\Invalidator\NavigationStorageInvalidator',
//                ],
//            ]
//        ]
//    ]
];
