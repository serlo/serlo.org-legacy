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
namespace Common\Hydrator;

use Doctrine\Common\Persistence\ObjectManager;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject;

class HydratorPluginAwareDoctrineObject extends DoctrineObject
{

    /**
     * @var \Common\Hydrator\HydratorPluginManager
     */
    protected $pluginManager;

    /**
     * @var array
     */
    protected $pluginWhitelist;

    /**
     * Constructor
     *
     * @param ObjectManager         $objectManager   The ObjectManager to use
     * @param HydratorPluginManager $pluginManager   The PluginManager to use
     * @param array                 $pluginWhitelist Leave empty to use all plugins registered in the PluginManager
     * @param bool                  $byValue         If set to true, hydrator will always use entity's public API
     */
    public function __construct(
        ObjectManager $objectManager,
        HydratorPluginManager $pluginManager,
        $pluginWhitelist = [],
        $byValue = true
    ) {
        parent::__construct($objectManager, $byValue);
        $this->pluginManager = $pluginManager;
    }

    public function hydrate(array $data, $object)
    {
        $this->prepare($object);
        $plugins = $this->getPlugins();
        /* @var $plugin HydratorPluginInterface */
        foreach ($plugins as $plugin) {
            $data = $plugin->hydrate($object, $data);
        }
        return parent::hydrate($data, $object);
    }

    public function extract($object)
    {
        $data    = parent::extract($object);
        $plugins = $this->getPlugins();

        /* @var $plugin HydratorPluginInterface */
        foreach ($plugins as $plugin) {
            $pluginExtraction = $plugin->extract($object);
            if (!empty($pluginExtraction)) {
                $data = array_merge($data, $pluginExtraction);
            }
        }
    }

    protected function getPlugins()
    {
        $instantiate = [];
        $plugins     = [];

        if (empty($this->pluginWhitelist)) {
            foreach ($this->pluginManager->getRegisteredServices() as $type) {
                foreach ($type as $plugin) {
                    $instantiate[] = $plugin;
                }
            }
        } else {
            $instantiate = $this->pluginWhitelist;
        }

        foreach ($instantiate as $whitelistedPlugin) {
            $plugins[] = $this->pluginManager->get($whitelistedPlugin);
        }

        return $plugins;
    }
}
