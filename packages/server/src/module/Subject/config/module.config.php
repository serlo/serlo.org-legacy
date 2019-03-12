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
namespace Subject;

return [
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Options\ModuleOptions'  => __NAMESPACE__ . '\Factory\ModuleOptionsFactory',
            __NAMESPACE__ . '\Manager\SubjectManager' => __NAMESPACE__ . '\Factory\SubjectManagerFactory',
            __NAMESPACE__ . '\Hydrator\Navigation'    => __NAMESPACE__ . '\Factory\NavigationFactory',
            __NAMESPACE__ . '\Storage\SubjectStorage' => __NAMESPACE__ . '\Factory\SubjectStorageFactory',
        ],
    ],
    'view_helpers'    => [
        'factories' => [
            'subject' => __NAMESPACE__ . '\Factory\SubjectHelperFactory',
        ],
    ],
    'taxonomy'        => [
        'types' => [
            'topic-folder'            => [
                'allowed_associations' => [
                    'Entity\Entity\EntityInterface',
                ],
                'allowed_parents'      => [
                    'topic',
                ],
                'rootable'             => false,
            ],
            'topic'                   => [
                'allowed_parents'      => [
                    'subject',
                    'topic',
                ],
                'allowed_associations' => [
                    'Entity\Entity\EntityInterface',
                ],
                'rootable'             => false,
            ],
            'subject'                 => [
                'allowed_parents' => [
                    'root',
                ],
                'rootable'        => false,
            ],
            'locale'                  => [
                'allowed_parents' => [
                    'subject',
                    'locale',
                ],
                'rootable'        => false,
            ],
            'curriculum'              => [
                'allowed_parents' => [
                    'subject',
                    'locale',
                ],
                'rootable'        => false,
            ],
            'curriculum-topic'        => [
                'allowed_associations' => [
                    'Entity\Entity\EntityInterface',
                ],
                'allowed_parents'      => [
                    'curriculum',
                    'curriculum-topic',
                ],
                'rootable'             => false,
            ],
            'curriculum-topic-folder' => [
                'allowed_associations' => [
                    'Entity\Entity\EntityInterface',
                ],
                'allowed_parents'      => [
                    'curriculum-topic',
                ],
                'rootable'             => false,
            ],
        ],
    ],
    'router'          => [
        'routes' => [
            'subject' => [
                'type'         => 'Subject',
                'options'      => [
                    'route'      => '/:subject',
                    'identifier' => 'subject',
                ],
                'child_routes' => [
                    'entity' => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/entity/:action',
                            'defaults' => [
                                'controller' => __NAMESPACE__ . '\Controller\EntityController',
                                'action'     => 'index',
                            ],
                        ],
                    ],
                    //'home'   => [
                    //    'type'    => 'segment',
                    //    'options' => [
                    //        'route'    => '',
                    //        'defaults' => [
                    //            'controller' => __NAMESPACE__ . '\Controller\HomeController',
                    //            'action'     => 'index',
                    //        ]
                    //    ]
                    //]
                ],
            ],
        ],
    ],
    'route_manager'   => [
        'invokables' => [
            'Subject' => __NAMESPACE__ . '\Route\SubjectRoute',
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\TaxonomyController',
            __NAMESPACE__ . '\Controller\EntityController',
            __NAMESPACE__ . '\Controller\HomeController',
        ],
        'definition'          => [
            'class' => [
                __NAMESPACE__ . '\Controller\HomeController'     => [
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                    'setSubjectManager'  => [
                        'required' => true,
                    ],
                    'setTaxonomyManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\TaxonomyController' => [
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                    'setSubjectManager'  => [
                        'required' => true,
                    ],
                    'setTaxonomyManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\EntityController'   => [
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                    'setSubjectManager'  => [
                        'required' => true,
                    ],
                    'setTaxonomyManager' => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                __NAMESPACE__ . '\Manager\SubjectManagerInterface' => __NAMESPACE__ . '\Manager\SubjectManager',
            ],
        ],
    ],
];
