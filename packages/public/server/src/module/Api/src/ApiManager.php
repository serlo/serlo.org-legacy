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

namespace Api;

use Alias\AliasManagerInterface;
use Api\Service\GraphQLService;
use DateTime;
use Discussion\DiscussionManagerInterface;
use Discussion\Entity\CommentInterface;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use License\Entity\LicenseInterface;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

class ApiManager
{
    /** @var AliasManagerInterface */
    protected $aliasManager;
    /** @var DiscussionManagerInterface */
    protected $discussionManager;
    /** @var GraphQLService */
    protected $graphql;

    public function __construct(
        AliasManagerInterface $aliasManager,
        DiscussionManagerInterface $discussionManager,
        GraphQLService $graphql
    ) {
        $this->aliasManager = $aliasManager;
        $this->discussionManager = $discussionManager;
        $this->graphql = $graphql;
    }

    public function getAliasDataForUser(UserInterface $user)
    {
        return [
            'id' => $user->getId(),
            'path' => '/user/profile/' . $user->getUsername(),
            'source' => '/user/profile/' . $user->getId(),
            'timestamp' => $this->normalizeDate($user->getDate()),
        ];
    }

    private function normalizeDate(DateTime $date)
    {
        // Needed because date-times of the initial Athene2 import are set to "0000-00-00 00:00:00"
        if ($date->getTimestamp() < 0) {
            $date->setTimestamp(0);
        }
        return $date->format(DateTime::ATOM);
    }

