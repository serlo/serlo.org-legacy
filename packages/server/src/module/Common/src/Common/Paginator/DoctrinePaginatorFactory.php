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
namespace Common\Paginator;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Pagination\Paginator;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrinePaginatorAdapter;
use Zend\Paginator\Paginator as ZendPaginator;

/**
 * @category   Zend
 * @package    Paginator
 */
class DoctrinePaginatorFactory
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $entityManager;

    /**
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createPaginator($dql, $page, $limit)
    {
        $offset        = ($page - 1) * $limit;
        $query         = $this->entityManager->createQuery($dql)->setMaxResults($limit)->setFirstResult($offset);
        $paginator     = new Paginator($query);
        $adapter       = new DoctrinePaginatorAdapter($paginator);
        $zendPaginator = new ZendPaginator($adapter);
        $zendPaginator->setCurrentPageNumber($page);
        $zendPaginator->setItemCountPerPage($limit);
        return $zendPaginator;
    }

    public function createPaginatorFromQuery($query, $page, $limit)
    {
        $paginator     = new Paginator($query);
        $adapter       = new DoctrinePaginatorAdapter($paginator);
        $zendPaginator = new ZendPaginator($adapter);
        $zendPaginator->setCurrentPageNumber($page);
        $zendPaginator->setItemCountPerPage($limit);
        return $zendPaginator;
    }
}
