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

namespace FeatureFlags\View\Helper;

use FeatureFlags\Service;
use Zend\Form\View\Helper\AbstractHelper;
use Zend\Http\Request;

class FeatureFlags extends AbstractHelper
{
    /** @var Service */
    private $service;
    /** @var Request */
    private $request;

    public function __construct(Service $service, Request $request)
    {
        $this->service = $service;
        $this->request = $request;
    }

    public function __invoke()
    {
        return $this;
    }

    /**
     * @param string $feature
     * @return bool
     */
    public function isEnabled(string $feature): bool
    {
        return $this->isEnabledViaQueryParam($feature)
            || $this->isEnabledViaCookie($feature)
            || $this->isEnabledGlobally($feature);
    }

    private function isEnabledViaQueryParam(string $feature): bool
    {
        $queryParamName = 'featureFlag' . ucfirst($feature);
        $queryParamValue = $this->request->getQuery($queryParamName);
        return $queryParamValue !== null;
    }

    private function isEnabledViaCookie(string $feature): bool
    {
        $cookieName = 'feature-flag/' . $feature;
        $cookie = $this->request->getCookie();
        // If no cookie header sent, return false
        if (!$cookie) {
            return false;
        }
        return $cookie->offsetExists($cookieName);
    }

    private function isEnabledGlobally(string $feature): bool
    {
        return $this->service->isEnabled($feature);
    }
}
