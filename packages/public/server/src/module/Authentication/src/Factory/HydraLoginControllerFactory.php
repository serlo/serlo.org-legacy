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
namespace Authentication\Factory;

use Authentication\Controller\HydraLoginController;
use Authentication\Service\AuthenticationServiceInterface;
use Authentication\Service\HydraService;
use Common\Factory\AbstractControllerFactory;
use Instance\Manager\InstanceManager;
use Instance\Manager\InstanceManagerInterface;
use User\Manager\UserManager;
use User\Manager\UserManagerInterface;
use Zend\Mvc\I18n\Translator;
use Zend\ServiceManager\ServiceLocatorInterface;

class HydraLoginControllerFactory extends AbstractControllerFactory
{
    protected function createController(ServiceLocatorInterface $serviceManager)
    {
        /** @var AuthenticationServiceInterface $authenticationService */
        $authenticationService = $serviceManager->get(
            'Zend\Authentication\AuthenticationService'
        );
        /** @var HydraService $hydraService */
        $hydraService = $serviceManager->get(HydraService::class);
        /** @var InstanceManagerInterface $instanceManager */
        $instanceManager = $serviceManager->get(InstanceManager::class);
        /** @var UserManagerInterface $userManager */
        $userManager = $serviceManager->get(UserManager::class);
        /** @var Translator $translator */
        $translator = $serviceManager->get('MvcTranslator');
        return new HydraLoginController(
            $authenticationService,
            $hydraService,
            $instanceManager,
            $userManager,
            $translator
        );
    }
}
