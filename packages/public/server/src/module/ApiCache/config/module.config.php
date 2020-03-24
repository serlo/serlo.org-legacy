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

namespace ApiCache;

use ApiCache\Factory\AliasManagerListenerFactory;
use ApiCache\Factory\CacheFactory;
use ApiCache\Factory\LicenseManagerListenerFactory;
use ApiCache\Factory\PageManagerListenerFactory;
use ApiCache\Factory\RepositoryManagerListenerFactory;
use ApiCache\Factory\UserManagerListenerFactory;
use ApiCache\Factory\UuidManagerListenerFactory;
use ApiCache\Listener\AliasManagerListener;
use ApiCache\Listener\LicenseManagerListener;
use ApiCache\Listener\PageManagerListener;
use ApiCache\Listener\RepositoryManagerListener;
use ApiCache\Listener\UserManagerListener;
use ApiCache\Listener\UuidManagerListener;

return [
    'service_manager' => [
        'factories' => [
            Cache::class => CacheFactory::class,
            AliasManagerListener::class => AliasManagerListenerFactory::class,
            LicenseManagerListener::class => LicenseManagerListenerFactory::class,
            PageManagerListener::class => PageManagerListenerFactory::class,
            RepositoryManagerListener::class => RepositoryManagerListenerFactory::class,
            UserManagerListener::class => UserManagerListenerFactory::class,
            UuidManagerListener::class => UuidManagerListenerFactory::class,
        ],
    ],
];
