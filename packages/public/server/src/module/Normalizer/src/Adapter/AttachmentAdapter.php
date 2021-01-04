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

use Attachment\Entity\ContainerInterface;
use Normalizer\Exception\RuntimeException;

class AttachmentAdapter extends AbstractAdapter
{
    /** @var ContainerInterface */
    protected $object;

    protected function getContent()
    {
        return $this->getFile()->getLocation();
    }

    protected function getCreationDate()
    {
        return $this->getFile()->getDateTime();
    }

    protected function getFile()
    {
        $file = $this->object->getFiles()->current();
        if (!is_object($file)) {
            throw new RuntimeException('No files have been attached');
        }
        return $file;
    }

    protected function getId()
    {
        return $this->object->getId();
    }

    protected function getKeywords()
    {
        return [];
    }

    protected function getPreview()
    {
        return $this->getFile()->getLocation();
    }

    protected function getRouteName()
    {
        return 'attachment/info';
    }

    protected function getRouteParams()
    {
        return [
            'id' => $this->object->getId(),
        ];
    }

    protected function getTitle()
    {
        return $this->getFile()->getFilename();
    }

    protected function getType()
    {
        return $this->object->getType();
    }

    protected function isTrashed()
    {
        return false;
    }
}
