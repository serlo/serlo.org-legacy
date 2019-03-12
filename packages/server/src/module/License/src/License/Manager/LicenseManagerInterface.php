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

use Common\ObjectManager\Flushable;
use Instance\Entity\InstanceInterface;
use License\Entity\LicenseAwareInterface;
use License\Entity\LicenseInterface;
use License\Form\LicenseForm;

interface LicenseManagerInterface extends Flushable
{

    /**
     * @param int $id
     * @return LicenseInterface
     */
    public function getLicense($id);

    /**
     * @param LicenseForm $form
     * @return LicenseInterface
     */
    public function createLicense(LicenseForm $form);

    /**
     * @param int $id
     * @return void
     */
    public function removeLicense($id);

    /**
     * @return LicenseInterface[]
     */
    public function findAllLicenses();

    /**
     * @param LicenseForm $form
     * @return void
     */
    public function updateLicense(LicenseForm $form);

    /**
     * @param int $id
     * @return LicenseForm
     */
    public function getLicenseForm($id = null);

    /**
     * @param LicenseAwareInterface $object
     * @param LicenseInterface      $license
     * @return void
     */
    public function injectLicense(LicenseAwareInterface $object, LicenseInterface $license = null);

    /**
     * @return LicenseInterface
     */
    public function getDefaultLicense();
}
