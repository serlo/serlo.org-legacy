<?php

namespace Api\Controller;

use Api\Service\AuthorizationService;
use DateTime;
use Event\EventManagerInterface;
use Event\Exception\EntityNotFoundException;
use Exception;
use Notification\Entity\NotificationEventInterface;
use Notification\Entity\NotificationInterface;
use Notification\NotificationManagerInterface;
use User\Exception\UserNotFoundException;
use User\Manager\UserManagerInterface;
use Zend\Http\Response;
use Zend\View\Model\JsonModel;

class NotificationApiController extends AbstractApiController
{
    /** @var EventManagerInterface */
    protected $eventManager;
    /** @var NotificationManagerInterface */
    protected $notificationManager;
    /** @var UserManagerInterface */
    protected $userManager;

    public function __construct(
        AuthorizationService $authorizationService,
        EventManagerInterface $eventManager,
        NotificationManagerInterface $notificationManager,
        UserManagerInterface $userManager
    ) {
        parent::__construct($authorizationService);
        $this->eventManager = $eventManager;
        $this->notificationManager = $notificationManager;
        $this->userManager = $userManager;
    }

    public function notificationsByUserAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $userId = (int) $this->params('user-id');

        try {
            $user = $this->userManager->getUser($userId);
        } catch (UserNotFoundException $exception) {
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }

        $notifications = $this->notificationManager->findNotificationsBySubscriber(
            $user,
            null
        );
        return new JsonModel([
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
        ]);
    }

    public function eventAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = (int) $this->params('id');

        try {
            $event = $this->eventManager->getEvent($id);
        } catch (EntityNotFoundException $exception) {
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }

        // TODO: normalize & document
        $type = $event->getName();
        $payload = [];
        //        foreach ($event->getParameters() as $param) {
        //            $payload[$param->getName()->toString()] = $param->getValue();
        //        }

        return new JsonModel([
            'id' => $event->getId(),
            'type' => $type,
            'instance' => $event->getInstance()->getSubdomain(),
            'date' => $this->normalizeDate($event->getTimestamp()),
            'actorId' => $event->getActor()->getId(),
            'objectId' => $event->getObject()->getId(),
            'payload' => json_encode($payload),
        ]);
    }

    protected function normalizeDate(DateTime $date)
    {
        // Needed because date-times of the initial Athene2 import are set to "0000-00-00 00:00:00"
        if ($date->getTimestamp() < 0) {
            $date->setTimestamp(0);
        }
        return $date->format(DateTime::ATOM);
    }

    // TODO: /api/set-notification-state/1
    // TODO: call _setNotifications
    // TODO: call _setNotificationEvent
}
