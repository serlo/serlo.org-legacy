<?php

namespace Authentication\Storage;

interface UserSessionStorageInterface
{
    /**
     * @param bool $rememberMe
     * @return void
     */
    public function setRememberMe($rememberMe = false);
}
