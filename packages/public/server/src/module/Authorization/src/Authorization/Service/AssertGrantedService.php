<?php

namespace Authorization\Service;

use Authorization\Exception\UnauthorizedException;
use ZfcRbac\Service\AuthorizationServiceAwareTrait;

class AssertGrantedService implements AssertGrantedServiceInterface
{
    use AuthorizationServiceAwareTrait;

    /** @inheritDoc */
    public function assert($permission, $context = null)
    {
        if (!$this->getAuthorizationService()->isGranted($permission, $context)) {
            throw new UnauthorizedException();
        }
    }
}
