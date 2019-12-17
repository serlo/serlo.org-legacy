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

    protected function getUnrevisedRevisionsBySubject()
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

        return $revisionsBySubject;
    }

    protected function getReviewHelpLinks()
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        if ($instance->getLanguage()->getCode() == "de") {
            $reviewHelpUrl = "/140479";
        } else {
            $reviewHelpUrl = "https://docs.google.com/document/d/1p03xx2KJrFw8Mui4-xllvSTHcEPi8G1bdC8rGXcH6f8/edit";
        }

        $helpLinks = [
            [ $reviewHelpUrl, "Guideline for reviewing"],
            [ "/discussions", "List of all discussions"],
            [
                "https://community.serlo.org/channel/feedback-requests",
                "Channel #feedback-requests in RocketChat",
            ],
            [
                "https://docs.google.com/forms/d/e/1FAIpQLSfMjWIZZq2_AoHbqNv3AOEjQRBwA8qEZIMJpk5l0vX7w2nwnQ/viewform",
                "Questionnaire for reviewers",
            ],
        ];

        return $helpLinks;
    }

    public function unrevisedAction()
    {
        $view = new ViewModel([
            'revisionsBySubject' => $this->getUnrevisedRevisionsBySubject(),
            'helpLinks' => $this->getReviewHelpLinks(),
        ]);
        $view->setTemplate('entity/unrevised');

        return $view;
    }
}
