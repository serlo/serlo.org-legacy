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
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
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
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }
    }

    public function lastEventAction()
    {
        return new JsonModel($this->manager->getEventDataFromLastEvent());
    }

    public function setNotificationStateAction()
    {
        if (!$this->getRequest()->isPost()) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_404);
            return $this->response;
        }

        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = (int) $this->params('id');

        $data = json_decode($this->getRequest()->getContent(), true);
        $userId = $data['userId'];
        $unread = $data['unread'];

        if (!isset($userId) || !isset($unread)) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel(['reason' => 'Invalid body']);
        }

        try {
            $this->manager->setNotificationState($id, $userId, $unread);
            return new JsonModel(
                $this->manager->getNotificationDataByUserId($userId)
            );
        } catch (UserNotFoundException $e) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel(['reason' => 'Invalid user id']);
        } catch (NotificationNotFoundException $e) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_403);
            return new JsonModel(['reason' => 'Invalid notification id']);
        }
    }
}
