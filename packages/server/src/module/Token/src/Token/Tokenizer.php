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
namespace Token;

use Token\Provider;
use Token\Provider\ProviderInterface;

class Tokenizer implements TokenizerInterface
{
    use\Zend\ServiceManager\ServiceLocatorAwareTrait;

    /**
     * @var Provider\ProviderInterface
     */
    protected $provider;

    /**
     * @return Provider\ProviderInterface $provider
     */
    public function getProvider()
    {
        return $this->provider;
    }

    /**
     * @param ProviderInterface $provider
     * @return self
     */
    protected function setProvider(ProviderInterface $provider)
    {
        $this->provider = $provider;
        return $this;
    }

    public function transliterate($provider, $object, $tokenString)
    {
        if (! is_object($provider)) {
            $provider = $this->getServiceLocator()->get($provider);
        }

        $this->setProvider($provider);
        $this->getProvider()->setObject($object);

        // WHY DO YOU NOT WORK WHEN { IS THE FIRST CHAR
        $tokenString = ':' . $tokenString;

        $returnString = $tokenString;

        $token = strtok($tokenString, '{');
        while ($token !== false) {
            $token = strtok('}');
            $replace = '{' . $token . '}';
            $with = $this->transliterateToken($token);
            $limit = 1;
            $returnString = str_replace($replace, $with, $returnString, $limit);
            $token = strtok('{');
        }

        // WHY DO YOU NOT WORK WHEN { IS THE FIRST CHAR
        $return = substr($returnString, 1);
        return $return;
    }

    protected function transliterateToken($token)
    {
        $data = $this->getProvider()->getData();
        if (! array_key_exists($token, $data)) {
            throw new \Token\Exception\RuntimeException(sprintf('Token `%s` not provided by `%s`', $token, get_class($this->getProvider())));
        }
        return $data[$token];
    }
}
