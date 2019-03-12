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
namespace Navigation\Manager;

use Common\ObjectManager\Flushable;
use Instance\Entity\InstanceInterface;
use Navigation\Entity\ContainerInterface;
use Navigation\Entity\PageInterface;
use Navigation\Entity\ParameterInterface;
use Navigation\Entity\ParameterKeyInterface;
use Navigation\Exception\ContainerNotFoundException;
use Navigation\Exception\PageNotFoundException;
use Navigation\Exception\ParameterNotFoundException;
use Type\Entity\TypeInterface;
use Zend\Form\FormInterface;

interface NavigationManagerInterface extends Flushable
{
    /**
     * @param FormInterface $form
     * @return ContainerInterface
     */
    public function createContainer(FormInterface $form);

    /**
     * @param FormInterface $form
     * @return PageInterface
     */
    public function createPage(FormInterface $form);

    /**
     * @param FormInterface $form
     * @return ParameterInterface
     */
    public function createParameter(FormInterface $form);

    /**
     * @param FormInterface $form
     * @return ParameterKeyInterface
     */
    public function createParameterKey(FormInterface $form);

    /**
     * @param string            $name
     * @param InstanceInterface $instance
     * @return ContainerInterface
     * @throws ContainerNotFoundException
     */
    public function findContainerByNameAndInstance($name, InstanceInterface $instance);

    /**
     * @param InstanceInterface $instance
     * @return ContainerInterface[]
     * @throws ContainerNotFoundException
     */
    public function findContainersByInstance(InstanceInterface $instance);

    /**
     * @param int $id
     * @throws ContainerNotFoundException
     * @return ContainerInterface
     * @throws ContainerNotFoundException
     */
    public function getContainer($id);

    /**
     * @param int $id
     * @return PageInterface
     * @throws PageNotFoundException
     */
    public function getPage($id);

    /**
     * @param int $id
     * @return ParameterInterface
     * @throws ParameterNotFoundException
     */
    public function getParameter($id);

    /**
     * @return ParameterKeyInterface[]
     */
    public function getParameterKeys();

    /**
     * @return TypeInterface[]
     */
    public function getTypes();

    /**
     * @param int $id
     * @return void
     * @throws ContainerNotFoundException
     */
    public function removeContainer($id);

    /**
     * @param int $id
     * @return void
     */
    public function removePage($id);

    /**
     * @param int $id
     * @return void
     */
    public function removeParameter($id);

    /**
     * @param FormInterface $form
     * @return void
     */
    public function updatePage(FormInterface $form);

    /**
     * @param FormInterface $form
     * @return void
     */
    public function updateParameter(FormInterface $form);
}
