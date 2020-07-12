<?php

namespace Api\Manager;

use DateTime;
use Event\EventManagerInterface;
use Event\Exception\EntityNotFoundException;
use Notification\Entity\NotificationEventInterface;
use Notification\Entity\NotificationInterface;
use Notification\NotificationManagerInterface;
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

    public function __construct(
        EventManagerInterface $eventManager,
        NotificationManagerInterface $notificationManager,
        UserManagerInterface $userManager
    ) {
        $this->eventManager = $eventManager;
        $this->notificationManager = $notificationManager;
        $this->userManager = $userManager;
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

        // TODO: normalize & document
        $type = $event->getName();
        $payload = [];
        //        foreach ($event->getParameters() as $param) {
        //            $payload[$param->getName()->toString()] = $param->getValue();
        //        }

        return [
            'id' => $event->getId(),
            'type' => $type,
            'instance' => $event->getInstance()->getSubdomain(),
            'date' => $this->normalizeDate($event->getTimestamp()),
            'actorId' => $event->getActor()->getId(),
            'objectId' => $event->getObject()->getId(),
            'payload' => json_encode($payload),
        ];
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
