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
namespace Entity\Options;

use Entity\Exception;
use Link\Options\LinkOptionsInterface;
use Zend\Stdlib\AbstractOptions;

abstract class AbstractLinkOptions extends AbstractOptions implements ComponentOptionsInterface, LinkOptionsInterface
{
    /**
     * @var string
     */
    protected $type;

    /**
     * @var array
     */
    protected $children = [];

    /**
     * @var array
     */
    protected $parents = [];

    /**
     * @var array
     */
    protected $permissions = [
        'create' => 'entity.link.create',
        'purge'  => 'entity.link.purge',
    ];

    /**
     * @param array $permissions
     */
    public function setPermissions($permissions)
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

    abstract public function getLinkType();

    public function getAllowedChildren()
    {
        return array_keys($this->children);
    }

    public function getAllowedParents()
    {
        return array_keys($this->parents);
    }

    public function isParentAllowed($type)
    {
        return in_array($type, $this->getAllowedParents());
    }

    public function isChildAllowed($type)
    {
        return in_array($type, $this->getAllowedChildren());
    }

    public function allowsManyParents($type)
    {
        if (!$this->isParentAllowed($type)) {
            throw new Exception\RuntimeException(sprintf(
                'Link type "%s" does not allow parent "%s".',
                $this->getLinkType(),
                $type
            ));
        }

        return array_key_exists('multiple', $this->parents[$type]) ? $this->parents[$type]['multiple'] : false;
    }

    public function allowsManyChildren($type)
    {
        if (!$this->isChildAllowed($type)) {
            throw new Exception\RuntimeException(sprintf(
                'Link "%s" does not allow child "%s".',
                $this->getLinkType(),
                $type
            ));
        }

        return array_key_exists('multiple', $this->children[$type]) ? $this->children[$type]['multiple'] : false;
    }

    public function isValid($key)
    {
        return $key == $this->getLinkType();
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function setChildren($children)
    {
        $this->children = $children;
    }

    public function setParents($parents)
    {
        $this->parents = $parents;
    }

    public function getPermission($type)
    {
        if (!isset($type, $this->permissions)) {
            throw new Exception\RuntimeException(sprintf('Permission type "%s" not found', $type));
        }

        return $this->permissions[$type];
    }
}
