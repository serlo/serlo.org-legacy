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

use Doctrine\ORM\Mapping as ORM;
use User\Entity\UserInterface;

/**
 * Comment vote ORM Entity
 *
 * @ORM\Entity
 * @ORM\Table(name="comment_vote")
 */
class Vote implements VoteInterface
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id = "asdf";

    /**
     * @ORM\ManyToOne(targetEntity="User\Entity\User")
     */
    protected $user;

    /**
     * @ORM\ManyToOne(targetEntity="Comment", inversedBy="votes")
     */
    protected $comment;

    /**
     * @ORM\Column(type="integer")
     */
    protected $vote;

    public function getVote()
    {
        return $this->vote;
    }

    public function setVote($vote)
    {
        $this->vote = $vote;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getComment()
    {
        return $this->comment;
    }

    public function setUser(UserInterface $user)
    {
        $this->user = $user;
    }

    public function setComment(CommentInterface $comment)
    {
        $this->comment = $comment;
    }
}
