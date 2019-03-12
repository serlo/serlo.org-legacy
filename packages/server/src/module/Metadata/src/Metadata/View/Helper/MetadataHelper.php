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
namespace Metadata\View\Helper;

use Common\Filter\PreviewFilter;
use Metadata\Entity\MetadataInterface;
use Metadata\Manager\MetadataManagerInterface;
use Uuid\Entity\UuidInterface;
use Zend\View\Helper\AbstractHelper;

class MetadataHelper extends AbstractHelper
{
    /**
     * @var MetadataManagerInterface
     */
    protected $metadataManager;

    /**
     * @param MetadataManagerInterface $metadataManager
     */
    public function __construct(MetadataManagerInterface $metadataManager)
    {
        $this->metadataManager = $metadataManager;
    }

    /**
     * @return $this
     */
    public function __invoke()
    {
        return $this;
    }

    /**
     * @param UuidInterface $object
     * @param array         $keys
     * @param string        $separator
     * @return $this
     */
    public function keywords(UuidInterface $object, array $keys = [], $separator = ', ')
    {
        $data = [];
        if (!empty($keys)) {
            $metadata = [];
            foreach ($keys as $key) {
                $metadata[] = implode($this->metadataManager->findMetadataByObjectAndKey($object, $key), $separator);
            }
        } else {
            $metadata = $this->metadataManager->findMetadataByObject($object);
        }

        foreach ($metadata as $object) {
            /* @var $object MetadataInterface */
            $data[] = $object->getValue();
        }

        $filter = new PreviewFilter(250);
        $data   = implode($data, $separator);
        $data   = $filter->filter($data);
        $this->getView()->headMeta()->setProperty('keywords', $data);

        return $this;
    }
}
