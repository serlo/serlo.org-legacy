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
 * @author      Aeneas Rekkas (aeneas.rekkas@serlo.org]
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright   Copyright (c] 2013 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/]
 */
namespace Common;

return [
    'controller_plugins' => [
        'invokables' => [
            'referer'  => 'Common\Controller\Plugin\RefererProvider',
            'redirect' => 'Common\Controller\Plugin\RedirectHelper',
        ],
    ],
    'route_manager'      => [
        'invokables' => [
            'slashable' => __NAMESPACE__ . '\Router\Slashable',
        ],
    ],
    'service_manager'    => [
        'factories' => [
            __NAMESPACE__ . '\Hydrator\HydratorPluginAwareDoctrineObject' => __NAMESPACE__ . '\Factory\HydratorPluginAwareDoctrineObjectFactory',
            __NAMESPACE__ . '\Hydrator\HydratorPluginManager'             => __NAMESPACE__ . '\Factory\HydratorPluginManagerFactory',
            'doctrine.cache.apccache'                                     => __NAMESPACE__ . '\Factory\ApcCacheFactory',
        ],
    ],
];
