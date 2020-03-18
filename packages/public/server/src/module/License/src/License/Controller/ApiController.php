<?php

namespace License\Controller;

use License\Manager\LicenseManagerAwareTrait;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractActionController
{
    use LicenseManagerAwareTrait;

    public function indexAction()
    {
        $id = $this->params('id');
        $license = $this->getLicenseManager()->getLicense($id);
        return new JsonModel([
            'id' => $license->getId(),
            'instance' => $license->getInstance()->getSubdomain(),
            'default' => $license->isDefault(),
            'title' => $license->getTitle(),
            'url' => $license->getUrl(),
            'content' => $license->getContent(),
            'agreement' => $license->getAgreement(),
            'iconHref' => $license->getIconHref(),
        ]);
    }
}
