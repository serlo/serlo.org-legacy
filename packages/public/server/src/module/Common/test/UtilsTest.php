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
namespace CommonTest;

use Common\Utils;
use PHPUnit\Framework\TestCase;

class UtilsTest extends TestCase
{
    public function testArrayFlatmap()
    {
        $double = function ($x) {
            return [$x, $x];
        };

        $this->assertEquals(Utils::array_flatmap($double, []), []);
        $this->assertEquals(Utils::array_flatmap($double, [1]), [1, 1]);
        $this->assertEquals(Utils::array_flatmap($double, [1]), [1, 1]);
        $this->assertEquals(Utils::array_flatmap($double, [1, 2]), [
            1,
            1,
            2,
            2,
        ]);
        $this->assertEquals(Utils::array_flatmap($double, ['x', true, 42]), [
            'x',
            'x',
            true,
            true,
            42,
            42,
        ]);
    }

    public function testArrayFlatmapEmptySet()
    {
        $this->assertEquals(Utils::array_flatmap(function () {}, []), []);
    }
}
