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
namespace Alias\Controller;

use Alias\Exception\AliasNotFoundException;
use Alias\Exception\CanonicalUrlNotFoundException;
use Alias;
use Zend\Http\Request;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Stdlib\ArrayUtils;

class AliasController extends AbstractActionController
{
    use Alias\AliasManagerAwareTrait, \Instance\Manager\InstanceManagerAwareTrait;

    /**
     * @var mixed
     */
    protected $router;

    public function forwardAction()
    {
        $alias    = $this->params('alias');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        try {
            $location = $this->aliasManager->findCanonicalAlias($alias, $instance);
            $this->redirect()->toUrl($location);
            $this->getResponse()->setStatusCode(301);
            return false;
        } catch (CanonicalUrlNotFoundException $e) {
        }

        try {
            $source = $this->aliasManager->findSourceByAlias($alias, $instance, true);
        } catch (AliasNotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $router  = $this->getServiceLocator()->get('Router');
        $request = new Request();
        $request->setMethod(Request::METHOD_GET);
        $request->setUri($source);
        $routeMatch = $router->match($request);

        if ($routeMatch === null) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $this->getEvent()->setRouteMatch($routeMatch);
        $params     = $routeMatch->getParams();
        $controller = $params['controller'];
        $return     = $this->forward()->dispatch(
            $controller,
            ArrayUtils::merge(
                $params,
                [
                    'forwarded' => true,
                ]
            )
        );

        return $return;
    }
}
