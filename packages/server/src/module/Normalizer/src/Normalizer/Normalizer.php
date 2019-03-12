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
namespace Normalizer;

use Normalizer\Adapter\AdapterPluginManager;
use Zend\Cache\Storage\StorageInterface;
use Zend\I18n\Translator\TranslatorAwareTrait;
use Zend\ServiceManager\ServiceLocatorAwareTrait;

class Normalizer implements NormalizerInterface
{
    use TranslatorAwareTrait;

    /**
     * @var Adapter\AdapterPluginManager
     */
    protected $pluginManager;

    /**
     * @var StorageInterface
     */
    protected $storage;


    /**
     * @var array
     */
    protected $adapters = [
        'Attachment\Entity\ContainerInterface'  => 'Normalizer\Adapter\AttachmentAdapter',
        'Discussion\Entity\CommentInterface'    => 'Normalizer\Adapter\CommentAdapter',
        'Entity\Entity\EntityInterface'         => 'Normalizer\Adapter\EntityAdapter',
        'Entity\Entity\RevisionInterface'       => 'Normalizer\Adapter\EntityRevisionAdapter',
        'Page\Entity\PageRepositoryInterface'   => 'Normalizer\Adapter\PageRepositoryAdapter',
        'Page\Entity\PageRevisionInterface'     => 'Normalizer\Adapter\PageRevisionAdapter',
        'Blog\Entity\PostInterface'             => 'Normalizer\Adapter\PostAdapter',
        'Taxonomy\Entity\TaxonomyTermInterface' => 'Normalizer\Adapter\TaxonomyTermAdapter',
        'User\Entity\UserInterface'             => 'Normalizer\Adapter\UserAdapter',
    ];

    public function __construct(StorageInterface $storage, AdapterPluginManager $pluginManager = null)
    {
        if (!$pluginManager) {
            $pluginManager = new AdapterPluginManager();
        }
        $this->pluginManager = $pluginManager;
        $this->storage       = $storage;
    }

    public function normalize($object)
    {
        if (!is_object($object)) {
            throw new Exception\InvalidArgumentException(sprintf('Expected object but got %s.', gettype($object)));
        }

        // $key = hash('sha256', serialize($object));

        // if ($this->storage->hasItem($key)) {
        //    return $this->storage->getItem($key);
        // }

        foreach ($this->adapters as $class => $adapterClass) {
            if ($object instanceof $class) {
                /* @var $adapterClass Adapter\AdapterInterface */
                $adapter    = $this->pluginManager->get($adapterClass);
                $adapter->setTranslator($this->translator);
                $normalized = $adapter->normalize($object);
                // $this->storage->setItem($key, $normalized);
                return $normalized;
            }
        }

        throw new Exception\NoSuitableAdapterFoundException($object);
    }
}
