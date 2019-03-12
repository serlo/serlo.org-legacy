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
namespace Mailman\Listener;

use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use Zend\View\Model\ViewModel;

class UserControllerListener extends AbstractListener
{
    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach($this->getMonitoredClass(), 'register', [$this, 'onRegister'], -1);
    }

    protected function getMonitoredClass()
    {
        return 'User\Controller\UserController';
    }

    public function onRegister(Event $e)
    {
        /* @var $user \User\Entity\UserInterface */
        $user = $e->getParam('user');

        $this->getMailRenderer()->setTemplateFolder('mailman/messages/register');
        $data = $this->getMailRenderer()->renderMail([
            'body' => [
                'user' => $user,
            ],
        ]);

        try {
            $this->getMailman()->send(
                $user->getEmail(),
                $this->getMailman()->getDefaultSender(),
                $data
            );
        } catch (\Throwable $e) {
            // catch exception
        }
    }
}
