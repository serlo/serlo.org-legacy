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
namespace Contexter\Manager;

use Common\ObjectManager\Flushable;
use Contexter\Entity\ContextInterface;
use Contexter\Entity\RouteInterface;

interface ContextManagerInterface extends Flushable
{

    /**
     * @param int $id
     * @return ContextInterface
     */
    public function getContext($id);

    /**
     * @param int $id
     * @return RouteInterface
     */
    public function getRoute($id);

    /**
     * @param int    $objectId
     * @param string $type
     * @param string $title
     * @return ContextInterface
     */
    public function add($objectId, $type, $title);

    /**
     * @return ContextInterface[]
     */
    public function findAll();

    /**
     * @return array
     */
    public function findAllTypeNames();

    /**
     * @param int $id
     * @return void
     */
    public function removeRoute($id);

    /**
     * @param int $id
     * @return void
     */
    public function removeContext($id);
}
