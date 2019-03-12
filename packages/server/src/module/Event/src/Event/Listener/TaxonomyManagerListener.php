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
namespace Event\Listener;

use Taxonomy\Entity\TaxonomyTermInterface;
use Zend\EventManager\Event;

class TaxonomyManagerListener extends AbstractListener
{
    public function attachShared(\Zend\EventManager\SharedEventManagerInterface $events)
    {
        $class = $this->getMonitoredClass();
        $events->attach($class, 'parent.change', [$this, 'onParentChange']);
        $events->attach($class, 'create', [$this, 'onCreate']);
        $events->attach($class, 'update', [$this, 'onUpdate']);
        $events->attach($class, 'associate', [$this, 'onAssociate']);
        $events->attach($class, 'dissociate', [$this, 'onDissociate']);
    }

    protected function getMonitoredClass()
    {
        return 'Taxonomy\Manager\TaxonomyManager';
    }

    public function onAssociate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term     = $e->getParam('term');
        $instance = $term->getInstance();

        $this->logEvent(
            'taxonomy/term/associate',
            $instance,
            $term,
            [
                [
                    'name'  => 'object',
                    'value' => $e->getParam('object'),
                ],
            ]
        );
    }

    public function onCreate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term     = $e->getParam('term');
        $instance = $term->getInstance();

        $this->logEvent('taxonomy/term/create', $instance, $term);
    }

    public function onDissociate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term     = $e->getParam('term');
        $instance = $term->getInstance();

        $this->logEvent(
            'taxonomy/term/dissociate',
            $instance,
            $term,
            [
                [
                    'name'  => 'object',
                    'value' => $e->getParam('object'),
                ],
            ]
        );
    }

    public function onParentChange(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term     = $e->getParam('term');
        $from     = $e->getParam('from');
        $to       = $e->getParam('to');
        $instance = $term->getInstance();

        $this->logEvent(
            'taxonomy/term/parent/change',
            $instance,
            $term,
            [
                [
                    'name'  => 'from',
                    'value' => $from ? $from : 'no parent',
                ],
                [
                    'name'  => 'to',
                    'value' => $to ? $from : 'no parent',
                ],
            ]
        );
    }

    public function onUpdate(Event $e)
    {
        /* @var $term TaxonomyTermInterface */
        $term     = $e->getParam('term');
        $instance = $term->getInstance();

        $this->logEvent('taxonomy/term/update', $instance, $term);
    }
}
