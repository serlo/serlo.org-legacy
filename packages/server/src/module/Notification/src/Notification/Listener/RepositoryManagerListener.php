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
namespace Notification\Listener;

use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class RepositoryManagerListener extends AbstractListener
{
    public function onCommitRevision(Event $e)
    {
        $repository = $e->getParam('repository');
        $data       = $e->getParam('data');
        $user       = $e->getParam('author');

        foreach ($data as $params) {
            if (is_array($params) && array_key_exists('subscription', $params)) {
                $param = $params['subscription'];
                if ($param['subscribe'] === '1') {
                    $notifyMailman = $param['mailman'] === '1' ? true : false;
                    $this->subscribe($user, $repository, $notifyMailman);
                }
            }
        }
    }

    public function attachShared(SharedEventManagerInterface $events)
    {
        $events->attach(
            $this->getMonitoredClass(),
            'commit',
            [
                $this,
                'onCommitRevision',
            ],
            2
        );
    }

    protected function getMonitoredClass()
    {
        return 'Versioning\RepositoryManager';
    }
}
