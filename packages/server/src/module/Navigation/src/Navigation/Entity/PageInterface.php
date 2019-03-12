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

interface PageInterface extends InstanceProviderInterface
{
    /**
     * @param PageInterface $page
     * @return void
     */
    public function addChild(PageInterface $page);

    /**
     * @param ParameterInterface $parameter
     * @return void
     */
    public function addParameter(ParameterInterface $parameter);

    /**
     * @return PageInterface[]
     */
    public function getChildren();

    /**
     * @return ContainerInterface
     */
    public function getContainer();

    /**
     * @return int
     */
    public function getId();

    /**
     * @return ParameterInterface[]
     */
    public function getParameters();

    /**
     * @return PageInterface
     */
    public function getParent();

    /**
     * @return int
     */
    public function getPosition();

    /**
     * @return bool
     */
    public function hasChildren();

    /**
     * @param PageInterface $page
     * @return void
     */
    public function removeChild(PageInterface $page);

    /**
     * @param ParameterInterface $parameter
     * @return mixed
     */
    public function removeParameter(ParameterInterface $parameter);

    /**
     * @param ContainerInterface $container
     * @return void
     */
    public function setContainer(ContainerInterface $container);

    /**
     * @param PageInterface $page
     * @return PageInterface
     */
    public function setParent(PageInterface $page);

    /**
     * @param $position
     * @return void
     */
    public function setPosition($position);
}
