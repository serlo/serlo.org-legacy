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
namespace Normalizer\Adapter;

use Attachment\Entity\ContainerInterface;
use Blog\Entity\PostInterface;
use DateTime;
use Discussion\Entity\CommentInterface;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Normalizer\Entity\Normalized;
use Normalizer\Exception\InvalidArgumentException;
use Normalizer\Exception\NoSuitableAdapterFoundException;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
use Taxonomy\Entity\TaxonomyTermInterface;
use User\Entity\UserInterface;
use Uuid\Entity\UuidInterface;
use Zend\I18n\Translator\TranslatorAwareTrait;
use Zend\I18n\Translator\TranslatorInterface;

abstract class AbstractAdapter
{
    use TranslatorAwareTrait;

    /** @var UuidInterface */
    protected $object;

    public function __construct(
        UuidInterface $object,
        TranslatorInterface $translator
    ) {
        $this->object = $object;
        $this->setTranslator($translator);
    }

    public function normalize()
    {
        return new Normalized([
            'title' => $this->getTitle(),
            'content' => $this->getContent(),
            'type' => $this->getType(),
            'routeName' => $this->getRouteName(),
            'routeParams' => $this->getRouteParams(),
            'id' => $this->getId(),
            'metadata' => [
                'title' => $this->getHeadTitle(),
                'creationDate' => $this->getCreationDate()
                    ? $this->getCreationDate()
                    : new DateTime(),
                'description' => $this->getDescription(),
                'metaDescription' => $this->getMetaDescription(),
                'keywords' => $this->getKeywords(),
                'lastModified' => $this->getLastModified()
                    ? $this->getLastModified()
                    : new DateTime(),
                'robots' => $this->isTrashed() ? 'noindex' : 'all',
            ],
        ]);
    }

    /** @return string */
    abstract protected function getContent();

    /** @return string */
    abstract protected function getCreationDate();

    /** @return string */
    protected function getDescription()
    {
        return $this->getContent();
    }

    /** @return string */
    protected function getMetaDescription()
    {
        return $this->getDescription();
    }

    /** @return DateTime */
    protected function getLastModified()
    {
        return new DateTime();
    }

    /** @return int */
    abstract protected function getId();

    /** @return string */
    abstract protected function getKeywords();

    /** @return string */
    abstract protected function getPreview();

    /** @return string */
    abstract protected function getRouteName();

    /** @return array */
    abstract protected function getRouteParams();

    /** @return string */
    abstract protected function getTitle();

    /** @return string */
    abstract protected function getType();

    /** @return boolean */
    abstract protected function isTrashed();

    /** @return string */
    protected function getHeadTitle()
    {
        return $this->getTitle();
    }

    /**
     * @param mixed $object
     * @return AbstractAdapter
     */
    protected function createAdapter($object)
    {
        return AbstractAdapter::create($object, $this->translator);
    }

    protected static $adapters = [
        ContainerInterface::class => AttachmentAdapter::class,
        CommentInterface::class => CommentAdapter::class,
        EntityInterface::class => EntityAdapter::class,
        RevisionInterface::class => EntityRevisionAdapter::class,
        PageRepositoryInterface::class => PageRepositoryAdapter::class,
        PageRevisionInterface::class => PageRevisionAdapter::class,
        PostInterface::class => PostAdapter::class,
        TaxonomyTermInterface::class => TaxonomyTermAdapter::class,
        UserInterface::class => UserAdapter::class,
    ];

    /**
     * @param mixed $object
     * @param TranslatorInterface $translator
     * @return AbstractAdapter
     */
    public static function create($object, TranslatorInterface $translator)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException(
                sprintf('Expected object but got %s.', gettype($object))
            );
        }

        foreach (AbstractAdapter::$adapters as $class => $adapterClass) {
            if ($object instanceof $class) {
                return new $adapterClass($object, $translator);
            }
        }
        throw new NoSuitableAdapterFoundException($object);
    }
}
