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
namespace Uuid\Options;

use Uuid\Exception;
use Zend\Stdlib\AbstractOptions;

class ModuleOptions extends AbstractOptions
{
    /**
     * @var array
     */
    protected $permissions = [];

    /**
     * @var array
     */
    protected $defaultPermissions = [
        'trash' => 'uuid.trash',
        'restore' => 'uuid.restore',
        'purge' => 'uuid.purge',
    ];

    /**
     * @param array $permissions
     */
    public function setPermissions(array $permissions)
    {
        $this->permissions = $permissions;
    }

    /**
     * @return array
     */
    public function getPermissions()
    {
        return $this->permissions;
    }

    /**
     * @param string $object
     * @param string $action
     * @return string
     * @throws Exception\RuntimeException
     */
    public function getPermission($scope, $action)
    {
        $scope = (string) $scope;
        if (!isset($this->permissions[$scope])) {
            $permissions = $this->defaultPermissions;
        } else {
            $permissions = $this->permissions[$scope];
        }

        if (!isset($permissions[$action])) {
            throw new Exception\RuntimeException(sprintf(
                'Permission action "%s" for scope "%s" not found',
                $action,
                $scope
            ));
        }

        return $permissions[$action];
    }
}
