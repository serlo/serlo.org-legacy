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
namespace Subject;

use Zend\Mvc\MvcEvent;
use Zend\Mvc\Router\RoutePluginManager;
use Zend\Stdlib\ArrayUtils;

class Module
{
    protected static function getInstanceConfigs()
    {
        $return = [];
        $path   = self::findParentPath('config/instances');
        $dir    = __DIR__ . '/';
        if ($handle = opendir($path)) {
            while (false !== ($file = readdir($handle))) {
                echo $dir . $file . is_dir($dir . $file . '/') . '<br/>';
                flush();
                if ($file != "." && $file != ".." && is_dir($dir . $file)) {
                    $return = ArrayUtils::merge($return, include $dir . $file . '/instance.config.php');
                }
            }
        }

        return $return;
    }

    protected static function findParentPath($path)
    {
        $dir         = __DIR__ . '/';
        $previousDir = '.';
        while (!is_dir($dir . $path) && !file_exists($dir . $path)) {
            $dir = dirname($dir);
            if ($previousDir === $dir) {
                return false;
            }
            $previousDir = $dir;
        }

        return $dir . $path;
    }

    public function getAutoloaderConfig()
    {
        $autoloader = [];

        $autoloader['Zend\Loader\StandardAutoloader'] = [
            'namespaces' => [
                __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
            ],
        ];

        if (file_exists(__DIR__ . '/autoload_classmap.php')) {
            return [
                'Zend\Loader\ClassMapAutoloader' => [
                    __DIR__ . '/autoload_classmap.php',
                ],
            ];
        }

        return $autoloader;
    }

    public function getConfig()
    {
        return ArrayUtils::merge(include __DIR__ . '/config/module.config.php', $this->getInstanceConfig());
    }

    public function getInstanceConfig()
    {
        $instances = [__DIR__ . '/config/instances.config.php'];
        $config    = [];
        foreach ($instances as $instance) {
            $config = ArrayUtils::merge($config, include $instance);
        }

        return $config;
    }
}
