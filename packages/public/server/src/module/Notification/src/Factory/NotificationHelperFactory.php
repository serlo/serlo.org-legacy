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
namespace Notification\Factory;

use Notification\View\Helper\Notification;
use User\Factory\UserManagerFactoryTrait;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class NotificationHelperFactory implements FactoryInterface
{
    use UserManagerFactoryTrait;

    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        /* @var AbstractPluginManager $serviceLocator */
        $serviceManager      = $serviceLocator->getServiceLocator();
        $userManager         = $this->getUserManager($serviceManager);
        $notificationManager = $serviceManager->get('Notification\NotificationManager');
        $storage             = $serviceManager->get('Notification\Storage\Storage');
        $renderer            = $serviceManager->get('ZfcTwig\View\TwigRenderer');

        return new Notification($notificationManager, $storage, $renderer, $userManager);
    }
}