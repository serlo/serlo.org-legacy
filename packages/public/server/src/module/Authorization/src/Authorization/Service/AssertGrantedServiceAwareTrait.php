<?php

namespace Authorization\Service;

trait AssertGrantedServiceAwareTrait
{
    /** @var AssertGrantedServiceInterface */
    protected $assertGrantedService;

    public function setAssertGrantedService(AssertGrantedServiceInterface $assertGrantedService)
    {
        $this->assertGrantedService = $assertGrantedService;
    }

    public function getAssertGrantedService()
    {
        return $this->assertGrantedService;
    }
}
