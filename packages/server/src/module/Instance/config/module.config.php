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
namespace Instance;

return [
    'zfc_rbac'           => [
        'assertion_map' => [
            'instance.get' => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'doctrine_factories' => [
        'entitymanager' => __NAMESPACE__ . '\Factory\InstanceAwareEntityManagerFactory',
    ],
    'router'             => [
        'routes' => [
            'instance' => [
                'type'         => 'literal',
                'options'      => [
                    'route'    => '/instance',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\InstanceController',
                    ],
                ],
                'child_routes' => [
                    'switch' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/switch/:instance',
                            'defaults' => [
                                'action' => 'switch',
                            ],
                        ],
                    ],
                ],
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
            'instance' => __NAMESPACE__ . '\Factory\InstanceHelperFactory',
            'currentLanguage' => __NAMESPACE__ . '\Factory\LanguageHelperFactory',
        ],
    ],
    'controllers'        => [
        'factories' => [
            __NAMESPACE__ . '\Controller\InstanceController' => __NAMESPACE__ . '\Factory\InstanceControllerFactory',
        ],
    ],
    'service_manager'    => [
        'invokables' => [
            __NAMESPACE__ . '\Strategy\StrategyPluginManager',
        ],
        'factories'  => [
            __NAMESPACE__ . '\Manager\InstanceManager'            => __NAMESPACE__ . '\Factory\InstanceManagerFactory',
            __NAMESPACE__ . '\Options\InstanceOptions'            => __NAMESPACE__ . '\Factory\InstanceOptionsFactory',
            __NAMESPACE__ . '\Listener\IsolationBypassedListener' => __NAMESPACE__ . '\Factory\IsolationBypassedListenerFactory',
            'Zend\I18n\Translator\TranslatorInterface'            => 'Zend\I18n\Translator\TranslatorServiceFactory',
        ],
    ],
    'di'                 => [
        'instance' => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\InstanceManagerInterface' => __NAMESPACE__ . '\Manager\InstanceManager',
            ],
        ],
    ],
    'class_resolver'     => [
        __NAMESPACE__ . '\Entity\InstanceInterface' => __NAMESPACE__ . '\Entity\Instance',
    ],
];
