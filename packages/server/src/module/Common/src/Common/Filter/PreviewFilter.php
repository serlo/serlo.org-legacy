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
namespace Common\Filter;

use Zend\Filter\FilterInterface;
use Zend\Filter\StripTags;

class PreviewFilter implements FilterInterface
{

    /**
     * @var string
     */
    protected $append;

    /**
     * @var int
     */
    protected $length;

    /**
     * @param int    $length
     * @param string $append
     */
    public function __construct($length = 150, $append = ' ...')
    {
        $this->length = $length;
        $this->append = $append;
    }

    /**
     * @param string $value
     * @return string
     */
    public function filter($value)
    {
        $value     = trim($value);
        $stripTags = new StripTags();
        $value     = $stripTags->filter($value);
        $length    = $this->length;

        if (strlen($value) <= $length) {
            return $value;
        }

        $appendLength = strlen($this->append);
        $length       = $length - $appendLength;
        $words        = explode(' ', $value);
        $return       = '';

        foreach ($words as $word) {
            $word = trim($word);
            if (strlen($return . ' ' . $word) > $length) {
                break;
            }
            $return .= ' ' . $word;
        }

        if (strlen(trim($return)) < 1) {
            return substr($value, 0, $length) . $this->append;
        }

        $return = trim($return) . $this->append;
        $return = preg_replace('/[\$\%]/i', '', $return); // Remove LaTeX Stuff
        // Remove Newlines and Backslashes and trim whitespaces
        $return = preg_replace('/[\n\\\\]/i', ' ', $return);
        $return = preg_replace('/[\s]{2,}/i', ' ', $return);
        return $return;
    }
}
