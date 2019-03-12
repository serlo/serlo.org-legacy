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
namespace Subject\Hydrator;

use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Navigation\Provider\ContainerProviderInterface;
use Subject\Manager\SubjectManagerAwareTrait;
use Subject\Manager\SubjectManagerInterface;
use Zend\Stdlib\ArrayUtils;

class Navigation implements ContainerProviderInterface
{
    use SubjectManagerAwareTrait, InstanceManagerAwareTrait;

    protected $path;

    public function __construct(InstanceManagerInterface $instanceManager, SubjectManagerInterface $subjectManager)
    {
        $this->subjectManager  = $subjectManager;
        $this->instanceManager = $instanceManager;
    }

    public function provide($container)
    {
        $config   = [];
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $subjects = $this->getSubjectManager()->findSubjectsByInstance($instance);
        foreach ($subjects as $subject) {
            $config = ArrayUtils::merge(
                $config,
                include $this->path . $instance->getName() . '/' . strtolower(
                    $subject->getName()
                    ) . '/navigation.config.php'
            );
        }

        return $config;
    }

    public function setPath($path)
    {
        $this->path = $path;
    }
}
