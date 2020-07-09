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

namespace CommonTest\Stub\Helper;

use Common\Helper\FetchInterface;
use Error;

class FetchStub implements FetchInterface
{
    /** @var array */
    protected $mocks = [];
    /** @var array */
    protected $requests = [];

    public function fetch($url, $init = [])
    {
        if (array_key_exists($url, $this->mocks)) {
            $response = $this->mocks[$url];
            $this->requests[$url] = $this->getRequestsTo($url);
            array_push($this->requests[$url], $init);
            return $response;
        }

        throw new Error('Unexpected fetch to ' . $url);
    }

    public function init($mocks)
    {
        $this->mocks = $mocks;
        $this->requests = [];
    }

    public function getRequestsTo($url)
    {
        return $this->requests[$url] ?? [];
    }
}
