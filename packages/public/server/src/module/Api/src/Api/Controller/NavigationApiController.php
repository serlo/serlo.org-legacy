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

use Exception;
use Instance\Manager\InstanceManagerAwareTrait;
use Navigation\Exception\ContainerNotFoundException;
use Navigation\Service\NavigationServiceAwareTrait;
use Throwable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Router\RouteInterface;
use Zend\View\Model\JsonModel;

class NavigationApiController extends AbstractActionController
{
    use InstanceManagerAwareTrait;
    use NavigationServiceAwareTrait;

    /** @var RouteInterface */
    protected $router;

    public function __construct($router)
    {
        $this->router = $router;
    }

    public function indexAction()
    {
        try {
            $pages = $this->navigationService->getNavigation('default');
            $pages = $this->formatPages($pages);
        } catch (ContainerNotFoundException $e) {
            $pages = [];
        }
        return new JsonModel(['data' => json_encode($pages)]);
    }

    protected function formatPages(array $pages)
    {
        $pages = array_map(function ($page) {
            return $this->formatPage($page);
        }, $pages);
        return array_values(array_filter($pages, function ($page) {
            return isset($page);
        }));
    }

    protected function formatPage(array $page)
    {
        $parameters = $page['parameters'];
        if (count($parameters) === 0) {
            return null;
        }
        if (array_key_exists('visible', $parameters) && $parameters['visible'] === 'false') {
            return null;
        }

        $result = [];

        $children = $this->formatPages($page['children']);
        if (count($children) > 0) {
            $result['children'] = $children;
        }

        if (array_key_exists('label', $parameters) && array_key_exists('uri', $parameters)) {
            $result['label'] = $parameters['label'];
            if ($parameters['uri'] !== '#') {
                preg_match('/\/(\d+)/', $parameters['uri'], $matches);
                if (count($matches) === 2) {
                    $result['label'] = $parameters['label'];
                    $result['id'] = (int)$matches[1];
                } else {
                    $result['url'] = $parameters['uri'];
                }
            }
        }

        if (array_key_exists('label', $parameters) && array_key_exists('route', $parameters)) {
            $result['label'] = $parameters['label'];

            if ($parameters['route'] === 'page/view') {
                $result['id'] = (int)$parameters['params.page'];
            } elseif ($parameters['route'] === 'taxonomy/term/get') {
                $result['id'] = (int)$parameters['params.term'];
            } else {
                try {
                    $routeParams = [];
                    foreach ($parameters as $key => $value) {
                        preg_match('/params\.(.+)/', $key, $matches);
                        if (count($matches) === 2) {
                            $routeParams[$matches[1]] = $value;
                        }
                    }
                    $url = $this->router->assemble($routeParams, ['name' => $parameters['route']]);
                    $result['url'] = $url;
                } catch (Throwable $e) {
                    return null;
                }
            }
        }

        if (count($result) === 0) {
            $data = print_r($page, true);
            throw new Exception("Invalid page" . $data);
        }

        return $result;
    }
}
