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
namespace Discussion;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Paginator\DoctrinePaginatorFactory;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Discussion\Entity\CommentInterface;
use Discussion\Exception;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Entity\InstanceInterface;
use Taxonomy\Manager\TaxonomyManagerAwareTrait;
use Uuid\Entity\UuidInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\EventManager\EventManagerAwareTrait;
use Zend\Form\FormInterface;
use Zend\Paginator\Adapter\ArrayAdapter;
use Zend\Paginator\Paginator;
use ZfcRbac\Service\AuthorizationService;

use Doctrine\ORM\Query;
use Doctrine\ORM\EntityManager;

class DiscussionManager implements DiscussionManagerInterface
{
    use EventManagerAwareTrait, ObjectManagerAwareTrait;
    use FlushableTrait;
    use ClassResolverAwareTrait, AuthorizationAssertionTrait;

    /**
     * @var string
     */
    protected $serviceInterface = 'Discussion\Service\DiscussionServiceInterface';
    /**
     * @var string
     */
    protected $entityInterface = 'Discussion\Entity\CommentInterface';

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        ObjectManager $objectManager
    ) {
        $this->setAuthorizationService($authorizationService);
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
    }

    public function commentDiscussion(FormInterface $form)
    {
        /* @var $comment Entity\CommentInterface */
        $comment = $this->getClassResolver()->resolve($this->entityInterface);
        $this->bind($comment, $form);

        if ($comment->getParent()->hasParent()) {
            throw new Exception\RuntimeException(sprintf(
                'You are trying to comment on a comment, but only commenting a discussion is allowed (comments have parents whilst discussions do not).'
            ));
        }

        $this->assertGranted('discussion.comment.create', $comment);
        $this->getObjectManager()->persist($comment);
        $this->getEventManager()->trigger(
            'comment',
            $this,
            [
                'author'     => $comment->getAuthor(),
                'comment'    => $comment,
                'discussion' => $comment->getParent(),
                'instance'   => $comment->getInstance(),
                'data'       => $form->getData(),
            ]
        );

        return $comment;
    }

    public function findDiscussionsByInstance(InstanceInterface $instance, $page, $limit = 20)
    {
        $this->assertGranted('discussion.get', $instance);
        $className     = $this->getClassResolver()->resolveClassName($this->entityInterface);
        $voteClassName = $this->getClassResolver()->resolveClassName('Discussion\Entity\VoteInterface');

        $offset = ($page - 1) * $limit;
        /* @var $om EntityManager */
        $om    = $this->objectManager;
        $results = $om->createQueryBuilder()->select('c')->addSelect('SUM(v.vote) AS votes')->from($className, 'c')
            ->leftJoin($voteClassName, 'v', 'WITH', 'v.comment = c')
            ->groupBy('c.id')->addGroupBy('v.comment')->orderBy('c.archived', 'ASC')->addOrderBy('c.date', 'DESC')
            ->addOrderBy('votes', 'DESC')->where('c.instance = :instance_id')->andWhere('c.parent IS NULL')
            ->setParameter('instance_id', $instance->getId())
            // TODO This could cause performance issues
            //->setMaxResults($limit)->setFirstResult($offset)
            ->getQuery()->getResult();

        $purified = [];
        foreach ($results as $result) {
            $purified[] = $result[0];
        }

        $paginator = new Paginator(new ArrayAdapter($purified));
        $paginator->setCurrentPageNumber($page);
        $paginator->setItemCountPerPage($limit);
        return $paginator;
    }


    public function findDiscussionsOn(UuidInterface $uuid, $archived = null)
    {
        $className        = $this->getClassResolver()->resolveClassName($this->entityInterface);
        $objectRepository = $this->getObjectManager()->getRepository($className);
        $criteria         = ['object' => $uuid->getId()];
        if ($archived !== null) {
            $criteria['archived'] = $archived;
        }
        $discussions = $objectRepository->findBy($criteria);

        foreach ($discussions as $discussion) {
            $this->assertGranted('discussion.get', $discussion);
        }

        $collection = new ArrayCollection($discussions);
        return $this->sortDiscussions($collection);
    }

    public function getComment($id)
    {
        $className = $this->getClassResolver()->resolveClassName($this->entityInterface);
        $comment   = $this->getObjectManager()->find($className, $id);

        if (!is_object($comment)) {
            throw new Exception\CommentNotFoundException(sprintf('Could not find a comment by the id of %s', $id));
        }

        $this->assertGranted('discussion.get', $comment);

        return $comment;
    }

    public function getDiscussion($id)
    {
        return $this->getComment($id);
    }

    public function sortDiscussions(Collection $collection)
    {
        $array = $collection->toArray();
        uasort(
            $array,
            function (CommentInterface $a, CommentInterface $b) {
                $votesA = $a->countUpVotes() - $a->countDownVotes();
                $votesB = $b->countUpVotes() - $b->countDownVotes();

                if ($a->getArchived() && !$b->getArchived()) {
                    return 1;
                } elseif (!$a->getArchived() && $b->getArchived()) {
                    return -1;
                }

                if ($votesA == $votesB) {
                    return $a->getId() < $b->getId() ? 1 : -1;
                }

                return $votesA < $votesB ? 1 : -1;
            }
        );
        array_unique($array);
        return new ArrayCollection($array);
    }

    public function startDiscussion(FormInterface $form)
    {
        /* @var $comment Entity\CommentInterface */
        $comment = $this->getClassResolver()->resolve($this->entityInterface);
        $this->bind($comment, $form);

        if ($comment->getObject() instanceof CommentInterface) {
            throw new Exception\RuntimeException(sprintf('You can\'t discuss a comment!'));
        }

        $this->assertGranted('discussion.create', $comment);
        $this->getObjectManager()->persist($comment);
        $this->getEventManager()->trigger(
            'start',
            $this,
            [
                'author'     => $comment->getAuthor(),
                'on'         => $comment->getObject(),
                'discussion' => $comment,
                'instance'   => $comment->getInstance(),
                'data'       => $form->getData(),
            ]
        );

        return $comment;
    }

    public function toggleArchived($commentId)
    {
        $comment = $this->getComment($commentId);
        $this->assertGranted('discussion.archive', $comment);

        if ($comment->hasParent()) {
            throw new Exception\RuntimeException(sprintf('You can\'t archive a comment, only discussions.'));
        }

        $comment->setArchived(!$comment->getArchived());
        $this->getObjectManager()->persist($comment);
        $this->getEventManager()->trigger(
            $comment->getArchived() ? 'archive' : 'restore',
            $this,
            ['discussion' => $comment]
        );
    }

    /**
     * @param CommentInterface $comment
     * @param FormInterface    $form
     * @return CommentInterface
     * @throws Exception\RuntimeException
     */
    protected function bind(CommentInterface $comment, FormInterface $form)
    {
        if (!$form->isValid()) {
            throw new Exception\RuntimeException(print_r($form->getMessages(), true));
        }

        $processForm = clone $form;
        $data        = $form->getData(FormInterface::VALUES_AS_ARRAY);
        $processForm->bind($comment);
        $processForm->setData($data);

        if (!$processForm->isValid()) {
            throw new Exception\RuntimeException($processForm->getMessages());
        }

        return $comment;
    }
}
