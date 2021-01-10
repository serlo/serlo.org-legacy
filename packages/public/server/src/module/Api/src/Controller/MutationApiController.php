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
use Discussion\Form\DiscussionForm;
use Entity\Entity\EntityInterface;
use Page\Entity\PageRepositoryInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Manager\UserManagerInterface;
use Uuid\Manager\UuidManagerInterface;
use Zend\Http\Response;
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

            $user = $this->userManager->getUser(
                Utils::array_get_int($data, 'userId')
            );

            $objectId = Utils::array_get_int($data, 'objectId');
            $uuid = $this->uuidManager->getUuid($objectId, false, false);

            if (
                $uuid instanceof EntityInterface ||
                $uuid instanceof PageRepositoryInterface ||
                $uuid instanceof CommentInterface ||
                $uuid instanceof TaxonomyTermInterface
            ) {
                $instance = $uuid->getInstance();
            } else {
                $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
                return $this->response;
            }

            if ($uuid instanceof CommentInterface) {
                // TODO
            } else {
                /** @var DiscussionForm $form $form */
                $form = $this->getServiceLocator()->get(DiscussionForm::class);
                $form->setData([
                    'object' => $uuid,
                    'author' => $user,
                    'instance' => $instance,
                    'title' => Utils::array_get_string($data, 'title'),
                    'content' => Utils::array_get_string($data, 'content'),
                    'csrf' => CsrfTokenContainer::getToken(),
                    'subscription' => [
                        'subscribe' => true,
                        'mailman' => true,
                    ],
                ]);
                $comment = $this->discussionManager->startDiscussion(
                    $form,
                    $user
                );
            }

            return new JsonModel($this->apiManager->getUuidData($comment));
        } catch (\Throwable $exception) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return $this->response;
        }
    }
}
