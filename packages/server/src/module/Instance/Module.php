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
namespace Instance;

use Instance\Manager\InstanceAwareEntityManager;
use Zend\I18n\Translator\Translator;
use Zend\I18n\Translator\TranslatorAwareInterface;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Validator\AbstractValidator;

class Module
{
    /**
     * @var array
     */
    public static $listeners = [
        'Instance\Listener\IsolationBypassedListener',
    ];

    public function getAutoloaderConfig()
    {
        $autoloader = [];

        $autoloader['Zend\Loader\StandardAutoloader'] = [
            'namespaces' => [
                __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
            ],
        ];

        if (file_exists(__DIR__ . '/autoload_classmap.php')) {
            return [
                'Zend\Loader\ClassMapAutoloader' => [
                    __DIR__ . '/autoload_classmap.php',
                ],
            ];
        }

        return $autoloader;
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function onBootstrap(MvcEvent $e)
    {
        $app            = $e->getApplication();
        $serviceManager = $app->getServiceManager();
        $eventManager   = $app->getEventManager();

        /* @var $translator Translator */
        $translator = $serviceManager->get('MvcTranslator');
        $router     = $serviceManager->get('Router');

        /* @var $instanceManager Manager\InstanceManager */
        $instanceManager = $serviceManager->get('Instance\Manager\InstanceManager');
        $instance        = $instanceManager->getInstanceFromRequest();
        $language        = $instance->getLanguage();
        $code            = $language->getCode();
        $locale          = $language->getLocale() . '.UTF-8';

        if ($router instanceof TranslatorAwareInterface) {
            $router->setTranslator($translator);
        }

        AbstractValidator::setDefaultTranslator($translator);

        if (!setlocale(LC_ALL, $locale) || !setlocale(LC_MESSAGES, $locale)) {
            throw new \Exception(sprintf(
                'Either gettext is not enabled or locale %s is not installed on this system',
                $locale
            ));
        }

        putenv('LC_ALL=' . $locale);
        putenv('LC_MESSAGES=' . $locale);

        if (function_exists('bindtextdomain')) {
            bindtextdomain('athene2', __DIR__ . '/../../lang');
        }
        if (function_exists('bind_textdomain_codeset')) {
            bind_textdomain_codeset('athene2', 'UTF-8');
        }
        if (function_exists('textdomain')) {
            textdomain('athene2');
        }

        $translator->addTranslationFile('PhpArray', __DIR__ . '/../../lang/routes/' . $code . '.php', 'default', $code);
        $translator->setLocale($locale);
        $translator->setFallbackLocale('en_US.UTF-8');

        $eventManager->attach('route', [$this, 'onPreRoute'], 4);
        $eventManager->attach(MvcEvent::EVENT_DISPATCH, array($this, 'onDispatchRegisterListeners'), 1000);

        $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
        if ($entityManager instanceof InstanceAwareEntityManager) {
            $entityManager->setInstance($instance);
        }
    }

    public function onDispatchRegisterListeners(MvcEvent $e)
    {
        $eventManager       = $e->getApplication()->getEventManager();
        $sharedEventManager = $eventManager->getSharedManager();
        foreach (self::$listeners as $listener) {
            $sharedEventManager->attachAggregate(
                $e->getApplication()->getServiceManager()->get($listener)
            );
        }
    }

    public function onPreRoute(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
    }
}
