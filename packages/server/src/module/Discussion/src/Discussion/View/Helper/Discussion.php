<?php
/**
 * This file is part of Athene2.
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
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace Discussion\View\Helper;

use Discussion\Entity\CommentInterface;
use Discussion\Exception\RuntimeException;
use Discussion\Form\CommentForm;
use Discussion\Form\DiscussionForm;
use Doctrine\Common\Collections\Collection;
use Entity\Entity\Entity;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Form\TermForm;
use Uuid\Entity\UuidInterface;
use Zend\Http\Request;
use Zend\View\Helper\AbstractHelper;
use ZfcTwig\View\TwigRenderer;

class Discussion extends AbstractHelper
{
    use \Discussion\DiscussionManagerAwareTrait, \Common\Traits\ConfigAwareTrait, \User\Manager\UserManagerAwareTrait,
        \Taxonomy\Manager\TaxonomyManagerAwareTrait, \Instance\Manager\InstanceManagerAwareTrait;

    protected $discussions;
    protected $object;

    protected $form;

    protected $archived;

    protected $forum;

    /**
     * @var TermForm
     */
    protected $termForm;

    /**
     * @var \Discussion\Form\CommentForm
     */
    protected $commentForm;

    /**
     * @var \Discussion\Form\DiscussionForm
     */
    protected $discussionForm;

    /**
     * @var \ZfcTwig\View\TwigRenderer
     */
    protected $renderer;

    /**
     * @var \Zend\Http\Request
     */
    protected $request;

    /**
     * @var array
     */
    protected $inMemory = [];

    public function __construct(
        TermForm $termForm,
        CommentForm $commentForm,
        DiscussionForm $discussionForm,
        TwigRenderer $renderer,
        Request $request
    ) {
        $this->renderer       = $renderer;
        $this->form           = [];
        $this->termForm       = $termForm;
        $this->commentForm    = $commentForm;
        $this->discussionForm = $discussionForm;
        $this->request       = $request;
    }

    public function __invoke(UuidInterface $object = null, $forum = null, $archived = null)
    {
        if ($object !== null) {
            $this->discussions = $this->getDiscussionManager()->findDiscussionsOn($object, $archived);
            $this->setObject($object);
        }
        if ($archived !== null) {
            $this->setArchived($archived);
        }
        if ($forum !== null) {
            $this->setForum($forum);
        }
        return $this;
    }

    /**
     * @return boolean $archived
     */
    public function getArchived()
    {
        return $this->archived;
    }

    /**
     * @param boolean $archived
     * @return self
     */
    public function setArchived($archived)
    {
        $this->archived = $archived;
        return $this;
    }

    public function getDiscussions(UuidInterface $object)
    {
        $discussions = $this->getDiscussionManager()->findDiscussionsOn($object);
        $discussions = $discussions->filter(
            function (CommentInterface $comment) {
                return !$comment->isTrashed();
            }
        );
        return $discussions;
    }

    public function getForm($type, UuidInterface $object, TaxonomyTermInterface $forum = null)
    {
        $view = $this->getView();
        $queries = ['query' => ['redirect' => $view->serverUrl(true)]];

        switch ($type) {
            case 'discussion':
                $form = clone $this->discussionForm;
                $form->setAttribute(
                    'action',
                    $view->url(
                        'discussion/discussion/start',
                        ['on' => $object->getId()],
                        $queries
                    )
                );
                return $form;
                break;
            case 'comment':
                $form = clone $this->commentForm;
                $form->setAttribute(
                    'action',
                    $view->url(
                        'discussion/discussion/comment',
                        ['discussion' => $object->getId()],
                        $queries
                    )
                );
                return $form;
                break;
            default:
                throw new RuntimeException();
        }
    }

    public function getForum()
    {
        return $this->forum;
    }

    public function setForum(TaxonomyTermInterface $forum)
    {
        $this->forum = $forum;
        return $this;
    }

    public function getObject()
    {
        return $this->object;
    }

    public function getUser()
    {
        return $this->getUserManager()->getUserFromAuthenticator();
    }

    public function render($template = null, $leftWidth = 2, $force = false)
    {
        $template = $template ? 'discussion/helper/' . $template . '/' . $template : $this->getOption('template');
        if ($force || !$this->request->isXmlHttpRequest()) {
            return $this->renderer->render(
                $template,
                [
                    'discussions' => $this->discussions,
                    'isArchived'  => $this->archived,
                    'object'      => $this->getObject(),
                    'forum'     => $this->getForum(),
                    'leftWidth' => $leftWidth,
                ]
            );
        } else {
            return '';
        }
    }

    public function setObject(UuidInterface $object)
    {
        $this->object = $object;
        return $this;
    }

    public function sortDiscussions(Collection $collection)
    {
        return $this->discussionManager->sortDiscussions($collection);
    }

    protected function getDefaultConfig()
    {
        return [
            'template' => 'discussion/helper/default/default',
            'root'     => 'root',
            'forum'    => 'forum',
        ];
    }
}
