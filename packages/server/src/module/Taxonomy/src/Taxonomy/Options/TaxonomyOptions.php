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
namespace Taxonomy\Options;

use Zend\Stdlib\AbstractOptions;

class TaxonomyOptions extends AbstractOptions
{
    protected $allowedChildren = [];

    protected $allowedParents = [];

    protected $rootable;

    protected $allowedAssociations = [];

    /**
     * @return array $allowedChildren
     */
    public function getAllowedChildren()
    {
        return $this->allowedChildren;
    }

    /**
     * @param array $allowedChildren
     * @return self
     */
    public function setAllowedChildren(array $allowedChildren)
    {
        $this->allowedChildren = $allowedChildren;
        return $this;
    }

    /**
     * @return array $allowedParents
     */
    public function getAllowedParents()
    {
        return $this->allowedParents;
    }

    /**
     * @param array $allowedParents
     * @return self
     */
    public function setAllowedParents($allowedParents)
    {
        $this->allowedParents = $allowedParents;
        return $this;
    }

    /**
     * @param string $association
     * @return boolean
     */
    public function isAssociationAllowed($association)
    {
        foreach ($this->getAllowedAssociations() as $allowedAssociation) {
            if ($association === $allowedAssociation || $association instanceof $allowedAssociation) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return array $allowedAssociations
     */
    public function getAllowedAssociations()
    {
        return $this->allowedAssociations;
    }

    /**
     * @param array $allowedAssociations
     * @return self
     */
    public function setAllowedAssociations($allowedAssociations)
    {
        $this->allowedAssociations = $allowedAssociations;
        return $this;
    }

    /**
     * @param string $child
     * @return boolean
     */
    public function isChildAllowed($child)
    {
        return in_array($child, $this->allowedChildren);
    }

    /**
     * @param string $parent
     * @return boolean
     */
    public function isParentAllowed($parent)
    {
        return in_array($parent, $this->allowedParents);
    }

    /**
     * @return bool $rootable
     */
    public function isRootable()
    {
        return $this->rootable;
    }

    /**
     * @param bool $rootable
     * @return self
     */
    public function setRootable($rootable)
    {
        $this->rootable = $rootable;
        return $this;
    }
}
