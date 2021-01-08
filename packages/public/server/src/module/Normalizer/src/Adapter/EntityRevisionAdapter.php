<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Normalizer\Adapter;

use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;

class EntityRevisionAdapter extends AbstractAdapter
{
    /** @var RevisionInterface */
    protected $object;

    protected function getContent()
    {
        return $this->object->get('content');
    }

    protected function getKeywords()
    {
        return [];
    }

    protected function getField($field, $fallback = null)
    {
        if ($this->object->get($field) !== null) {
            return $this->object->get($field);
        } elseif (
            $fallback !== null &&
            $this->object->get($fallback) !== null
        ) {
            return $this->object->get($fallback);
        } else {
            return $this->object->getId();
        }
    }

    protected function getId()
    {
        return $this->object->getId();
    }

    protected function getPreview()
    {
        $description = $this->object->get('description');
        $description = $description ?: $this->object->get('content');
        return $description;
    }

    protected function getRouteName()
    {
        return 'entity/repository/compare';
    }

    protected function getRouteParams()
    {
        return [
            'entity' => $this->object->getRepository()->getId(),
            'revision' => $this->object->getId(),
        ];
    }

    protected function getCreationDate()
    {
        return $this->object->getTimestamp();
    }

    protected function getTitle()
    {
        return $this->object->get('title') ?: $this->object->getId();
    }

    protected function getType()
    {
        /** @var EntityInterface $repository */
        $repository = $this->object->getRepository();
        return $repository->getType()->getName();
    }

    protected function isTrashed()
    {
        return $this->object->isTrashed();
    }
}
