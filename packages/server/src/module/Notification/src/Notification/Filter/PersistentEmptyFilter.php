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
namespace Notification\Filter;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Persistence\ObjectManager;
use Notification\Entity\NotificationInterface;
use Zend\Filter\Exception;
use Zend\Filter\FilterInterface;

class PersistentEmptyFilter implements FilterInterface
{
    /**
     * @var ObjectManager
     */
    protected $objectManager;

    /**
     * @param ObjectManager $objectManager
     */
    public function __construct(ObjectManager $objectManager)
    {
        $this->objectManager = $objectManager;
    }

    /**
     * Returns the result of filtering $value
     *
     * @param  mixed $value
     * @throws Exception\RuntimeException If filtering $value is impossible
     * @return mixed
     */
    public function filter($value)
    {
        $passes = function (NotificationInterface $notification) {
            if ($notification->getEvents()->count() == 0) {
                $this->objectManager->remove($notification);
                $this->objectManager->persist($notification);
                return false;
            }

            return true;
        };

        if ($value instanceof Collection) {
            return $value->filter($passes);
        } elseif (is_array($value)) {
            return array_filter($value, $passes);
        } else {
            throw new Exception\RuntimeException(sprintf(
                'Expected Collection or array but got %s',
                is_object($value) ? get_class($value) : gettype($value)
            ));
        }
    }
}
