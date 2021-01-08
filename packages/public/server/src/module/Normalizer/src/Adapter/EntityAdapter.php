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

use DateTime;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;

class EntityAdapter extends AbstractAdapter
{
    /** @var EntityInterface */
    protected $object;

    protected function getContent()
    {
        return $this->getField('content');
    }

    protected function getCreationDate()
    {
        $head = $this->object->getHead();
        if ($head) {
            return $head->getTimestamp();
        }
        return new DateTime();
    }

    /**
     * @return string
     */
    protected function getDescription()
    {
        return $this->getField(['summary', 'description', 'content']);
    }

    protected function getField($field, $default = '')
    {
        $entity = $this->object;
        $id = $entity->getId();

        if (is_array($field)) {
            $fields = $field;
            $value = '';
            foreach ($fields as $field) {
                $value = $this->getField((string) $field);
                if ($value && $value != $id) {
                    break;
                }
            }

            return $value ?: $id;
        }

        /** @var RevisionInterface $revision */
        $revision = $entity->hasCurrentRevision()
            ? $entity->getCurrentRevision()
            : $entity->getHead();

        if (!$revision) {
            return $default;
        }

        $value = $revision->get($field);

        return $value ?: $id;
    }

    protected function getId()
    {
        return $this->object->getId();
    }

    protected function getKeywords()
    {
        $entity = $this->object;
        $keywords = [];
        $terms = $entity->getTaxonomyTerms();
        if (!$terms->count()) {
            $parents = $entity->getParents('link');
            if ($parents->count()) {
                $terms = $parents->first()->getTaxonomyTerms();
            }
        }
        foreach ($terms as $term) {
            while ($term->hasParent()) {
                $keywords[] = $term->getName();
                $term = $term->getParent();
            }
        }
        return array_unique($keywords);
    }

    /**
     * @return DateTime
     */
    protected function getLastModified()
    {
        $head = $this->object->getHead();
        if ($head) {
            return $head->getTimestamp();
        }
        return new DateTime();
    }

    protected function getPreview()
    {
        return $this->getField(['summary', 'description', 'content']);
    }

    protected function getRouteName()
    {
        return 'entity/page';
    }

    protected function getRouteParams()
    {
        return [
            'entity' => $this->object->getId(),
        ];
    }

    protected function getTitle()
    {
        return $this->getField(['title', 'id'], $this->getId());
    }

    protected function getType()
    {
        return $this->object->getType()->getName();
    }

    protected function isTrashed()
    {
        return $this->object->isTrashed();
    }

    protected function getHeadTitle()
    {
        $maxStringLen = 65;

        $type = $this->getType();
        $typeName = $this->getTranslator()->translate($type);

        if ($type === 'applet') {
            $typeName = $this->getTranslator()->translate('applet');
        }

        if ($type === 'course-page') {
            $typeName = $this->getTranslator()->translate('course');
        }

        $titleFallback = $this->getTitle();
        $title = $this->getField('meta_title');
        if ($title === $this->getId()) {
            $title = $titleFallback;
        }

        if ($type === 'course-page') {
            $parent = $this->object->getParents('link')->first();
            $parentAdapter = $this->createAdapter($parent);
            $parentTitle = $parentAdapter->getTitle();
            $title = $parentTitle . ' | ' . $title;
        }

        // add "(Kurs)" etc
        if ($type !== 'article') {
            if (strlen($title) < $maxStringLen - strlen($typeName)) {
                $title .= ' (' . $typeName . ')';
            }
        }

        return $title;
    }

    protected function getMetaDescription()
    {
        $description = $this->getField('meta_description');

        if ($description === $this->getId()) {
            $description = $this->getDescription();
        }

        if ($this->getType() === 'course-page') {
            $parent = $this->object->getParents('link')->first();
            $parentAdapter = $this->createAdapter($parent);
            $description = $parentAdapter->getMetaDescription();
        }

        return $description;
    }
}
