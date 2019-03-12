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
namespace FeatureFlags;

use PHPUnit\Framework\TestCase;

class MockSentry implements ServiceLoggerInterface
{
    public $lastMessage;

    public function captureMessage(string $msg, array $params)
    {
        $this->lastMessage = vsprintf($msg, $params);
    }
}

class PostTest extends TestCase
{
    /**
     * @var MockSentry
     */
    private $logger;
    private $service;

    public function setUp()
    {
        $this->logger = new MockSentry();
        $this->service = new Service([
            'foo' => true,
            'bar' => false,
        ], $this->logger);
    }

    public function testEnabledFeature()
    {
        $this->assertTrue($this->service->isEnabled('foo'));
    }

    public function testDisabledFunction()
    {
        $this->assertFalse($this->service->isEnabled('bar'));
    }

    public function testMissingFunction()
    {
        $this->assertFalse($this->service->isEnabled('foobar'));
        $this->assertEquals('No configuration found for feature flag "foobar"', $this->logger->lastMessage);
    }
}
