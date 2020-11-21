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
namespace Alias\Controller\Plugin;

use Alias\AliasManagerInterface;
use Instance\Manager\InstanceManagerInterface;
use Zend\Mvc\Controller\Plugin\Url as ZendUrl;

class Url extends ZendUrl
{
    /** @var AliasManagerInterface */
    protected $aliasManager;
    /** @var InstanceManagerInterface */
    protected $instanceManager;

    public function __construct(
        AliasManagerInterface $aliasManager,
        InstanceManagerInterface $instanceManager
    ) {
        $this->aliasManager = $aliasManager;
        $this->instanceManager = $instanceManager;
    }

    public function fromRoute(
        $route = null,
        $params = [],
        $options = [],
        $reuseMatchedParams = false,
        $useAlias = true
    ) {
        $url = parent::fromRoute(
            $route,
            $params,
            $options,
            $reuseMatchedParams
        );

        if (!$useAlias) {
            return $url;
        }

        return $this->aliasManager->getAliasOfSource($url) ?? $url;
    }
}
