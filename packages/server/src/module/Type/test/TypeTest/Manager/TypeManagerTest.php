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
namespace module\Blog\test\BlogTest\Manager;

use AtheneTest\TestCase\AbstractManagerTestCase;
use Doctrine\Common\Collections\ArrayCollection;
use Type\Entity\Type;
use Type\Entity\TypeInterface;
use Type\TypeManager;
use Type\TypeManagerInterface;

class TypeManagerTest extends AbstractManagerTestCase
{
    /**
     * @var TypeManagerInterface
     */
    private $typeManager;

    public function setUp()
    {
        parent::setUp();
        $this->classResolver = $this->mockClassResolver();
        $this->objectManager = $this->mockObjectManager();
        $this->typeManager = new TypeManager($this->classResolver, $this->objectManager);
    }

    public function testFindTypeByNames_OK()
    {
        $names = ["name1","name2"];
        $className = "Type\Entity\Type";
        $types = new ArrayCollection([new Type(),new Type()]);

        $this->prepareResolveClass($this->classResolver, TypeInterface::class, $className);
        $this->prepareFindBy($this->objectManager, $className, ['name' => $names], $types->toArray());

        $this->assertEquals($types, $this->typeManager->findTypesByNames($names));
    }

    public function testFindTypeByName_OK()
    {
        $name = "name";
        $className = "Type\Entity\Type";
        $type = new Type();

        $this->prepareResolveClass($this->classResolver, TypeInterface::class, $className);
        $this->prepareFindOneBy($this->objectManager, $className, ['name' => $name], $type);

        $this->assertEquals($type, $this->typeManager->findTypeByName($name));
    }
}
