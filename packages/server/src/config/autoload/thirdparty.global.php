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

require __DIR__ . '/../definitions.local.php';

return [
    // doctrine/doctrine-orm-module
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' => 'Doctrine\DBAL\Driver\PDOMySql\Driver',
                'params' => [
                    'host' => $db["host"],
                    'port' => $db["port"],
                    'user' => $db["username"],
                    'password' => $db["password"],
                    'dbname' => $db["database"],
                    // Yes..this is currently the only way i know of fixing database encoding issues
                    'charset' => 'latin1',
                ],
            ],
        ],
        'entitymanager' => [
            'orm_default' => [
                'connection' => 'orm_default',
                'configuration' => 'orm_default',
            ],
        ],
    ],

    // stroker/cache
    'strokercache' => [
        'strategies' => [
            'enabled' => [
                'StrokerCache\Strategy\RouteName' => [
                    'routes' => [
                        'home',
                        'taxonomy/term/get',
                        'entity/page',
                        'page/view',
                        'navigation/render',
                        'sitemap',
                        'uuid/get',
                    ],
                ],
            ],
        ],
    ],

    // zf-commons/zfc-rbac
    'zfc_rbac' => [
        'protection_policy' => ZfcRbac\Guard\GuardInterface::POLICY_ALLOW,
        'role_provider' => [
            'ZfcRbac\Role\ObjectRepositoryRoleProvider' => [
                'object_manager' => 'doctrine.entitymanager.orm_default',
                'class_name' => 'User\Entity\Role',
                'role_name_property' => 'name',
            ],
        ],
        'redirect_strategy' => [
            'redirect_to_route_connected' => 'authorization/forbidden',
            'redirect_to_route_disconnected' => 'authentication/login',
            'append_previous_uri' => true,
            'previous_uri_query_key' => 'redir',
        ],
    ],

    // zf-commons/zfc-twig TODO: used in module configs
    'zfctwig' => [
        'environment_options' => [
            'cache' => __DIR__ . '/../../data/twig',
        ],
        'extensions' => [
            'Twig_Extensions_Extension_I18n',
        ],
    ],
];
