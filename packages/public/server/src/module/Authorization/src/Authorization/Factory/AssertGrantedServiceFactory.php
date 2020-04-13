<?php

namespace Authorization\Factory;

use Authorization\Service\AssertGrantedService;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZfcRbac\Service\AuthorizationService;

class AssertGrantedServiceFactory implements FactoryInterface
{
    /**
     * @inheritDoc
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $service = new AssertGrantedService();

        /** @var AuthorizationService $authorizationService */
        $authorizationService = $serviceLocator->get(AuthorizationService::class);
        $service->setAuthorizationService($authorizationService);

        return $service;
    }
}
