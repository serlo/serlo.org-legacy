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
namespace License\Hydrator;

use License\Entity;
use License\Exception;
use Zend\Stdlib\Hydrator\HydratorInterface;

class LicenseHydrator implements HydratorInterface
{
    public function extract($object)
    {
        /* @var $object Entity\LicenseInterface */
        if (!$object instanceof Entity\LicenseInterface) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 1 to be an instance of LicenseInterface but got `%s`',
                get_class($object)
            ));
        }

        return [
            'title'     => $object->getTitle(),
            'url'       => $object->getUrl(),
            'content'   => $object->getContent(),
            'iconHref'  => $object->getIconHref(),
            'agreement' => $object->getAgreement(),
            'default'   => $object->isDefault(),
        ];
    }

    public function hydrate(array $data, $object)
    {
        /* @var $object Entity\LicenseInterface */
        if (!$object instanceof Entity\LicenseInterface) {
            throw new Exception\InvalidArgumentException(sprintf(
                'Expected parameter 1 to be an instance of LicenseInterface but got `%s`',
                get_class($object)
            ));
        }

        $object->setContent($data['content']);
        $object->setTitle($data['title']);
        $object->setUrl($data['url']);
        $object->setIconHref($data['iconHref']);
        $object->setAgreement($data['agreement']);
        $object->setDefault($data['default']);

        return $object;
    }
}
