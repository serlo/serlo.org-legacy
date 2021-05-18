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

use Api\Service\AbstractGraphQLService;
use DateTime;
use Event\Entity\EventLogInterface;
use Event\EventManagerInterface;
use Notification\Entity\NotificationEventInterface;
use Notification\Entity\NotificationInterface;
use Notification\NotificationManagerInterface;
use Raven_Client;
use User\Entity\UserInterface;
use User\Manager\UserManagerInterface;

class NotificationApiManager
{
    /** @var EventManagerInterface */
    protected $eventManager;
    /** @var NotificationManagerInterface */
    protected $notificationManager;
    /** @var UserManagerInterface */
    protected $userManager;
    /** @var AbstractGraphQLService */
    protected $graphql;
    /** @var Raven_Client */
    protected $sentry;

    public function __construct(
        EventManagerInterface $eventManager,
        NotificationManagerInterface $notificationManager,
        UserManagerInterface $userManager,
        AbstractGraphQLService $graphql,
        $sentry
    ) {
        $this->eventManager = $eventManager;
        $this->notificationManager = $notificationManager;
        $this->userManager = $userManager;
        $this->graphql = $graphql;
        $this->sentry = $sentry;
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
        $this->graphql->removeCache(
            $this->graphql->getCacheKey('/api/notifications/' . $user->getId())
        );
    }

    protected function getEventData(EventLogInterface $event)
    {
        $normalized = $this->normalizeEvent($event);
        return array_merge(
            [
                'id' => $event->getId(),
                'instance' => $event->getInstance()->getSubdomain(),
                'date' => $this->normalizeDate($event->getTimestamp()),
                'objectId' => $event->getObject()->getId(),
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
                    'previousParentId' =>
                        $from != 'no parent' ? $from->getId() : null,
                    'parentId' => $to != 'no parent' ? $to->getId() : null,
                ];
            case 'uuid/restore':
                return [
                    '__typename' => 'SetUuidStateNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
                    'trashed' => false,
                ];
            case 'uuid/trash':
                return [
                    '__typename' => 'SetUuidStateNotificationEvent',
                    'actorId' => $event->getActor()->getId(),
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
