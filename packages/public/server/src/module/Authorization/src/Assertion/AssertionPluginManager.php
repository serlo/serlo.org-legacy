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
namespace Authorization\Assertion;

use ZfcRbac\Exception;

/**
 * Plugin manager to create assertions
 *
 * @method AssertionInterface get($name)
 */
class AssertionPluginManager extends \ZfcRbac\Assertion\AssertionPluginManager
{
    /**
     * {@inheritDoc}
     */
    public function validatePlugin($plugin)
    {
        if ($plugin instanceof AssertionInterface) {
            return; // we're okay
        }

        throw new Exception\RuntimeException(
            sprintf(
                'Assertions must implement "Authorization\Assertion\AssertionInterface", but "%s" was given',
                is_object($plugin) ? get_class($plugin) : gettype($plugin)
            )
        );
    }
}
