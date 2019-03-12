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

namespace Page\Assertion;

use Authorization\Assertion\AssertionInterface;
use Authorization\Result\AuthorizationResult;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use Page\Exception\InvalidArgumentException;
use Rbac\Traversal\Strategy\TraversalStrategyInterface;

class PageAssertion implements AssertionInterface
{


    /**
     * @var TraversalStrategyInterface
     */
    protected $traversalStrategy;

    /**
     * @param TraversalStrategyInterface $traversalStrategy
     */
    public function __construct(TraversalStrategyInterface $traversalStrategy)
    {
        $this->traversalStrategy = $traversalStrategy;
    }

    /**
     * Check if this assertion is true
     *
     * @param  AuthorizationResult $authorization
     * @param  mixed               $context
     * @return bool
     * @throws InvalidArgumentException
     */
    public function assert(AuthorizationResult $authorization, $context = null)
    {
        if ($context instanceof PageRepositoryInterface) {
        } elseif ($context instanceof PageRevisionInterface) {
            $context = $context->getRepository();
        } else {
            throw new InvalidArgumentException;
        }

        $flattened = $this->flattenRoles($authorization->getRoles());

        foreach ($context->getRoles() as $role) {
            if (in_array($role, $flattened)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array $roles
     * @return array
     */
    protected function flattenRoles(array $roles)
    {
        $roleNames = [];
        $iterator  = $this->traversalStrategy->getRolesIterator($roles);

        foreach ($iterator as $role) {
            $roleNames[] = $role;
        }

        return array_unique($roleNames);
    }
}
