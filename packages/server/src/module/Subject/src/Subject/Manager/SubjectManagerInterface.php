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
namespace Subject\Manager;

use Doctrine\Common\Collections\ArrayCollection;
use Entity\Entity\EntityInterface;
use Instance\Entity\InstanceInterface;
use Taxonomy\Entity\TaxonomyTermInterface;

interface SubjectManagerInterface
{

    /**
     * @param string            $name
     * @param InstanceInterface $instance
     * @return TaxonomyTermInterface
     */
    public function findSubjectByString($name, InstanceInterface $instance);

    /**
     * @param InstanceInterface $instance
     * @return ArrayCollection|TaxonomyTermInterface[]
     */
    public function findSubjectsByInstance(InstanceInterface $instance);

    /**
     * @param int $id
     * @return TaxonomyTermInterface
     */
    public function getSubject($id);

    /**
     * @param TaxonomyTermInterface $subject
     * @return EntityInterface[]
     */
    public function getUnrevisedRevisions(TaxonomyTermInterface $subject);

    /**
     * @param TaxonomyTermInterface $subject
     * @return EntityInterface[]
     */
    public function getTrashedEntities(TaxonomyTermInterface $subject);
}
