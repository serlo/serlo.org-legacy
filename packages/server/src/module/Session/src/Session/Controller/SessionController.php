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

namespace Session\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Config\SessionConfig;
use Zend\Session\SaveHandler\SaveHandlerInterface;

class SessionController extends AbstractActionController
{
    /**
     * @var SessionConfig
     */
    protected $config;

    /**
     * @var SaveHandlerInterface
     */
    protected $saveHandler;

    public function __construct(SaveHandlerInterface $saveHandler, SessionConfig $config)
    {
        $this->saveHandler = $saveHandler;
        $this->config      = $config;
    }

    public function gcAction()
    {
        $lifetime = $this->config->getRememberMeSeconds();
        $this->saveHandler->gc($lifetime);
        return 'success';
    }
}
