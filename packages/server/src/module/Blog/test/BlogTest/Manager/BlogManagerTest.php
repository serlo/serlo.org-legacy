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
use Blog\Entity\Post;
use Blog\Entity\PostInterface;
use Blog\Manager\BlogManager;
use Blog\Manager\BlogManagerInterface;
use Instance\Entity\Instance;
use Instance\Manager\InstanceManagerInterface;
use Taxonomy\Entity\Taxonomy;
use Taxonomy\Entity\TaxonomyTerm;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Zend\Form\FormInterface;

class BlogManagerTest extends AbstractManagerTestCase
{
    /**
     * @var BlogManagerInterface
     */
    private $blogManager;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $taxonomyManager;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $instanceManager;



    public function setUp()
    {
        parent::setUp();
        $this->classResolver = $this->mockClassResolver();
        $this->objectManager = $this->mockObjectManager();
        $this->authorizationService = $this->mockAuthorizationService();
        $this->eventManager = $this->mockEventManager();

        $this->taxonomyManager = $this->createMock(TaxonomyManagerInterface::class);
        $this->instanceManager = $this->createMock(InstanceManagerInterface::class);

        $this->blogManager = new BlogManager($this->classResolver, $this->taxonomyManager, $this->objectManager, $this->instanceManager, $this->authorizationService);
        $this->blogManager->setEventManager($this->eventManager);
    }


    public function testGetBlog_Granted()
    {
        $blog = new TaxonomyTerm();

        $this->taxonomyManager->expects($this->once())
            ->method('getTerm')
            ->with($this->equalTo(1))
            ->will($this->returnValue($blog));
        $this->prepareIsGranted($this->authorizationService, 'blog.get', $blog, true);
        $this->assertEquals($blog, $this->blogManager->getBlog(1));
    }

    /**
     *@expectedException \ZfcRbac\Exception\UnauthorizedException
     */
    public function testGetBlog_NotGranted()
    {
        $blog = new TaxonomyTerm();

        $this->taxonomyManager->expects($this->once())
            ->method('getTerm')
            ->with($this->equalTo(1))
            ->will($this->returnValue($blog));

        $this->prepareIsGranted($this->authorizationService, 'blog.get', $blog, false);
        $this->blogManager->getBlog(1);
    }

    public function testFindAllBlogs_Granted()
    {
        //dummy objects
        $childDummy = new TaxonomyTerm();
        $taxonomyDummy = new Taxonomy();
        $taxonomyDummy->addTerm($childDummy);
        $instanceDummy = new Instance();

        $this->taxonomyManager->expects($this->once())
            ->method('findTaxonomyByName')
            ->with($this->equalTo('blog'), $instanceDummy)
            ->will($this->returnValue($taxonomyDummy));
        $this->prepareIsGranted($this->authorizationService, 'blog.get', $childDummy, true);

        $this->assertEquals($taxonomyDummy->getChildren(), $this->blogManager->findAllBlogs($instanceDummy));
    }

    /**
     *@expectedException \ZfcRbac\Exception\UnauthorizedException
     */
    public function testFindAllBlogs_NotGranted()
    {
        $childDummy = new TaxonomyTerm();
        $taxonomyDummy = new Taxonomy();
        $taxonomyDummy->addTerm($childDummy);
        $instanceDummy = new Instance();

        $this->taxonomyManager->expects($this->once())
            ->method('findTaxonomyByName')
            ->with($this->equalTo('blog'), $instanceDummy)
            ->will($this->returnValue($taxonomyDummy));
        $this->prepareIsGranted($this->authorizationService, 'blog.get', $childDummy, false);
        $this->blogManager->findAllBlogs($instanceDummy);
    }

    public function testGetPost_FoundGranted()
    {
        $repoName = "Blog\Entity\Post";
        $post = new Post();
        $post->setTitle("Post1");

        $this->prepareResolveClass(
            $this->classResolver,
            "Blog\Entity\PostInterface",
            $repoName
        );
        $this->prepareFind($this->objectManager, $repoName, 1, $post);
        $this->prepareIsGranted($this->authorizationService, 'blog.post.get', $post, true);

        $this->assertEquals($post, $this->blogManager->getPost(1));
    }

    /**
     *@expectedException \Blog\Exception\PostNotFoundException
     */
    public function testGetPost_NotFound()
    {
        $repoName = "Blog\Entity\Post";

        $this->prepareResolveClass(
            $this->classResolver,
            PostInterface::class,
            $repoName
        );
        $this->prepareIsGranted($this->authorizationService, 'blog.post.get', null, true);
        $this->prepareFind($this->objectManager, $repoName, 1, null);
        $this->blogManager->getPost(1);
    }

    public function testUpdatePost_Granted_Valid()
    {
        $post = new Post();
        $post->setTitle("Title");

        $form = $this->createMock(FormInterface::class);
        $form->expects($this->once())->method('getObject')->will($this->returnValue($post));
        $form->expects($this->any())->method('isValid')->will($this->returnValue(true));

        $this->prepareIsGranted($this->authorizationService, 'blog.post.update', $post, true);

        //check persist
        $this->objectManager->expects($this->once())->method("persist")->with($this->equalTo($post));
        //check event trigger
        $this->eventManager->expects($this->once())->method("trigger")->with(
            $this->equalTo("update"),
            $this->equalTo($this->blogManager),
            $this->equalTo(['post' => $post])
        );

        $this->blogManager->updatePost($form);
    }

    /**
     *@expectedException \RuntimeException
     */
    public function testUpdatePost_Granted_NotValid()
    {
        $post = new Post();
        $post->setTitle("Title");

        $form = $this->createMock(FormInterface::class);
        $form->expects($this->once())->method('getObject')->will($this->returnValue($post));
        $form->expects($this->any())->method('isValid')->will($this->returnValue(false));
        $this->prepareIsGranted($this->authorizationService, 'blog.post.update', $post, true);
        $this->blogManager->updatePost($form);
    }

    public function testCreatePost_Granted_Valid()
    {
        $post = new Post();
        $post->setTitle("Title");

        $this->prepareResolve(
            $this->classResolver,
            PostInterface::class,
            $post
        );

        $form = $this->createMock(FormInterface::class);
        $form->expects($this->any())->method('isValid')->will($this->returnValue(true));
        $this->prepareIsGranted($this->authorizationService, 'blog.post.create', $post, true);
        //check persist
        $this->objectManager->expects($this->once())->method("persist")->with($this->equalTo($post));
        //check event trigger
        $this->eventManager->expects($this->once())->method("trigger")->with(
            $this->equalTo("create"),
            $this->equalTo($this->blogManager),
            $this->equalTo(['post' => $post])
        );

        $this->blogManager->createPost($form);
    }

    /**
     *@expectedException \RuntimeException
     */
    public function testCreatePost_NotValid()
    {
        $post = new Post();
        $post->setTitle("Title");

        $this->prepareResolve(
            $this->classResolver,
            PostInterface::class,
            $post
        );

        $form = $this->createMock(FormInterface::class);
        $form->expects($this->any())->method('isValid')->will($this->returnValue(false));
        $this->blogManager->createPost($form);
    }
}