    public function removeLicense($id)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/license/' . $id),
            null
        );
    }

    public function setLicense(LicenseInterface $license)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/license/' . $license->getId()),
            $this->getLicenseData($license)
        );
    }

    public function getLicenseData(LicenseInterface $license)
    {
        return [
            'id' => $license->getId(),
            'instance' => $license->getInstance()->getSubdomain(),
            'default' => $license->isDefault(),
            'title' => $license->getTitle(),
            'url' => $license->getUrl(),
            'content' => $license->getContent(),
            'agreement' => $license->getAgreement(),
            'iconHref' => $license->getIconHref(),
        ];
    }

    public function removeUuid($id)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/uuid/' . $id),
            null
        );
    }

    public function setUuid(UuidInterface $uuid)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/uuid/' . $uuid->getId()),
            $this->getUuidData($uuid)
        );
    }

    public function getUuidData(UuidInterface $uuid)
    {
        $data = [
            'id' => $uuid->getId(),
            'trashed' => $uuid->getTrashed(),
            'alias' => $this->aliasManager->getAliasOfObject($uuid),
        ];

        if ($uuid instanceof EntityInterface) {
            $data['__typename'] = $this->normalizeType(
                $uuid->getType()->getName()
            );
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['date'] = $this->normalizeDate($uuid->getTimestamp());
            $data['currentRevisionId'] = $uuid->getCurrentRevision()
                ? $uuid->getCurrentRevision()->getId()
                : null;
            $data['revisionIds'] = $this->getRevisionIds($uuid);
            $data['licenseId'] = $uuid->getLicense()
                ? $uuid->getLicense()->getId()
                : null;
            $data['taxonomyTermIds'] = $uuid
                ->getTaxonomyTerms()
                ->map(function (TaxonomyTermInterface $term) {
                    return $term->getId();
                })
                ->toArray();

            $parentIds = $uuid
                ->getParents('link')
                ->map(function (EntityInterface $parent) {
                    return $parent->getId();
                })
                ->toArray();
            if (count($parentIds) > 0) {
                $data['parentId'] = $parentIds[0];
            }

            if ($data['__typename'] === 'Course') {
                $data['pageIds'] = $uuid
                    ->getChildren('link')
                    ->map(function (EntityInterface $child) {
                        return $child->getId();
                    })
                    ->toArray();
            }
            if ($data['__typename'] === 'ExerciseGroup') {
                $data['exerciseIds'] = $uuid
                    ->getChildren('link')
                    ->map(function (EntityInterface $child) {
                        return $child->getId();
                    })
                    ->toArray();
            }

            if (
                $data['__typename'] === 'Exercise' ||
                $data['__typename'] === 'GroupedExercise'
            ) {
                $solutionIds = $uuid
                    ->getChildren('link')
                    ->filter(function (EntityInterface $child) {
                        return $child->getType()->getName() === 'text-solution';
                    })
                    ->map(function (EntityInterface $child) {
                        return $child->getId();
                    })
                    ->toArray();
                $data['solutionId'] =
                    count($solutionIds) > 0
                        ? array_values($solutionIds)[0]
                        : null;
            }
        }

        if ($uuid instanceof RevisionInterface) {
            $data['date'] = $this->normalizeDate($uuid->getTimestamp());
            $data['authorId'] = $uuid->getAuthor()->getId();
            /** @var EntityInterface $entity */
            $entity = $uuid->getRepository();
            $data['__typename'] =
                $this->normalizeType($entity->getType()->getName()) .
                'Revision';
            $data['repositoryId'] = $entity->getId();

            if ($data['__typename'] === 'AppletRevision') {
                $data['url'] = $uuid->get('url', '');
                $data['title'] = $uuid->get('title', '');
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
                $data['metaTitle'] = $uuid->get('meta_title', '');
                $data['metaDescription'] = $uuid->get('meta_description', '');
            } elseif ($data['__typename'] === 'ArticleRevision') {
                $data['title'] = $uuid->get('title', '');
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
                $data['metaTitle'] = $uuid->get('meta_title', '');
                $data['metaDescription'] = $uuid->get('meta_description', '');
            } elseif ($data['__typename'] === 'CourseRevision') {
                $data['title'] = $uuid->get('title', '');
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
                $data['metaDescription'] = $uuid->get('meta_description', '');
            } elseif ($data['__typename'] === 'CoursePageRevision') {
                $data['title'] = $uuid->get('title', '');
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
            } elseif ($data['__typename'] === 'EventRevision') {
                $data['title'] = $uuid->get('title', '');
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
                $data['metaTitle'] = $uuid->get('meta_title', '');
                $data['metaDescription'] = $uuid->get('meta_description', '');
            } elseif ($data['__typename'] === 'ExerciseRevision') {
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
            } elseif ($data['__typename'] === 'ExerciseGroupRevision') {
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
            } elseif ($data['__typename'] === 'GroupedExerciseRevision') {
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
            } elseif ($data['__typename'] === 'SolutionRevision') {
                $data['content'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
            } elseif ($data['__typename'] === 'VideoRevision') {
                $data['title'] = $uuid->get('title', '');
                $data['content'] = $uuid->get('description', '');
                $data['url'] = $uuid->get('content', '');
                $data['changes'] = $uuid->get('changes', '');
            }
        }

        if ($uuid instanceof PageRepositoryInterface) {
            if (!$uuid->getCurrentRevision()) {
                return null;
            }
            $data['__typename'] = 'Page';
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['currentRevisionId'] = $uuid->getCurrentRevision()->getId();
            $data['revisionIds'] = array_reverse($this->getRevisionIds($uuid));
            $data['date'] = $this->normalizeDate(
                $uuid
                    ->getRevisions()
                    ->first()
                    ->getTimestamp()
            );
            $data['licenseId'] = $uuid->getLicense()->getId();
        }

        if ($uuid instanceof PageRevisionInterface) {
            $data['__typename'] = 'PageRevision';
            $data['title'] = $uuid->getTitle();
            $data['content'] = $uuid->getContent();
            $data['date'] = $this->normalizeDate($uuid->getTimestamp());
            $data['authorId'] = $uuid->getAuthor()->getId();
            $data['repositoryId'] = $uuid->getRepository()->getId();
        }

        if ($uuid instanceof UserInterface) {
            $data['__typename'] = 'User';
            $data['username'] = $uuid->getUsername();
            $data['date'] = $this->normalizeDate($uuid->getDate());
            $data['lastLogin'] = $uuid->getLastLogin()
                ? $this->normalizeDate($uuid->getLastLogin())
                : null;
            $data['description'] = $uuid->getDescription();
        }

        if ($uuid instanceof CommentInterface) {
            $data['__typename'] = 'Comment';
            $data['authorId'] = $uuid->getAuthor()->getId();
            $data['title'] = $uuid->getTitle();
            $data['date'] = $this->normalizeDate($uuid->getTimestamp());
            $data['archived'] = $uuid->getArchived();
            $data['content'] = $uuid->getContent();
            if ($uuid->hasParent()) {
                $data['parentId'] = $uuid->getParent()->getId();
            } else {
                $data['parentId'] = $uuid->getObject()->getId();
            }
            $data['childrenIds'] = array_map(function ($comment) {
                return $comment->getId();
            }, $uuid->getChildren()->toArray());
        }

        if ($uuid instanceof TaxonomyTermInterface) {
            $data['__typename'] = 'TaxonomyTerm';
            $data['type'] = $this->toCamelCase($uuid->getType()->getName());
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['name'] = $uuid->getName();
            $data['description'] = $uuid->getDescription();

            $weight = $uuid->getPosition();
            $data['weight'] = isset($weight) ? $weight : 0;

            $parent = $uuid->getParent();
            $data['parentId'] = isset($parent) ? $parent->getId() : null;

            $associated = $uuid
                ->getAssociated('entities')
                ->map(function (UuidInterface $uuid) {
                    return $uuid->getId();
                })
                ->toArray();
            $children = $uuid
                ->getChildren()
                ->map(function (TaxonomyTermInterface $uuid) {
                    return $uuid->getId();
                })
                ->toArray();
            $data['childrenIds'] = array_merge($associated, $children);
        }

        return $data;
    }

    public function setThreads(UuidInterface $uuid)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/threads/' . $uuid->getId()),
            $this->getThreadsData($uuid)
        );
    }

    public function getThreadsData(UuidInterface $uuid)
    {
        $threads = $this->discussionManager->findDiscussionsOn($uuid);
        $threadIds = array_map(function ($thread) {
            return $thread->getId();
        }, $threads->toArray());
        return [
            // Sort threads from most to least recent
            'firstCommentIds' => array_reverse($threadIds),
        ];
    }

    private function getRevisionIds($uuid)
    {
        return $uuid
            ->getRevisions()
            ->map(function ($revision) {
                return $revision->getId();
            })
            ->toArray();
    }

    private function normalizeType($type)
    {
        $type = str_replace('text-', '', $type);
        return $this->toPascalCase($type);
    }

    private function toPascalCase($value)
    {
        $segments = explode('-', $value);
        return implode(
            '',
            array_map(function ($segment) {
                return strtoupper($segment[0]) . substr($segment, 1);
            }, $segments)
        );
    }

    private function toCamelCase($value)
    {
        $segments = explode('-', $value);
        $firstSegment = $segments[0];
        $remainingSegments = array_slice($segments, 1);
        return implode(
            '',
            array_merge(
                [$firstSegment],
                array_map(function ($segment) {
                    return strtoupper($segment[0]) . substr($segment, 1);
                }, $remainingSegments)
            )
        );
    }
}
