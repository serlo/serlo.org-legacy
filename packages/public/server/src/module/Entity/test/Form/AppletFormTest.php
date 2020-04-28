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
namespace EntityTest\Form;

use PHPUnit\Framework\TestCase;
use Entity\Form\AppletForm;
use License\Entity\LicenseInterface;

class AppletFormTest extends TestCase
{
    private $appletForm;

    public function setUp()
    {
        parent::setUp();
        $license = $this->createMock(LicenseInterface::class);
        $this->appletForm  = new AppletForm($license);
    }

    public function testUrlElement()
    {
        $urlFilter = $this->appletForm->getInputFilter()->get("url");

        $validUrls = ["https://www.geogebra.org/m/2440601", "2440601", "aAZYthn93", "09azAZ"];

        foreach ($validUrls as $url) {
            $urlFilter->setValue($url);

            $this->assertTrue($urlFilter->isValid(), sprintf("URL `%s` should be accepted.", $url));
        }

        $invalidUrls = ["", "http://www.geogebra.org/m/2440601", "https://geogebra.org/m/2440601",
                        "https://ggbm.at/2440601", "azz aaa", "/123",
                        "https://www.geogebra.org/m/YdT/", "$5f", ];

        foreach ($invalidUrls as $url) {
            $urlFilter->setValue($url);

            $this->assertFalse(
                $urlFilter->isValid(),
                sprintf("Invalid URL `%s` should not be accepted.", $url)
            );
        }
    }
}
