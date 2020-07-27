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
use DateTime;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Exception;
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
    /** @var GraphQLService */
    protected $graphql;

    public function __construct(
        AliasManagerInterface $aliasManager,
        GraphQLService $graphql
    ) {
        $this->aliasManager = $aliasManager;
        $this->graphql = $graphql;
    }

    public function setAlias(AliasInterface $alias)
    {
        $query = <<<MUTATION
            mutation setAlias(
                \$id: Int!
                \$instance: Instance!
                \$path: String!
                \$source: String!
                \$timestamp: DateTime!
            ) {
                _setAlias(
                    id: \$id
                    instance: \$instance
                    path: \$path
                    source: \$source
                    timestamp: \$timestamp
                )
            }
MUTATION;
        $this->graphql->exec($query, $this->getAliasData($alias));
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
        $query = <<<MUTATION
            mutation removeLicense(\$id: Int!) {
                _removeLicense(id: \$id)
            }
MUTATION;
        $this->graphql->exec($query, ['id' => $id]);
    }

    public function setLicense(LicenseInterface $license)
    {
        $query = <<<MUTATION
            mutation setLicense(
                \$id: Int!
                \$instance: Instance!
                \$default: Boolean!
                \$title: String!
                \$url: String!
                \$content: String!
                \$agreement: String!
                \$iconHref: String!
            ) {
                _setLicense(
                    id: \$id
                    instance: \$instance
                    default: \$default
                    title: \$title
                    url: \$url
                    content: \$content
                    agreement: \$agreement
                    iconHref: \$iconHref
                )
            }
MUTATION;
        $this->graphql->exec($query, $this->getLicenseData($license));
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
        $query = <<<MUTATION
            mutation removeUuid(\$id: Int!) {
                _removeUuid(id: \$id)
            }
MUTATION;
        $this->graphql->exec($query, ['id' => $id]);
    }

    public function setUuid(UuidInterface $uuid)
    {
        if ($uuid instanceof EntityInterface) {
            $type = $this->normalizeType($uuid->getType()->getName());

            if ($type === 'applet') {
                $this->setApplet($uuid);
            } elseif ($type === 'article') {
                $this->setArticle($uuid);
            } elseif ($type === 'course') {
                $this->setCourse($uuid);
            } elseif ($type === 'coursePage') {
                $this->setCoursePage($uuid);
            } elseif ($type === 'event') {
                $this->setEvent($uuid);
            } elseif ($type === 'exercise') {
                $this->setExercise($uuid);
            } elseif ($type === 'exerciseGroup') {
                $this->setExerciseGroup($uuid);
            } elseif ($type === 'groupedExercise') {
                $this->setGroupedExercise($uuid);
            } elseif ($type === 'solution') {
                $this->setSolution($uuid);
            } elseif ($type === 'video') {
                $this->setVideo($uuid);
            }
        }

        if ($uuid instanceof RevisionInterface) {
            /** @var EntityInterface $entity */
            $entity = $uuid->getRepository();
            $type = $this->normalizeType($entity->getType()->getName());

            if ($type === 'applet') {
                $this->setAppletRevision($uuid);
            } elseif ($type === 'article') {
                $this->setArticleRevision($uuid);
            } elseif ($type === 'course') {
                $this->setCourseRevision($uuid);
            } elseif ($type === 'coursePage') {
                $this->setCoursePageRevision($uuid);
            } elseif ($type === 'event') {
                $this->setEventRevision($uuid);
            } elseif ($type === 'exercise') {
                $this->setExerciseRevision($uuid);
            } elseif ($type === 'exerciseGroup') {
                $this->setExerciseGroupRevision($uuid);
            } elseif ($type === 'groupedExercise') {
                $this->setGroupedExerciseRevision($uuid);
            } elseif ($type === 'solution') {
                $this->setSolutionRevision($uuid);
            } elseif ($type === 'video') {
                $this->setVideoRevision($uuid);
            }
        }

        if ($uuid instanceof PageRepositoryInterface) {
            $this->setPage($uuid);
        }

        if ($uuid instanceof PageRevisionInterface) {
            $this->setPageRevision($uuid);
        }

        if ($uuid instanceof UserInterface) {
            $this->setUser($uuid);
        }

        if ($uuid instanceof TaxonomyTermInterface) {
            $this->setTaxonomyTerm($uuid);
        }
    }

    private function normalizeType($type)
    {
        $type = str_replace('text-', '', $type);
        return $this->toPascalCase($type);
    }

    public function setApplet(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setApplet(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$taxonomyTermIds: [Int!]!
            ) {
                _setApplet(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    taxonomyTermIds: \$taxonomyTermIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setArticle(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setArticle(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$taxonomyTermIds: [Int!]!
            ) {
                _setArticle(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    taxonomyTermIds: \$taxonomyTermIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setCourse(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setCourse(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$taxonomyTermIds: [Int!]!
                \$pageIds: [Int!]!
            ) {
                _setCourse(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    taxonomyTermIds: \$taxonomyTermIds
                    pageIds: \$pageIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setCoursePage(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setCoursePage(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$parentId: Int!
            ) {
                _setCoursePage(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    parentId: \$parentId
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setEvent(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setEvent(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$taxonomyTermIds: [Int!]!
            ) {
                _setEvent(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    taxonomyTermIds: \$taxonomyTermIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setExercise(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setExercise(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$solutionId: Int
                \$taxonomyTermIds: [Int!]!
            ) {
                _setExercise(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    solutionId: \$solutionId
                    taxonomyTermIds: \$taxonomyTermIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setExerciseGroup(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setExerciseGroup(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$exerciseIds: [Int!]!
                \$taxonomyTermIds: [Int!]!
            ) {
                _setExerciseGroup(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    exerciseIds: \$exerciseIds
                    taxonomyTermIds: \$taxonomyTermIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setGroupedExercise(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setGroupedExercise(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$solutionId: Int
                \$parentId: Int!
            ) {
                _setGroupedExercise(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    solutionId: \$solutionId
                    parentId: \$parentId
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setSolution(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setSolution(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$parentId: Int!
            ) {
                _setSolution(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    parentId: \$parentId
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setVideo(EntityInterface $entity)
    {
        $query = <<<MUTATION
            mutation setVideo(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$instance: Instance!
                \$date: DateTime!
                \$currentRevisionId: Int
                \$licenseId: Int!
                \$taxonomyTermIds: [Int!]!
            ) {
                _setVideo(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    instance: \$instance
                    date: \$date
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                    taxonomyTermIds: \$taxonomyTermIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($entity));
    }

    public function setAppletRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setAppletRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$url: String!
                \$title: String!
                \$content: String!
                \$changes: String!
                \$metaTitle: String!
                \$metaDescription: String!
            ) {
                _setAppletRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    url: \$url
                    title: \$title
                    content: \$content
                    changes: \$changes
                    metaTitle: \$metaTitle
                    metaDescription: \$metaDescription
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setArticleRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setArticleRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$title: String!
                \$content: String!
                \$changes: String!
                \$metaTitle: String!
                \$metaDescription: String!
            ) {
                _setArticleRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    title: \$title
                    content: \$content
                    changes: \$changes
                    metaTitle: \$metaTitle
                    metaDescription: \$metaDescription
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setCourseRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setCourseRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$title: String!
                \$content: String!
                \$changes: String!
                \$metaDescription: String!
            ) {
                _setCourseRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    title: \$title
                    content: \$content
                    changes: \$changes
                    metaDescription: \$metaDescription
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setCoursePageRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setCoursePageRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$title: String!
                \$content: String!
                \$changes: String!
            ) {
                _setCoursePageRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    title: \$title
                    content: \$content
                    changes: \$changes
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setEventRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setEventRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$title: String!
                \$content: String!
                \$changes: String!
                \$metaTitle: String!
                \$metaDescription: String!
            ) {
                _setEventRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    title: \$title
                    content: \$content
                    changes: \$changes
                    metaTitle: \$metaTitle
                    metaDescription: \$metaDescription
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setExerciseRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setExerciseRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$content: String!
                \$changes: String!
            ) {
                _setExerciseRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    content: \$content
                    changes: \$changes
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setExerciseGroupRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setExerciseGroupRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$content: String!
                \$changes: String!
            ) {
                _setExerciseGroupRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    content: \$content
                    changes: \$changes
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setGroupedExerciseRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setGroupedExerciseRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$content: String!
                \$changes: String!
            ) {
                _setGroupedExerciseRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    content: \$content
                    changes: \$changes
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setSolutionRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setSolutionRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$content: String!
                \$changes: String!
            ) {
                _setSolutionRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    content: \$content
                    changes: \$changes
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setVideoRevision(RevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setVideoRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$title: String!
                \$content: String!
                \$url: String!
                \$changes: String!
            ) {
                _setVideoRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    title: \$title
                    content: \$content
                    url: \$url
                    changes: \$changes
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setPage(PageRepositoryInterface $page)
    {
        $query = <<<MUTATION
            mutation setPage(
                \$id: Int!
                \$trashed: Boolean!
                \$instance: Instance!
                \$alias: String
                \$currentRevisionId: Int
                \$licenseId: Int!
            ) {
                _setPage(
                    id: \$id
                    trashed: \$trashed
                    instance: \$instance
                    alias: \$alias
                    currentRevisionId: \$currentRevisionId
                    licenseId: \$licenseId
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($page));
    }

    public function setPageRevision(PageRevisionInterface $revision)
    {
        $query = <<<MUTATION
            mutation setPageRevision(
                \$id: Int!
                \$trashed: Boolean!
                \$date: DateTime!
                \$authorId: Int!
                \$repositoryId: Int!
                \$title: String!
                \$content: String!
            ) {
                _setPageRevision(
                    id: \$id
                    trashed: \$trashed
                    date: \$date
                    authorId: \$authorId
                    repositoryId: \$repositoryId
                    title: \$title
                    content: \$content
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($revision));
    }

    public function setUser(UserInterface $user)
    {
        $query = <<<MUTATION
            mutation setUser(
                \$id: Int!
                \$trashed: Boolean!
                \$username: String!
                \$date: DateTime!
                \$lastLogin: DateTime
                \$description: String
            ) {
              _setUser(
                id: \$id
                trashed: \$trashed
                username: \$username
                date: \$date
                lastLogin: \$lastLogin
                description: \$description
              )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($user));
    }

    public function setTaxonomyTerm(TaxonomyTermInterface $taxonomyTerm)
    {
        $query = <<<MUTATION
            mutation setTaxonomyTerm(
                \$id: Int!
                \$trashed: Boolean!
                \$alias: String
                \$type: TaxonomyTermType!
                \$instance: Instance!
                \$name: String!
                \$description: String
                \$weight: Int!
                \$parentId: Int!
                \$childrenIds: [Int!]!
            ) {
                _setTaxonomyTerm(
                    id: \$id
                    trashed: \$trashed
                    alias: \$alias
                    type: \$type
                    instance: \$instance
                    name: \$name
                    description: \$description
                    weight: \$weight
                    parentId: \$parentId
                    childrenIds: \$childrenIds
                )
            }
MUTATION;

        $this->graphql->exec($query, $this->getUuidData($taxonomyTerm));
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

    public function getUuidData(UuidInterface $uuid)
    {
        try {
            $alias =
                '/' .
                $this->aliasManager
                    ->findAliasByObject($uuid, false)
                    ->getAlias();
        } catch (Exception $e) {
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
                $data['url'] = $uuid->get('ContentRevision', '');
                $data['changes'] = $uuid->get('changes', '');
            }
        }

        if ($uuid instanceof PageRepositoryInterface) {
            $data['__typename'] = 'Page';
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['currentRevisionId'] = $uuid->getCurrentRevision()
                ? $uuid->getCurrentRevision()->getId()
                : null;
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
}
