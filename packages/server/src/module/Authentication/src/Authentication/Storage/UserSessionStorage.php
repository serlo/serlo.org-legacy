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
namespace Authentication\Storage;

use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Persistence\ObjectManager;
use User\Exception\UserNotFoundException;
use Zend\Authentication\Storage\Session;

class UserSessionStorage extends Session
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;

    protected $rememberTime;

    public function __construct(
        ClassResolverInterface $classResolver,
        ObjectManager $objectManager,
        $rememberTime = 2419200
    ) {
        parent::__construct('authentication');
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
        $this->rememberTime  = $rememberTime;
    }

    public function setRememberMe($rememberMe = false)
    {
        if ($rememberMe) {
            $this->session->getManager()->rememberMe($this->rememberTime);
        }
    }

    public function write($contents)
    {
        $id = $contents->getId();
        parent::write($id);
    }

    public function read()
    {
        $className = $this->getClassResolver()->resolveClassName('User\Entity\UserInterface');
        $id        = parent::read();
        $user      = $this->getObjectManager()->find($className, $id);
        if (!$user) {
            throw new UserNotFoundException(sprintf('User %s not found', $id));
        }

        return $user;
    }

    public function clear()
    {
        $this->session->getManager()->forgetMe();
        parent::clear();
    }
}
