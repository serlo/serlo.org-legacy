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
namespace Normalizer\Controller;

use Blog\Entity\PostInterface;
use Entity\Entity\EntityInterface;
use Instance\Manager\InstanceManagerInterface;
use Page\Entity\PageRepositoryInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use Uuid\Entity\UuidInterface;
use Uuid\Manager\UuidManagerInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class SitemapController extends AbstractActionController
{
    /**
     * @var InstanceManagerInterface
     */
    protected $instanceManager;

    /**
     * @var UuidManagerInterface
     */
    protected $uuidManager;

    public function __construct(InstanceManagerInterface $instanceManager, UuidManagerInterface $uuidManager)
    {
        $this->instanceManager = $instanceManager;
        $this->uuidManager     = $uuidManager;
    }

    public function indexAction()
    {
        $view = new ViewModel();
        $this->getResponse()->getHeaders()->addHeaders(
            [
                'Content-Type' => 'text/html',
            ]
        );
        $view->setTemplate('normalizer/sitemap');
        $view->setTerminal(true);
        return $view;
    }

    public function uuidAction()
    {
        // Todo unhack
        $objects  = $this->uuidManager->findAll();
        $objects  = $objects->filter(
            function (UuidInterface $object) {
                $isGood = $object instanceof TaxonomyTermInterface || $object instanceof PageRepositoryInterface;
                $isGood = $isGood || $object instanceof EntityInterface || $object instanceof PostInterface;
                if ($object instanceof EntityInterface) {
                    $name = $object->getType()->getName();
                    $isGood = $isGood && $object->hasCurrentRevision()
                        && (in_array(
                            $name,
                            ['article', 'course', 'video']
                        ));
                }
                return !$object->isTrashed() && $isGood;
            }
        );
        $view = new ViewModel(['objects' => $objects]);
        $this->getResponse()->getHeaders()->addHeaders(
            [
                'Content-Type' => 'text/html',
            ]
        );
        $view->setTemplate('normalizer/sitemap-uuid');
        $view->setTerminal(true);
        return $view;
    }
}
