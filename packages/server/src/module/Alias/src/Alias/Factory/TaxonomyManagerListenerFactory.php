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
namespace Alias\Factory;

use Alias\Listener\AbstractListener;
use Zend\ServiceManager\ServiceLocatorInterface;

class TaxonomyManagerListenerFactory extends AbstractListenerFactory
{
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return AbstractListener
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $aliasManager = $this->getAliasManager($serviceLocator);
        $listener     = $this->getClassName();
        $normalizer   = $serviceLocator->get('Normalizer\Normalizer');

        return new $listener($aliasManager, $normalizer);
    }

    protected function getClassName()
    {
        return 'Alias\Listener\TaxonomyManagerListener';
    }
}
