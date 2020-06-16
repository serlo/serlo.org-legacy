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
namespace Entity\Factory;

use Entity\Controller\EntityController;
use Entity\Manager\EntityManager;
use Instance\Manager\InstanceManager;
use Zend\I18n\Translator\Translator;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class EntityControllerFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        /* @var $serviceLocator AbstractPluginManager */
        $serviceManager = $serviceLocator->getServiceLocator();

        /** @var EntityManager $entityManager */
        $entityManager = $serviceManager->get('Entity\Manager\EntityManager');
        /** @var InstanceManager $instanceManager */
        $instanceManager = $serviceManager->get(
            'Instance\Manager\InstanceManager'
        );
        /** @var Translator $translator */
        $translator = $serviceManager->get('MvcTranslator');

        $result = new EntityController();
        $result->setEntityManager($entityManager);
        $result->setInstanceManager($instanceManager);
        $result->setTranslator($translator);

        return $result;
    }
}
