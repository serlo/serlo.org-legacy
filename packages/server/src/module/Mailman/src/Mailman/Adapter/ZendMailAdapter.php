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
namespace Mailman\Adapter;

use Mailman\Exception;
use StrokerCache\Strategy\Controller;
use Zend\Mail\Header\ContentType;
use Zend\Mail\Message;
use Zend\Mail\Transport\Smtp;
use Zend\Mail\Transport\SmtpOptions;
use Zend\Mime\Message as MimeMessage;
use Zend\Mime\Part as MimePart;

class ZendMailAdapter implements AdapterInterface
{
    /**
     * @var ZendMailAdapter
     */
    private static $instance;

    /**
     * @var SmtpOptions
     */
    protected $smtpOptions;

    /**
     * @var array
     */
    protected $queue = [];

    /**
     * @var Smtp
     */
    protected $transport;

    public function __construct(SmtpOptions $smtpOptions)
    {
        if (self::$instance) {
            throw new Exception\RuntimeException('ZendMailAdapter does not allow multiple instances');
        }

        self::$instance    = $this;
        $this->smtpOptions = $smtpOptions;
        $this->queue       = [];
        $this->transport   = new Smtp();
    }

    public function addMail($to, $from, $mail)
    {
        $message              = new Message();
        $bodyPart             = new MimeMessage();
        $bodyHtmlMessage          = new MimePart($mail->getHtmlBody());
        $bodyHtmlMessage->type    = 'text/html';
        $bodyHtmlMessage->charset = 'UTF-8';

        $bodyTextMessage          = new MimePart($mail->getPlainBody());
        $bodyTextMessage->type    = 'text/plain';
        $bodyTextMessage->charset = 'UTF-8';

        $bodyPart->setParts([$bodyHtmlMessage, $bodyTextMessage]);
        $message->setFrom($from);
        $message->addTo($to);
        $message->setEncoding("UTF-8");
        $message->setSubject($mail->getSubject());
        $message->setBody($bodyPart);

        $message->getHeaders()->get('content-type')->setType('multipart/alternative');
        $this->queue[] = $message;
    }

    public function flush()
    {
        $this->transport->setOptions($this->getSmtpOptions());
        foreach ($this->queue as $message) {
            $this->transport->send($message);
        }
        $this->queue = [];
    }

    /**
     * @return \Zend\Mail\Transport\SmtpOptions $smtpOptions
     */
    public function getSmtpOptions()
    {
        return $this->smtpOptions;
    }
}
