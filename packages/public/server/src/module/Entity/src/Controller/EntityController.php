<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Entity\Controller;

use Entity\Result;
use Instance\Manager\InstanceManagerAwareTrait;
use Zend\EventManager\ResponseCollection;
use Zend\I18n\Translator\TranslatorAwareTrait;
use Zend\View\Model\ViewModel;

class EntityController extends AbstractController
{
    use InstanceManagerAwareTrait, TranslatorAwareTrait;

    public function createAction()
    {
        // No assertion necessary, because no view. This is done in the manager logic
        $type = $this->params('type');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $query = $this->params()->fromQuery();
        $entity = $this->getEntityManager()->createEntity(
            $type,
            $query,
            $instance
        );
        $this->getEntityManager()->flush();

        $data = ['entity' => $entity, 'data' => $query];
        $response = $this->getEventManager()->trigger(
            'create.postFlush',
            $this,
            $data
        );
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
        $view = new ViewModel([
            'revisionsBySubject' => $this->getUnrevisedRevisionsBySubject(),
            'helpLinks' => $this->getReviewHelpLinks(),
        ]);
        $view->setTemplate('entity/unrevised');

        return $view;
    }

    protected function getUnrevisedRevisionsBySubject()
    {
        $revisions = $this->getEntityManager()
            ->findAllUnrevisedRevisions(
                $this->getInstanceManager()->getInstanceFromRequest()
            )
            ->getIterator();

        $revisions->uasort(function ($revisionA, $revisionB) {
            $timestampA = $revisionA->getTimestamp()->getTimestamp();
            $timestampB = $revisionB->getTimestamp()->getTimestamp();

            return $timestampB - $timestampA;
        });

        $revisionsBySubject = [];

        foreach ($revisions as $revision) {
            $entity = $revision->getRepository();
            $subjectNames = array_map(function ($x) {
                return $x->getName();
            }, $entity->getSubjects());

            if (empty($subjectNames)) {
                $subjectNames = [
                    $this->getTranslator()->translate(
                        'Entities without a subject'
                    ),
                ];
            }

            foreach ($subjectNames as $subjectName) {
                $revisionsBySubject[$subjectName][
                    $entity->getId()
                ][] = $revision;
            }
        }

        return $revisionsBySubject;
    }

    protected function getReviewHelpLinks()
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        if ($instance->getLanguage()->getCode() == 'de') {
            $reviewHelpUrl = '/140473';
        } else {
            $reviewHelpUrl =
                'https://docs.google.com/document/d/1p03xx2KJrFw8Mui4-xllvSTHcEPi8G1bdC8rGXcH6f8/edit';
        }

        $translator = $this->getTranslator();
        $helpLinks = [
            [
                'url' => $reviewHelpUrl,
                'title' => $translator->translate('Guideline for reviewing'),
            ],
            [
                'url' => '/discussions',
                'title' => $translator->translate('List of all discussions'),
            ],
            [
                'url' =>
                    'https://docs.google.com/forms/d/e/1FAIpQLSfMjWIZZq2_AoHbqNv3AOEjQRBwA8qEZIMJpk5l0vX7w2nwnQ/viewform',
                'title' => $translator->translate(
                    'Questionnaire for reviewers'
                ),
            ],
        ];

        return $helpLinks;
    }
}
