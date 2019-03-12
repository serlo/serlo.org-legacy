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
namespace Mailman\Renderer;

use Mailman\Model\Mail;
use Zend\View\Model\ViewModel;
use Zend\View\Renderer\RendererInterface;

class MailRenderer implements MailRendererInterface
{
    /**
     * @var string
     */
    protected $route;

    /**
     * @var RendererInterface
     */
    protected $renderer;


    public function __construct($renderer)
    {
        $this->renderer = $renderer;
    }

    public function renderMail($data)
    {
        $subjectData = key_exists('subject', $data) ? $data['subject'] : null;
        $bodyData = key_exists('body', $data) ? $data['body'] : null;

        $subject = new ViewModel($subjectData);
        $subject->setTemplate($this->route . '/subject');

        $body = new ViewModel($bodyData);
        $body->setTemplate($this->route . '/body');

        $plain = new ViewModel($bodyData);
        $plain->setTemplate($this->route . '/plain');

        return new Mail($this->renderer->render($subject), $this->renderer->render($body), $this->renderer->render($plain));
    }

    public function setTemplateFolder($route)
    {
        $this->route = $route;
    }
}
