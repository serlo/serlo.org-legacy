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

namespace Ads\Factory;

use Ads\Manager\AdsManager;
use ClassResolver\ClassResolverFactoryTrait;
use Common\Factory\AuthorizationServiceFactoryTrait;
use Common\Factory\EntityManagerFactoryTrait;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AdsManagerFactory implements FactoryInterface
{
    use EntityManagerFactoryTrait, ClassResolverFactoryTrait, AuthorizationServiceFactoryTrait;

    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $authorizationService = $this->getAuthorizationService($serviceLocator);
        $entityManager        = $this->getEntityManager($serviceLocator);
        $classResolver        = $this->getClassResolver($serviceLocator);
        $attachmentManager    = $serviceLocator->get('Attachment\Manager\AttachmentManager');
        $pageManager = $serviceLocator->get('Page\Manager\PageManager');
        $adsManager           = new AdsManager($authorizationService, $attachmentManager, $classResolver, $entityManager, $pageManager);

        return $adsManager;
    }
}
