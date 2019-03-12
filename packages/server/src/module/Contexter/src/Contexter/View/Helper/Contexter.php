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
namespace Contexter\View\Helper;

use Zend\View\Helper\AbstractHelper;

class Contexter extends AbstractHelper
{
    use \Contexter\Router\RouterAwareTrait;

    protected $url = false;

    public function __invoke()
    {
        return $this;
    }

    public function forceUrl($url)
    {
        $this->url = $url;
        return $this;
    }

    public function render($type = null)
    {
        if (is_object($this->getRouter()->getRouteMatch())) {
            $matches   = $this->getRouter()->match(null, $type);
            $url       = $this->url;
            $this->url = false;
            return $this->getView()->partial(
                'contexter/helper/default',
                [
                    'router'  => $this->getRouter(),
                    'matches' => $matches,
                    'type'    => $type,
                    'url'     => $url,
                ]
            );
        }
    }

    public function renderButton($float = null, $class = 'btn-primary')
    {
        if (is_object($this->getRouter()->getRouteMatch())) {
            $matches   = $this->getRouter()->match();
            $url       = $this->url;
            $this->url = false;
            return $this->getView()->partial(
                'contexter/helper/button',
                [
                    'router'  => $this->getRouter(),
                    'matches' => $matches,
                    'url'     => $url,
                    'float'   => $float,
                    'class'   => $class,
                ]
            );
        }
    }
}
