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
namespace Taxonomy\Options;

use Taxonomy\Exception;
use Zend\Stdlib\AbstractOptions;

class ModuleOptions extends AbstractOptions
{
    protected $types = [];

    /**
     * @return array $types
     */
    public function getTypes()
    {
        return $this->types;
    }

    /**
     * @param string $type
     * @throws Exception\RuntimeException
     * @return TaxonomyOptions
     */
    public function getType($type)
    {
        if (! array_key_exists($type, $this->types)) {
            throw new Exception\RuntimeException(sprintf('No configuration for type "%s" found.', $type));
        }

        if (! is_object($this->types[$type])) {
            $options = array_merge([
                'allowed_children' => $this->aggregateAllowedChildren($type),
            ], $this->types[$type]);
            $this->types[$type] = new TaxonomyOptions($options);
        }

        return $this->types[$type];
    }

    /**
     * @param array $types
     * @return self
     */
    public function setTypes(array $types)
    {
        $this->types = $types;
        return $this;
    }

    /**
     * @param string $needle
     * @return array
     */
    protected function aggregateAllowedChildren($needle)
    {
        $children = [];
        foreach ($this->types as $key => $type) {
            if (array_key_exists('allowed_parents', $type) && in_array($needle, $type['allowed_parents'])) {
                $children[] = $key;
            }
        }
        return $children;
    }
}
