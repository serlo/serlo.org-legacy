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
namespace Subject\Options;

use Zend\Stdlib\AbstractOptions;

class SubjectOptions extends AbstractOptions
{
    protected $allowedTaxonomies = [];

    protected $allowedEntities = [];

    /**
     * @return array
     */
    public function getAllowedTaxonomies()
    {
        return $this->allowedTaxonomies;
    }

    /**
     * @return array
     */
    public function getAllowedEntities()
    {
        return $this->allowedEntities;
    }

    /**
     * @param array $allowedTaxonomies
     * @return self
     */
    public function setAllowedTaxonomies(array $allowedTaxonomies)
    {
        $this->allowedTaxonomies = $allowedTaxonomies;
        return $this;
    }

    /**
     * @param array $allowedEntities
     * @return self
     */
    public function setAllowedEntities(array $allowedEntities)
    {
        $this->allowedEntities = $allowedEntities;
        return $this;
    }

    /**
     * @param string $taxonomy
     * @return boolean
     */
    public function isTaxonomyAllowed($taxonomy)
    {
        return in_array($taxonomy, $this->getAllowedTaxonomies());
    }

    /**
     * @param string $entity
     * @return boolean
     */
    public function isEntityAllowed($entity)
    {
        return in_array($entity, $this->getAllowedEntities());
    }
}
