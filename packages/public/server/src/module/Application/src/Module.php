<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Application;

use Zend\EventManager\EventInterface;
use Zend\ModuleManager\Feature\BootstrapListenerInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\InitProviderInterface;
use Zend\ModuleManager\ModuleEvent;
use Zend\ModuleManager\ModuleManagerInterface;

class Module implements
    BootstrapListenerInterface,
    ConfigProviderInterface,
    InitProviderInterface
{
    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function init(ModuleManagerInterface $moduleManager)
    {
        $events = $moduleManager->getEventManager();
        $events->attach(ModuleEvent::EVENT_MERGE_CONFIG, [
            $this,
            'onMergeConfig',
        ]);
    }

    public function onBootstrap(EventInterface $e)
    {
        $t = $e->getTarget();

        $t->getEventManager()->attach(
            $t
                ->getServiceManager()
                ->get('ZfcRbac\View\Strategy\UnauthorizedStrategy')
        );
    }

    public function onMergeConfig(ModuleEvent $e)
    {
        $configListener = $e->getConfigListener();
        $config = $configListener->getMergedConfig(false);

        // Prioritise Zend\View\Strategy\JsonStrategy over other view strategies
        if (!isset($config['view_manager']['strategies'])) {
            return;
        }
        $jsonStrategyIndex = array_search(
            'Zend\View\Strategy\JsonStrategy',
            $config['view_manager']['strategies']
        );
        if ($jsonStrategyIndex !== false) {
            unset($config['view_manager']['strategies'][$jsonStrategyIndex]);
            array_unshift(
                $config['view_manager']['strategies'],
                'Zend\View\Strategy\JsonStrategy'
            );
            $configListener->setMergedConfig($config);
        }
    }
}
