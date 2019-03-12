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
namespace Versioning;

use Authorization\Service\AuthorizationAssertionTrait;
use Common\Traits\InstanceManagerTrait;
use Doctrine\Common\Persistence\ObjectManager;
use Versioning\Entity\RepositoryInterface;
use Versioning\Entity\RevisionInterface;
use Versioning\Options\ModuleOptions;
use Zend\EventManager\EventManagerAwareTrait;
use ZfcRbac\Service\AuthorizationService;

class RepositoryManager implements RepositoryManagerInterface
{
    use EventManagerAwareTrait, AuthorizationAssertionTrait;

    /**
     * @var ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @var RepositoryInterface
     */
    protected $repository;

    /**
     * @var ObjectManager
     */
    protected $objectManager;

    /**
     * @param AuthorizationService $authorizationService
     * @param ModuleOptions        $moduleOptions
     * @param ObjectManager        $objectManager
     */
    public function __construct(
        AuthorizationService $authorizationService,
        ModuleOptions $moduleOptions,
        ObjectManager $objectManager
    ) {
        $this->moduleOptions        = $moduleOptions;
        $this->objectManager        = $objectManager;
        $this->authorizationService = $authorizationService;
    }

    /**
     * {@inheritDoc}
     */
    public function checkoutRevision(RepositoryInterface $repository, $revision, $reason = '')
    {
        if (!$revision instanceof RevisionInterface) {
            $revision = $this->findRevision($repository, $revision);
        }

        $user       = $this->getAuthorizationService()->getIdentity();
        $permission = $this->moduleOptions->getPermission($repository, 'checkout');
        $this->assertGranted($permission, $repository);
        $repository->setCurrentRevision($revision);

        $this->getEventManager()->trigger(
            'checkout',
            $this,
            [
                'repository' => $repository,
                'revision'   => $revision,
                'actor'      => $user,
                'reason'     => $reason,
            ]
        );

        $this->objectManager->persist($repository);
    }

    /**
     * {@inheritDoc}
     */
    public function commitRevision(RepositoryInterface $repository, array $data)
    {
        $user       = $this->getAuthorizationService()->getIdentity();
        $permission = $this->moduleOptions->getPermission($repository, 'commit');
        $revision   = $repository->createRevision();

        $this->assertGranted($permission, $repository);
        $revision->setAuthor($user);
        $repository->addRevision($revision);
        $revision->setRepository($repository);

        foreach ($data as $key => $value) {
            if (is_string($key) && $key !== 'csrf' && is_string($value)) {
                $revision->set($key, $value);
            }
        }

        $this->getEventManager()->trigger(
            'commit',
            $this,
            [
                'repository' => $repository,
                'revision'   => $revision,
                'data'       => $data,
                'author'     => $user,
            ]
        );

        $this->objectManager->persist($revision);

        return $revision;
    }

    /**
     * {@inheritDoc}
     */
    public function findRevision(RepositoryInterface $repository, $id)
    {
        foreach ($repository->getRevisions() as $revision) {
            if ($revision->getId() == $id) {
                return $revision;
            }
        }

        throw new Exception\RevisionNotFoundException(sprintf('Revision "%d" not found', $id));
    }

    /**
     * {@inheritDoc}
     */
    public function findPreviousRevision(RepositoryInterface $repository, RevisionInterface $revision)
    {
        $date = $revision->getTimestamp();

        $previousTimestamp = null;
        $previousRevision = $revision;

        foreach ($repository->getRevisions() as $revision) {
            $timestamp = $revision->getTimestamp();
            if ($timestamp < $date) {
                if ($previousTimestamp === null || $previousTimestamp < $timestamp) {
                    $previousTimestamp = $timestamp;
                    $previousRevision = $revision;
                }
            }
        }
        return $previousRevision;
    }

    /**
     * {@inheritDoc}
     */
    public function flush()
    {
        $this->objectManager->flush();
    }

    /**
     * {@inheritDoc}
     */
    public function rejectRevision(RepositoryInterface $repository, $revision, $reason = '')
    {
        if (!$revision instanceof RevisionInterface) {
            $revision = $this->findRevision($repository, $revision);
        }

        $user       = $this->getAuthorizationService()->getIdentity();
        $permission = $this->moduleOptions->getPermission($repository, 'reject');

        $this->assertGranted($permission, $repository);
        $revision->setTrashed(true);
        $this->objectManager->persist($revision);
        $this->getEventManager()->trigger(
            'reject',
            $this,
            [
                'repository' => $repository,
                'revision'   => $revision,
                'actor'      => $user,
                'reason'     => $reason,
            ]
        );
    }
}
