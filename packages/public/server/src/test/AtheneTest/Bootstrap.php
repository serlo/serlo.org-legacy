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

namespace {
    function t($string)
    {
        return $string;
    }
}

namespace AtheneTest {

    use Zend\Loader\AutoloaderFactory;
    use RuntimeException;

    error_reporting(E_ALL | E_STRICT);
    chdir(__DIR__);
    date_default_timezone_set('UTC');

    /**
     * @codeCoverageIgnore
     */
    class Bootstrap
    {
        protected static $serviceManager;


        protected static $application;

        public static function getApplication()
        {
            return static::$application;
        }

        public static $dir;

        public static function init()
        {
            static::$dir = __DIR__;
            static::initAutoloader();
        }

        public static function chroot()
        {
            $rootPath = dirname(static::findParentPath('module'));
            chdir($rootPath);
        }

        public static function getServiceManager()
        {
            return static::$serviceManager;
        }

        protected static function initAutoloader()
        {
            $root = __DIR__ . '/../..';
            require $root . '/init_autoloader.php';
        }

        public static function findParentPath($path)
        {
            $dir = static::$dir;
            $previousDir = '.';
            while (!is_dir($dir . '/' . $path) && !file_exists($dir . '/' . $path)) {
                $dir = dirname($dir);
                if ($previousDir === $dir) {
                    return false;
                }
                $previousDir = $dir;
            }
            return $dir . '/' . $path;
        }
    }

    Bootstrap::init();
    Bootstrap::chroot();
}
