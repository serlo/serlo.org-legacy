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

namespace StaticPage\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use StaticPage\DatenschutzRevision;

class DatenschutzController extends AbstractActionController
{
    public function indexAction()
    {
        $this->layout('layout/1-col');

        return $this->renderRevision($this->getCurrentRevision());
    }

    public function archiveIndexAction()
    {
        $view = new ViewModel([
            'revisions' => $this->getHydratedRevisions(),
        ]);

        $this->layout('layout/1-col');
        $view->setTemplate('static/de/datenschutz/archive');

        return $view;
    }

    public function archiveViewAction()
    {
        $revision = $this->params('revision');

        return $this->renderRevision($revision);
    }

    public function jsonAction()
    {
        return new JsonModel($this->getRevisions());
    }

    private function renderRevision(string $revision)
    {
        $view = new ViewModel([
            'revision' => $this->hydrateRevision($revision),
        ]);

        $view->setTemplate('static/de/datenschutz/revision-' . $revision);

        return $view;
    }

    /**
     * @return string[]
     */
    private function getRevisions()
    {
        $config = $this->getServiceLocator()->get('Config');
        return $config['datenschutz']['revisions'];
    }

    /**
     * @return string
     */
    private function getCurrentRevision()
    {
        return $this->getRevisions()[0];
    }

    /**
     * @return DatenschutzRevision[]
     */
    private function getHydratedRevisions()
    {
        return array_map(function ($revision) {
            return $this->hydrateRevision($revision);
        }, $this->getRevisions());
    }

    /**
     * @param string $revision
     * @return DatenschutzRevision
     */
    private function hydrateRevision(string $revision)
    {
        return new DatenschutzRevision($revision, $revision === $this->getCurrentRevision());
    }
}
