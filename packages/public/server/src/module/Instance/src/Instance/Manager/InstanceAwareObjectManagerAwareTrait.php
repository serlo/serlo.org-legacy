<?php

namespace Instance\Manager;

trait InstanceAwareObjectManagerAwareTrait
{
    /** @var InstanceAwareEntityManager */
    protected $objectManager;

    /**
     * @return InstanceAwareEntityManager $objectManager
     */
    public function getObjectManager()
    {
        return $this->objectManager;
    }

    public function setObjectManager(InstanceAwareEntityManager $objectManager)
    {
        $this->objectManager = $objectManager;
        return $this;
    }
}
