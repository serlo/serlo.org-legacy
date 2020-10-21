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
use Alias\Entity\AliasInterface;
use Api\Service\GraphQLService;
use Common\Traits\ObjectManagerAwareTrait;
use DateTime;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Instance\Entity\InstanceInterface;
use License\Entity\LicenseInterface;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Throwable;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

class ApiManager
{
    /** @var AliasManagerInterface */
    protected $aliasManager;
    /** @var GraphQLService */
    protected $graphql;

    use ObjectManagerAwareTrait;

    public function __construct(
        AliasManagerInterface $aliasManager,
        GraphQLService $graphql
    ) {
        $this->aliasManager = $aliasManager;
        $this->graphql = $graphql;
    }

    public function setAlias(AliasInterface $alias)
    {
        $value = $this->getAliasData($alias);
        $cleanPath = str_replace('%2F', '/', urlencode($value['path']));
        $this->graphql->setCache(
            $this->graphql->getCacheKey(
                '/api/alias/' . $cleanPath,
                $alias->getInstance()->getSubdomain()
            ),
            $value
        );
    }

    public function getAliasData(AliasInterface $alias)
    {
        return [
            'id' => $alias->getObject()->getId(),
            'instance' => $alias->getInstance()->getSubdomain(),
            'path' => '/' . $alias->getAlias(),
            'source' => $alias->getSource(),
            'timestamp' => $this->normalizeDate($alias->getTimestamp()),
        ];
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
        try {
            $alias =
                '/' .
                $this->aliasManager
                    ->findAliasByObject($uuid, false)
                    ->getAlias();
        } catch (Throwable $e) {
            $alias = null;
        }

        $data = [
            'id' => $uuid->getId(),
            'trashed' => $uuid->getTrashed(),
            'alias' => $alias,
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

    public function getEventsData(array $options, int $limit)
    {
        $returnLastElements = false;
        $generalConditions = [];

        if (array_key_exists('userId', $options)) {
            $generalConditions[] = 'actor_id = ' . $options['userId'];
        }
        if (array_key_exists('uuid', $options)) {
            $generalConditions[] = 'uuid_id = ' . $options['uuid'];
        }

        $idConditions = $generalConditions;

        if (array_key_exists('after', $options)) {
            $idConditions[] = 'id > ' . $options['after'];
        }
        if (array_key_exists('before', $options)) {
            $idConditions[] = 'id < ' . $options['before'];
            $returnLastElements = true;
        }
        if (array_key_exists('first', $options)) {
            $limit = min($limit, intval($options['first']));
        }
        if (array_key_exists('last', $options)) {
            $limit = min($limit, intval($options['last']));
            $returnLastElements = true;
        }

        $sqlIds =
            'SELECT id FROM event_log ' .
            $this->toWhereClause($idConditions) .
            'ORDER BY id ' .
            ($returnLastElements ? 'DESC ' : '') .
            'LIMIT ' .
            ($limit + 1);
        $ids = array_map(function ($x) {
            return intval($x['id']);
        }, $this->executeSql($sqlIds));
        $ids = $returnLastElements ? array_reverse($ids) : $ids;

        return [
            'eventIds' => array_slice($ids, 0, $limit),
            'hasNext' => count($ids) > $limit,
        ];
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

    private function executeSql($sql)
    {
        $query = $this->objectManager->getConnection()->prepare($sql);
        $query->execute();
        return $query->fetchAll();
    }

    private function toWhereClause(array $conditions)
    {
        return $conditions ? 'WHERE ' . join(' AND ', $conditions) . ' ' : '';
    }
}
