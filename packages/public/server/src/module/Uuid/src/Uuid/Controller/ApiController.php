<?php

namespace Uuid\Controller;

use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Page\Entity\PageRepositoryInterface;
use Uuid\Manager\UuidManagerAwareTrait;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractActionController
{
    use UuidManagerAwareTrait;

    public function indexAction()
    {
        $id = $this->params('id');
        $uuid = $this->getUuidManager()->getUuid($id);

        $data = [
            'id' => $uuid->getId(),
        ];

        if ($uuid instanceof EntityInterface) {
            $data['discriminator'] = 'entity';
            $data['type'] = $uuid->getType()->getName();
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['currentRevisionId'] = $uuid->getCurrentRevision()->getId();
            $data['licenseId'] = $uuid->getLicense()->getId();
        }

        if ($uuid instanceof RevisionInterface) {
            $data['discriminator'] = 'entityRevision';
            /** @var EntityInterface $entity */
            $entity = $uuid->getRepository();
            $data['type'] = $entity->getType()->getName();
            $data['fields'] = [];
            foreach ($uuid->getFields() as $field) {
                $data['fields'] [$field->getName()] = $field->getValue();
            }
        }

        if ($uuid instanceof PageRepositoryInterface) {
            $data['discriminator'] = 'page';
        }

        return new JsonModel($data);
    }
}
