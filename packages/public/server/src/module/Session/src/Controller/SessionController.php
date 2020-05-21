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

namespace Session\Controller;

use Zend\Log\LoggerInterface;
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
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var string
     */
    protected $secret;

    public function __construct(
        SaveHandlerInterface $saveHandler,
        SessionConfig $config,
        LoggerInterface $logger,
        string $secret
    ) {
        $this->saveHandler = $saveHandler;
        $this->config = $config;
        $this->logger = $logger;
        $this->secret = $secret;
    }

    public function gcAction()
    {
        $response = $this->response;
        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            if ($data['secret'] === $this->secret) {
                $this->logger->info('Session worker started.');
                $lifetime = $this->config->getRememberMeSeconds();
                $this->saveHandler->gc($lifetime);
                try {
                    $lifetime = $this->config->getRememberMeSeconds();
                    $this->saveHandler->gc($lifetime);
                    $this->logger->info(
                        'Session worker finished successfully.'
                    );
                    $response->setStatusCode(200);
                } catch (\Exception $e) {
                    $this->logger->err(
                        'Session worker failed with message ' . $e->getMessage()
                    );
                    $response->setStatusCode(500);
                }
            } else {
                $response->setStatusCode(401);
            }
        } else {
            $response->setStatusCode(404);
        }
        return $response;
    }
}
