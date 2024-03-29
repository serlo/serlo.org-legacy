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
use Normalizer\Exception\RuntimeException;
use Taxonomy\Entity\TaxonomyTermInterface;

class TaxonomyTermAdapter extends AbstractAdapter
{
    /** @var TaxonomyTermInterface */
    protected $object;

    protected function getContent()
    {
        return $this->object->getDescription();
    }

    protected function getCreationDate()
    {
        return new DateTime();
    }

    protected function getId()
    {
        return $this->object->getId();
    }

    protected function getKeywords()
    {
        $term = $this->object;
        $keywords = [];
        while ($term->hasParent()) {
            $keywords[] = $term->getName();
            $term = $term->getParent();
        }
        return $keywords;
    }

    protected function getPreview()
    {
        return $this->object->getDescription();
    }

    protected function getRouteName()
    {
        $object = $this->object;
        switch ($object->getType()->getName()) {
            case 'blog':
                return 'blog/view';
            case 'forum-category':
            case 'forum':
                return 'discussion/discussions/get';
            case 'topic':
            case 'topic-folder':
            case 'curriculum':
            case 'locale':
            case 'curriculum-topic':
            case 'curriculum-topic-folder':
            case 'topic-final-folder':
            case 'subject':
            case 'root':
                return 'taxonomy/term/get';
        }

        throw new RuntimeException(
            sprintf('No strategy found for %s', $object->getType()->getName())
        );
    }

    protected function getRouteParams()
    {
        $object = $this->object;
        switch ($object->getType()->getName()) {
            case 'blog':
            case 'forum':
            case 'forum-category':
                return ['id' => $object->getId()];
            case 'topic':
            case 'topic-folder':
            case 'curriculum':
            case 'locale':
            case 'curriculum-topic':
            case 'curriculum-topic-folder':
            case 'subject':
            case 'topic-final-folder':
            case 'root':
                return ['term' => $object->getId()];
        }

        throw new RuntimeException(
            sprintf('No strategy found for %s', $object->getType()->getName())
        );
    }

    protected function getTitle()
    {
        return $this->object->getName();
    }

    protected function getHeadTitle()
    {
        $maxStringLen = 65;

        $type = $this->getType();
        $typeName = $this->getTranslator()->translate($type);

        $title = $this->getTitle();

        // add "(Lehrplan)" etc
        if ($type !== 'topic-folder') {
            if (strlen($title) < $maxStringLen - strlen($typeName)) {
                $title .= ' (' . $typeName . ')';
            }
        }

        return $title;
    }

    protected function getType()
    {
        return $this->object->getTaxonomy()->getName();
    }
    protected function isTrashed()
    {
        return $this->object->isTrashed();
    }
}
