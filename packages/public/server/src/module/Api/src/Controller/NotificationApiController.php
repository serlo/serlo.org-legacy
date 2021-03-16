<?php

namespace Api\Controller;

use Api\Manager\NotificationApiManager;
use Api\Service\AuthorizationService;
use Event\Exception\EntityNotFoundException;
use Notification\Exception\NotificationNotFoundException;
use User\Exception\UserNotFoundException;
use Zend\Http\Response;
use Zend\View\Model\JsonModel;

class NotificationApiController extends AbstractApiController
{
    /** @var NotificationApiManager */
    protected $manager;

    public function __construct(
        AuthorizationService $authorizationService,
        NotificationApiManager $manager
    ) {
        parent::__construct($authorizationService);
        $this->manager = $manager;
    }

    public function notificationsByUserAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        try {
            return new JsonModel(
                $this->manager->getNotificationDataByUserId(
                    (int) $this->params('user-id')
                )
            );
        } catch (UserNotFoundException $exception) {
            $this->createJsonResponse('null');
        }
    }

    public function eventAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        try {
            return new JsonModel(
                $this->manager->getEventDataById((int) $this->params('id'))
            );
        } catch (EntityNotFoundException $exception) {
            $this->createJsonResponse('null');
        }
    }

    public function setNotificationStateAction()
    {
        if (!$this->getRequest()->isPost()) {
            return $this->notFoundResponse();
        }

        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        try {
            $data = $this->getRequestBody([
                'id' => 'is_int',
                'userId' => 'is_int',
                'unread' => 'is_bool',
            ]);

            $this->manager->setNotificationState(
                $data['id'],
                $data['userId'],
                $data['unread']
            );
            return new JsonModel(
                $this->manager->getNotificationDataByUserId($data['userId'])
            );
        } catch (UserNotFoundException $e) {
            return $this->badRequestResponse('Invalid user id');
        } catch (NotificationNotFoundException $e) {
            return $this->forbiddenResponse('Invalid notification id');
        } catch (\TypeError $e) {
            return $this->badRequestResponse('Invalid request body');
        }
    }
}
