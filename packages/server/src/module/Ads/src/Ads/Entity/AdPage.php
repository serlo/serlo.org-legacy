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
namespace Ads\Entity;

use Doctrine\ORM\Mapping as ORM;
use Page\Entity\PageRepositoryInterface;
use Instance\Entity\InstanceInterface;

/**
 * An AdPage for Horizon
 *
 * @ORM\Entity
 * @ORM\Table(name="ad_page")
 */
class AdPage implements AdPageInterface
{

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Instance\Entity\Instance")
     * @ORM\JoinColumn(name="instance_id", referencedColumnName="id")
     *
     * @var InstanceInterface
     */
    protected $instance;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Page\Entity\PageRepository")
     * @ORM\JoinColumn(name="page_repository_id", referencedColumnName="id")
     *
     * @var PageRepositoryInterface
     */
    protected $page_repository_id;

    /**
     * @return InstanceInterface
     */
    public function getInstance()
    {
        return $this->instance;
    }

    /**
     * @param InstanceInterface $instance
     */
    public function setInstance(InstanceInterface $instance)
    {
        $this->instance = $instance;
    }

    public function getPageRepository()
    {
        return $this->page_repository_id;
    }

    public function setPageRepository(PageRepositoryInterface $pageRepository)
    {
        $this->page_repository_id = $pageRepository;
    }
}
