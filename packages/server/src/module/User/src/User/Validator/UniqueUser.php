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
namespace User\Validator;

use DoctrineModule\Validator\UniqueObject;

class UniqueUser extends UniqueObject
{
    /**
     * (non-PHPdoc)
     *
     * @see \DoctrineModule\Validator\UniqueObject::isValid()
     */
    public function isValid($value, $context = null)
    {
        $value = $this->cleanSearchValue($value);
        $match = $this->objectRepository->findOneBy($value);

        if (!is_object($match)) {
            return true;
        }

        /*$expectedIdentifiers = $this->getExpectedIdentifiers($context);
        $foundIdentifiers    = $this->getFoundIdentifiers($match);

        if (count(array_diff_assoc($expectedIdentifiers, $foundIdentifiers)) == 0) {
            return true;
        }*/

        $this->error(self::ERROR_OBJECT_NOT_UNIQUE, $value);
        return false;
    }
}
