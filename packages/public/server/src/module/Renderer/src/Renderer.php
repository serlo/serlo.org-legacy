<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Renderer;

use Exception;
use FeatureFlags\Service as FeatureFlagsService;
use Instance\Manager\InstanceManagerInterface;
use Raven_Client;
use Renderer\Exception\RuntimeException;
use Renderer\View\Helper\FormatHelper;
use Renderer\View\Helper\FormatHelperAwareTrait;
use Zend\Cache\Storage\StorageInterface;

class Renderer
{
    use FormatHelperAwareTrait;

    /** @var InstanceManagerInterface */
    protected $instanceManager;

    /** @var FeatureFlagsService */
    protected $featureFlags;

    /** @var string */
    protected $editorRendererUrl;

    /** @var string */
    protected $legacyRendererUrl;

    /** @var StorageInterface */
    protected $storage;

    /** @var bool */
    protected $cacheEnabled;

    /** @var Raven_Client */
    protected $sentry;

    /**
     * @param InstanceManagerInterface $instanceManager
     * @param FeatureFlagsService $featureFlags
     * @param string $editorRendererUrl
     * @param string $legacyRendererUrl
     * @param FormatHelper $formatHelper
     * @param StorageInterface $storage
     * @param bool $cacheEnabled
     * @param Raven_Client $sentry
     */
    public function __construct(
        InstanceManagerInterface $instanceManager,
        FeatureFlagsService $featureFlags,
        $editorRendererUrl,
        $legacyRendererUrl,
        FormatHelper $formatHelper,
        StorageInterface $storage,
        $cacheEnabled,
        Raven_Client $sentry
    ) {
        $this->instanceManager = $instanceManager;
        $this->featureFlags = $featureFlags;
        $this->editorRendererUrl = $editorRendererUrl;
        $this->legacyRendererUrl = $legacyRendererUrl;
        $this->formatHelper = $formatHelper;
        $this->storage = $storage;
        $this->cacheEnabled = $cacheEnabled;
        $this->sentry = $sentry;
    }

    /**
     * @param string $state
     * @return string
     */
    public function render($state)
    {
        $data = [
            'state' => $state,
            'language' => $this->instanceManager
                ->getInstanceFromRequest()
                ->getLanguage()
                ->getCode(),
        ];

        $key = 'renderer/' . hash('sha512', json_encode($data));

        if ($this->cacheEnabled && $this->storage->hasItem($key)) {
            return $this->storage->getItem($key);
        }

        $rendered = null;

        $httpHeader = [
            'Accept: application/json',
            'Content-Type: application/json',
        ];

        $url = $this->getFormatHelper()->isLegacyFormat($state)
            ? $this->legacyRendererUrl
            : $this->editorRendererUrl;

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
            if ($this->getFormatHelper()->isLegacyFormat($state)) {
                $rendered .= '<div class="requires-mathjax"></div>';
            }
        } catch (Exception $e) {
            $this->sentry->captureException($e, [
                'tags' => ['renderer' => true],
            ]);
            throw new RuntimeException(sprintf('Broken pipe'));
        }

        if ($this->cacheEnabled) {
            $this->storage->setItem($key, $rendered);
        }

        return $rendered;
    }
}
