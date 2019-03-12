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
namespace Mailman;

return [
    'mailman'         => [
        'adapters' => [
            'Mailman\Adapter\ZendMailAdapter',
        ],
    ],
    'mailmock' => [
        // overridden in develop.local.php
        'active' => false,
    ],
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Mailman'                                   => __NAMESPACE__ . '\Factory\MailmanFactory',
            __NAMESPACE__ . '\Options\ModuleOptions'                     => __NAMESPACE__ . '\Factory\ModuleOptionsFactory',
            __NAMESPACE__ . '\Adapter\ZendMailAdapter'                   => __NAMESPACE__ . '\Factory\ZendMailAdapterFactory',
            __NAMESPACE__ . '\Storage\MailMockStorage'                   => __NAMESPACE__ . '\Factory\MailMockStorageFactory',
            __NAMESPACE__ . '\Listener\AuthenticationControllerListener' => __NAMESPACE__ . '\Factory\AuthenticationControllerListenerFactory',
            __NAMESPACE__ . '\Listener\UserControllerListener'           => __NAMESPACE__ . '\Factory\UserControllerListenerFactory',
            __NAMESPACE__ . '\Listener\NotificationWorkerListener'       => __NAMESPACE__ . '\Factory\NotificationWorkerListenerFactory',
            __NAMESPACE__ . '\Renderer\MailRenderer'                     => __NAMESPACE__ . '\Factory\MailRendererFactory',
            'Zend\Mail\Transport\SmtpOptions'                            => __NAMESPACE__ . '\Factory\SmtpOptionsFactory',
        ],
    ],
    'controllers'        => [
        'factories' => [
            __NAMESPACE__ . '\Controller\MailMockController' => __NAMESPACE__ . '\Factory\MailMockControllerFactory',
        ],
    ],
    'smtp_options'    => [
        'name'              => 'localhost.localdomain',
        'host'              => 'localhost',
        'connection_class'  => 'smtp',
        'connection_config' => [
            'username' => 'postmaster',
            'password' => '',
        ],
    ],
    'di'              => [
        'instance' => [
            'preferences' => [
                'Mailman\MailmanInterface' => 'Mailman\Mailman',
            ],
        ],
    ],
    'router'             => [
        'routes' => [
            'mails' => [
                'type'         => 'literal',
                'options'      => [
                    'route'    => '/mails',
                    'defaults' => [
                        'controller' => __NAMESPACE__ . '\Controller\MailMockController',
                    ],
                ],
                'child_routes' => [
                    'list' => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/list',
                            'defaults' => [
                                'action' => 'list',
                            ],
                        ],
                    ],
                    'clear' => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/clear',
                            'defaults' => [
                                'action' => 'clear',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
