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

namespace Navigation\Service;

use Instance\Manager\InstanceManagerAwareTrait;
use Navigation\Entity\PageInterface;
use Navigation\Entity\ParameterInterface;
use Navigation\Manager\NavigationManagerAwareTrait;

class NavigationService
{
    use InstanceManagerAwareTrait;
    use NavigationManagerAwareTrait;

    public function getNavigation($name)
    {
        $container = $this->navigationManager->findContainerByNameAndInstance(
            $name,
            $this->instanceManager->getInstanceFromRequest()
        );
        return array_map(function ($page) {
            return $this->formatPage($page);
        }, $container->getPages());
    }

    protected function formatPage(PageInterface $page)
    {
        return [
            'parameters' => $this->array_flatten(
                array_map(function ($param) {
                    return $this->formatParameter($param);
                }, $page->getParameters()->toArray())
            ),
            'children' => $page
                ->getChildren()
                ->map(function (PageInterface $child) {
                    return $this->formatPage($child);
                })
                ->toArray(),
        ];
    }

    protected function formatParameter(
        ParameterInterface $parameter,
        $prefix = ''
    ) {
        $key = $prefix . $parameter->getKey()->getName();
        if ($parameter->hasChildren()) {
            return $this->array_flatten(
                array_map(function ($param) use ($key) {
                    return $this->formatParameter($param, $key . '.');
                }, $parameter->getChildren()->toArray())
            );
        }
        return [
            $key => $parameter->getValue(),
        ];
    }

    protected function array_flatten(array $arr)
    {
        if (count($arr) > 0) {
            return array_merge(...$arr);
        }
        return [];
    }
}
