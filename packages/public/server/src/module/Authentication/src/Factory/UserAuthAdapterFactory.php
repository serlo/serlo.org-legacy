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

use Authentication\Adapter\UserAuthAdapter;
use Authentication\HashService;
use Authentication\HashServiceInterface;
use Common\Factory\EntityManagerFactoryTrait;
use Doctrine\Common\Persistence\ObjectManager;
use Zend\I18n\Translator\TranslatorInterface;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class UserAuthAdapterFactory implements FactoryInterface
{
    use EntityManagerFactoryTrait;

    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        /* @var $serviceLocator AbstractPluginManager */
        //$serviceManager = $serviceLocator->getServiceLocator();

        /** @var HashServiceInterface $hashService */
        $hashService = $serviceLocator->get(HashService::class);
        /** @var ObjectManager $objectManager */
        $objectManager = $this->getEntityManager($serviceLocator);
        /** @var TranslatorInterface $translator */
        $translator = $serviceLocator->get('MvcTranslator');

        $result = new UserAuthAdapter($hashService, $objectManager);
        $result->setTranslator($translator);

        return $result;
    }
}
