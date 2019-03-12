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
namespace Contexter\Adapter;

use Contexter\Exception\RuntimeException;
use Contexter\Router\RouterAwareTrait;
use Zend\Mvc\Router\RouteMatch;
use Zend\Stdlib\ArrayUtils;

abstract class AbstractAdapter implements AdapterInterface
{
    use RouterAwareTrait;

    /**
     * @var RouteMatch
     */
    protected $routeMatch;

    /**
     * @var mixed
     */
    protected $adapter;

    public function getAdaptee()
    {
        return $this->adapter;
    }

    public function setAdaptee($adapter)
    {
        if (!$this->isValidController($adapter)) {
            throw new RuntimEexception(sprintf('Invalid controller type'));
        }
        $this->adapter = $adapter;
    }

    public function getKeys()
    {
        return array_keys($this->getParameters());
    }

    public function getRouteMatch()
    {
        return $this->routeMatch;
    }

    public function setRouteMatch(RouteMatch $routeMatch)
    {
        $this->routeMatch = $routeMatch;
    }

    public function getRouteParams()
    {
        return $this->getRouteMatch()->getParams();
    }

    public function getParams()
    {
        return ArrayUtils::merge($this->getRouteParams(), $this->getProvidedParams());
    }

    abstract protected function isValidController($controller);
}
