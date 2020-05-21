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

namespace Session;

use Session\Controller\SessionController;

return [
    'service_manager' => [
        'factories' => [
            'Zend\Session\SaveHandler\SaveHandlerInterface' =>
                __NAMESPACE__ . '\Factory\SaveHandlerFactory',
        ],
    ],
    'controllers' => [
        'factories' => [
            'Session\Controller\SessionController' =>
                __NAMESPACE__ . '\Factory\SessionControllerFactory',
        ],
    ],
    'router' => [
        'routes' => [
            'session' => [
                'type' => 'literal',
                'options' => [
                    'route' => '/session',
                    'defaults' => [
                        'controller' => SessionController::class,
                    ],
                ],
                'may_terminate' => false,
                'child_routes' => [
                    'gc' => [
                        'type' => 'literal',
                        'options' => [
                            'route' => '/gc',
                            'defaults' => [
                                'action' => 'gc',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
