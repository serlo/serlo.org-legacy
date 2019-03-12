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
return [
    // Zend Di
    'di' => [
        'instance' => [
            'preferences' => [
                'Zend\ServiceManager\ServiceLocatorInterface' => 'ServiceManager',
                'Doctrine\Common\Persistence\ObjectManager' => 'Doctrine\ORM\EntityManager',
            ],
        ],
    ],

    // Zend i18n
    'translator' => [
        'locale' => 'en_US',
        'translation_file_patterns' => [
            [
                'type' => 'gettext',
                'base_dir' => __DIR__ . '/../../lang',
                'pattern' => '%s/LC_MESSAGES/athene2.mo',
            ],
        ],
    ],

    // Zend Router
    'router' => [
        'router_class' => 'Zend\Mvc\Router\Http\TranslatorAwareTreeRouteStack',
    ],

    // Zend Session
    'session' => [
        'config' => [
            'class' => 'Zend\Session\Config\SessionConfig',
            'options' => [
                'name' => 'athene2',
                'cookie_lifetime' => 2419200,
                'remember_me_seconds' => 2419200,
                'use_cookies' => true,
                'cookie_secure' => false,
            ],
        ],
        'storage' => 'Zend\Session\Storage\SessionArrayStorage',
        'validators' => [
            'Zend\Session\Validator\RemoteAddr',
            'Zend\Session\Validator\HttpUserAgent',
        ],
    ],
];
