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
namespace Taxonomy\Hydrator;

use Common\Hydrator\AbstractHydratorPlugin;
use Doctrine\Common\Persistence\ObjectManager;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Manager\TaxonomyManagerInterface;

class TaxonomyTermHydratorPlugin extends AbstractHydratorPlugin
{
    /**
     * @var ObjectManager
     */
    protected $objectManager;

    /**
     * @var TaxonomyManagerInterface
     */
    protected $taxonomyManager;

    public function __construct(ObjectManager $objectManager, TaxonomyManagerInterface $taxonomyManager)
    {
        $this->objectManager   = $objectManager;
        $this->taxonomyManager = $taxonomyManager;
    }

    /**
     * (Partially) hydrates the object and removes the affected (key, value) pairs from the return set.
     *
     * @param object $object
     * @param array  $data
     * @return array
     */
    public function hydrate($object, array $data)
    {
        if (!$object instanceof TaxonomyTermAwareInterface) {
            return $data;
        }

        $metadata = $this->objectManager->getClassMetadata(get_class($object));
        foreach ($data as $field => $value) {
            if ($metadata->hasAssociation($field) && is_object($value)) {
                $target = $metadata->getAssociationTargetClass($field);
                if ($target == 'Taxonomy\Entity\TaxonomyTerm') {
                    $this->taxonomyManager->associateWith($value, $object);
                    unset($data[$field]);
                }
            }
        }

        return $data;
    }
}
