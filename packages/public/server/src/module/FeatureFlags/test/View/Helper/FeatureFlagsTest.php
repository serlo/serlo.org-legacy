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
use FeatureFlagsTest\MockSentry;
use PHPUnit\Framework\TestCase;
use Zend\Http\Request;

class FeatureFlagsTest extends TestCase
{
    /** @var MockSentry */
    private $logger;
    /** @var Service */
    private $service;
    /** @var FeatureFlags */
    private $helper;
    /** @var Request */
    private $request;

    public function setUp()
    {
        $this->logger = new MockSentry();
        $this->service = new Service(
            [
                'foo' => true,
                'bar' => false,
            ],
            $this->logger
        );
        $this->request = new Request();
        $this->helper = new FeatureFlags($this->service, $this->request);
    }

    public function testEnabledFeature()
    {
        $this->assertTrue($this->helper->isEnabled('foo'));
    }

    public function testDisabledFunction()
    {
        $this->assertFalse($this->helper->isEnabled('bar'));
    }

    public function testEnabledViaQueryParam()
    {
        $this->request->getQuery()->set('featureFlagBar', '');
        $this->assertTrue($this->helper->isEnabled('bar'));
    }

    public function testEnabledViaCookie()
    {
        $this->request
            ->getHeaders()
            ->addHeaderLine('Cookie', 'feature-flag/bar=');
        $this->assertTrue($this->helper->isEnabled('bar'));
    }
}
