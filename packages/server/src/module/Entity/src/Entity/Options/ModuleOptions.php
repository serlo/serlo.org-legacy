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
namespace Entity\Options;

use Entity\Exception;
use Zend\Stdlib\AbstractOptions;

class ModuleOptions extends AbstractOptions
{
    /**
     * @var array
     */
    protected $types = [];

    /**
     * @param string $type
     * @return EntityOptions
     * @throws Exception\RuntimeException
     */
    public function getType($type)
    {
        if (!array_key_exists($type, $this->types)) {
            throw new Exception\RuntimeException(sprintf('Type "%s" not found.', $type));
        }

        $options = $this->types[$type];

        if (!$options instanceof EntityOptions) {
            $options            = new EntityOptions($options);
            $options->setName($type);

            $this->types[$type] = $options;
        }

        return $options;
    }

    /**
     * @return array|EntityOptions[]
     */
    public function getTypes()
    {
        $types = [];
        foreach ($this->types as $type => $options) {
            $types[] = $this->getType($type);
        }
        return $types;
    }

    /**
     * @param array $types
     * @return void
     */
    public function setTypes(array $types)
    {
        $this->types = $types;
    }
}
