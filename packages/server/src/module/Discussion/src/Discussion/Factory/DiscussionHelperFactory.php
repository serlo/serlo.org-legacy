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
namespace Discussion\Factory;

use Discussion\View\Helper\Discussion;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class DiscussionHelperFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $serviceLocator        = $serviceLocator->getServiceLocator();
        $discussionManager     = $serviceLocator->get('Discussion\DiscussionManager');
        $userManager           = $serviceLocator->get('User\Manager\UserManager');
        $instanceManager       = $serviceLocator->get('Instance\Manager\InstanceManager');
        $sharedTaxonomyManager = $serviceLocator->get('Taxonomy\Manager\TaxonomyManager');
        $termForm              = $serviceLocator->get('Taxonomy\Form\TermForm');
        $discussionForm        = $serviceLocator->get('Discussion\Form\DiscussionForm');
        $commentForm           = $serviceLocator->get('Discussion\Form\CommentForm');
        $renderer              = $serviceLocator->get('ZfcTwig\View\TwigRenderer');
        $request               = $serviceLocator->get('Request');
        $plugin                = new Discussion($termForm, $commentForm, $discussionForm, $renderer, $request);

        $plugin->setDiscussionManager($discussionManager);
        $plugin->setUserManager($userManager);
        $plugin->setInstanceManager($instanceManager);
        $plugin->setTaxonomyManager($sharedTaxonomyManager);

        return $plugin;
    }
}
