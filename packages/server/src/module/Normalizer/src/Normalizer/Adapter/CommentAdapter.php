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

use Discussion\Entity\CommentInterface;

class CommentAdapter extends AbstractAdapter
{
    /**
     * @return CommentInterface
     */
    public function getObject()
    {
        return $this->object;
    }

    public function isValid($object)
    {
        return $object instanceof CommentInterface;
    }

    protected function getContent()
    {
        return $this->getObject()->getContent();
    }

    protected function getId()
    {
        return $this->getObject()->getId();
    }

    protected function getKeywords()
    {
        return [];
    }

    protected function getPreview()
    {
        return $this->getContent();
    }

    protected function getRouteName()
    {
        return 'discussion/view';
    }

    protected function getRouteParams()
    {
        return [
            'id' => $this->getObject()->hasParent() ? $this->getObject()->getParent()->getId() :
                    $this->getObject()->getId(),
        ];
    }

    protected function getCreationDate()
    {
        return $this->getObject()->getTimestamp();
    }

    protected function getTitle()
    {
        return $this->getObject()->hasParent() ? $this->getObject()->getParent()->getTitle() :
            $this->getObject()->getTitle();
    }

    protected function getType()
    {
        return $this->getObject()->hasParent() ? 'comment' : 'parent';
    }

    protected function isTrashed()
    {
        return $this->getObject()->isTrashed();
    }
}
