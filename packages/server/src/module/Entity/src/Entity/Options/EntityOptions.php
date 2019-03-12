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
namespace Entity\Options;

use Entity\Exception;
use Zend\Stdlib\AbstractOptions;

class EntityOptions extends AbstractOptions
{
    /**
     * @var array
     */
    protected $availableComponents = [
        'Entity\Options\RepositoryOptions',
        'Entity\Options\LinkOptions',
        'Entity\Options\RelatedContentOptions',
        'Entity\Options\SearchOptions',
        'Entity\Options\RedirectOptions',
    ];
    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $title = 'title';

    /**
     * @var string
     */
    protected $content = 'content';

    /**
     * @var string
     */
    protected $description = 'description';

    /**
     * @param string $content
     */
    public function setContent($content)
    {
        $this->content = $content;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @var array
     */
    protected $components = [];

    /**
     * @param string $component
     * @return AbstractOptions
     * @throws \Entity\Exception\RuntimeException
     */
    public function getComponent($component)
    {
        if (!$this->hasComponent($component)) {
            throw new Exception\RuntimeException(sprintf('Component "%s" not enabled.', $component));
        }

        $options = $this->components[$component];

        if (!$options instanceof AbstractOptions) {
            $instance = $this->findComponent($component);
            $instance->setFromArray($options);
            $this->components[$component] = $options = $instance;
        }

        return $options;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @param string $component
     * @return bool
     */
    public function hasComponent($component)
    {
        return array_key_exists($component, $this->components);
    }

    /**
     * @param array $components
     */
    public function setComponents($components)
    {
        $this->components = $components;
    }

    /**
     * @param string $key
     * @throws Exception\RuntimeException
     * @return AbstractOptions
     */
    protected function findComponent($key)
    {
        foreach ($this->availableComponents as & $availableComponent) {
            if (!is_object($availableComponent)) {
                $availableComponent = new $availableComponent();
            }
            if ($availableComponent->isValid($key)) {
                return $availableComponent;
            }
        }

        throw new Exception\RuntimeException(sprintf('Could not find a suitable component for "%s"', $key));
    }
}
