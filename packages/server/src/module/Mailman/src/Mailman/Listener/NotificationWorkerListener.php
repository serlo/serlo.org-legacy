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

use Doctrine\Common\Collections\ArrayCollection;
use DoctrineModule\Paginator\Adapter\Collection;
use Mailman\MailmanInterface;
use Mailman\Renderer\MailRendererInterface;
use Notification\Entity\Notification;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use Zend\I18n\Translator\Translator;
use Zend\Log\LoggerInterface;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class NotificationWorkerListener extends AbstractListener
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @param LoggerInterface   $logger
     * @param MailmanInterface  $mailman
     * @param MailRendererInterface $mailRenderer
     * @param Translator        $translator
     */
    public function __construct(
        LoggerInterface $logger,
        MailmanInterface $mailman,
        MailRendererInterface $mailRenderer,
        Translator $translator
    ) {
        $this->logger = $logger;
        parent::__construct($mailman, $mailRenderer, $translator);
    }

    /**
     * @param SharedEventManagerInterface $events
     * @return void
     */
    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach($this->getMonitoredClass(), 'notify', [$this, 'onNotify'], -1);
    }

    /**
     * @param Event $e
     * @return void
     */
    public function onNotify(Event $e)
    {
        /* @var $user \User\Entity\UserInterface */
        $user          = $e->getParam('user');
        $notifications = $e->getParam('notifications');

        if (!$notifications instanceof Collection) {
            $notifications = new ArrayCollection($notifications);
        }

        $discussionNotifications = new ArrayCollection();
        $contentNotifications = new ArrayCollection();
        foreach ($notifications as $notification) {
            /** @var Notification $notification */
            if (substr($notification->getEventName(), 0, strlen('discussion')) === 'discussion') {
                $discussionNotifications->add($notification);
            } else {
                $contentNotifications->add($notification);
            }
        }

        $this->getMailRenderer()->setTemplateFolder('mailman/messages/notification');
        $data = $this->getMailRenderer()->renderMail([
            'body' => [
                'user'          => $user,
                'discussionNotifications' => $discussionNotifications,
                'contentNotifications' => $contentNotifications,
            ],
        ]);

        try {
            $this->getMailman()->send(
                $user->getEmail(),
                $this->getMailman()->getDefaultSender(),
                $data
            );
        } catch (\Exception $e) {
            // TODO: Persist email and try resending it later
            $log = $this->exceptionToString($e);
            $this->logger->crit($log);
            var_dump($e->getMessage(), $e->getTraceAsString());
        }
    }

    /**
     * @param \Exception $e
     * @return string
     */
    protected function exceptionToString(\Exception $e)
    {
        $trace = $e->getTraceAsString();
        $i     = 1;
        do {
            $messages[] = $i++ . ": " . $e->getMessage();
        } while ($e = $e->getPrevious());

        $log = "Exception:n" . implode("n", $messages);
        $log .= "nTrace:n" . $trace;

        return $log;
    }

    /**
     * @return string
     */
    protected function getMonitoredClass()
    {
        return 'Notification\NotificationWorker';
    }
}
