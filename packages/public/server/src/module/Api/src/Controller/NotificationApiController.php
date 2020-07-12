<?php

namespace Api\Controller;

use Api\Manager\NotificationApiManager;
use Api\Service\AuthorizationService;
use Event\Exception\EntityNotFoundException;
use User\Exception\UserNotFoundException;
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
                $this->manager->getEventData((int) $this->params('id'))
            );
        } catch (EntityNotFoundException $exception) {
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }
    }
}
