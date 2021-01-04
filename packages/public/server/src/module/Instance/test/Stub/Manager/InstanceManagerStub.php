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

namespace InstanceTest\Stub\Manager;

use Instance\Entity\InstanceInterface;
use Instance\Exception\InstanceNotFoundException;
use Instance\Manager\InstanceManagerInterface;
use InstanceTest\Fixture\Entity\EnglishInstance;
use InstanceTest\Fixture\Entity\GermanInstance;

class InstanceManagerStub implements InstanceManagerInterface
{
    /** @var InstanceInterface */
    public $germanInstance;
    /** @var InstanceInterface */
    public $englishInstance;
    /** @var InstanceInterface */
    protected $instance;

    public function __construct()
    {
        $this->germanInstance = new GermanInstance();
        $this->englishInstance = new EnglishInstance();
        $this->instance = $this->germanInstance;
    }

    public function useGermanInstance()
    {
        $this->instance = $this->germanInstance;
    }

    public function useEnglishInstance()
    {
        $this->instance = $this->englishInstance;
    }

    public function findInstanceByName($name)
    {
        $result = array_values(
            array_filter($this->findAllInstances(), function ($instance) use (
                $name
            ) {
                return $instance->getName() === $name;
            })
        );
        if (count($result) === 0) {
            throw new InstanceNotFoundException(
                sprintf('Instance %s could not be found', $name)
            );
        }
        return $result[0];
    }

    public function findAllInstances()
    {
        return [$this->germanInstance, $this->englishInstance];
    }

    public function findInstanceBySubDomain($subDomain)
    {
        $result = array_filter(
            array_filter($this->findAllInstances(), function ($instance) use (
                $subDomain
            ) {
                return $instance->getSubdomain() === $subDomain;
            })
        );
        if (count($result) === 0) {
            throw new InstanceNotFoundException(
                sprintf('Instance %s could not be found', $subDomain)
            );
        }
        return $result[0];
    }

    public function getDefaultInstance()
    {
        return $this->germanInstance;
    }

    public function getInstanceFromRequest()
    {
        return $this->instance;
    }

    public function switchInstance($id)
    {
        $this->instance = $this->getInstance($id);
    }

    public function getInstance($id)
    {
        $result = array_filter(
            array_filter($this->findAllInstances(), function ($instance) use (
                $id
            ) {
                return $instance->getId() === $id;
            })
        );
        if (count($result) === 0) {
            throw new InstanceNotFoundException(
                sprintf('Instance %s could not be found', $id)
            );
        }
        return $result[0];
    }
}
