<?php

namespace Uuid\Controller;

use DateTime;
use Entity\Entity\EntityInterface;
use Entity\Entity\RevisionInterface;
use Page\Entity\PageRepositoryInterface;
use Page\Entity\PageRevisionInterface;
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
            'trashed' => $uuid->getTrashed(),
        ];

        if ($uuid instanceof EntityInterface) {
            $data['discriminator'] = 'entity';
            $data['type'] = $uuid->getType()->getName();
            $data['instance'] = $uuid->getInstance()->getSubdomain();
            $data['date'] = $uuid->getTimestamp()->format(DateTime::ATOM);
            $data['currentRevisionId'] = $uuid->getCurrentRevision()->getId();
            $data['licenseId'] = $uuid->getLicense()->getId();
        }

        if ($uuid instanceof RevisionInterface) {
            $data['discriminator'] = 'entityRevision';
            $data['date'] = $uuid->getTimestamp()->format(DateTime::ATOM);
            /** @var EntityInterface $entity */
            $entity = $uuid->getRepository();
            $data['type'] = $entity->getType()->getName();
            $data['repositoryId'] = $entity->getId();
            $data['fields'] = [];
            foreach ($uuid->getFields() as $field) {
                $data['fields'] [$field->getName()] = $field->getValue();
            }
        }

        if ($uuid instanceof PageRepositoryInterface) {
            $data['discriminator'] = 'page';
            $data['currentRevisionId'] = $uuid->getCurrentRevision()->getId();
        }

        if ($uuid instanceof PageRevisionInterface) {
            $data['discriminator'] = 'pageRevision';
            $data['title'] = $uuid->getTitle();
            $data['content'] = $uuid->getContent();
            $data['date'] = $uuid->getTimestamp()->format(DateTime::ATOM);
            $data['repositoryId'] = $uuid->getRepository()->getId();
        }

        return new JsonModel($data);
    }
}
