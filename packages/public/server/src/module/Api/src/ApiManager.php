<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

namespace Api;

use Alias\AliasManagerInterface;
use Api\Service\AbstractGraphQLService;
use Authorization\Entity\RoleInterface;
use DateTime;
use Discussion\DiscussionManagerInterface;
use Discussion\Entity\CommentInterface;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use License\Entity\LicenseInterface;
use Notification\Entity\SubscriptionInterface;
use Notification\SubscriptionManagerInterface;
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
    /** @var SubscriptionManagerInterface */
    protected $subscriptionManager;
    /** @var AbstractGraphQLService */
    protected $graphql;

    public function __construct(
        AliasManagerInterface $aliasManager,
        DiscussionManagerInterface $discussionManager,
        SubscriptionManagerInterface $subscriptionManager,
        AbstractGraphQLService $graphql
    ) {
        $this->aliasManager = $aliasManager;
        $this->discussionManager = $discussionManager;
        $this->subscriptionManager = $subscriptionManager;
        $this->graphql = $graphql;
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
        $this->graphql->removeCache(
            $this->graphql->getCacheKey('/api/uuid/' . $id)
        );
    }

    public function setSubscriptions(UserInterface $user)
    {
        $this->graphql->setCache(
            $this->graphql->getCacheKey('/api/subscriptions/' . $user->getId()),
            $this->getSubscriptionsData($user)
        );
    }

    public function getSubscriptionsData(UserInterface $user)
    {
        $subscriptions = array_map(function (
            SubscriptionInterface $subscription
        ) {
            return [
                'id' => $subscription->getSubscribedObject()->getId(),
            ];
        },
        $this->subscriptionManager->findSubscriptionsByUser($user)->toArray());
        return [
            'userId' => $user->getId(),
            'subscriptions' => $subscriptions,
        ];
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
}
