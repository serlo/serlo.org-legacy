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
namespace Navigation\Entity;

use Instance\Entity\InstanceProviderInterface;

interface ParameterInterface extends InstanceProviderInterface
{
    /**
     * @param ParameterInterface $child
     * @return void
     */
    public function addChild(ParameterInterface $child);

    /**
     * @return self[]
     */
    public function getChildren();

    /**
     * @return int
     */
    public function getId();

    /**
     * @return ParameterKeyInterface
     */
    public function getKey();

    /**
     * @return PageInterface
     */
    public function getPage();

    /**
     * @return string
     */
    public function getValue();

    /**
     * @return bool
     */
    public function hasChildren();

    /**
     * @param ParameterInterface $child
     * @return void
     */
    public function removeChild(ParameterInterface $child);

    /**
     * @param ParameterKeyInterface $key
     * @return void
     */
    public function setKey(ParameterKeyInterface $key);

    /**
     * @param PageInterface $page
     * @return void
     */
    public function setPage(PageInterface $page);

    /**
     * @param string $value
     * @return void
     */
    public function setValue($value);

    /**
     * @return ParameterInterface
     */
    public function getParent();

    /**
     * @param ParameterInterface $parent
     * @return void
     */
    public function setParent(ParameterInterface $parent);
}
