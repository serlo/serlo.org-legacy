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
namespace Instance\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Entity\InstanceInterface;
use Instance\Exception;
use Instance\Options\InstanceOptions;
use Instance\Strategy\StrategyInterface;
use ZfcRbac\Service\AuthorizationService;
use ZfcRbac\Service\AuthorizationServiceAwareTrait;

class InstanceManager implements InstanceManagerInterface
{
    use ObjectManagerAwareTrait, ClassResolverAwareTrait;
    use AuthorizationAssertionTrait;

    /**
     * @var InstanceInterface
     */
    protected $requestInstance;

    /**
     * @var InstanceOptions
     */
    protected $options;

    /**
     * @var StrategyInterface
     */
    protected $strategy;

    /**
     * @param AuthorizationService   $authorizationService
     * @param ClassResolverInterface $classResolver
     * @param InstanceOptions        $options
     * @param ObjectManager          $objectManager
     * @param StrategyInterface      $strategy
     */
    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceOptions $options,
        ObjectManager $objectManager,
        StrategyInterface $strategy
    ) {
        $this->setAuthorizationService($authorizationService);
        $this->classResolver = $classResolver;
        $this->objectManager = $objectManager;
        $this->options       = $options;
        $this->strategy      = $strategy;
    }

    /**
     * {@inheritDoc}
     */
    public function findAllInstances()
    {
        $className  = $this->getClassResolver()->resolveClassName('Instance\Entity\InstanceInterface');
        $collection = $this->getObjectManager()->getRepository($className)->findAll();
        $return     = new ArrayCollection();

        foreach ($collection as $instance) {
            if ($this->getAuthorizationService()->isGranted('instance.get', $instance)) {
                $return->add($instance);
            }
        }

        return $return;
    }

    /**
     * {@inheritDoc}
     */
    public function findInstanceByName($name)
    {
        if (!is_string($name)) {
            throw new Exception\InvalidArgumentException(sprintf('Expected string but got %s', gettype($name)));
        }

        $className = $this->getClassResolver()->resolveClassName('Instance\Entity\InstanceInterface');
        $criteria  = ['name' => $name];
        $instance  = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (!is_object($instance)) {
            throw new Exception\InstanceNotFoundException(sprintf('Instance %s could not be found', $name));
        }

        $this->assertGranted('instance.get', $instance);

        return $instance;
    }

    /**
     * {@inheritDoc}
     */
    public function findInstanceBySubDomain($subDomain)
    {
        if (!is_string($subDomain)) {
            throw new Exception\InvalidArgumentException(sprintf('Expected string but got %s', gettype($subDomain)));
        }

        $className = $this->getClassResolver()->resolveClassName('Instance\Entity\InstanceInterface');
        $criteria  = ['subdomain' => $subDomain];
        $instance  = $this->getObjectManager()->getRepository($className)->findOneBy($criteria);

        if (!is_object($instance)) {
            throw new Exception\InstanceNotFoundException(sprintf('Instance %s could not be found', $subDomain));
        }

        $this->assertGranted('instance.get', $instance);

        return $instance;
    }

    /**
     * {@inheritDoc}
     */
    public function getDefaultInstance()
    {
        return $this->getInstance($this->options->getDefault());
    }

    /**
     * {@inheritDoc}
     */
    public function getInstance($id)
    {
        $className = $this->getClassResolver()->resolveClassName('Instance\Entity\InstanceInterface');
        $instance  = $this->getObjectManager()->find($className, $id);

        if (!is_object($instance)) {
            throw new Exception\InstanceNotFoundException(sprintf('Instance %s could not be found', $id));
        }
        $this->assertGranted('instance.get', $instance);

        return $instance;
    }

    /**
     * {@inheritDoc}
     */
    public function getInstanceFromRequest()
    {
        return $this->strategy->getActiveInstance($this);
    }

    /**
     * {@inheritDoc}
     */
    public function switchInstance($id)
    {
        if (!$id instanceof InstanceInterface) {
            $id = $this->getInstance($id);
        }
        $this->strategy->switchInstance($id);
    }
}
