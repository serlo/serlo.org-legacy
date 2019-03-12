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
namespace Contexter\Controller;

use Contexter\Form\ContextForm;
use Contexter\Form\UrlForm;
use Contexter\Manager\ContextManagerAwareTrait;
use Contexter\Manager\ContextManagerInterface;
use Contexter\Router\RouterAwareTrait;
use Contexter\Router\RouterInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class ContextController extends AbstractActionController
{
    use ContextManagerAwareTrait, RouterAwareTrait;

    public function __construct(
        ContextManagerInterface $contextManager,
        RouterInterface $router
    ) {
        $this->contextManager = $contextManager;
        $this->router         = $router;
    }

    public function addAction()
    {
        $this->assertGranted('contexter.context.add');

        $uri = $this->params()->fromQuery('uri', null);

        if ($uri === null) {
            $this->redirect()->toRoute('contexter/select-uri');
            return false;
        } else {
            $routeMatch = $this->getRouter()->matchUri($uri);
            $this->getRouter()->setRouteMatch($routeMatch);
            $types      = $this->getContextManager()->findAllTypeNames();
            $parameters = $this->getRouter()->getAdapter()->getParams();
            $form       = new ContextForm($parameters, $types->toArray());
            $form->setData(['route' => $routeMatch->getMatchedRouteName()]);
            if ($this->getRequest()->isPost()) {
                $form->setData($this->getRequest()->getPost());
                if ($form->isValid()) {
                    $data = $form->getData();

                    foreach ($data['parameters'] as $key => $value) {
                        if ($value == '1' && isset($parameters[$key])) {
                            $useParameters[$key] = $parameters[$key];
                        }
                    }

                    $context = $this->getContextManager()->add($data['object'], $data['type'], $data['title']);
                    $this->getContextManager()->addRoute($context, $data['route'], $data['parameters']);
                    $this->getContextManager()->flush();

                    return $this->redirect()->toUrl($uri);
                }
            }
        }
        $view = new ViewModel(['form' => $form]);
        $view->setTemplate('contexter/add/form');

        return $view;
    }

    public function manageAction()
    {
        $elements = $this->getContextManager()->findAll();
        $view     = new ViewModel(['elements' => $elements]);
        $view->setTemplate('contexter/manage');
        return $view;
    }

    public function removeAction()
    {
        $id      = $this->params('id');
        $context = $this->getContextManager()->getContext($id);
        $this->assertGranted('contexter.context.remove', $context);

        $this->getContextManager()->removeContext($id);
        $this->getContextManager()->flush();
        $this->redirect()->toReferer();

        return false;
    }

    public function removeRouteAction()
    {
        $id    = $this->params('id');
        $route = $this->getContextManager()->getRoute($id);
        $this->assertGranted('contexter.route.remove', $route);

        $this->getContextManager()->removeRoute($id);
        $this->getContextManager()->flush();
        $this->redirect()->toReferer();

        return false;
    }

    public function selectUriAction()
    {
        $this->assertGranted('contexter.context.add');

        $form = new UrlForm();
        $view = new ViewModel(['form' => $form]);
        if ($this->getRequest()->isPost()) {
            $form->setData(
                $this->getRequest()->getPost()
            );
            if ($form->isValid()) {
                $data = $form->getData();
                $url  = $this->url()->fromRoute('contexter/add', []) . '?uri=' . $data['uri'];
                return $this->redirect()->toUrl($url);
            }
        }
        $view->setTemplate('contexter/add/url-form');

        return $view;
    }

    public function updateAction()
    {
        $id      = $this->params('id');
        $context = $this->getContextManager()->getContext($id);
        $this->assertGranted('contexter.context.update', $context);
        $view = new ViewModel(['context' => $context]);
        $view->setTemplate('contexter/update');
        return $view;
    }
}
