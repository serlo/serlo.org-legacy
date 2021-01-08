<?php

namespace Api\Factory;

use Api\Manager\E2ETestsHelperApiManager;
use ClassResolver\ClassResolver;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class E2ETestsHelperApiManagerFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceManager)
    {
        /** @var ClassResolver $classResolver */
        $classResolver = $serviceManager->get(ClassResolver::class);
        /** @var EntityManager */
        $entityManager = $serviceManager->get(EntityManager::class);
        return new E2ETestsHelperApiManager($classResolver, $entityManager);
    }
}
