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

namespace StaticPage\Controller;

use Instance\Manager\InstanceManagerAwareTrait;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use StaticPage\PrivacyRevision;

class PrivacyController extends AbstractActionController
{
    use InstanceManagerAwareTrait;

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
        $view->setTemplate('static/privacy/archive');

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

        $view->setTemplate('static/' . $this->getPrivacyLanguageCode() . '/privacy/revision-' . $revision);

        return $view;
    }

    private function getPrivacyLanguageCode()
    {
        $allRevisions = $this->getServiceLocator()->get('Config')['privacy']['revisions'];
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $language = $instance->getLanguage()->getCode();

        return array_key_exists($language, $allRevisions) ? $language : 'en';
    }

    /**
     * @return string[]
     */
    private function getRevisions()
    {
        $allRevisions = $this->getServiceLocator()->get('Config')['privacy']['revisions'];

        return $allRevisions[$this->getPrivacyLanguageCode()];
    }

    /**
     * @return string
     */
    private function getCurrentRevision()
    {
        return $this->getRevisions()[0];
    }

    /**
     * @return PrivacyRevision[]
     */
    private function getHydratedRevisions()
    {
        return array_map(function ($revision) {
            return $this->hydrateRevision($revision);
        }, $this->getRevisions());
    }

    /**
     * @param string $revision
     * @return PrivacyRevision
     */
    private function hydrateRevision(string $revision)
    {
        return new PrivacyRevision($revision, $revision === $this->getCurrentRevision());
    }
}
