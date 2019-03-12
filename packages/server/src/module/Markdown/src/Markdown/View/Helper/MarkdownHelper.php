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
namespace Markdown\View\Helper;

use Markdown\Exception\RuntimeException;
use Markdown\Service\RenderServiceAwareTrait;
use Markdown\Service\RenderServiceInterface;
use Zend\View\Helper\AbstractHelper;

class MarkdownHelper extends AbstractHelper
{
    use RenderServiceAwareTrait;

    protected $storage;

    public function __construct(RenderServiceInterface $renderService)
    {
        $this->renderService = $renderService;
    }

    public function __invoke()
    {
        return $this;
    }

    /**
     * @param string $content
     * @param bool   $catch
     * @return string
     */
    public function toHtml($content, $catch = true)
    {
        if ($catch) {
            try {
                return $this->getRenderService()->render($content);
            } catch (RuntimeException $e) {
                return htmlspecialchars($content);
            }
        } else {
            return $this->getRenderService()->render($content);
        }
    }
}
