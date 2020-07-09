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
namespace Authentication\Controller;

use Authentication\Exception\HydraException;
use Authentication\Service\AuthenticationServiceInterface;
use Authentication\Service\HydraService;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class HydraLogoutController extends AbstractActionController
{
    /** @var AuthenticationServiceInterface */
    protected $authenticationService;
    /** @var HydraService */
    protected $hydraService;

    public function __construct(
        AuthenticationServiceInterface $authenticationService,
        HydraService $hydraService
    ) {
        $this->authenticationService = $authenticationService;
        $this->hydraService = $hydraService;
    }

    public function indexAction()
    {
        // Skip consent because OAuth only used internally at the moment
        $challenge = $this->params()->fromQuery('logout_challenge');

        try {
            $this->hydraService->getLogoutRequest($challenge);
            $this->authenticationService->clearIdentity();
            $acceptResponse = $this->hydraService->acceptLogoutChallenge(
                $challenge
            );
            return $this->redirect()->toUrl($acceptResponse['redirect_to']);
        } catch (HydraException $error) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
            return new JsonModel([
                'error' => $error->getMessage(),
            ]);
        }
    }
}
