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
namespace Link\Listener;

use Common\Listener\AbstractSharedListenerAggregate;
use Zend\EventManager\Event;

class EntityManagerListener extends AbstractSharedListenerAggregate
{
    use\Entity\Manager\EntityManagerAwareTrait, \Link\Service\LinkServiceAwareTrait,
        \Entity\Options\ModuleOptionsAwareTrait;

    public function onCreate(Event $e)
    {
        /* var $entity \Entity\Entity\EntityInterface */
        $entity = $e->getParam('entity');
        $data   = $e->getParam('data');

        if (!array_key_exists('link', $data)) {
            return;
        }

        $options = $data['link'];
        $type    = $options['type'];

        if (isset($options['child'])) {
            $child       = $entity;
            $parent      = $this->getEntityManager()->getEntity($options['child']);
            $linkOptions = $this->getModuleOptions()->getType(
                $parent->getType()->getName()
            )->getComponent($type);

            $this->getLinkService()->associate($parent, $child, $linkOptions);
        } elseif (isset($options['parent'])) {
            $parent      = $entity;
            $child       = $this->getEntityManager()->getEntity($options['child']);
            $linkOptions = $this->getModuleOptions()->getType(
                $parent->getType()->getName()
            )->getComponent($type);

            $this->getLinkService()->associate($parent, $child, $linkOptions);
        }
    }

    /*
     * (non-PHPdoc) @see \Zend\EventManager\SharedListenerAggregateInterface::attachShared()
     */
    public function attachShared(\Zend\EventManager\SharedEventManagerInterface $events)
    {
        $this->listeners[] = $events->attach(
            $this->getMonitoredClass(),
            'create',
            [
                $this,
                'onCreate',
            ],
            2
        );
    }

    /*
     * (non-PHPdoc) @see \Common\Listener\AbstractSharedListenerAggregate::getMonitoredClass()
     */
    protected function getMonitoredClass()
    {
        return 'Entity\Manager\EntityManager';
    }
}
