<?php

namespace Authorization\Service;

use Authorization\Exception\UnauthorizedException;

interface AssertGrantedServiceInterface
{
    /**
     * @param string $permission
     * @param mixed $context
     * @return void
     * @throws UnauthorizedException
     */
    public function assert($permission, $context = null);
}
