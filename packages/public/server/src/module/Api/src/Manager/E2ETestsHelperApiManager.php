<?php

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
