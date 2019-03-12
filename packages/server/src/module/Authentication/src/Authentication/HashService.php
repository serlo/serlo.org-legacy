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
namespace Authentication;

class HashService implements HashServiceInterface
{
    private $_config = [
        'salt_pattern' => '1,3,5,9,14,15,20,21,28,30',
        'hash_method'  => 'sha1',
    ];


    public function __construct()
    {
        $this->_config['salt_pattern'] = explode(',', $this->_config['salt_pattern']);
    }

    /**
     * @param      $password
     * @param bool $salt
     * @return string
     */
    public function hashPassword($password, $salt = false)
    {
        if ($salt === false) {
            // Create a salt seed, same length as the number of offsets in the pattern
            $salt = substr($this->hash(uniqid(null, true)), 0, count($this->_config['salt_pattern']));
        }

        // Password hash that the salt will be inserted into
        $hash = $this->hash($salt . $password);

        // Change salt to an array
        $salt = str_split($salt, 1);

        // Returned password
        $password = '';

        // Used to calculate the length of splits
        $last_offset = 0;

        foreach ($this->_config['salt_pattern'] as $offset) {
            // Split a new part of the hash off
            $part = substr($hash, 0, $offset - $last_offset);

            // Cut the current part out of the hash
            $hash = substr($hash, $offset - $last_offset);

            // Add the part to the password, appending the salt character
            $password .= $part . array_shift($salt);

            // Set the last offset to the current offset
            $last_offset = $offset;
        }

        // Return the password, with the remaining hash appended
        return $password . $hash;
    }

    /**
     * Perform a hash, using the configured method.
     *
     * @param   string  string to hash
     * @return  string
     */
    private function hash($str)
    {
        return hash($this->_config['hash_method'], $str);
    }

    /**
     * Finds the salt from a password, based on the configured salt pattern.
     *
     * @param   string  hashed password
     * @return  string
     */
    public function findSalt($password)
    {
        $salt = '';

        foreach ($this->_config['salt_pattern'] as $i => $offset) {
            // Find salt characters, take a good long look...
            $salt .= substr($password, $offset + $i, 1);
        }

        return $salt;
    }
}
