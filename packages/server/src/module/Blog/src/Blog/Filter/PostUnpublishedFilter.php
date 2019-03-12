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
namespace Blog\Filter;

use Blog\Entity\PostInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Zend\Filter\Exception;
use Zend\Filter\FilterInterface;

class PostUnpublishedFilter implements FilterInterface
{
    /**
     * Returns the result of filtering $value
     *
     * @param  mixed $value
     * @throws Exception\RuntimeException If filtering $value is impossible
     * @return mixed
     */
    public function filter($value)
    {
        $result = [];

        if (!$value instanceof Collection) {
            throw new Exception\RuntimeException(sprintf(
                'Expected instance of Collection but got %s.',
                is_object($value) ? get_class($value) : gettype($value)
            ));
        }

        foreach ($value as $post) {
            if (!$post instanceof PostInterface) {
                throw new Exception\RuntimeException(sprintf(
                    'Expected instance of PostInterface but got %s.',
                    is_object($post) ? get_class($post) : gettype($post)
                ));
            }
            if (!$post->isPublished() && !$post->isTrashed()) {
                $result[] = $post;
            }
        }

        return new ArrayCollection($result);
    }
}
