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

namespace Markdown\Service;

use Markdown\Exception;
use Zend\Cache\Storage\StorageInterface;

class OryRenderService implements RenderServiceInterface
{
    /**
     * @var string
     */
    protected $url;

    /**
     * @var StorageInterface
     */
    protected $storage;

    /**
     * @param string $url
     * @param StorageInterface $storage
     */
    public function __construct($url, StorageInterface $storage)
    {
        $this->url = $url;
        $this->storage = $storage;
    }

    /**
     * @see \Markdown\Service\RenderServiceInterface::render()
     */
    public function render($input)
    {
        $key = 'editor-renderer-' . hash('sha512', $input);

        if ($this->storage->hasItem($key)) {
            return $this->storage->getItem($key);
        }

        $rendered = null;
        $data = ['state' => $input];

        $httpHeader = [
            'Accept: application/json',
            'Content-Type: application/json',
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        curl_close($ch);

        try {
            $rendered = json_decode($result, true)['html'];
        } catch (Exception $e) {
            throw new Exception\RuntimeException(sprintf('Broken pipe'));
        }

        $this->storage->setItem($key, $rendered);

        return $rendered;
    }
}
