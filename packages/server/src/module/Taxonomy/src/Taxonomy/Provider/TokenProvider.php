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
namespace Taxonomy\Provider;

use Common\Filter\Slugify;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Exception;
use Token\Provider\AbstractProvider;
use Token\Provider\ProviderInterface;

class TokenProvider extends AbstractProvider implements ProviderInterface
{
    protected $filter;

    public function __construct()
    {
        $this->filter = new Slugify();
    }

    public function getData()
    {
        return [
            'path' => $this->getPath($this->getObject()),
            'id'   => $this->getObject()->getId(),
        ];
    }

    protected function getPath(TaxonomyTermInterface $taxonomyTerm, $string = null)
    {
        $name   = $taxonomyTerm->getName();
        $parent = $taxonomyTerm->getParent();
        $string = $name . '/' . $string;

        if ($parent && $parent->getTaxonomy()->getName() != 'root') {
            return $this->getPath($parent, $string);
        }

        return $string;
    }

    protected function validObject($object)
    {
        if (!$object instanceof TaxonomyTermInterface) {
            throw new Exception\InvalidArgumentException(sprintf('Expected PostInterface but got `%s`', get_class($object)));
        }
    }
}
