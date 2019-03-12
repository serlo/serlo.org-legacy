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

$moduleCache = true;
$configCache = false;

require __DIR__ . '/definitions.local.php';

return [
    // This should be an array of module namespaces used in the application.
    'modules'                 => [
        // Session needs to be the first entry, so db storage instead of php storage is used!
        'PageSpeed',
        'Session',
        'ZendDeveloperTools',
        'Application',
        'DoctrineModule',
        'DoctrineORMModule',
        'StrokerCache',
        'ZfcBase',
        'ZfcRbac',
        'TwbBundle',
        'ZfcTwig',
        'Common',
        'Authentication',
        'Ui',
        'Admin',
        'User',
        'Versioning',
        'Entity',
        'Taxonomy',
        'Link',
        'Subject',
        'Term',
        'Uuid',
        'ClassResolver',
        'Instance',
        'Event',
        'Mailman',
        'Alias',
        'Token',
        'Discussion',
        'Page',
        'Blog',
        'Attachment',
        'RelatedContent',
        'Contexter',
        'Navigation',
        'Flag',
        'Search',
        'Metadata',
        'License',
        'Normalizer',
        'Type',
        'Markdown',
        'Authorization',
        'Taxonomy',
        'Notification',
        'Ads',
        'Log',
        'CacheInvalidator',
        'Cache',
        'StaticPage',
        'Newsletter',
        'FeatureFlags',
    ],
    // These are various options for the listeners attached to the ModuleManager
    'module_listener_options' => [
        // This should be an array of paths in which modules reside.
        // If a string key is provided, the listener will consider that a module
        // namespace, the value of that key the specific path to that module's
        // Module class.
        'module_paths'             => [
            __DIR__ . '/../module',
            __DIR__ . '/../vendor',
        ],
        // An array of paths from which to glob configuration files after
        // modules are loaded. These effectively override configuration
        // provided by modules themselves. Paths may use GLOB_BRACE notation.
        // Current order:
        // config/autoload/global.php
        // config/autoload/*.global.php
        // config/autoload/local.php
        // config/autoload/*.local.php
        'config_glob_paths'        => [
            sprintf('config/autoload/{,*.}{global,%s,local}.php', $env),
            'config/instance/{,*.}{global,local}.php',
            'config/instance/navigation/*.php',
        ],
        // Whether or not to enable a configuration cache.
        // If enabled, the merged configuration will be cached and used in
        // subsequent requests.
        'config_cache_enabled'     => $configCache,
        // The key used to create the configuration cache file name.

        'config_cache_key'         => "2245023265ae4cf87d02c8b6ba994139",
        // Whether or not to enable a module class map cache.
        // If enabled, creates a module class map cache which will be used
        // by in future requests, to reduce the autoloading process.
        'module_map_cache_enabled' => $moduleCache,
        // The key used to create the class map cache file name.
        'module_map_cache_key'     => "496fe9daf9bed5ab03314f04518b9268",
        // The path in which to cache merged configuration.
        'cache_dir'                => __DIR__ . "/../data",
        // Whether or not to enable modules dependency checking.
        // Enabled by default, prevents usage of modules that depend on other modules
        // that weren't loaded.
        // 'check_dependencies' => true,
    ],
    // Used to create an own service manager. May contain one or more child arrays.
    //'service_listener_options' => array(
    //     array(
    //         'service_manager' => $stringServiceManagerName,
    //         'config_key'      => $stringConfigKey,
    //         'interface'       => $stringOptionalInterface,
    //         'method'          => $stringRequiredMethodName,
    //     ),
    // )

    // Initial configuration with which to seed the ServiceManager.
    // Should be compatible with Zend\ServiceManager\Config.
    // 'service_manager' => array(),
];
