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
namespace Normalizer\Controller;

use Attachment\Entity\Container;
use Discussion\Entity\CommentInterface;
use Entity\Entity\EntityInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class SignpostController extends AbstractActionController
{
    use UuidManagerAwareTrait;

    public function metaAction()
    {
        $object = $this->getUuidManager()->getUuid($this->params('id'), false);

        if ($object instanceof EntityInterface) {
            $type = 'entity';
        } elseif ($object instanceof Container) {
            $type = 'attachment';
        } elseif ($object instanceof CommentInterface) {
            $type = 'comment';
        } elseif ($object instanceof TaxonomyTermInterface) {
            $type = 'taxonomyTerm';
        } else {
            $type = 'Could not detect type';
        }

        return new JsonModel([
            'id' => $object->getId(),
            'type' => $type,
        ]);
    }

    public function refAction()
    {
        $this->redirect()->toRoute('alias', [
            'alias' => $this->params('object'),
        ]);
        $this->getResponse()->setStatusCode(301);
        return false;
    }
}
