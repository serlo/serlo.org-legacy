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
namespace CacheInvalidator\Listener;

use CacheInvalidator\Invalidator\InvalidatorManager;
use CacheInvalidator\Options\CacheOptions;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;
use Zend\EventManager\SharedListenerAggregateInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class CacheListener implements SharedListenerAggregateInterface
{
    /**
     * @var CacheOptions
     */
    protected $cacheOptions;

    /**
     * @var ServiceLocatorInterface
     */
    protected $serviceLocator;

    /**
     * @var InvalidatorManager
     */
    protected $strategyManager;

    /**
     * @param CacheOptions       $cacheOptions
     * @param InvalidatorManager $strategyManager
     */
    public function __construct(CacheOptions $cacheOptions, InvalidatorManager $strategyManager)
    {
        $this->cacheOptions    = $cacheOptions;
        $this->strategyManager = $strategyManager;
    }

    /**
     * @param SharedEventManagerInterface $events
     */
    public function attachShared(SharedEventManagerInterface $events)
    {
        $classes = $this->cacheOptions->getListens();
        foreach ($classes as $class => $options) {
            foreach ($options as $event => $invalidators) {
                $strategyManager = $this->strategyManager;
                $events->attach(
                    $class,
                    $event,
                    function (Event $e) use ($class, $event, $invalidators, $strategyManager) {
                        foreach ($invalidators as $invalidator) {
                            $invalidator = $strategyManager->get($invalidator);
                            $invalidator->invalidate($e, $class, $event);
                        }
                    }
                );
            }
        }
    }

    /**
     * Detach all previously attached listeners
     *
     * @param SharedEventManagerInterface $events
     */
    public function detachShared(SharedEventManagerInterface $events)
    {
        // TODO: Implement detachShared() method.
    }
}
