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
namespace Normalizer\Adapter;

use Entity\Entity\Revision;

class EntityRevisionAdapter extends AbstractAdapter
{

    /**
     * @return Revision
     */
    public function getObject()
    {
        return $this->object;
    }

    public function isValid($object)
    {
        return $object instanceof Revision;
    }

    protected function getContent()
    {
        return $this->getObject()->get('content');
    }

    protected function getKeywords()
    {
        return [];
    }

    protected function getField($field, $fallback = null)
    {
        if ($this->getObject()->get($field) !== null) {
            return $this->getObject()->get($field);
        } elseif ($fallback !== null && $this->getObject()->get($fallback) !== null) {
            return $this->getObject()->get($fallback);
        } else {
            return $this->getObject()->getId();
        }
    }

    protected function getId()
    {
        return $this->getObject()->getId();
    }

    protected function getPreview()
    {
        $description = $this->getObject()->get('description');
        $description = $description ? : $this->getObject()->get('content');
        return $description;
    }

    protected function getRouteName()
    {
        return 'entity/repository/compare';
    }

    protected function getRouteParams()
    {
        return [
            'entity'   => $this->getObject()->getRepository()->getId(),
            'revision' => $this->getObject()->getId(),
        ];
    }

    protected function getCreationDate()
    {
        return $this->getObject()->getTimestamp();
    }

    protected function getTitle()
    {
        return $this->getObject()->get('title') ? : $this->object->getId();
    }

    protected function getType()
    {
        return $this->getObject()->getRepository()->getType()->getName();
    }

    protected function isTrashed()
    {
        return $this->getObject()->isTrashed();
    }
}
