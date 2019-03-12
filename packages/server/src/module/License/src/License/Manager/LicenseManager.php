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
namespace License\Manager;

use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ConfigAwareTrait;
use Common\Traits\FlushableTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use License\Entity\LicenseAwareInterface;
use License\Entity\LicenseInterface;
use License\Exception;
use License\Form\LicenseForm;
use Zend\EventManager\EventManagerAwareTrait;
use ZfcRbac\Service\AuthorizationService;

class LicenseManager implements LicenseManagerInterface
{
    use ClassResolverAwareTrait, ObjectManagerAwareTrait;
    use InstanceManagerAwareTrait, EventManagerAwareTrait;
    use AuthorizationAssertionTrait, FlushableTrait;

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceManagerInterface $instanceManager,
        ObjectManager $objectManager
    ) {
        $this->setAuthorizationService($authorizationService);
        $this->classResolver   = $classResolver;
        $this->instanceManager = $instanceManager;
        $this->objectManager   = $objectManager;
    }

    public function createLicense(LicenseForm $form)
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $this->assertGranted('license.create', $instance);

        if (!$form->isValid()) {
            throw new Exception\RuntimeException(print_r($form->getMessages(), true));
        }

        /* @var $entity \License\Entity\LicenseInterface */
        $entity = $form->getObject();
        $entity->setInstance($instance);
        $form->bind($entity);
        $this->getObjectManager()->persist($entity);

        return $entity;
    }

    public function findAllLicenses()
    {
        $className = $this->getClassResolver()->resolveClassName('License\Entity\LicenseInterface');
        $licenses  = $this->getObjectManager()->getRepository($className)->findAll();
        foreach ($licenses as $license) {
            $this->assertGranted('license.get', $license);
        }
        return $licenses;
    }

    public function getDefaultLicense()
    {
        $className = $this->getClassResolver()->resolveClassName('License\Entity\LicenseInterface');
        $license   = $this->getObjectManager()->getRepository($className)->findOneBy(
            [
                'default' => true,
            ]
        );

        if (!is_object($license)) {
            throw new Exception\Runtimeexception(sprintf('No default license set for for %s', $license->getName()));
        }

        return $license;
    }

    public function getLicense($id)
    {
        $className = $this->getClassResolver()->resolveClassName('License\Entity\LicenseInterface');
        $license   = $this->getObjectManager()->find($className, $id);

        if (!is_object($license)) {
            throw new Exception\LicenseNotFoundException(sprintf('License not found by id `%s`.', $id));
        }

        $this->assertGranted('license.get', $license);

        return $license;
    }

    public function getLicenseForm($id = null)
    {
        if ($id !== null) {
            $license = $this->getLicense($id);
        } else {
            $license = $this->getClassResolver()->resolve('License\Entity\LicenseInterface');
        }
        $form = new LicenseForm();
        $form->bind($license);
        return $form;
    }

    public function injectLicense(LicenseAwareInterface $object, LicenseInterface $license = null)
    {
        if (!$license) {
            $license = $this->getDefaultLicense();
        }
        $object->setLicense($license);
        $this->getObjectManager()->persist($object);
        $this->getEventManager()->trigger('inject', $this, ['object' => $object, 'license' => $license]);
    }

    public function removeLicense($id)
    {
        $license = $this->getLicense($id);
        $this->assertGranted('license.purge', $license);
        $this->getObjectManager()->remove($license);
    }

    public function updateLicense(LicenseForm $form)
    {
        $form->bind($form->getObject());
        if (!$form->isValid()) {
            throw new Exception\RuntimeException(print_r($form->getMessages(), true));
        }
        $license = $form->getObject();
        $this->assertGranted('license.update', $license);
        $this->getObjectManager()->persist($license);
    }
}
