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
namespace Subject\Controller;

use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Subject\Manager\SubjectManagerAwareTrait;
use Subject\Manager\SubjectManagerInterface;
use Taxonomy\Manager\TaxonomyManagerAwareTrait;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;

class AbstractController extends AbstractActionController
{
    use SubjectManagerAwareTrait, InstanceManagerAwareTrait, TaxonomyManagerAwareTrait;

    public function __construct(
        InstanceManagerInterface $instanceManager,
        SubjectManagerInterface $subjectManager,
        TaxonomyManagerInterface $taxonomyManager
    ) {
        $this->instanceManager = $instanceManager;
        $this->subjectManager  = $subjectManager;
        $this->taxonomyManager = $taxonomyManager;
    }

    /**
     * @param null $id
     * @return \Taxonomy\Entity\TaxonomyTermInterface
     */
    public function getSubject($id = null)
    {
        $subject = $id ? : $this->params()->fromRoute('subject');

        if (is_numeric($subject)) {
            return $this->getSubjectManager()->getSubject($id);
        }

        return $this->getSubjectManager()->findSubjectByString(
            $subject,
            $this->getInstanceManager()->getInstanceFromRequest()
        );
    }

    public function getTerm($id = null)
    {
        $id = $this->params()->fromRoute('id', $id);
        return $this->taxonomyManager->getTerm($id);
    }
}
