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

namespace Api\Controller;

use Api\ApiManager;
use Api\Service\AuthorizationService;
use Common\Utils;
use Csrf\CsrfTokenContainer;
use Discussion\DiscussionManagerInterface;
use Discussion\Entity\CommentInterface;
use Discussion\Form\CommentForm;
use Discussion\Form\DiscussionForm;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Page\Entity\PageRepositoryInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Manager\UserManagerInterface;
use Uuid\Manager\UuidManagerInterface;
use Zend\Json\Json;
use Zend\View\Model\JsonModel;

class MutationApiController extends AbstractApiController
{
    /** @var ApiManager */
    protected $apiManager;
    /** @var DiscussionManagerInterface */
    protected $discussionManager;
    /** @var UserManagerInterface */
    protected $userManager;
    /** @var UuidManagerInterface */
    protected $uuidManager;

    public function __construct(
        AuthorizationService $authorizationService,
        ApiManager $apiManager,
        DiscussionManagerInterface $discussionManager,
        UserManagerInterface $userManager,
        UuidManagerInterface $uuidManager
    ) {
        parent::__construct($authorizationService);
        $this->apiManager = $apiManager;
        $this->discussionManager = $discussionManager;
        $this->userManager = $userManager;
        $this->uuidManager = $uuidManager;
    }

    public function commentThreadAction()
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
                'content' => 'is_string',
                'userId' => 'is_int',
                'threadId' => 'is_int',
            ]);
            $user = $this->userManager->getUser($data['userId']);
            $uuid = $this->uuidManager->getUuid(
                $data['threadId'],
                false,
                false
            );

            if (!($uuid instanceof CommentInterface)) {
                return $this->badRequestResponse();
            }

            /** @var CommentForm */
            $form = $this->getServiceLocator()->get(CommentForm::class);
            $form->setData([
                'parent' => $uuid,
                'author' => $user,
                'instance' => $uuid->getInstance(),
                'content' => $data['content'],
                'csrf' => CsrfTokenContainer::getToken(),
                'subscription' => [
                    'subscribe' => true,
                    'mailman' => true,
                ],
            ]);

            $comment = $this->discussionManager->commentDiscussion(
                $form,
                $user
            );

            return new JsonModel($this->apiManager->getUuidData($comment));
        } catch (\Throwable $exception) {
            return $this->badRequestResponse();
        }
    }

    public function startThreadAction()
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
                'title' => 'is_string',
                'content' => 'is_string',
                'userId' => 'is_int',
                'objectId' => 'is_int',
            ]);

            $user = $this->userManager->getUser($data['userId']);
            $uuid = $this->uuidManager->getUuid(
                $data['objectId'],
                false,
                false
            );

            if (
                !($uuid instanceof EntityInterface) &&
                !($uuid instanceof PageRepositoryInterface) &&
                !($uuid instanceof RevisionInterface) &&
                !($uuid instanceof TaxonomyTermInterface)
            ) {
                return $this->badRequestResponse();
            }

            /** @var DiscussionForm */
            $form = $this->getServiceLocator()->get(DiscussionForm::class);
            $form->setData([
                'object' => $uuid,
                'author' => $user,
                'instance' => $uuid->getInstance(),
                'title' => $data['title'],
                'content' => $data['content'],
                'csrf' => CsrfTokenContainer::getToken(),
                'subscription' => [
                    'subscribe' => true,
                    'mailman' => true,
                ],
            ]);

            $comment = $this->discussionManager->startDiscussion($form, $user);

            return new JsonModel($this->apiManager->getUuidData($comment));
        } catch (\Throwable $exception) {
            return $this->badRequestResponse();
        }
    }

    public function setArchiveThreadAction()
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
                'userId' => 'is_int',
                'id' => 'is_int',
                'archived' => 'is_bool',
            ]);

            $user = $this->userManager->getUser($data['userId']);
            $comment = $this->uuidManager->getUuid($data['id'], false, false);

            if (!$comment instanceof CommentInterface) {
                return $this->badRequestResponse();
            }

            if ($comment->getArchived() != $data['archived']) {
                $this->discussionManager->toggleArchived($comment, $user);
            }

            return new JsonModel($this->apiManager->getUuidData($comment));
        } catch (\Throwable $exception) {
            error_log($exception);
            return $this->badRequestResponse();
        }
    }
}
