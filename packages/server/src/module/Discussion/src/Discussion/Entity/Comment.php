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
namespace Discussion\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use Taxonomy\Entity\TaxonomyTermInterface;
use Taxonomy\Entity\TaxonomyTermNodeInterface;
use User\Entity\UserInterface;
use Uuid\Entity\Uuid;
use Uuid\Entity\UuidInterface;

/**
 * Comment ORM Entity
 *
 * @ORM\Entity
 * @ORM\Table(name="comment")
 */
class Comment extends Uuid implements CommentInterface
{
    use InstanceAwareTrait;

    /**
     * @ORM\ManyToOne(targetEntity="Uuid\Entity\Uuid", inversedBy="opinions")
     * @ORM\JoinColumn(name="uuid_id", referencedColumnName="id")
     */
    protected $object;

    /**
     * @ORM\ManyToOne(targetEntity="Comment", inversedBy="children", cascade={"remove"})
     */
    protected $parent;

    /**
     * @ORM\OneToMany(targetEntity="Comment", mappedBy="parent")
     */
    protected $children;

    /**
     * @ORM\OneToMany(targetEntity="Vote", mappedBy="comment", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    protected $votes;

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     */
    protected $author;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    protected $date;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $archived;

    /**
     * @ORM\Column(type="string")
     */
    protected $title;

    /**
     * @ORM\Column(type="string")
     */
    protected $content;

    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->votes    = new ArrayCollection();
        $this->terms    = new ArrayCollection();
        $this->archived = false;
    }

    public function isDiscussion()
    {
        return !is_object($this->parent);
    }

    public function hasParent()
    {
        return is_object($this->parent);
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function setParent(CommentInterface $comment)
    {
        $this->parent = $comment;
    }

    public function getArchived()
    {
        return $this->archived;
    }

    public function setArchived($archived)
    {
        $this->archived = $archived;
    }

    public function getObject()
    {
        return $this->object;
    }

    public function setObject(UuidInterface $uuid)
    {
        $this->object = $uuid;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor(UserInterface $author)
    {
        $this->author = $author;
    }

    public function getTimestamp()
    {
        return $this->date;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function getChildren()
    {
        return $this->children;
    }

    public function addChild(CommentInterface $comment)
    {
        $this->children->add($comment);
    }

    public function countUpVotes()
    {
        $collection = $this->votes->filter(
            function (VoteInterface $v) {
                return $v->getVote() === 1;
            }
        );
        return $collection->count();
    }

    public function getVotes()
    {
        return $this->votes;
    }

    public function countDownVotes()
    {
        $collection = $this->votes->filter(
            function (VoteInterface $v) {
                return $v->getVote() === -1;
            }
        );
        return $collection->count();
    }

    public function upVote(UserInterface $user)
    {
        if ($this->findVotesByUser($user)->count()) {
            return false;
        }

        $this->createVote($user, 1);
        return true;
    }

    public function downVote(UserInterface $user)
    {
        if ($this->findVotesByUser($user)->count() === 0) {
            return false;
        }
        $element = $this->findVotesByUser($user)->current();
        $this->getVotes()->removeElement($element);
        return true;
    }

    public function hasUserVoted(UserInterface $user)
    {
        return $this->findVotesByUser($user)->count() === 1;
    }

    public function addTaxonomyTerm(TaxonomyTermInterface $taxonomyTerm, TaxonomyTermNodeInterface $node = null)
    {
        $this->terms->add($taxonomyTerm);
    }

    public function removeTaxonomyTerm(TaxonomyTermInterface $taxonomyTerm, TaxonomyTermNodeInterface $node = null)
    {
        $this->terms->removeElement($taxonomyTerm);
    }

    public function getTaxonomyTerms()
    {
        return $this->terms;
    }

    protected function findVotesByUser(UserInterface $user)
    {
        $criteria = Criteria::create()->where(Criteria::expr()->eq('user', $user))->setFirstResult(0)->setMaxResults(1);
        return $this->getVotes()->matching($criteria);
    }

    protected function createVote(UserInterface $user, $vote)
    {
        $entity = new Vote();
        $entity->setUser($user);
        $entity->setVote($vote);
        $entity->setComment($this);
        $this->getVotes()->add($entity);
        return $entity;
    }
}
