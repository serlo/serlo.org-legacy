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
namespace BlogTest\Entity;

use AtheneTest\TestCase\AbstractGetterSetterTestCase;
use Blog\Entity\Post;
use DateTime;
use Exception;

class PostTest extends AbstractGetterSetterTestCase
{
    private $post;

    public function setUp()
    {
        parent::setUp();
        $this->post  = new Post();
        parent::setObject($this->post);
    }

    protected function getData()
    {
        return array(
            "author" => $this->createMock("User\Entity\UserInterface"),
            "blog" => $this->createMock("Taxonomy\Entity\TaxonomyTermInterface"),
            "title" => "title",
            "content" => "content",
            "timestamp" => new DateTime(),
            "publish" => new DateTime(),

        );
    }

    public function testIsPublished()
    {
        $post = new Post();
        //set DateTime in past
        $post->setPublish(new Datetime("2000-03-14"));
        $this->assertTrue($post->isPublished());
    }

    public function testAddTaxonomyTerm()
    {
        $post = new Post();
        $taxTerm = $this->createMock("Taxonomy\Entity\TaxonomyTermInterface");
        $post->addTaxonomyTerm($taxTerm);
        $this->assertSame($taxTerm, $post->getBlog());
    }

    public function testRemoveTaxonomyTerm()
    {
        $post = new Post();

        //test for unimplemented method -> exception
        $this->expectException(Exception::class);
        $post->removeTaxonomyTerm($this->createMock("Taxonomy\Entity\TaxonomyTermInterface"));
    }
}
