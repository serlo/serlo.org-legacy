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
namespace Common\Traits;

use Zend\Http\Response;
use Zend\View\Model\JsonModel;

trait ControllerHelperTrait
{
    protected function badRequestResponse($reason = null)
    {
        $this->getResponse()->setStatusCode(Response::STATUS_CODE_400);
        return $reason == null
            ? $this->response
            : new JsonModel(['reason' => $reason]);
    }

    protected function forbiddenResponse($reason = null)
    {
        $this->getResponse()->setStatusCode(Response::STATUS_CODE_403);
        return $reason == null
            ? $this->response
            : new JsonModel(['reason' => $reason]);
    }

    protected function notFoundResponse()
    {
        $this->getResponse()->setStatusCode(Response::STATUS_CODE_404);
        return $this->response;
    }

    protected function createJsonResponse($data)
    {
        $this->response
            ->getHeaders()
            ->addHeaderLine('Content-Type', 'application/json');
        $this->response->setContent($data);
        return $this->response;
    }
}
