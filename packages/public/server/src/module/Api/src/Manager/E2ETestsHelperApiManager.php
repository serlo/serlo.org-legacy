<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Api\Manager;

use ClassResolver\ClassResolver;
use Doctrine\ORM\EntityManager;
use Event\Entity\EventLogInterface;

class E2ETestsHelperApiManager
{
    /** @var ClassResolver */
    protected $classResolver;
    /** @var EntityManager */
    protected $entitiyManager;

    public function __construct(
        ClassResolver $classResolver,
        EntityManager $entityManager
    ) {
        $this->classResolver = $classResolver;
        $this->entitiyManager = $entityManager;
    }

    /**
     * @retrun array
     */
    public function getEventsAfter(int $eventId)
    {
        $className = $this->classResolver->resolveClassName(
            EventLogInterface::class
        );
        return $this->entitiyManager
            ->createQuery(
                'SELECT e FROM ' .
                    $className .
                    ' e WHERE e.id > ' .
                    $eventId .
                    ' ORDER BY e.id'
            )
            ->execute();
    }

    /**
     * @return EventLogInterface
     */
    public function getLastEvent()
    {
        $className = $this->classResolver->resolveClassName(
            EventLogInterface::class
        );
        $events = $this->entitiyManager
            ->createQuery(
                'SELECT e FROM ' . $className . ' e ORDER BY e.id DESC'
            )
            ->setMaxResults(1)
            ->execute();

        return $events[0];
    }
}
