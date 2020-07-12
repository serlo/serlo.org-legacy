<?php

namespace Api\Manager;

use DateTime;
use Event\Entity\EventLogInterface;
use Event\EventManagerInterface;
use Event\Exception\EntityNotFoundException;
use Notification\Entity\NotificationEventInterface;
use Notification\Entity\NotificationInterface;
use Notification\NotificationManagerInterface;
use Raven_Client;
use User\Exception\UserNotFoundException;
use User\Manager\UserManagerInterface;

class NotificationApiManager
{
    /** @var EventManagerInterface */
    protected $eventManager;
    /** @var NotificationManagerInterface */
    protected $notificationManager;
    /** @var UserManagerInterface */
    protected $userManager;
    /** @var Raven_Client */
    private $sentry;

    public function __construct(
        EventManagerInterface $eventManager,
        NotificationManagerInterface $notificationManager,
        UserManagerInterface $userManager,
        $sentry
    ) {
        $this->eventManager = $eventManager;
        $this->notificationManager = $notificationManager;
        $this->userManager = $userManager;
        $this->sentry = $sentry;
    }

    /**
     * @param int $userId
     * @return array
     * @throws UserNotFoundException
     */
    public function getNotificationDataByUserId(int $userId)
    {
        $user = $this->userManager->getUser($userId);
        $notifications = $this->notificationManager->findNotificationsBySubscriber(
            $user,
            null
        );
        return [
            'userId' => $userId,
            'notifications' => $notifications
                ->map(function (NotificationInterface $notification) {
                    /** @var NotificationEventInterface $event */
                    $event = $notification->getEvents()->first();
                    return [
                        'id' => $notification->getId(),
                        'unread' => !$notification->getSeen(),
                        'eventId' => $event->getId(),
                    ];
                })
                ->toArray(),
        ];
    }

    /**
     * @param int $id
     * @return array
     * @throws EntityNotFoundException
     */
    public function getEventData(int $id)
    {
        $event = $this->eventManager->getEvent($id);
        $normalized = $this->normalizeEvent($event);

        return [
            'id' => $event->getId(),
            'type' => $normalized['type'],
            'instance' => $event->getInstance()->getSubdomain(),
            'date' => $this->normalizeDate($event->getTimestamp()),
            'actorId' => $event->getActor()->getId(),
            'objectId' => $event->getObject()->getId(),
            'payload' => json_encode($normalized['payload']),
        ];
    }

    protected function normalizeEvent(EventLogInterface $event)
    {
        switch ($event->getName()) {
            case 'discussion/comment/archive':
                return [
                    'type' => 'SET_THREAD_STATE',
                    'payload' => [
                        'archived' => true,
                    ],
                ];
            case 'discussion/comment/restore':
                return [
                    'type' => 'SET_THREAD_STATE',
                    'payload' => [
                        'archived' => false,
                    ],
                ];
            case 'discussion/comment/create':
                return [
                    'type' => 'CREATE_COMMENT',
                    'payload' => [
                        'threadId' => $event
                            ->getParameter('discussion')
                            ->getId(),
                    ],
                ];
            case 'discussion/create':
                return [
                    'type' => 'CREATE_THREAD',
                    'payload' => [
                        'objectId' => $event->getParameter('on')->getId(),
                    ],
                ];
            case 'entity/create':
                return [
                    'type' => 'CREATE_ENTITY',
                    'payload' => [],
                ];
            case 'license/object/set':
                return [
                    'type' => 'SET_LICENSE',
                    'payload' => [],
                ];
            case 'entity/link/create':
                return [
                    'type' => 'CREATE_LINK',
                    'payload' => [
                        'parentId' => $event->getParameter('parent')->getId(),
                    ],
                ];
            case 'entity/link/remove':
                return [
                    'type' => 'REMOVE_LINK',
                    'payload' => [
                        'parentId' => $event->getParameter('parent')->getId(),
                    ],
                ];
            case 'entity/revision/add':
                return [
                    'type' => 'CREATE_ENTITY_REVISION',
                    'payload' => [
                        'repositoryId' => $event
                            ->getParameter('repository')
                            ->getId(),
                    ],
                ];
            case 'entity/revision/checkout':
                return [
                    'type' => 'CHECKOUT_REVISION',
                    'payload' => [
                        'repositoryId' => $event
                            ->getParameter('repository')
                            ->getId(),
                        'reason' => $event->getParameter('reason') ?? '',
                    ],
                ];
            case 'entity/revision/reject':
                return [
                    'type' => 'REJECT_REVISION',
                    'payload' => [
                        'repositoryId' => $event
                            ->getParameter('repository')
                            ->getId(),
                        'reason' => $event->getParameter('reason') ?? '',
                    ],
                ];
            case 'taxonomy/term/associate':
                return [
                    'type' => 'CREATE_TAXONOMY_ASSOCIATION',
                    'payload' => [
                        'objectId' => $event->getParameter('object')->getId(),
                    ],
                ];
            case 'taxonomy/term/dissociate':
                return [
                    'type' => 'REMOVE_TAXONOMY_ASSOCIATION',
                    'payload' => [
                        'objectId' => $event->getParameter('object')->getId(),
                    ],
                ];
            case 'taxonomy/term/create':
                return [
                    'type' => 'CREATE_TAXONOMY_TERM',
                    'payload' => [],
                ];
            case 'taxonomy/term/update':
                return [
                    'type' => 'SET_TAXONOMY_TERM',
                    'payload' => [],
                ];
            case 'taxonomy/term/parent/change':
                $from = $event->getParameter('from');
                $to = $event->getParameter('to');
                return [
                    'type' => 'SET_TAXONOMY_PARENT',
                    'payload' => [
                        'previousParentId' => $from ? $from->getId() : null,
                        'parentId' => $to ? $to->getId() : null,
                    ],
                ];
            case 'uuid/restore':
                return [
                    'type' => 'SET_UUID_STATE',
                    'payload' => [
                        'trashed' => false,
                    ],
                ];
            case 'uuid/trash':
                return [
                    'type' => 'SET_UUID_STATE',
                    'payload' => [
                        'trashed' => true,
                    ],
                ];
            default:
                $this->sentry->captureMessage(
                    'Unsupported event type',
                    [],
                    [
                        'tags' => ['api' => true],
                        'extra' => [
                            'type' => $event->getName(),
                        ],
                    ]
                );
                return [
                    'type' => 'UNSUPPORTED',
                    'payload' => [
                        'type' => $event->getName(),
                    ],
                ];
        }
    }

    protected function normalizeDate(DateTime $date)
    {
        // Needed because date-times of the initial Athene2 import are set to "0000-00-00 00:00:00"
        if ($date->getTimestamp() < 0) {
            $date->setTimestamp(0);
        }
        return $date->format(DateTime::ATOM);
    }
}
