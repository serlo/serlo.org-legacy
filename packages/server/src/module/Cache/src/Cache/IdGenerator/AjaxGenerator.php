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

/**
 * @author Bram Gerritsen bgerritsen@gmail.com
 * @copyright (c) Bram Gerritsen 2013
 * @license http://opensource.org/licenses/mit-license.php
 */

namespace Cache\IdGenerator;

use StrokerCache\Exception\RuntimeException;
use StrokerCache\IdGenerator\IdGeneratorInterface;

class AjaxGenerator implements IdGeneratorInterface
{

    /**
     * {@inheritDoc}
     *
     * @throws RuntimeException
     */
    public function generate()
    {
        if (!isset($_SERVER['REQUEST_URI'])) {
            throw new RuntimeException("Can't auto-detect current page identity");
        }

        $port = ($_SERVER['SERVER_PORT'] == '80') ? '' : (':'.$_SERVER['SERVER_PORT']);
        $scheme = stripos($_SERVER['SERVER_PROTOCOL'], 'https') === 0 ? 'https' : 'http';
        $ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : 'notajax';

        return md5($scheme . '://'.$_SERVER['HTTP_HOST']. $port . $_SERVER['REQUEST_URI'] . $ajax);
    }
}
