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
namespace Attachment\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Instance\Entity\InstanceAwareTrait;
use Type\Entity\TypeAwareTrait;
use Uuid\Entity\Uuid;

/**
 * @ORM\Entity
 * @ORM\Table(name="attachment_container")
 */
class Container extends Uuid implements ContainerInterface
{
    use TypeAwareTrait;
    use InstanceAwareTrait;

    /**
     * @ORM\OneToMany(targetEntity="File", mappedBy="attachment")
     * @ORM\OrderBy({"id" = "ASC"})
     */
    protected $files;

    public function __construct()
    {
        $this->files = new ArrayCollection;
    }

    public function getFiles()
    {
        return $this->files;
    }

    public function getFirstFile()
    {
        return $this->files->first();
    }

    public function addFile(FileInterface $file)
    {
        $this->files->add($file);
    }
}
