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

use DateTime;
use Entity\Entity\EntityInterface;

class EntityAdapter extends AbstractAdapter
{
    /**
     * @return EntityInterface
     */
    public function getObject()
    {
        return $this->object;
    }

    public function isValid($object)
    {
        return $object instanceof EntityInterface;
    }

    protected function getContent()
    {
        return $this->getField('content');
    }

    protected function getCreationDate()
    {
        $head = $this->getObject()->getHead();
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
        $entity = $this->getObject();
        $id     = $entity->getId();

        if (is_array($field)) {
            $fields = $field;
            $value  = '';
            foreach ($fields as $field) {
                $value = $this->getField((string)$field);
                if ($value && $value != $id) {
                    break;
                }
            }

            return $value ? : $id;
        }


        $revision = $entity->hasCurrentRevision() ? $entity->getCurrentRevision() : $entity->getHead();

        if (!$revision) {
            return $default;
        }

        $value = $revision->get($field);

        return $value ? : $id;
    }

    protected function getId()
    {
        return $this->getObject()->getId();
    }

    protected function getKeywords()
    {
        $entity   = $this->getObject();
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
                $term       = $term->getParent();
            }
        }
        return array_unique($keywords);
    }

    /**
     * @return DateTime
     */
    protected function getLastModified()
    {
        $head = $this->getObject()->getHead();
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
            'entity' => $this->getObject()->getId(),
        ];
    }

    protected function getTitle()
    {
        return $this->getField(['title', 'id'], $this->getId());
    }

    protected function getType()
    {
        return $this->getObject()->getType()->getName();
    }

    protected function isTrashed()
    {
        return $this->getObject()->isTrashed();
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
            $parent = $this->getObject()->getParents('link')->first();
            $parentAdapter = new EntityAdapter();
            $parentAdapter->setTranslator($this->translator);
            $parentTitle = $parentAdapter->normalize($parent)->getTitle();
            $title = $parentTitle . " | " . $title;
        }

        //add "(Kurs)" etc
        if ($type !== 'article') {
            if (strlen($title) < ($maxStringLen-strlen($typeName))) {
                $title .=  ' (' . $typeName . ')';
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
            $parent = $this->getObject()->getParents('link')->first();
            $parentAdapter = new EntityAdapter();
            $parentAdapter->setTranslator($this->translator);
            $description = $parentAdapter->normalize($parent)->getMetaData()->getMetaDescription();
        }

        return $description;
    }
}
