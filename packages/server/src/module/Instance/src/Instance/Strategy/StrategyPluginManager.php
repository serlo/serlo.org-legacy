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
namespace Instance\Strategy;

use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\Exception;

class StrategyPluginManager extends AbstractPluginManager
{
    /**
     * {@inheritDoc}
     */
    protected $autoAddInvokableClass = false;

    /**
     * {@inheritDoc}
     */
    protected $factories = [
        'Instance\Strategy\DomainStrategy' => 'Instance\Factory\DomainStrategyFactory',
        'Instance\Strategy\CookieStrategy' => 'Instance\Factory\CookieStrategyFactory',
    ];

    /**
     * {@inheritDoc}
     */
    public function validatePlugin($plugin)
    {
        if (!$plugin instanceof StrategyInterface) {
            throw new Exception\RuntimeException(sprintf(
                'Expected instance of StrategyInterface but got %s.',
                is_object($plugin) ? get_class($plugin) : gettype($plugin)
            ));
        }
    }

    /**
     * {@inheritDoc}
     */
    protected function canonicalizeName($name)
    {
        return $name;
    }
}
