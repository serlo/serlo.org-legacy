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
namespace ClassResolverTest;

use ClassResolver\ClassResolver;
use ClassResolverTest\Fake\Foo;
use PHPUnit\Framework\TestCase;
use Zend\ServiceManager\ServiceManager;

class ClassResolverTest extends TestCase
{
    protected $classResolver;
    protected $serviceLocatorMock;

    public function setUp()
    {
        parent::setUp();

        $this->classResolver = new ClassResolver([
            'ClassResolverTest\Fake\FailInterface'      => 'ClassResolverTest\Fake\Foo',
            'ClassResolverTest\Fake\FooInterface'       => 'ClassResolverTest\Fake\Foo',
            'ClassResolverTest\Fake\BarInterface'       => 'ClassResolverTest\Fake\Bar',
            'ClassResolverTest\Fake\SuperFailInterface' => 'ClassResolverTest\Fake\SuperFail',
        ]);
    }

    public function testResolveClassName()
    {
        $this->assertEquals(
            'ClassResolverTest\Fake\Foo',
            $this->classResolver->resolveClassName('ClassResolverTest\Fake\FooInterface')
        );
        $this->assertEquals(
            'ClassResolverTest\Fake\Bar',
            $this->classResolver->resolveClassName('ClassResolverTest\Fake\BarInterface')
        );
    }

    public function testResolve()
    {
        $this->assertInstanceOf(
            'ClassResolverTest\Fake\FooInterface',
            $this->classResolver->resolve('ClassResolverTest\Fake\FooInterface')
        );
        $this->assertNotSame(
            $this->classResolver->resolve('ClassResolverTest\Fake\FooInterface'),
            $this->classResolver->resolve('ClassResolverTest\Fake\FooInterface')
        );
    }

    public function testResolveFromServiceManager()
    {
        $serviceManager = new ServiceManager();
        $service        = new Foo();

        $serviceManager->setService('ClassResolverTest\Fake\Foo', $service);
        $this->classResolver->setServiceLocator($serviceManager);

        $this->assertSame($service, $this->classResolver->resolve('ClassResolverTest\Fake\FooInterface', true));
    }

    /**
     * @expectedException \ClassResolver\Exception\RuntimeException
     */
    public function testResolveException()
    {
        $this->classResolver->resolve('ClassResolverTest\Fake\FailInterface');
    }

    /**
     * @expectedException \ClassResolver\Exception\InvalidArgumentException
     */
    public function testInvalidArgumentException()
    {
        $this->classResolver->resolveClassName([]);
    }

    /**
     * @expectedException \ClassResolver\Exception\RuntimeException
     */
    public function testClassNotFound()
    {
        $this->classResolver->resolveClassName('ClassResolverTest\Fake\SuperFailInterface');
    }

    /**
     * @expectedException \ClassResolver\Exception\RuntimeException
     */
    public function testNotResolvable()
    {
        $this->classResolver->resolveClassName('NotResolvable');
    }
}
