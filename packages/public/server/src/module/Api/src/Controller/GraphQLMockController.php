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
namespace Api\Controller;

use Api\Service\AbstractGraphQLService;
use Api\Service\GraphQLMockService;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class GraphQLMockController extends AbstractActionController
{
    /**
     * @var GraphQLMockService
     */
    protected $graphql;

    /**
     * @var boolean
     */
    protected $active;

    public function __construct(AbstractGraphQLService $graphql)
    {
        if ($graphql instanceof GraphQLMockService) {
            $this->active = true;
            $this->graphql = $graphql;
        }
    }

    public function listAction()
    {
        if (!$this->active) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }
        return new JsonModel($this->graphql->get());
    }

    public function clearAction()
    {
        if (!$this->active) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }
        $this->graphql->clear();
        return $this->redirect()->toRoute('api/list');
    }
}
