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
namespace Alias;

use Instance\Entity\InstanceInterface;
use Uuid\Entity\UuidInterface;
use Zend\Mvc\Router\RouteMatch;

interface AliasManagerInterface
{
    /**
     * @param UuidInterface $uuid
     * @return string|null
     */
    public function getAliasOfObject(UuidInterface $uuid);

    /**
     * @param string $source
     * @return string|null
     */
    public function getAliasOfSource(string $source);

    /**
     * @param string $alias
     * @param InstanceInterface $instance
     * @return string|null
     */
    public function resolveLegacyAlias($alias, InstanceInterface $instance);

    /**
     * @param string $alias
     * @param InstanceInterface $instance
     * @return array|null
     */
    public function resolveAliasInInstance(
        string $alias,
        InstanceInterface $instance
    );

    /**
     * @param string $alias
     * @return UuidInterface|null
     */
    public function getObjectOfAlias(string $alias);

    /**
     * @param string $alias
     * @return RouteMatch|null
     */
    public function routeMatchUrl(string $alias);
}
