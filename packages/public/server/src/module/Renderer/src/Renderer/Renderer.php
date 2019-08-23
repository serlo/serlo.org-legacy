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

namespace Renderer;

use Exception;
use Renderer\Exception\RuntimeException;
use Renderer\View\Helper\FormatHelper;
use Renderer\View\Helper\FormatHelperAwareTrait;
use Zend\Cache\Storage\StorageInterface;

class Renderer
{
    use FormatHelperAwareTrait;

    /**
     * @var string
     */
    private $editorRendererUrl;

    /**
     * @var string
     */
    private $legacyRendererUrl;

    /**
     * @var StorageInterface
     */
    private $storage;

    /**
     * @var bool
     */
    private $cacheEnabled;

    /**
     * @param string $editorRendererUrl
     * @param string $legacyRendererUrl
     * @param FormatHelper $formatHelper
     * @param StorageInterface $storage
     * @param bool $cacheEnabled
     */
    public function __construct($editorRendererUrl, $legacyRendererUrl, FormatHelper $formatHelper, StorageInterface $storage, $cacheEnabled)
    {
        $this->editorRendererUrl = $editorRendererUrl;
        $this->legacyRendererUrl = $legacyRendererUrl;
        $this->formatHelper = $formatHelper;
        $this->storage = $storage;
        $this->cacheEnabled = $cacheEnabled;
    }

    /**
     * @param string $input
     * @return string
     */
    public function render($input)
    {
        $key = 'renderer/' . hash('sha512', $input);

        if ($this->cacheEnabled && $this->storage->hasItem($key)) {
            return $this->storage->getItem($key);
        }

        $rendered = null;
        $data = ['state' => $input];


        $httpHeader = [
            'Accept: application/json',
            'Content-Type: application/json',
        ];

        $url = $this->getFormatHelper()->isLegacyFormat($input) ? $this->legacyRendererUrl : $this->editorRendererUrl;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        curl_close($ch);

        try {
            $rendered = json_decode($result, true)['html'];
        } catch (Exception $e) {
            throw new RuntimeException(sprintf('Broken pipe'));
        }

        if ($this->cacheEnabled) {
            $this->storage->setItem($key, $rendered);
        }

        return $rendered;
    }
}
