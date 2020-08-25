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

namespace Api\Controller;

use Api\Service\AuthorizationService;
use Doctrine\Common\Persistence\ObjectManager;
use Zend\View\Model\JsonModel;

class CacheApiController extends AbstractApiController
{
    /** @var ObjectManager */
    protected $objectManager;

    public function __construct(
        AuthorizationService $authorizationService,
        ObjectManager $objectManager
    ) {
        $this->objectManager = $objectManager;
        parent::__construct($authorizationService);
    }

    public function indexAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $cacheKeys = array_merge(
            $this->getNavigationCacheKeys(),
            $this->getLicenseCacheKeys(),
            $this->getUuidCacheKeys(),
            $this->getAliasCacheKeys()
            // $this->getNotificationCacheKeys(),
            // $this->getEventCacheKeys()
        );

        return new JsonModel($cacheKeys);
    }

    protected function getNavigationCacheKeys()
    {
        $sql = 'SELECT subdomain FROM instance';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        return array_map(function ($row) {
            return $row['subdomain'] . '.serlo.org/api/navigation';
        }, $q->fetchAll());
    }

    protected function getAliasCacheKeys()
    {
        $sql =
            'SELECT a.alias, i.subdomain FROM url_alias a LEFT JOIN instance i ON a.instance_id = i.id';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        return array_map(function ($row) {
            $cleanPath = str_replace('%2F', '/', urlencode($row['alias']));
            return $row['subdomain'] . '.serlo.org/api/alias/' . $cleanPath;
        }, $q->fetchAll());
    }

    protected function getUuidCacheKeys()
    {
        $sql =
            'SELECT id FROM page_repository WHERE current_revision_id IS NOT NULL ' .
            'UNION SELECT current_revision_id FROM page_repository  WHERE current_revision_id IS NOT NULL ' .
            'UNION SELECT id FROM term_taxonomy ' .
            'UNION SELECT id FROM entity WHERE current_revision_id IS NOT NULL ' .
            'UNION SELECT current_revision_id FROM entity  WHERE current_revision_id IS NOT NULL ' .
            'UNION SELECT id FROM user';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        return array_map(function ($row) {
            return 'de.serlo.org/api/uuid/' . $row['id'];
        }, $q->fetchAll());
    }

    protected function getLicenseCacheKeys()
    {
        $sql = 'SELECT id FROM license';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        return array_map(function ($row) {
            return 'de.serlo.org/api/license/' . $row['id'];
        }, $q->fetchAll());
    }

    protected function getNotificationCacheKeys()
    {
        $sql = 'SELECT id FROM user';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        return array_map(function ($row) {
            return 'de.serlo.org/api/notifications/' . $row['id'];
        }, $q->fetchAll());
    }

    protected function getEventCacheKeys()
    {
        $sql = 'SELECT id FROM event_log';
        $q = $this->objectManager->getConnection()->prepare($sql);
        $q->execute();
        return array_map(function ($row) {
            return 'de.serlo.org/api/event/' . $row['id'];
        }, $q->fetchAll());
    }
}
