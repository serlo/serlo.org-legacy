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

namespace Api\Listener;

use Discussion\DiscussionManager;
use Discussion\Entity\CommentInterface;
use Uuid\Entity\UuidInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class DiscussionManagerListener extends AbstractListener
{
    public function onComment(Event $e)
    {
        /** @var CommentInterface $comment */
        $comment = $e->getParam('comment');
        $this->getApiManager()->setUuid($comment);
        /** @var CommentInterface $comment */
        $thread = $e->getParam('discussion');
        $this->getApiManager()->setUuid($thread);
    }

    public function onStart(Event $e)
    {
        /** @var CommentInterface $thread */
        $thread = $e->getParam('discussion');
        $this->getApiManager()->setUuid($thread);
        /** @var UuidInterface $uuid */
        $uuid = $e->getParam('on');
        $this->getApiManager()->setThreads($uuid);
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'comment',
            [$this, 'onComment'],
            2
        );
        $events->attach(
            $this->getMonitoredClass(),
            'start',
            [$this, 'onStart'],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return DiscussionManager::class;
    }
}
