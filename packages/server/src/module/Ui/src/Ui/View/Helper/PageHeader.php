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
namespace Ui\View\Helper;

use Common\Traits\ConfigAwareTrait;
use Ui\Options\PageHeaderHelperOptions;
use Zend\Filter\StripTags;
use Zend\View\Helper\AbstractHelper;

class PageHeader extends AbstractHelper
{
    /**
     * @var string
     */
    protected $text = '';

    /**
     * @var string
     */
    protected $subtext = '';

    /**
     * @var string|null
     */
    protected $backLink = '';

    /**
     * @var PageHeaderHelperOptions
     */
    protected $options;

    /**
     * @var string
     */
    protected $append = '';

    /**
     * @var string
     */
    protected $prepend = '';

    /**
     * @param PageHeaderHelperOptions $pageHeaderHelperOptions
     */
    public function __construct(PageHeaderHelperOptions $pageHeaderHelperOptions)
    {
        $this->options = $pageHeaderHelperOptions;
    }

    /**
     * @param string $text
     * @return $this
     */
    public function __invoke($text)
    {
        $this->text = $this->getView()->translate((string)$text);
        return $this;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->render();
    }

    /**
     * @param string $string
     * @return $this
     */
    public function append($string)
    {
        $this->append .= $string;
        return $this;
    }

    /**
     * @param string $string
     * @return $this
     */
    public function prepend($string)
    {
        $this->prepend .= $string;
        return $this;
    }

    /**
     * @param bool $setHeadTitle
     * @return string
     */
    public function render($setHeadTitle = true)
    {
        if ($setHeadTitle) {
            $filter = new StripTags();
            $this->getView()->headTitle($filter->filter($this->text));
            if (!empty($this->subtext)) {
                $this->getView()->headTitle($filter->filter($this->subtext));
            }
        }

        return $this->getView()->partial(
            $this->options->getTemplate(),
            [
                'text'     => $this->text,
                'subtext'  => $this->subtext,
                'backLink' => $this->backLink,
                'append'   => $this->append,
                'prepend'  => $this->prepend,
            ]
        );
    }

    /**
     * @param string $backLink
     * @return $this
     */
    public function setBackLink($backLink)
    {
        $this->backLink = $backLink;
        return $this;
    }

    /**
     * @param string $subtext
     * @return $this
     */
    public function setSubtitle($subtext)
    {
        $this->subtext = $this->getView()->translate((string)$subtext);
        return $this;
    }
}
