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
namespace Markdown;

return [
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Storage\MarkdownStorage'   => __NAMESPACE__ . '\Factory\MarkdownStorageFactory',
            __NAMESPACE__ . '\Service\HtmlRenderService' => __NAMESPACE__ . '\Factory\HtmlRenderServiceFactory',
            __NAMESPACE__ . '\Service\OryRenderService' => __NAMESPACE__ . '\Factory\OryRenderServiceFactory',
        ],
    ],
    'view_helpers'    => [
        'factories' => [
            'markdown' => __NAMESPACE__ . '\Factory\MarkdownHelperFactory',
            'oryRenderer' => __NAMESPACE__ . '\Factory\OryRenderHelperFactory',
        ],
        'invokables' => [
            'isOryEditorFormat' => __NAMESPACE__ . '\View\Helper\OryFormatHelper',
        ],
    ],
    'di'              => [
        'instance' => [
            'preferences' => [
                __NAMESPACE__ . '\Service\CacheServiceInterface'  => __NAMESPACE__ . '\Service\CacheService',
                __NAMESPACE__ . '\Service\RenderServiceInterface' => __NAMESPACE__ . '\Service\HtmlRenderService',
            ],
        ],
    ],
];
