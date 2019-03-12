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
namespace Link\Service;

use Authorization\Service\AuthorizationAssertionTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Link\Entity\LinkableInterface;
use Link\Entity\LinkInterface;
use Link\Exception;
use Link\Options\LinkOptionsInterface;
use Type\Entity\TypeInterface;
use Type\TypeManagerAwareTrait;
use Zend\EventManager\EventManagerAwareTrait;

class LinkService implements LinkServiceInterface
{
    use ObjectManagerAwareTrait, TypeManagerAwareTrait;
    use AuthorizationAssertionTrait, EventManagerAwareTrait;

    public function associate(
        LinkableInterface $parent,
        LinkableInterface $child,
        LinkOptionsInterface $parentOptions,
        $position = null
    ) {
        $this->assertGranted($parentOptions->getPermission('create'), $child);

        $this->isValidChild($parent, $child, $parentOptions);

        $typeName = $parentOptions->getLinkType();
        $type     = $this->getTypeManager()->findTypeByName($typeName);
        $link     = $parent->createLink();

        if ($position === null) {
            $position = $parent->getChildLinks()->count();
        }

        $link->setParent($parent);
        $link->setChild($child);
        $link->setType($type);
        $link->setPosition($position);

        $this->getEventManager()->trigger(
            'link',
            $this,
            [
                'entity' => $child,
                'parent' => $parent,
            ]
        );

        $this->getObjectManager()->persist($link);

        return $this;
    }

    public function dissociate(
        LinkableInterface $parent,
        LinkableInterface $child,
        LinkOptionsInterface $parentOptions
    ) {
        $this->assertGranted($parentOptions->getPermission('purge'), $child);

        $typeName = $parentOptions->getLinkType();
        $type     = $this->getTypeManager()->findTypeByName($typeName);
        $link     = $this->findLinkByChild($parent, $child->getId(), $type);

        if (is_object($link)) {
            $this->getEventManager()->trigger(
                'unlink',
                $this,
                [
                    'entity' => $child,
                    'parent' => $parent,
                ]
            );

            $this->getObjectManager()->remove($link);
        }

        return $this;
    }

    public function sortChildren(LinkableInterface $parent, $typeName, array $children)
    {
        $type = $this->getTypeManager()->findTypeByName($typeName);
        $i    = 0;

        foreach ($children as $child) {
            if ($child instanceof LinkableInterface) {
                $child = $child->getId();
            }

            $link = $this->findLinkByChild($parent, $child, $type);

            if ($link !== null) {
                $link->setPosition($i);
                $this->getObjectManager()->persist($link);
            }
            $i++;
        }

        return $this;
    }

    public function sortParents(LinkableInterface $child, $typeName, array $parents)
    {
        $type = $this->getTypeManager()->findTypeByName($typeName);
        $i    = 0;

        foreach ($parents as $parent) {
            if ($parent instanceof LinkableInterface) {
                $parent = $parent->getId();
            }
            $link = $this->findLinkByChild($child, $parent, $type);

            if ($link !== null) {
                $link->setPosition($i);
                $this->getObjectManager()->persist($link);
            }
            $i++;
        }

        return $this;
    }

    protected function findLinkByChild(LinkableInterface $element, $childId, TypeInterface $type)
    {
        /* @var $link LinkInterface */
        foreach ($element->getChildLinks() as $link) {
            if ($link->getChild()->getId() == $childId && $link->getType() === $type) {
                return $link;
            }
        }

        return null;
    }

    protected function findLinkByParent(LinkableInterface $element, $parentId, TypeInterface $type)
    {
        /* @var $link LinkInterface */
        foreach ($element->getParentLinks() as $link) {
            if ($link->getParent()->getId() === $parentId && $link->getType() === $type) {
                return $link;
            }
        }

        return null;
    }

    protected function isValidChild(LinkableInterface $parent, LinkableInterface $child, LinkOptionsInterface $options)
    {
        $childType  = $child->getType()->getName();
        $parentType = $parent->getType()->getName();

        if (!$options->isChildAllowed($childType)) {
            throw new Exception\RuntimeException(sprintf('Child type "%s" is not allowed.', $childType));
        }

        if (!$options->allowsManyChildren($childType)) {
            /* @var $childLink \Link\Entity\LinkInterface */
            foreach ($parent->getChildLinks() as $childLink) {
                if ($childLink->getChild()->getType()->getName() == $childType
                ) {
                    throw new Exception\RuntimeException(sprintf(
                        'Child type "%s" does not allow multiple children.',
                        $childType
                    ));
                }
            }
        }

        return true;
    }
}
