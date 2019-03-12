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
namespace Normalizer\Adapter;

use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\Exception;

class AdapterPluginManager extends AbstractPluginManager
{
    /**
     * @var array
     */
    protected $invokableClasses = [
        'Normalizer\Adapter\AttachmentAdapter',
        'Normalizer\Adapter\CommentAdapter',
        'Normalizer\Adapter\EntityAdapter',
        'Normalizer\Adapter\EntityRevisionAdapter',
        'Normalizer\Adapter\PageRepositoryAdapter',
        'Normalizer\Adapter\PageRevisionAdapter',
        'Normalizer\Adapter\PostAdapter',
        'Normalizer\Adapter\TaxonomyTermAdapter',
        'Normalizer\Adapter\UserAdapter',
    ];

    /**
     * Validate the plugin
     * Checks that the filter loaded is either a valid callback or an instance
     * of FilterInterface.
     *
     * @param  mixed $plugin
     * @return void
     * @throws Exception\RuntimeException if invalid
     */
    public function validatePlugin($plugin)
    {
        if (!$plugin instanceof AdapterInterface) {
            throw new Exception\RuntimeException(sprintf(
                'Expected AdapterInterface but got %s',
                is_object($plugin) ? get_class($plugin) : gettype($plugin)
            ));
        }
    }
}
