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
namespace Entity\Controller;

use Entity\Result;
use Instance\Manager\InstanceManagerAwareTrait;
use Zend\EventManager\ResponseCollection;
use Zend\View\Model\ViewModel;

class EntityController extends AbstractController
{
    use InstanceManagerAwareTrait;

    public function createAction()
    {
        // No assertion necessary, because no view. This is done in the manager logic
        $type     = $this->params('type');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $query    = $this->params()->fromQuery();
        $entity   = $this->getEntityManager()->createEntity(
            $type,
            $query,
            $instance
        );
        $this->getEntityManager()->flush();

        $data     = ['entity' => $entity, 'data' => $query];
        $response = $this->getEventManager()->trigger('create.postFlush', $this, $data);
        return $this->checkResponse($response);
    }

    public function checkResponse(ResponseCollection $response)
    {
        $redirected = false;
        foreach ($response as $result) {
            if ($result instanceof Result\UrlResult) {
                $this->redirect()->toUrl($result->getResult());
                $redirected = true;
            }
        }

        if (!$redirected) {
            return $this->redirect()->toReferer();
        }
        return true;
    }

    public function unrevisedAction()
    {
        $revisions = $this->getEntityManager()->findAllUnrevisedRevisions()->getIterator();

        $revisions->uasort(function ($revisionA, $revisionB) {
            $timestampA = $revisionA->getTimestamp()->getTimestamp();
            $timestampB = $revisionB->getTimestamp()->getTimestamp();

            return $timestampB - $timestampA;
        });

        $revisionsBySubject = array();

        foreach ($revisions as $revision) {
            $entity = $revision->getRepository();

            foreach ($entity->getSubjects() as $subject) {
                $revisionsBySubject[$subject->getName()][$entity->getId()][] = $revision;
            }
        }

        $view = new ViewModel(['revisionsBySubject' => $revisionsBySubject]);
        $view->setTemplate('entity/unrevised');

        return $view;
    }
}
