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
namespace Alias\Controller\Plugin;

use Alias\AliasManagerInterface;
use Alias\Exception\AliasNotFoundException;
use Instance\Manager\InstanceManagerInterface;
use Zend\Mvc\Controller\Plugin\Url as ZendUrl;
use Zend\Mvc\Exception;

class Url extends ZendUrl
{
    /**
     * @param AliasManagerInterface    $aliasManager
     * @param InstanceManagerInterface $instanceManager
     */
    public function __construct(
        AliasManagerInterface $aliasManager,
        InstanceManagerInterface $instanceManager
    ) {
        $this->aliasManager    = $aliasManager;
        $this->instanceManager = $instanceManager;
    }

    public function fromRoute(
        $route = null,
        $params = array(),
        $options = array(),
        $reuseMatchedParams = false,
        $useAlias = true
    ) {
        $url = parent::fromRoute($route, $params, $options, $reuseMatchedParams);

        if (!$useAlias) {
            return $url;
        }

        $aliasManager = $this->aliasManager;
        $instance = $this->instanceManager->getInstanceFromRequest();

        try {
            $url = $aliasManager->findAliasBySource($url, $instance);
        } catch (AliasNotFoundException $e) {
            // Nothing to do..
        }

        return $url;
    }
}
