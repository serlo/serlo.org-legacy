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
namespace Alias\Listener;

use Page\Entity\PageRepositoryInterface;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class PageControllerListener extends AbstractListener
{
    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach($this->getMonitoredClass(), 'page.create.postFlush', [$this, 'onUpdate']);
    }

    /**
     * Gets executed on page create
     *
     * @param Event $e
     * @return void
     */
    public function onUpdate(Event $e)
    {
        /* @var $repository PageRepositoryInterface */
        $slug       = $e->getParam('slug');
        $repository = $e->getParam('repository');
        $url        = $e->getTarget()->url()->fromRoute('page/view', ['page' => $repository->getId()], null, null, false);
        $alias      = $this->getAliasManager()->createAlias(
            $url,
            $slug,
            $slug . '-' . $repository->getId(),
            $repository,
            $repository->getInstance()
        );
        $this->getAliasManager()->flush($alias);
    }

    protected function getMonitoredClass()
    {
        return 'Page\Controller\IndexController';
    }
}
