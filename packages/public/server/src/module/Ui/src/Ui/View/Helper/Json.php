<?php


namespace Ui\View\Helper;


use Zend\Form\View\Helper\AbstractHelper;

class Json extends AbstractHelper
{
    public function __invoke()
    {
        return $this;
    }

    public function decode($string)
    {
        return json_decode($string, true);
    }

    public function encode($obj)
    {
        return json_encode($obj);
    }
}
