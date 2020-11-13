<?php

namespace Api\Manager;

use Api\Service\GraphQLService;
use ClassResolver\ClassResolverAwareTrait;
use Common\Traits\EntityManagerAwareTrait;
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

    use ClassResolverAwareTrait, EntityManagerAwareTrait;

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
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/notifications/' . $user->getId()),
            $this->getNotificationData($user)
        );
    }

    public function getEventsData(int $after, int $limit)
    {
        $className = $this->getClassResolver()->resolveClassName(
            EventLogInterface::class
        );
        $dql =
            'SELECT event from ' .
            $className .
            ' event WHERE event.id > ' .
            $after;
        $events = $this->getEntityManager()
            ->createQuery($dql)
            ->setMaxResults($limit)
            ->execute();

        return [
            'nodes' => array_map(function ($event) {
                return $this->getEventData($event);
            }, $events),
        ];
    }

    /**
     * @param int $id
     * @return array
     * @throws EntityNotFoundException
     */
    public function getEventDataById(int $id)
    {
        $event = $this->eventManager->getEvent($id, false);
        return $this->getEventData($event);
    }

    protected function getEventData(EventLogInterface $event)
    {
        $normalized = $this->normalizeEvent($event);
        return array_merge(
            [
                'id' => $event->getId(),
                'instance' => $event->getInstance()->getSubdomain(),
                'date' => $this->normalizeDate($event->getTimestamp()),
            ],
            $normalized
        );
    }

    public function setEventData(EventLogInterface $event)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/event/' . $event->getId()),
            $this->getEventData($event)
        );
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
                    '__typename' => 'SetThreadStateNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'threadId' => $event->getObject()->getId(),
                    'archived' => true,
                ];
            case 'discussion/comment/restore':
                return [
                    '__typename' => 'SetThreadStateNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'threadId' => $event->getObject()->getId(),
                    'archived' => false,
                ];
            case 'discussion/comment/create':
                return [
                    '__typename' => 'CreateCommentNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'threadId' => $event->getParameter('discussion')->getId(),
                    'commentId' => $event->getObject()->getId(),
                ];
            case 'discussion/create':
                return [
                    '__typename' => 'CreateThreadNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'threadId' => $event->getObject()->getId(),
                    'objectId' => $event->getParameter('on')->getId(),
                ];
            case 'entity/create':
                return [
                    '__typename' => 'CreateEntityNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'entityId' => $event->getObject()->getId(),
                ];
            case 'license/object/set':
                return [
                    '__typename' => 'SetLicenseNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'repositoryId' => $event->getObject()->getId(),
                ];
            case 'entity/link/create':
                return [
                    '__typename' => 'CreateEntityLinkNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'parentId' => $event->getParameter('parent')->getId(),
                    'childId' => $event->getObject()->getId(),
                ];
            case 'entity/link/remove':
                return [
                    '__typename' => 'RemoveEntityLinkNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'parentId' => $event->getParameter('parent')->getId(),
                    'childId' => $event->getObject()->getId(),
                ];
            case 'entity/revision/add':
                return [
                    '__typename' => 'CreateEntityRevisionNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'entityId' => $event->getParameter('repository')->getId(),
                    'entityRevisionId' => $event->getObject()->getId(),
                ];
            case 'entity/revision/checkout':
                return [
                    '__typename' => 'CheckoutRevisionNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'repositoryId' => $event
                        ->getParameter('repository')
                        ->getId(),
                    'revisionId' => $event->getObject()->getId(),
                    'reason' => $event->getParameter('reason') ?? '',
                ];
            case 'entity/revision/reject':
                return [
                    '__typename' => 'RejectRevisionNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'repositoryId' => $event
                        ->getParameter('repository')
                        ->getId(),
                    'revisionId' => $event->getObject()->getId(),
                    'reason' => $event->getParameter('reason') ?? '',
                ];
            case 'taxonomy/term/associate':
                return [
                    '__typename' => 'CreateTaxonomyLinkNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'parentId' => $event->getObject()->getId(),
                    'childId' => $event->getParameter('object')->getId(),
                ];
            case 'taxonomy/term/dissociate':
                return [
                    '__typename' => 'RemoveTaxonomyLinkNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'parentId' => $event->getObject()->getId(),
                    'childId' => $event->getParameter('object')->getId(),
                ];
            case 'taxonomy/term/create':
                return [
                    '__typename' => 'CreateTaxonomyTermNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'taxonomyTermId' => $event->getObject()->getId(),
                ];
            case 'taxonomy/term/update':
                return [
                    '__typename' => 'SetTaxonomyTermNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'taxonomyTermId' => $event->getObject()->getId(),
                ];
            case 'taxonomy/term/parent/change':
                $from = $event->getParameter('from');
                $to = $event->getParameter('to');
                return [
                    '__typename' => 'SetTaxonomyParentNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'childId' => $event->getObject()->getId(),
                    'previousParentId' => $from ? $from->getId() : null,
                    'parentId' => $to ? $to->getId() : null,
                ];
            case 'uuid/restore':
                return [
                    '__typename' => 'SetUuidStateNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'objectId' => $event->getObject()->getId(),
                    'trashed' => false,
                ];
            case 'uuid/trash':
                return [
                    '__typename' => 'SetUuidStateNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'objectId' => $event->getObject()->getId(),
                    'trashed' => true,
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
                    'error' => 'unsupported',
                    'type' => $event->getName(),
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
