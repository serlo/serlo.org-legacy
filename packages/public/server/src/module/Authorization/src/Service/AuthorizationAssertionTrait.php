<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Authorization\Service;

use User\Entity\UserInterface;
use ZfcRbac\Exception\UnauthorizedException;
use ZfcRbac\Service\AuthorizationServiceAwareTrait;

trait AuthorizationAssertionTrait
{
    use AuthorizationServiceAwareTrait;

    /**
     * Assert that access is granted
     *
     * @return void
     * @throws UnauthorizedException
     */
    protected function assertGranted(
        string $permission,
        $context = null,
        UserInterface $user = null
    ) {
        $roles = $user == null ? null : $user->getRoles()->toArray();
        $isGranted = !$this->getAuthorizationService()->isGranted(
            $permission,
            $context,
            $roles
        );
        if ($isGranted) {
            throw new UnauthorizedException(
                sprintf('Permission %s was not granted.', $permission)
            );
        }
    }
}
