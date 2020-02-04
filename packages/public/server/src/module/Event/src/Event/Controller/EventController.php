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

namespace Event\Controller;

use Event\EventManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use ZfcRbac\Exception\UnauthorizedException;

class EventController extends AbstractActionController
{
    use \User\Manager\UserManagerAwareTrait;

    /**
     * @var EventManagerInterface
     */
    protected $eventManager;

    public function __construct(EventManagerInterface $eventManager)
    {
        $this->eventManager = $eventManager;
    }

    public function historyAction()
    {
        $id = $this->params('id');
        $events = $this->eventManager->findEventsByObject($id);

        if (empty($events)) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $view = new ViewModel(['id' => $id, 'events' => $events]);
        $view->setTemplate('event/history/object');
        return $view;
    }

    public function allAction()
    {
        $page = $this->params()->fromQuery('page', 0);
        $paginator = $this->eventManager->findAll($page);
        $view = new ViewModel(['paginator' => $paginator]);
        $view->setTemplate('event/history/all');
        return $view;
    }

    public function userAction()
    {
        $userId = $this->params('id');

        if (!is_numeric($userId)) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }

        $page = $this->params()->fromQuery('page', 0);
        $paginator = $this->eventManager->findAllEventsByActor($userId, $page);
        $view = new ViewModel(['userId' => $userId, 'paginator' => $paginator]);
        $view->setTemplate('event/history/user');
        return $view;
    }

    public function meAction()
    {
        $user = $this->getUserManager()->getUserFromAuthenticator();

        if (!$user) {
            throw new UnauthorizedException;
        }

        $userId = $user->getId();
        $page = $this->params()->fromQuery('page', 0);
        $paginator = $this->eventManager->findAllEventsByActor($userId, $page);
        $view = new ViewModel(['userId' => $userId, 'paginator' => $paginator]);
        $view->setTemplate('event/history/user');
        return $view;
    }

    public function renderAction()
    {
        $id = $this->params('id');
        $format = $this->params('format');
        $event = $this->eventManager->getEvent($id);

        if ($format === 'html') {
            $viewRender = $this->getServiceLocator()->get('ZfcTwig\View\TwigRenderer');
            $view = new ViewModel([
                'event' => $event,
            ]);
            $view->setTemplate('event/helper/event/default');
            $html = $viewRender->render($view);
            return new JsonModel([
                'id' => $event->getId(),
                'body' => $html,
            ]);
        }

        if ($format === 'email') {
            $viewRender = $this->getServiceLocator()->get('ZfcTwig\View\TwigRenderer');
            $plainModel = new ViewModel([
                'event' => $event,
                'plain' => true,
            ]);
            $plainModel->setTemplate('event/render/email');
            $plain = $viewRender->render($plainModel);
            $htmlModel = new ViewModel([
                'event' => $event,
                'plain' => false,
            ]);
            $htmlModel->setTemplate('event/render/email');
            $html = $viewRender->render($htmlModel);
            return new JsonModel([
                'body' => [
                    'plain' => trim($plain),
                    'html' => trim($html),
                ],
            ]);
        }
    }
}
