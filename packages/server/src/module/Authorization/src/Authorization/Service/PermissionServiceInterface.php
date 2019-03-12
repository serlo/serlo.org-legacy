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
namespace Authorization\Service;

use Authorization\Entity\ParametrizedPermissionInterface;
use Authorization\Entity\PermissionInterface;
use Authorization\Exception\PermissionNotFoundException;

interface PermissionServiceInterface
{
    /**
     * @return PermissionInterface[]
     */
    public function findAllPermissions();

    /**
     * @param $name
     * @param $parameterKey
     * @param $parameterValue
     * @return PermissionInterface
     */
    public function findOrCreateParametrizedPermission($name, $parameterKey, $parameterValue);

    /**
     * @param PermissionInterface|string $name
     * @param string                     $parameterKey
     * @param mixed                      $parameterValue
     * @throws PermissionNotFoundException
     * @return PermissionInterface
     */
    public function findParametrizedPermission($name, $parameterKey, $parameterValue);

    /**
     * @param PermissionInterface|string $name
     * @param string                     $parameterKey
     * @param mixed                      $parameterValue
     * @return PermissionInterface[]
     */
    public function findParametrizedPermissions($name, $parameterKey, $parameterValue);

    /**
     * @param string $name
     * @return PermissionInterface
     */
    public function findPermissionByName($name);

    /**
     * @param int $id
     * @return ParametrizedPermissionInterface
     */
    public function getParametrizedPermission($id);

    /**
     * @param int $id
     * @return PermissionInterface
     */
    public function getPermission($id);
}
