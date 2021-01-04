<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Api\Controller;

use Alias\AliasManagerAwareTrait;
use Api\ApiManagerAwareTrait;
use Api\Service\AuthorizationService;
use Discussion\DiscussionManagerAwareTrait;
use Discussion\Entity\Comment;
use Discussion\Entity\CommentInterface;
use Entity\Entity\EntityInterface;
use Instance\Manager\InstanceManagerAwareTrait;
use License\Exception\LicenseNotFoundException;
use License\Manager\LicenseManagerAwareTrait;
use Notification\SubscriptionManagerAwareTrait;
use Page\Entity\PageRepositoryInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Exception\UserNotFoundException;
use User\Manager\UserManagerAwareTrait;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\Http\Response;
use Zend\Json\Json;
use Zend\Json\Exception\RuntimeException as JsonRuntimeException;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractApiController
{
    use AliasManagerAwareTrait;
    use ApiManagerAwareTrait;
    use DiscussionManagerAwareTrait;
    use InstanceManagerAwareTrait;
    use LicenseManagerAwareTrait;
    use UserManagerAwareTrait;
    use UuidManagerAwareTrait;
    use SubscriptionManagerAwareTrait;

    public function __construct(AuthorizationService $authorizationService)
    {
        parent::__construct($authorizationService);
    }

    public function aliasAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $alias = $this->params('alias');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $data = $this->getAliasManager()->resolveAliasInInstance(
            $alias,
            $instance
        );
        return $data === null
            ? $this->createJsonResponse('null')
            : new JsonModel($data);
    }

    public function addCommentAction()
    {
        if (!$this->getRequest()->isPost()) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_404);
            return $this->response;
        }

        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        try {
            $data = Json::decode(
                $this->getRequest()->getContent(),
                Json::TYPE_ARRAY
            );
        } catch (JsonRuntimeException $exception) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return $this->response;
        }

        $isDataValid =
            is_array($data) &&
            isset($data['title']) &&
            is_string($data['title']) &&
            isset($data['content']) &&
            is_string($data['content']) &&
            isset($data['userId']) &&
            is_numeric($data['userId']) &&
            isset($data['objectId']) &&
            is_numeric($data['objectId']);

        if (!$isDataValid) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return $this->response;
        }

        try {
            $user = $this->getUserManager()->getUser($data['userId']);
        } catch (UserNotFoundException $exception) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return $this->response;
        }

        try {
            $uuid = $this->getUuidManager()->getUuid(
                $data['objectId'],
                false,
                false
            );
        } catch (NotFoundException $exception) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return $this->response;
        }

        $comment = new Comment();
        $comment->setTitle($data['title']);
        $comment->setContent($data['content']);
        $comment->setAuthor($user);

        if ($uuid instanceof EntityInterface) {
            $comment->setInstance($uuid->getInstance());
        } elseif ($uuid instanceof PageRepositoryInterface) {
            $comment->setInstance($uuid->getInstance());
        } elseif ($uuid instanceof CommentInterface) {
            $comment->setInstance($uuid->getInstance());
        } elseif ($uuid instanceof TaxonomyTermInterface) {
            $comment->setInstance($uuid->getInstance());
        } else {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return $this->response;
        }

        if ($uuid instanceof CommentInterface) {
            $comment->setParent($uuid);
        } else {
            $comment->setObject($uuid);
        }

        $this->getDiscussionManager()->saveComment($comment);

        return new JsonModel($this->getApiManager()->getUuidData($comment));
    }

    public function licenseAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = $this->params('id');

        try {
            $license = $this->getLicenseManager()->getLicense($id, false);
            return new JsonModel(
                $this->getApiManager()->getLicenseData($license)
            );
        } catch (LicenseNotFoundException $exception) {
            return $this->createJsonResponse('null');
        }
    }

    public function threadsAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = $this->params('id');
        try {
            $uuid = $this->getUuidManager()->getUuid($id, false, false);
            return new JsonModel($this->getApiManager()->getThreadsData($uuid));
        } catch (NotFoundException $exception) {
            return $this->createJsonResponse('[]');
        }
    }

    public function subscriptionsAction()
    {
        try {
            $userId = (int) $this->params('user-id');
            $user = $this->getUserManager()->getUser($userId);
            return new JsonModel(
                $this->getApiManager()->getSubscriptionsData($user)
            );
        } catch (UserNotFoundException $exception) {
            return $this->createJsonResponse('null');
        }
    }

    public function uuidAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = $this->params('id');
        try {
            $uuid = $this->getUuidManager()->getUuid($id, false, false);
            return new JsonModel($this->getApiManager()->getUuidData($uuid));
        } catch (NotFoundException $exception) {
            return $this->createJsonResponse('null');
        }
    }

    protected function createJsonResponse($data)
    {
        $this->response
            ->getHeaders()
            ->addHeaderLine('Content-Type', 'application/json');
        $this->response->setContent($data);
        return $this->response;
    }
}
