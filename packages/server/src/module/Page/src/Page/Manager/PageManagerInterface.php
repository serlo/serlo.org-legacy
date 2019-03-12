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
namespace Page\Manager;

use Common\ObjectManager\Flushable;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use User\Entity\UserInterface;
use Zend\Form\FormInterface;

interface PageManagerInterface extends Flushable
{
    /**
     * @param FormInterface $form
     * @return PageRepositoryInterface
     */
    public function createPageRepository(FormInterface $form);

    /**
     * @param PageRepositoryInterface $repository
     * @param array                   $data
     * @param UserInterface           $user
     * @return PageRepositoryInterface
     */
    public function createRevision(PageRepositoryInterface $repository, array $data, UserInterface $user);

    /**
     * @param FormInterface           $form
     * @return mixed
     */
    public function editPageRepository(FormInterface $form);

    /**
     * @param int $id
     * @return PageRepositoryInterface;
     */
    public function getPageRepository($id);

    /**
     * @param int $id
     * @return PageRevisionInterface;
     */
    public function getRevision($id);
}
