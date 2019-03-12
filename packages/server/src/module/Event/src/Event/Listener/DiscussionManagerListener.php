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
namespace Event\Listener;

use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

/**
 * Event Listener for Discussion\Controller\DiscussionController
 */
class DiscussionManagerListener extends AbstractListener
{
    public function attachShared(SharedEventManagerInterface $events)
    {
        $class = $this->getMonitoredClass();
        $events->attach($class, 'start', [$this, 'onStart']);
        $events->attach($class, 'comment', [$this, 'onComment']);
        $events->attach($class, 'archive', [$this, 'onArchive']);
        $events->attach($class, 'restore', [$this, 'onRestore']);
    }

    protected function getMonitoredClass()
    {
        return 'Discussion\DiscussionManager';
    }

    /**
     * Gets executed on 'archive'
     *
     * @param Event $e
     * @return void
     */
    public function onArchive(Event $e)
    {
        $discussion = $e->getParam('discussion');
        $instance   = $discussion->getInstance();
        $this->logEvent('discussion/comment/archive', $instance, $discussion);
    }

    /**
     * Gets executed on 'comment'
     *
     * @param Event $e
     * @return void
     */
    public function onComment(Event $e)
    {
        $instance   = $e->getParam('instance');
        $discussion = $e->getParam('discussion');
        $comment    = $e->getParam('comment');
        $params     = [
            [
                'name'  => 'discussion',
                'value' => $discussion,
            ],
        ];
        $this->logEvent('discussion/comment/create', $instance, $comment, $params);
    }

    /**
     * Gets executed on 'restore'
     *
     * @param Event $e
     * @return void
     */
    public function onRestore(Event $e)
    {
        $discussion = $e->getParam('discussion');
        $instance   = $discussion->getInstance();
        $this->logEvent('discussion/restore', $instance, $discussion);
    }

    /**
     * Gets executed on 'start'
     *
     * @param Event $e
     * @return void
     */
    public function onStart(Event $e)
    {
        $instance   = $e->getParam('instance');
        $discussion = $e->getParam('discussion');
        $params     = [
            [
                'name'  => 'on',
                'value' => $e->getParam('on'),
            ],
        ];

        $this->logEvent('discussion/create', $instance, $discussion, $params);
    }
}
