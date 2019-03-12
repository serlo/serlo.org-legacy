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
namespace Alias;

return [
    'controllers'      => [
        'factories' => [
            __NAMESPACE__ . '\Controller\RefreshController' => __NAMESPACE__ . '\Factory\RefreshControllerFactory',
        ],
    ],
    'console'         => [
        'router' => [
            'routes' => [
                'alias' => [
                    'options' => [
                        'route'    => 'alias refresh [--percentile=] [--skip-entities] [--skip-terms] ',
                        'defaults' => [
                            'controller' => __NAMESPACE__ . '\Controller\RefreshController',
                            'action'     => 'refresh',
                        ],
                    ],
                ],
            ],
        ],
    ],
    'alias_manager'      => [
        'aliases' => [
            'blogPost'     => [
                'tokenize' => 'blog/{category}/{title}',
                'provider' => 'Blog\Provider\TokenizerProvider',
                'fallback' => 'blog/{category}/{id}-{title}',
            ],
            'entity'       => [
                'tokenize' => '{path}/{title}',
                'fallback' => '{path}/{title}-{id}',
                'provider' => 'Entity\Provider\TokenProvider',
            ],
            'taxonomyTerm' => [
                'tokenize' => '{path}',
                'fallback' => '{path}-{id}',
                'provider' => 'Taxonomy\Provider\TokenProvider',
            ],
        ],
    ],
    'controller_plugins' => [
        'factories' => [
            'url' => __NAMESPACE__ . '\Factory\UrlPluginFactory',
        ],
    ],
    'class_resolver'     => [
        __NAMESPACE__ . '\Entity\AliasInterface' => __NAMESPACE__ . '\Entity\Alias',
    ],
    'router'             => [
        'routes' => [
            'alias' => [
                'type'     => 'Common\Router\Slashable',
                'priority' => -10000,
                'options'  => [
                    'route'       => '/:alias',
                    'defaults'    => [
                        'controller' => 'Alias\Controller\AliasController',
                        'action'     => 'forward',
                    ],
                    'constraints' => [
                        'alias' => '(.)+',
                    ],
                ],
            ],
        ],
    ],
    'service_manager'    => [
        'factories' => [
            __NAMESPACE__ . '\Options\ManagerOptions'             => __NAMESPACE__ . '\Factory\ManagerOptionsFactory',
            __NAMESPACE__ . '\AliasManager'                       => __NAMESPACE__ . '\Factory\AliasManagerFactory',
            __NAMESPACE__ . '\Listener\BlogManagerListener'       => __NAMESPACE__ . '\Factory\BlogManagerListenerFactory',
            __NAMESPACE__ . '\Listener\BlogManagerListener'       => __NAMESPACE__ . '\Factory\BlogManagerListenerFactory',
            __NAMESPACE__ . '\Listener\RepositoryManagerListener' => __NAMESPACE__ . '\Factory\RepositoryManagerListenerFactory',
            __NAMESPACE__ . '\Listener\PageControllerListener'    => __NAMESPACE__ . '\Factory\PageControllerListenerFactory',
            __NAMESPACE__ . '\Listener\TaxonomyManagerListener'   => __NAMESPACE__ . '\Factory\TaxonomyManagerListenerFactory',
            __NAMESPACE__ . '\Storage\AliasStorage'               => __NAMESPACE__ . '\Factory\AliasStorageFactory',
        ],
    ],
    'di'                 => [
        'allowed_controllers' => [
            'Alias\Controller\AliasController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Controller\AliasController' => [
                    'setAliasManager'    => [
                        'required' => true,
                    ],
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\AliasManagerInterface' => __NAMESPACE__ . '\AliasManager',
            ],
        ],
    ],
    'doctrine'           => [
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
    'view_helpers'       => [
        'factories' => [
            'url'   => __NAMESPACE__ . '\Factory\UrlHelperFactory',
            'alias' => __NAMESPACE__ . '\Factory\AliasHelperFactory',
        ],
    ],
    'zfctwig'            => [
        'helper_manager' => [
            'factories' => [
                'url'   => __NAMESPACE__ . '\Factory\UrlHelperFactory',
                'alias' => __NAMESPACE__ . '\Factory\AliasHelperFactory',
            ],
        ],
    ],
];
