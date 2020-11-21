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

namespace Alias;

use Alias\Controller\AliasController;
use Alias\Factory\AliasControllerFactory;

return [
    'controllers' => [
        'factories' => [
            AliasController::class => AliasControllerFactory::class,
        ],
    ],
    'controller_plugins' => [
        'factories' => [
            'url' => __NAMESPACE__ . '\Factory\UrlPluginFactory',
        ],
    ],
    'class_resolver' => [
        __NAMESPACE__ . '\Entity\AliasInterface' =>
            __NAMESPACE__ . '\Entity\Alias',
    ],
    'router' => [
        'routes' => [
            'alias' => [
                'type' => 'Common\Router\Slashable',
                'priority' => -10000,
                'options' => [
                    'route' => '/:alias',
                    'defaults' => [
                        'controller' => AliasController::class,
                        'action' => 'resolve',
                    ],
                    'constraints' => [
                        'alias' => '(.)+',
                    ],
                ],
            ],
        ],
    ],
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\AliasManager' =>
                __NAMESPACE__ . '\Factory\AliasManagerFactory',
            __NAMESPACE__ . '\Storage\AliasStorage' =>
                __NAMESPACE__ . '\Factory\AliasStorageFactory',
        ],
    ],
    'di' => [
        'instance' => [
            'preferences' => [
                __NAMESPACE__ . '\AliasManagerInterface' =>
                    __NAMESPACE__ . '\AliasManager',
            ],
        ],
    ],
    'doctrine' => [
        'driver' => [
            __NAMESPACE__ . '_driver' => [
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [__DIR__ . '/../src/Entity'],
            ],
            'orm_default' => [
                'drivers' => [
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
                ],
            ],
        ],
    ],
    'view_helpers' => [
        'factories' => [
            'url' => __NAMESPACE__ . '\Factory\UrlHelperFactory',
            'alias' => __NAMESPACE__ . '\Factory\AliasHelperFactory',
        ],
    ],
    'zfctwig' => [
        'helper_manager' => [
            'factories' => [
                'url' => __NAMESPACE__ . '\Factory\UrlHelperFactory',
                'alias' => __NAMESPACE__ . '\Factory\AliasHelperFactory',
            ],
        ],
    ],
];
