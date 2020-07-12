<?php

namespace Api\Manager;

use Api\Service\GraphQLService;
use DateTime;
use Event\Entity\EventLogInterface;
use Event\EventManagerInterface;
use Event\Exception\EntityNotFoundException;
use Notification\Entity\NotificationEventInterface;
use Notification\Entity\NotificationInterface;
use Notification\Exception\NotificationNotFoundException;
use Notification\NotificationManagerInterface;
use Raven_Client;
use User\Entity\UserInterface;
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
    /** @var GraphQLService */
    protected $graphql;
    /** @var Raven_Client */
    protected $sentry;

    public function __construct(
        EventManagerInterface $eventManager,
        NotificationManagerInterface $notificationManager,
        UserManagerInterface $userManager,
        GraphQLService $graphql,
        $sentry
    ) {
        $this->eventManager = $eventManager;
        $this->notificationManager = $notificationManager;
        $this->userManager = $userManager;
        $this->graphql = $graphql;
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
        return $this->getNotificationData($user);
    }

    protected function getNotificationData(UserInterface $user)
    {
        $notifications = $this->notificationManager->findNotificationsBySubscriber(
            $user,
            null
        );
        return [
            'userId' => $user->getId(),
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

    public function setNotificationData(UserInterface $user)
    {
        $query = <<<MUTATION
            mutation setNotifications(
                \$userId: Int!
                \$notifications: [NotificationInput!]!
            ) {
                _setNotifications(
                    userId: \$userId
                    notifications \$notifications
                )
            }
MUTATION;
        $this->graphql->exec($query, $this->getNotificationData($user));
    }

    /**
     * @param int $id
     * @return array
     * @throws EntityNotFoundException
     */
    public function getEventDataById(int $id)
    {
        $event = $this->eventManager->getEvent($id);
        return $this->getEventData($event);
    }

    protected function getEventData(EventLogInterface $event)
    {
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

    public function setEventData(EventLogInterface $event)
    {
        $query = <<<MUTATION
            mutation setNotificationEvent(
                \$id: Int!
                \$type: String!
                \$instance: Instance!
                \$date: String!
                \$actorId: Int!
                \$objectId: Int!
                \$payload: String!
            ) {
                _setNotificationEvent(
                    id: \$id
                    type: \$type
                    instance: \$instance
                    date: \$date
                    actorId: \$actorId
                    objectId: \$objectId
                    payload: \$payload
                )
            }
MUTATION;
        $this->graphql->exec($query, $this->getEventData($event));
    }

    /**
     * @param int $id
     * @param int $userId
     * @param bool $unread
     * @throws UserNotFoundException
     * @throws NotificationNotFoundException
     */
    public function setNotificationState(int $id, int $userId, bool $unread)
    {
        $user = $this->userManager->getUser($userId);
        $notifications = $this->notificationManager->findNotificationsBySubscriber(
            $user,
            null
        );
        /** @var NotificationInterface $notification */
        $notification = $notifications
            ->filter(function (NotificationInterface $n) use ($id) {
                return $n->getId() === $id;
            })
            ->first();
        if (!$notification) {
            throw new NotificationNotFoundException();
        }
        $notification->setSeen(!$unread);
        $this->notificationManager->getObjectManager()->persist($notification);
        $this->notificationManager->flush();
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
