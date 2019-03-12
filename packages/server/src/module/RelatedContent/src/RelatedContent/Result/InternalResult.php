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
namespace RelatedContent\Result;

use RelatedContent\Entity\InternalInterface;
use RelatedContent\Entity\TypeInterface;
use RelatedContent\Exception;

class InternalResult extends AbstractResult
{
    use\Common\Traits\RouterAwareTrait;

    /**
     * @return InternalInterface
     */
    public function getObject()
    {
        return parent::getObject();
    }

    public function setObject(TypeInterface $object)
    {
        if (!$object instanceof InternalInterface) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected InternalInterface but got `%s`',
                get_class($object)
            ));
        }

        return parent::setObject($object);
    }

    public function getType()
    {
        return 'internal';
    }

    public function getTitle()
    {
        return $this->getObject()->getTitle();
    }

    public function getUrl()
    {
        return $this->getRouter()->assemble(
            [
                'uuid' => $this->getObject()->getReference()->getId(),
            ],
            [
                'name' => 'uuid/get',
            ]
        );
    }
}
