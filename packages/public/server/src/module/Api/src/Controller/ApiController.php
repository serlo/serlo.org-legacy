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

namespace Api\Controller;

use Alias\AliasManagerAwareTrait;
use Api\ApiManagerAwareTrait;
use Api\Service\AuthorizationService;
use Exception;
use Instance\Manager\InstanceManagerAwareTrait;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\ValidationData;
use License\Exception\LicenseNotFoundException;
use License\Manager\LicenseManagerAwareTrait;
use Uuid\Exception\NotFoundException;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractApiController
{
    use AliasManagerAwareTrait;
    use ApiManagerAwareTrait;
    use InstanceManagerAwareTrait;
    use LicenseManagerAwareTrait;
    use UuidManagerAwareTrait;

    public function __construct(AuthorizationService $authorizationService)
    {
        parent::__construct($authorizationService);
    }

    public function aliasAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $alias = $this->params('alias');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        $aliases = $this->getAliasManager()->findAliases($alias, $instance);
        if (count($aliases) === 0) {
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }

        $currentAlias = $aliases[0];
        return new JsonModel(
            $this->getApiManager()->getAliasData($currentAlias)
        );
    }

    public function licenseAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = $this->params('id');

        try {
            $license = $this->getLicenseManager()->getLicense($id, false);
            return new JsonModel(
                $this->getApiManager()->getLicenseData($license)
            );
        } catch (LicenseNotFoundException $exception) {
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }
    }

    public function uuidAction()
    {
        $authorizationResponse = $this->assertAuthorization();
        if ($authorizationResponse) {
            return $authorizationResponse;
        }

        $id = $this->params('id');
        try {
            $uuid = $this->getUuidManager()->getUuid($id, false, false);
            return new JsonModel($this->getApiManager()->getUuidData($uuid));
        } catch (NotFoundException $exception) {
            $this->response
                ->getHeaders()
                ->addHeaderLine('Content-Type', 'application/json');
            $this->response->setContent('null');
            return $this->response;
        }
    }
}
