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
namespace Alias\View\Helper;

use Alias\AliasManagerAwareTrait;
use Alias\AliasManagerInterface;
use Alias\Exception\AliasNotFoundException;
use Common\Traits\ConfigAwareTrait;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Zend\Cache\Storage\StorageInterface;
use Zend\Mvc\Router\Console\RouteInterface;
use Zend\View\Helper\Url as ZendUrl;

class Url extends ZendUrl
{
    use AliasManagerAwareTrait, InstanceManagerAwareTrait;

    /**
     * @var StorageInterface
     */
    protected $storage;

    public function __construct(
        AliasManagerInterface $aliasManager,
        InstanceManagerInterface $instanceManager
    ) {
        $this->aliasManager    = $aliasManager;
        $this->instanceManager = $instanceManager;
    }

    public function __invoke($name = null, $params = [], $options = [], $reuseMatchedParams = false, $useAlias = true)
    {
        $useCanonical = (isset($options['force_canonical']) && $options['force_canonical']);
        $link         = parent::__invoke($name, $params, $options, $reuseMatchedParams);

        if (!$useAlias) {
            return $link;
        }

        try {
            $aliasManager = $this->getAliasManager();
            $instance     = $this->getInstanceManager()->getInstanceFromRequest();
            if ($useCanonical) {
                $options['force_canonical'] = false;
                $source                     = parent::__invoke($name, $params, $options, $reuseMatchedParams);
                $link                       = $aliasManager->findAliasBySource($source, $instance);
                return $this->getView()->serverUrl($link);
            }
            $link = $aliasManager->findAliasBySource($link, $instance);
        } catch (AliasNotFoundException $e) {
            // No alias was found -> nothing to do
        }

        return $link;
    }
}
