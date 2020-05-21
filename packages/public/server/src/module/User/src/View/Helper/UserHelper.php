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

namespace User\View\Helper;

use Event\EventManagerAwareTrait;
use User\Entity\UserInterface;
use User\Manager\UserManagerInterface;
use Zend\View\Helper\AbstractHelper;

class UserHelper extends AbstractHelper
{
    use EventManagerAwareTrait;
    /**
     * @var UserManagerInterface
     */
    protected $userManager;

    /**
     * @param UserManagerInterface $userManager
     */
    public function __construct(UserManagerInterface $userManager)
    {
        $this->userManager = $userManager;
    }

    /**
     * @return $this
     */
    public function __invoke()
    {
        return $this;
    }

    /**
     * @return string
     */
    public function getAuthenticatedUserID()
    {
        $user = $this->userManager->getUserFromAuthenticator();
        return $user ? $user->getId() : '';
    }

    /**
     * @return string
     */
    public function getAuthenticatedInterests()
    {
        $user = $this->userManager->getUserFromAuthenticator();
        if (!$user) {
            return '';
        }
        $field = $user->getField('interests');
        if (!$field) {
            return '';
        }
        return $field->getValue();
    }

    public function isNewbie(UserInterface $user): bool
    {
        return $this->getEventManager()
            ->findEventsByNamesAndActor($user, [
                'entity/revision/add',
                'discussion/comment/create',
            ])
            ->count() <= 5;
    }
}
