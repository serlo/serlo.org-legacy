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
namespace Link\Service;

use Link\Entity\LinkableInterface;
use Link\Options\LinkOptionsInterface;

interface LinkServiceInterface
{

    /**
     * @param LinkableInterface    $parent
     * @param LinkableInterface    $child
     * @param LinkOptionsInterface $parentOptions
     * @param number|null          $position
     * @return self
     */
    public function associate(
        LinkableInterface $parent,
        LinkableInterface $child,
        LinkOptionsInterface $parentOptions,
        $position = null
    );

    /**
     * @param LinkableInterface    $parent
     * @param LinkableInterface    $child
     * @param LinkOptionsInterface $parentOptions
     * @return self
     */
    public function dissociate(
        LinkableInterface $parent,
        LinkableInterface $child,
        LinkOptionsInterface $parentOptions
    );

    /**
     * @param LinkableInterface $parent
     * @param string            $typeName
     * @param array             $children
     * @return self
     */
    public function sortChildren(LinkableInterface $parent, $typeName, array $children);

    /**
     * @param LinkableInterface $child
     * @param string            $typeName
     * @param array             $parents
     * @return self
     */
    public function sortParents(LinkableInterface $child, $typeName, array $parents);
}
