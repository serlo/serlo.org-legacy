<?php

namespace Admin\Factory;

use Admin\Controller\DebuggerController;
use Authorization\Service\AssertGrantedServiceInterface;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class DebuggerControllerFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $serviceManager = $serviceLocator->getServiceLocator();
        $controller = new DebuggerController();

        /** @var AssertGrantedServiceInterface $assertGrantedService */
        $assertGrantedService = $serviceManager->get(AssertGrantedServiceInterface::class);
        $controller->setAssertGrantedService($assertGrantedService);

        return $controller;
    }
}
