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
namespace Attachment\Manager;

use Attachment\Entity\ContainerInterface;
use Attachment\Exception;
use Attachment\Form\AttachmentFieldsetProvider;
use Attachment\Options\ModuleOptions;
use Authorization\Service\AuthorizationAssertionTrait;
use ClassResolver\ClassResolverAwareTrait;
use ClassResolver\ClassResolverInterface;
use Common\Traits\ConfigAwareTrait;
use Common\Traits\ObjectManagerAwareTrait;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Persistence\ObjectManager;
use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Type\TypeManagerAwareTrait;
use Type\TypeManagerInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\Filter\File\RenameUpload;
use ZfcRbac\Service\AuthorizationService;
use ZfcRbac\Service\AuthorizationServiceAwareTrait;
use Google\Cloud\ServiceBuilder;

class AttachmentManager implements AttachmentManagerInterface
{
    use ClassResolverAwareTrait;
    use AuthorizationAssertionTrait, ObjectManagerAwareTrait;
    use InstanceManagerAwareTrait, TypeManagerAwareTrait;

    /**
     * @var \Attachment\Options\ModuleOptions
     */
    protected $moduleOptions;

    /**
     * @var \Google\Cloud\Storage\Bucket
     */
    protected $bucket;

    public function __construct(
        AuthorizationService $authorizationService,
        ClassResolverInterface $classResolver,
        InstanceManagerInterface $instanceManager,
        ModuleOptions $moduleOptions,
        TypeManagerInterface $typeManager,
        ObjectManager $objectManager
    ) {
        $this->authorizationService = $authorizationService;
        $this->classResolver        = $classResolver;
        $this->instanceManager      = $instanceManager;
        $this->typeManager          = $typeManager;
        $this->objectManager        = $objectManager;
        $this->moduleOptions        = $moduleOptions;

        $gcloud = new ServiceBuilder([
            'projectId' => $this->moduleOptions->getProjectId(),
        ]);

        $this->bucket = $gcloud->storage()->bucket($this->moduleOptions->getBucket());
    }

    /**
     * @param $path
     * @return bool|string
     */
    protected static function findParentPath($path)
    {
        $dir         = __DIR__;
        $previousDir = '.';
        while (!is_dir($dir . '/' . $path) && !file_exists($dir . '/' . $path)) {
            $dir = dirname($dir);
            if ($previousDir === $dir) {
                return false;
            }
            $previousDir = $dir;
        }

        return $dir . '/' . $path;
    }

    public function attach(AttachmentFieldsetProvider $form, $type = 'file', $appendId = null)
    {
        if (!$form->isValid()) {
            throw new Exception\RuntimeException(print_r($form->getMessages(), true));
        }

        if (!$appendId) {
            $this->assertGranted('attachment.create');
            $attachment = $this->createAttachment();
            $type       = $this->getTypeManager()->findTypeByName($type);
            $attachment->setType($type);
        } else {
            $attachment = $this->getAttachment($appendId);
            $this->assertGranted('attachment.append', $attachment);
        }

        $data = $form->getData()['attachment'];
        if (!isset($data['file']) || $data['file']['error']) {
            throw new Exception\NoFileSent;
        }

        $file        = $data['file'];
        $filename    = $file['name'];
        $size        = $file['size'];
        $filetype    = $file['type'];
        $pathinfo    = pathinfo($filename);
        $extension   = isset($pathinfo['extension']) ? '.' . $pathinfo['extension'] : '';
        $hash        = uniqid() . '_' . hash('ripemd160', $filename) . $extension;
        $location    = $file['tmp_name'];
        $webLocation = $this->moduleOptions->getWebpath() . '/' . $hash;
        $contentLanguage = $this->getInstanceManager()->getInstanceFromRequest()->getLanguage()->getCode();

        $this->bucket->upload(
            fopen($location, 'r'),
            [
                'resumable' => true,
                'name' => $hash,
                'metadata' => [
                    'name' => $filename,
                    'contentLanguage' => $contentLanguage,
                ],
            ]
        );

        return $this->attachFile($attachment, $filename, $webLocation, $size, $filetype);
    }

    public function flush()
    {
        $this->getObjectManager()->flush();
    }

    public function getAttachment($id)
    {
        /* @var $entity \Attachment\Entity\ContainerInterface */
        $entity = $this->getObjectManager()->find(
            $this->getClassResolver()->resolveClassName('Attachment\Entity\ContainerInterface'),
            $id
        );

        if (!is_object($entity)) {
            throw new Exception\AttachmentNotFoundException(sprintf('Upload "%s" not found', $id));
        }

        return $entity;
    }

    public function getFile($attachmentId, $fileId = null)
    {
        $attachment = $this->getAttachment($attachmentId);
        $this->assertGranted('attachment.get', $attachment);

        if ($fileId) {
            $criteria = Criteria::create()->where(Criteria::expr()->eq('id', $fileId));
            $matching = $attachment->getFiles()->matching($criteria);
            $file     = $matching->first();

            if (!is_object($file)) {
                throw new Exception\FileNotFoundException(sprintf('Container found, but file id does not exist.'));
            }

            return $file;
        } else {
            return $attachment->getFirstFile();
        }
    }

    protected function attachFile(ContainerInterface $attachment, $filename, $location, $size, $type)
    {
        $file = $this->getClassResolver()->resolve('Attachment\Entity\FileInterface');

        $file->setFilename($filename);
        $file->setLocation($location);
        $file->setSize($size);
        $file->setType($type);
        $file->setAttachment($attachment);
        $attachment->addFile($file);
        $this->getObjectManager()->persist($file);

        return $attachment;
    }

    protected function createAttachment()
    {
        /* @var $attachment ContainerInterface */
        $attachment = $this->getClassResolver()->resolve('Attachment\Entity\ContainerInterface');
        $instance   = $this->getInstanceManager()->getInstanceFromRequest();

        $attachment->setInstance($instance);
        $this->getObjectManager()->persist($attachment);

        return $attachment;
    }
}
