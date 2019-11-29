<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Discussion\Controller;

use DateTime;
use Discussion\Exception\CommentNotFoundException;
use Discussion\Form\CommentForm;
use Discussion\Form\DiscussionForm;
use Instance\Manager\InstanceManagerAwareTrait;
use Kafka\Producer;
use Taxonomy\Manager\TaxonomyManagerInterface;
use User\Manager\UserManagerAwareTrait;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Discussion\Exception\RuntimeException;

class DiscussionController extends AbstractController
{
    use InstanceManagerAwareTrait, UserManagerAwareTrait;

    /**
     * @var \Discussion\Form\CommentForm
     */
    protected $commentForm;

    /**
     * @var \Discussion\Form\DiscussionForm
     */
    protected $discussionForm;

    /**
     * @var TaxonomyManagerInterface
     */
    protected $taxonomyManager;

    /**
     * @var Producer $producer
     */
    protected $producer;

    public function __construct(
        CommentForm $commentForm,
        DiscussionForm $discussionForm,
        TaxonomyManagerInterface $taxonomyManager,
        Producer $producer
    )
    {
        $this->commentForm = $commentForm;
        $this->discussionForm = $discussionForm;
        $this->taxonomyManager = $taxonomyManager;
        $this->producer = $producer;
    }

    public function archiveAction()
    {
        $discussion = $this->getDiscussion($this->params('comment'));

        if (!$discussion) {
            return false;
        }

        $this->assertGranted('discussion.archive', $discussion);
        $this->getDiscussionManager()->toggleArchived($this->params('comment'));
        $this->getDiscussionManager()->flush();
        return $this->redirect()->toReferer();
    }

    public function commentAction()
    {
        if ($this->getRequest()->isPost()) {
            $form = $this->commentForm;
            $data = [
                'parent' => $this->params('discussion'),
            ];
            $form->setData(array_merge($this->params()->fromPost(), $data));
            if ($form->isValid()) {
                $message = [
                    'type' => 'create-comment',
                    'payload' => [
                        'author' => $this->getAuthorFromRequest(),
                        'thread_id' => $data['parent'],
                        'content' => $form->getData()['content'],
                        'created_at' => (new DateTime('NOW'))->format(DateTime::ISO8601),
                        'source' => [
                            'provider_id' => 'serlo.org',
                            'type' => 'comments/create',
                        ],
                    ],
                ];
                $success = $this->producer->send(
                    'comments-queue',
                    $message
                );

                return new JsonModel(['success' => $success, 'comment' => $message['payload']]);
            }
            return new JsonModel(['success' => false, 'errors' => $form->getMessages()]);
        }
        return new JsonModel(['success' => false]);
    }

    public function showAction()
    {
        $discussion = $this->getDiscussion();

        if (!$discussion) {
            return false;
        }

        $view = new ViewModel([
            'discussion' => $discussion,
            'user' => $this->getUserManager()->getUserFromAuthenticator(),
        ]);
        $view->setTemplate('discussion/discussion/index');

        return $view;
    }

    public function startAction()
    {
        $form = $this->getForm('discussion', $this->params('on'));
        if ($this->getRequest()->isPost()) {
            $data = [
                'object' => $this->params('on'),
            ];
            $form->setData(array_merge($this->params()->fromPost(), $data));
            if ($form->isValid()) {
                $message = [
                    'type' => 'create-thread',
                    'payload' => [
                        'author' => $this->getAuthorFromRequest(),
                        'entity' => [
                            'provider_id' => 'serlo.org',
                            'id' => $this->params('on'),
                        ],
                        'title' => '',
                        'content' => $form->getData()['content'],
                        'created_at' => (new DateTime('NOW'))->format(DateTime::ISO8601),
                        'source' => [
                            'provider_id' => 'serlo.org',
                            'type' => 'discussion/create',
                        ],
                    ],
                ];
                $success = $this->producer->send(
                    'comments-queue',
                    $message
                );

                return new JsonModel(['success' => $success, 'thread' => $message['payload']]);
            }
            return new JsonModel(['success' => false, 'errors' => $form->getMessages()]);
        }
        return new JsonModel(['success' => false]);
    }

    public
    function voteAction()
    {
        $discussion = $this->getDiscussion($this->params('comment'));

        if (!$discussion) {
            return false;
        }

        $user = $this->getUserManager()->getUserFromAuthenticator();
        $this->assertGranted('discussion.vote', $discussion);

        if ($this->params('vote') == 'down') {
            if ($discussion->downVote($user)) {
                $this->flashMessenger()->addSuccessMessage('You have downvoted this comment.');
            } else {
                $this->flashMessenger()->addErrorMessage('You can\'t downvote this comment.');
            }
        } else {
            if ($discussion->upVote($user)) {
                $this->flashMessenger()->addSuccessMessage('You have upvoted this comment.');
            } else {
                $this->flashMessenger()->addErrorMessage('You can\'t upvote this comment.');
            }
        }

        $this->getDiscussionManager()->flush();
        return $this->redirect()->toReferer();
    }

    protected
    function getDiscussion($id = null)
    {
        $id = $id ?: $this->params('id');
        try {
            return $this->getDiscussionManager()->getComment($id);
        } catch (CommentNotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return null;
        }
    }

    protected
    function getForm($type, $id)
    {
        switch ($type) {
            case 'discussion':
                $form = clone $this->discussionForm;
                return $form;
                break;
            case 'comment':
                $form = clone $this->commentForm;
                $form->setAttribute(
                    'action',
                    $this->url()->fromRoute(
                        'discussion/discussion/comment',
                        ['discussion' => $id]
                    )
                );
                return $form;
                break;
            default:
                throw new RuntimeException();
        }
    }

    protected function getAuthorFromRequest()
    {
        $user = $this->getUserManager()->getUserFromAuthenticator();
        if ($user) {
            return [
                'provider_id' => 'serlo.org',
                'user_id' => $user->getId(),
            ];
        }
        return [
            'provider_id' => 'serlo.org-session',
            'user_id' => session_id(),
        ];
    }
}
