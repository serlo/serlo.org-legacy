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

namespace Frontend;

use FeatureFlags\Service as FeatureFlagsService;
use KeyValueStore\KeyValueStore;

class RenderComponentService
{
    private $featureFlags;
    private $store;
    private $url;

    public function __construct(string $url, KeyValueStore $store, FeatureFlagsService $featureFlags)
    {
        $this->featureFlags = $featureFlags;
        $this->store = $store;
        $this->url = $url;
    }

    public function render(string $component, array $props = [], string $key = null)
    {
        $cacheKey = isset($key) ? 'frontend/' . $component . '/' . $key : null;
        if ($this->featureFlags->isEnabled('key-value-store')) {
            if (isset($cacheKey) && $this->store->exists($cacheKey)) {
                return $this->store->get($cacheKey);
            }
        }

        $ch = curl_init();
        $data = array_merge(
            $props,
            ['key' => 'secret']
        );

        $httpHeader = array(
            'Accept: text/html',
            'Content-Type: application/json',
        );
        curl_setopt($ch, CURLOPT_URL, $this->url . '/__' . $component);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        curl_close($ch);

        $value = '<div class="next">' . str_replace('<!DOCTYPE html>', '', $result) . '</div>';

        if ($this->featureFlags->isEnabled('key-value-store')) {
            if (isset($cacheKey)) {
                $this->store->set($cacheKey, $value);
            }
        }

        return $value;
    }
}
