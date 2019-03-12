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
namespace Event\View\Helper;

use Event\Entity\EventLogInterface;
use Event\EventManagerAwareTrait;
use Event\EventManagerInterface;
use Event\Exception;
use User\Entity\UserInterface;
use Zend\View\Helper\AbstractHelper;

class EventLog extends AbstractHelper
{
    use EventManagerAwareTrait;

    /**
     * @var string
     */
    protected $eventsTemplate = 'event/helper/events';

    /**
     * @var string
     */
    protected $eventTemplate = 'event/helper/event/default';

    /**
     * @param EventManagerInterface $eventManager
     */
    public function __construct(EventManagerInterface $eventManager)
    {
        $this->eventManager = $eventManager;
    }

    /**
     * @return $this
     */
    public function __invoke()
    {
        return $this;
    }

    public function renderEvent($id)
    {
        if (is_numeric($id)) {
            $event = $this->getEventManager()->getEvent($id);
        } elseif ($id instanceof EventLogInterface) {
            $event = $id;
        } else {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected numeric, EventLogInterface or EventServiceInterface but got `%s`',
                gettype($id)
            ));
        }

        return $this->getView()->partial($this->eventTemplate, ['event' => $event]);
    }

    public function countEventsFoundByActorAndNames(UserInterface $user, array $names)
    {
        return $this->getEventManager()->findEventsByNamesAndActor($user, $names)->count();
    }

    public function renderObjectLog($id)
    {
        $events = $this->getEventManager()->findEventsByObject($id);
        return $this->getView()->partial($this->eventsTemplate, ['events' => $events]);
    }

    public function renderUserLog($id, $limit = 50)
    {
        $events = $this->getEventManager()->findEventsByActor($id, $limit);
        return $this->getView()->partial($this->eventsTemplate, ['events' => $events]);
    }
}
