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
namespace Discussion;

return [
    'zfc_rbac'        => [
        'assertion_map' => [
            'discussion.create'          => 'Authorization\Assertion\RequestInstanceAssertion',
            'discussion.trash'           => 'Authorization\Assertion\InstanceAssertion',
            'discussion.restore'         => 'Authorization\Assertion\InstanceAssertion',
            'discussion.purge'           => 'Authorization\Assertion\InstanceAssertion',
            'discussion.vote'            => 'Authorization\Assertion\InstanceAssertion',
            'discussion.archive'         => 'Authorization\Assertion\InstanceAssertion',
            'discussion.comment.trash'   => 'Authorization\Assertion\InstanceAssertion',
            'discussion.comment.restore' => 'Authorization\Assertion\InstanceAssertion',
            'discussion.comment.purge'   => 'Authorization\Assertion\InstanceAssertion',
            'discussion.comment.create'  => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'uuid'            => [
        'permissions' => [
            'Discussion\Entity\Comment' => [
                'trash'   => 'discussion.comment.trash',
                'restore' => 'discussion.comment.restore',
                'purge'   => 'discussion.comment.purge',
            ],
        ],
    ],
    'view_helpers'    => [
        'factories' => [
            'discussion' => __NAMESPACE__ . '\Factory\DiscussionHelperFactory',
        ],
    ],
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\DiscussionManager' => __NAMESPACE__ . '\Factory\DiscussionManagerFactory',
        ],
    ],
    'taxonomy'        => [
        'types' => [
            'forum-category' => [
                'allowed_parents' => [
                    'root',
                    'forum-category',
                ],
                'rootable'        => false,
            ],
            'forum'          => [
                'allowed_associations' => [
                    'Discussion\Entity\CommentInterface',
                ],
                'allowed_parents'      => [
                    'forum-category',
                    'forum',
                ],
                'rootable'             => false,
            ],
        ],
    ],
    'class_resolver'  => [
        'Discussion\Entity\CommentInterface' => 'Discussion\Entity\Comment',
        'Discussion\Entity\VoteInterface'    => 'Discussion\Entity\Vote',
    ],
    'router'          => [
        'routes' => [
            'discussion' => [
                'type'         => 'segment',
                'options'      => [
                    'route' => '',
                ],
                'child_routes' => [
                    'view'        => [
                        'type'    => 'segment',
                        'options' => [
                            'route'    => '/discussion/:id',
                            'defaults' => [
                                'controller' => 'Discussion\Controller\DiscussionController',
                                'action'     => 'show',
                            ],
                        ],
                    ],
                    'discussions' => [
                        'type'          => 'literal',
                        'options'       => [
                            'route'    => '/discussions',
                            'defaults' => [
                                'controller' => 'Discussion\Controller\DiscussionsController',
                                'action'     => 'index',
                            ],
                        ],
                        'may_terminate' => true,
                        'child_routes'  => [
                            'get' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route' => '/:id',
                                    'defaults' => [
                                        'action'     => 'redirect',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'discussion'  => [
                        'type'         => 'literal',
                        'options'      => [
                            'route'    => '/discussion',
                            'defaults' => [],
                        ],
                        'child_routes' => [
                            'start'   => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/start/:on[/:forum]',
                                    'defaults'    => [
                                        'controller' => 'Discussion\Controller\DiscussionController',
                                        'action'     => 'start',
                                    ],
                                    'constraints' => [
                                        'on'    => '[0-9]+',
                                        'forum' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'select'  => [
                                'type'         => 'literal',
                                'options'      => [
                                    'route'    => '/select',
                                    'defaults' => [
                                        'controller' => 'Discussion\Controller\DiscussionController',
                                    ],
                                ],
                                'child_routes' => [
                                    'forum' => [
                                        'type'    => 'segment',
                                        'options' => [
                                            'route'       => '/forum/:on',
                                            'defaults'    => [
                                                'action' => 'selectForum',
                                            ],
                                            'constraints' => [
                                                'on' => '[0-9]+',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'comment' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/comment/:discussion',
                                    'defaults'    => [
                                        'controller' => 'Discussion\Controller\DiscussionController',
                                        'action'     => 'comment',
                                    ],
                                    'constraints' => [
                                        'discussion' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'vote'    => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/vote/:vote/:comment',
                                    'defaults'    => [
                                        'controller' => 'Discussion\Controller\DiscussionController',
                                        'action'     => 'vote',
                                    ],
                                    'constraints' => [
                                        'vote'    => 'up|down',
                                        'comment' => '[0-9]+',
                                    ],
                                ],
                            ],
                            'archive' => [
                                'type'    => 'segment',
                                'options' => [
                                    'route'       => '/archive/:comment',
                                    'defaults'    => [
                                        'controller' => 'Discussion\Controller\DiscussionController',
                                        'action'     => 'archive',
                                    ],
                                    'constraints' => [
                                        'comment' => '[0-9]+',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'di'              => [
        'allowed_controllers' => [
            'Discussion\Controller\DiscussionController',
            'Discussion\Controller\DiscussionsController',
        ],
        'definition'          => [
            'class' => [
                'Discussion\Form\DiscussionForm'              => [],
                'Discussion\Form\CommentForm'                 => [],
                'Discussion\Controller\DiscussionsController' => [
                    'setDiscussionManager' => [
                        'required' => true,
                    ],
                    'setInstanceManager'   => [
                        'required' => true,
                    ],
                    'setTaxonomyManager'   => [
                        'required' => true,
                    ],
                    'setUserManager'       => [
                        'required' => true,
                    ],
                ],
                'Discussion\Controller\DiscussionController'  => [
                    'setDiscussionManager' => [
                        'required' => true,
                    ],
                    'setUuidManager'       => [
                        'required' => true,
                    ],
                    'setInstanceManager'   => [
                        'required' => true,
                    ],
                    'setUserManager'       => [
                        'required' => true,
                    ],
                ],
            ],
        ],
        'instance'            => [
            'preferences' => [
                'Discussion\DiscussionManagerInterface' => 'Discussion\DiscussionManager',
            ],
        ],
    ],
    'doctrine'        => [
        'driver' => [
            __NAMESPACE__ . '_driver' => [
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Entity',
                ],
            ],
            'orm_default'             => [
                'drivers' => [
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
                ],
            ],
        ],
    ],
];
