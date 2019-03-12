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
namespace Search\Controller;

use Search\Form\SearchForm;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class SearchController extends AbstractActionController
{
    public function searchAction()
    {
        $form = new SearchForm();
        $view = new ViewModel(['form' => $form, 'query' => '']);

        $view->setTemplate('search/search');

        $data = $this->getRequest()->getQuery();
        if (isset($data['q'])) {
            $form->setData($data);
            if ($form->isValid()) {
                $data      = $form->getData();
                $view->setVariable('query', $data['q']);
                $view->setTemplate('search/results');
            }
        }

        return $view;
    }
}
