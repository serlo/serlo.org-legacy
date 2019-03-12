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
namespace Contexter;

return [
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Router\Router'         => __NAMESPACE__ . '\Factory\RouterFactory',
            __NAMESPACE__ . '\Options\ModuleOptions' => __NAMESPACE__ . '\Factory\ModuleOptionsFactory',
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\ContextController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Adapter\EntityControllerAdapter' => [
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\ContextController'    => [],
                __NAMESPACE__ . '\Manager\ContextManager'          => [],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\ContextManagerInterface' => __NAMESPACE__ . '\Manager\ContextManager',
                __NAMESPACE__ . '\Router\RouterInterface'          => __NAMESPACE__ . '\Router\Router',
            ],
        ],
    ],
];
