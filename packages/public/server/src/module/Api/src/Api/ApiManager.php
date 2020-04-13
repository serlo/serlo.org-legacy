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

use Alias\AliasManagerAwareTrait;
use Alias\Entity\AliasInterface;
use DateTime;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Exception;
use FeatureFlags\ServiceLoggerInterface;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;
use License\Entity\LicenseInterface;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;

class ApiManager
{
    use AliasManagerAwareTrait;

    private $options;

    /**
     * @var ServiceLoggerInterface
     */
    private $sentry;

    public function __construct(array $options, $sentry)
    {
        $this->options = $options;
        $this->sentry = $sentry;
    }

    public function getAliasData(AliasInterface $alias)
    {
        return [
            'id' => $alias->getObject()->getId(),
            'instance' => $alias->getInstance()->getSubdomain(),
            'path' => '/' . $alias->getAlias(),
            'source' => $alias->getSource(),
            'timestamp' => $alias->getTimestamp()->format(DateTime::ATOM),
        ];
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
        $this->executeQuery(
            $query,
            $this->getAliasData($alias)
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

    public function removeLicense($id)
    {
        $query = <<<MUTATION
            mutation removeLicense(\$id: Int!) {
                _removeLicense(id: \$id)
            }
MUTATION;
        $this->executeQuery(
            $query,
            ['id' => $id]
        );
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
        $this->executeQuery(
            $query,
            $this->getLicenseData($license)
        );
    }

    public function getUuidData(UuidInterface $uuid)
    {
        try {
            $alias = '/' . $this->getAliasManager()->findAliasByObject($uuid)->getAlias();
        } catch (\Exception $e) {
            $alias = null;
        }

        $data = [
            'id' => $uuid->getId(),
            'trashed' => $uuid->getTrashed(),
            'alias' => $alias,
        ];

        if ($uuid instanceof EntityInterface) {
            $data['discriminator'] = 'entity';
            $data['type'] = $uuid->getType()->getName();
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['date'] = $uuid->getTimestamp()->format(DateTime::ATOM);
            $data['currentRevisionId'] = $uuid->getCurrentRevision() ? $uuid->getCurrentRevision()->getId() : null;
            $data['licenseId'] = $uuid->getLicense()->getId();
            $data['taxonomyTermIds'] = $uuid->getTaxonomyTerms()->map(function (TaxonomyTermInterface $term) {
                return $term->getId();
            })->toArray();
        }

        if ($uuid instanceof RevisionInterface) {
            $data['discriminator'] = 'entityRevision';
            $data['date'] = $uuid->getTimestamp()->format(DateTime::ATOM);
            $data['authorId'] = $uuid->getAuthor()->getId();
            /** @var EntityInterface $entity */
            $entity = $uuid->getRepository();
            $data['type'] = $entity->getType()->getName();
            $data['repositoryId'] = $entity->getId();
            $data['fields'] = [];
            foreach ($uuid->getFields() as $field) {
                $data[$field->getName()] = $field->getValue();
            }
        }

        if ($uuid instanceof PageRepositoryInterface) {
            $data['discriminator'] = 'page';
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['currentRevisionId'] = $uuid->getCurrentRevision() ? $uuid->getCurrentRevision()->getId() : null;
            $data['licenseId'] = $uuid->getLicense()->getId();
        }

        if ($uuid instanceof PageRevisionInterface) {
            $data['discriminator'] = 'pageRevision';
            $data['title'] = $uuid->getTitle();
            $data['content'] = $uuid->getContent();
            $data['date'] = $uuid->getTimestamp()->format(DateTime::ATOM);
            $data['authorId'] = $uuid->getAuthor()->getId();
            $data['repositoryId'] = $uuid->getRepository()->getId();
        }

        if ($uuid instanceof UserInterface) {
            $data['discriminator'] = 'user';
            $data['username'] = $uuid->getUsername();
            $data['date'] = $uuid->getDate()->format(DateTime::ATOM);
            $data['lastLogin'] = $uuid->getLastLogin() ? $uuid->getLastLogin()->format(DateTime::ATOM) : null;
            $data['description'] = $uuid->getDescription();
        }

        if ($uuid instanceof TaxonomyTermInterface) {
            $data['discriminator'] = 'taxonomyTerm';
            $data['type'] = $this->toCamelCase($uuid->getType()->getName());
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['name'] = $uuid->getName();
            $data['description'] = $uuid->getDescription();

            $weight = $uuid->getPosition();
            $data['weight'] = isset($weight) ? $weight : 0;

            $parent = $uuid->getParent();
            $data['parentId'] = isset($parent) ? $parent->getId() : null;

            $associated = $uuid->getAssociated('entities')->map(function (TaxonomyTermAwareInterface $uuid) {
                return $uuid->getId();
            })->toArray();
            $children = $uuid->getChildren()->map(function (TaxonomyTermInterface $uuid) {
                return $uuid->getId();
            })->toArray();
            $data['childrenIds'] = array_merge($associated, $children);
        }

        return $data;
    }

    public function removeUuid($id)
    {
        $query = <<<MUTATION
            mutation removeUuid(\$id: Int!) {
                _removeUuid(id: \$id)
            }
MUTATION;
        $this->executeQuery(
            $query,
            ['id' => $id]
        );
    }

    public function setUuid(UuidInterface $uuid)
    {
        if ($uuid instanceof EntityInterface) {
            if ($uuid->getType()->getName() === 'article') {
                $this->setArticle($uuid);
            }
        }

        if ($uuid instanceof RevisionInterface) {
            /** @var EntityInterface $entity */
            $entity = $uuid->getRepository();

            if ($entity->getType()->getName() === 'article') {
                $this->setArticleRevision($uuid);
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

        $this->executeQuery(
            $query,
            $this->getUuidData($entity)
        );
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
                )
            }
MUTATION;

        $this->executeQuery(
            $query,
            $this->getUuidData($revision)
        );
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

        $this->executeQuery(
            $query,
            $this->getUuidData($page)
        );
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

        $this->executeQuery(
            $query,
            $this->getUuidData($revision)
        );
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

        $this->executeQuery(
            $query,
            $this->getUuidData($taxonomyTerm)
        );
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

        $this->executeQuery(
            $query,
            $this->getUuidData($user)
        );
    }


    private function executeQuery(string $query, array $variables)
    {
        $options = $this->options;
        if (!isset($options['host']) || !isset($options['secret'])) {
            return null;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $options['host']);

        $token = (new Builder())
            ->issuedBy('serlo.org')
            ->permittedFor('api.serlo.org')
            ->issuedAt(time())
            ->expiresAt(time() + 60)
            ->getToken(new Sha256(), new Key($options['secret']));

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Serlo Service=' . $token,
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'query' => $query,
            'variables' => $variables,
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = json_decode(curl_exec($ch), true);

        if (isset($response['errors'])) {
            $errors = print_r([
                'query' => $query,
                'variables' => $variables,
                'errors' => $response['errors'],
            ], true);
            $exception = new Exception($errors);
            $this->sentry->captureException($exception, ['tags' => ['api' => true]]);
        }
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
