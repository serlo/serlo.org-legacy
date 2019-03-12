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

use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Exception\RuntimeException;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Taxonomy\Options\ModuleOptions;
use Term\Manager\TermManagerAwareTrait;
use Term\Manager\TermManagerInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Uuid\Manager\UuidManagerInterface;
use Zend\Stdlib\Hydrator\HydratorInterface;

class TaxonomyTermHydrator implements HydratorInterface
{
    use TermManagerAwareTrait, UuidManagerAwareTrait;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @var \Taxonomy\Manager\TaxonomyManagerInterface
     */
    protected $taxonomyManager;

    public function __construct(
        ModuleOptions $moduleOptions,
        TermManagerInterface $termManager,
        UuidManagerInterface $uuidManager,
        TaxonomyManagerInterface $taxonomyManager
    ) {
        $this->termManager     = $termManager;
        $this->moduleOptions   = $moduleOptions;
        $this->uuidManager     = $uuidManager;
        $this->taxonomyManager = $taxonomyManager;
    }

    /**
     * @see \Zend\Stdlib\Extractor\ExtractionInterface::extract()
     * @param TaxonomyTermInterface $object
     * @return array
     */
    public function extract($object)
    {
        $term = $object->getTerm();

        return [
            'id'          => is_object($object) ? $object->getId() : null,
            'term'        => [
                'id'   => is_object($term) ? $term->getId() : null,
                'name' => is_object($term) ? $term->getName() : null,
            ],
            'taxonomy'    => is_object($object->getTaxonomy()) ? $object->getTaxonomy()->getId() : null,
            'parent'      => is_object($object->getParent()) ? $object->getParent()->getId() : null,
            'description' => $object->getDescription(),
            'position'    => $object->getPosition(),
        ];
    }

    public function hydrate(array $data, $object)
    {
        $oldParent = $object->getParent();
        $data      = $this->validate($data);

        foreach ($data as $key => $value) {
            $setter = 'set' . ucfirst($key);
            if (method_exists($object, $setter)) {
                $object->$setter($value);
            }
        }

        return $object;
    }

    /**
     * @param array $data
     * @return array
     * @throws \Taxonomy\Exception\RuntimeException
     */
    protected function validate(array $data)
    {
        $taxonomy = $data['taxonomy'];
        $parent   = isset($data['parent']) ? $data['parent'] : null;
        if (!is_object($taxonomy)) {
            $taxonomy = $data['taxonomy'] = $this->taxonomyManager->getTaxonomy($taxonomy);
        }
        if ($parent && !is_object($parent)) {
            $parent = $data['parent'] = $this->taxonomyManager->getTerm($parent);
        }
        $options = $this->getModuleOptions()->getType($taxonomy->getName());

        if ($parent === null && !$options->isRootable()) {
            throw new RuntimeException(sprintf(
                'Taxonomy "%s" is not rootable.',
                $taxonomy->getName()
            ));
        } elseif ($parent instanceof TaxonomyTermInterface) {
            $parentType    = $parent->getTaxonomy()->getName();
            $objectType    = $taxonomy->getName();
            $objectOptions = $this->getModuleOptions()->getType($objectType);

            if (!$objectOptions->isParentAllowed($parentType)) {
                throw new RuntimeException(sprintf(
                    'Parent "%s" does not allow child "%s"',
                    $parentType,
                    $objectType
                ));
            }
        }

        $data['term'] = $this->getTermManager()->createTerm($data['term']['name'], $taxonomy->getInstance());

        return $data;
    }

    /**
     * @return ModuleOptions $moduleOptions
     */
    public function getModuleOptions()
    {
        return $this->moduleOptions;
    }
}
