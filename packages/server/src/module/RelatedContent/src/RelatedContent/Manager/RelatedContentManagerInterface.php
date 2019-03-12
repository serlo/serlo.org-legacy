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
namespace RelatedContent\Manager;

use Doctrine\Common\Collections\Collection;
use RelatedContent\Entity;

interface RelatedContentManagerInterface
{

    /**
     * @param int $id
     * @return Collection
     */
    public function aggregateRelatedContent($id);

    /**
     * @param int $id
     * @return Entity\ContainerInterface
     */
    public function getContainer($id);

    /**
     * @param int $container
     * @param string $title
     * @param string $url
     * @return Entity\ExternalInterface
     */
    public function addExternal($container, $title, $url);

    /**
     * @param int $container
     * @param string $title
     * @return Entity\CategoryInterface
     */
    public function addCategory($container, $title);

    /**
     * @param int $container
     * @param string $title
     * @param int $related
     * @return Entity\InternalInterface
     */
    public function addInternal($container, $title, $related);

    /**
     * @param int $id
     * @return self
     */
    public function removeRelatedContent($id);

    /**
     * @param int $holder
     * @param int $position
     * @return self
     */
    public function positionHolder($holder, $position);
}
