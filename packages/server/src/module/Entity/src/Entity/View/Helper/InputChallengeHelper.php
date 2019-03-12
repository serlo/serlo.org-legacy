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
namespace Entity\View\Helper;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Entity\Entity\EntityInterface;
use Entity\Exception;
use Zend\View\Helper\AbstractHelper;

class InputChallengeHelper extends AbstractHelper
{
    public function __invoke()
    {
        return $this;
    }

    /**
     * @param EntityInterface $entity
     * @return array
     */
    public function fetchInput(EntityInterface $entity)
    {
        foreach ($entity->getValidChildren('link') as $child) {
            if (in_array($child->getType()->getName(), [
                'input-string-normalized-match-challenge',
                'input-number-exact-match-challenge',
                'input-expression-equal-match-challenge',
            ])) {
                return $child;
            }
        }

        return null;
    }

    /**
     * @param EntityInterface $entity
     * @return array
     */
    public function fetchWrongInputs(EntityInterface $entity)
    {
        $wrongInputs = [];

        foreach ($entity->getValidChildren('link') as $child) {
            $revision = $child->getCurrentRevision();

            if ($revision) {
                $wrongInputs[] = [
                    'entity' => $child,
                    'type' => $child->getType()->getName(),
                    'solution' => $revision->get('solution'),
                    'feedback' => $this->view->markdown()->toHtml($revision->get('feedback')),
                ];
            }
        }

        return $wrongInputs;
    }
}
