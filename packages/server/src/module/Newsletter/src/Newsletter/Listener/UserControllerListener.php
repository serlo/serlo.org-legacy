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
namespace Newsletter\Listener;

use Common\Listener\AbstractSharedListenerAggregate;
use Newsletter\MailChimpAwareTrait;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use Zend\Http\PhpEnvironment\RemoteAddress;
use \DrewM\MailChimp\MailChimp;

class UserControllerListener extends AbstractSharedListenerAggregate
{
    use MailChimpAwareTrait;

    /**
     * @param mixed $mailChimp
     */
    public function __construct($mailChimp)
    {
        $this->mailChimp = $mailChimp;
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach($this->getMonitoredClass(), 'register', [$this, 'onRegister']);
    }

    /**
     * Gets executed after user registration
     *
     * @param Event $e
     * @return void
     */
    public function onRegister(Event $e)
    {
        if (is_null($this->mailChimp)) {
            return;
        }

        /* @var $user \User\Entity\UserInterface */
        $user            = $e->getParam('user');
        $data            = $e->getParam('data');
        $email           = $user->getEmail();
        $username        = $user->getUsername();
        $timestamp       = date('c');
        $ip              = (new RemoteAddress())->getIpAddress();
        $newsletterOptIn = $data['newsletterOptIn'];
        $firstName       = $data['firstName'];
        $lastName        = $data['lastName'];
        $interests       = $data['interests'];

        if (!$newsletterOptIn) {
            return;
        }

        $request = array(
            'email_address'    => $email,
            'status'           => 'subscribed',
            'merge_fields'     => array(
                'FNAME'   => $firstName,
                'LNAME'   => $lastName,
                'UNAME'   => $username,
                'MMERGE6' => $timestamp,
            ),
            'ip_signup'        => $ip,
            'timestamp_signup' => $timestamp,
            'ip_opt'           => $ip,
            'timestamp_opt'    => $timestamp,
        );

        if ($interests) {
            $request = array_merge($request, array(
                'interests' => array(
                    $interests => true,
                ),
            ));
        }

        $result = $this->mailChimp->post('lists/a7bb2bbc4f/members', $request);
    }

    protected function getMonitoredClass()
    {
        return 'User\Controller\UserController';
    }
}
