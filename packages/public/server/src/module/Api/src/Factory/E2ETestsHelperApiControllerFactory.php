<?php

namespace Api\Factory;

use Api\Controller\E2ETestsHelperApiController;
use Api\Manager\E2ETestsHelperApiManager;
use Api\Manager\NotificationApiManager;
use Common\Factory\AbstractControllerFactory;
use Zend\Cache\StorageFactory;
use Zend\ServiceManager\ServiceLocatorInterface;

class E2ETestsHelperApiControllerFactory extends AbstractControllerFactory
{
    public function createController(ServiceLocatorInterface $serviceManager)
    {
        /** @var NotificationApiManager $notificationApiManager */
        $notificationApiManager = $serviceManager->get(
            NotificationApiManager::class
        );
        /** @var E2ETestsHelperApiManager $e2eManager */
        $e2eManager = $serviceManager->get(E2ETestsHelperApiManager::class);
        /** @var bool $isActive */
        $isActive = $serviceManager->get('config')['is_development_env'];
        $storage = StorageFactory::factory([
            'adapter' => [
                'name' => 'apc',
                'options' => [
                    'namespace' => E2ETestsHelperApiController::class,
                    'ttl' => 60 * 60,
                ],
            ],
            'plugins' => [
                'exception_handler' => [
                    'throw_exceptions' => false,
                ],
                'serializer',
            ],
        ]);
        return new E2ETestsHelperApiController(
            $isActive,
            $notificationApiManager,
            $e2eManager,
            $storage
        );
    }
}
