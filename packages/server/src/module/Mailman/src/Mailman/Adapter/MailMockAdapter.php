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
use Zend\Cache\Storage\StorageInterface;

class MailMockAdapter implements AdapterInterface
{
    protected static $instance;

    /**
     * @var StorageInterface
     */
    protected $storage;

    protected $queueKey = ':QUEUE:';
    protected $flushedKey = ':FLUSHED:';



    public function __construct(StorageInterface $storage)
    {
        if (self::$instance) {
            throw new Exception\RuntimeException('MailMockAdapter does not allow multiple instances');
        }

        self::$instance    = $this;
        $this->storage = $storage;
        if (! $this->storage->hasItem($this->queueKey)) {
            $this->storage->setItem($this->queueKey, []);
        }
        if (! $this->storage->hasItem($this->flushedKey)) {
            $this->storage->setItem($this->flushedKey, []);
        }
    }

    public function addMail($to, $from, $mail)
    {
        $queue = $this->storage->getItem($this->queueKey);
        $queue[] = [
            'to' => $to,
            'from' => $from,
            'mail' => [
                'subject' => $mail->getSubject(),
                'body' => $mail->getHtmlBody(),
                'plain' => $mail->getPlainBody(),
            ],
        ];
        $this->storage->setItem($this->queueKey, $queue);
    }

    public function flush()
    {
        $currentQueue = $this->storage->getItem($this->queueKey);
        $this->storage->setItem($this->flushedKey, $currentQueue);
        $this->storage->setItem($this->queueKey, []);
    }

    public function clear()
    {
        $this->storage->setItem($this->queueKey, []);
        $this->storage->setItem($this->flushedKey, []);
    }

    public function getQueue()
    {
        return $this->storage->getItem($this->queueKey);
    }

    public function getFlushed()
    {
        return $this->storage->getItem($this->flushedKey);
    }
}
