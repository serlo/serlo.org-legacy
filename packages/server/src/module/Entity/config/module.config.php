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
namespace Entity;

return [
    'zfc_rbac' => [
        'assertion_map' => [
            'entity.create' => 'Authorization\Assertion\InstanceAssertion',
            'entity.get' => 'Authorization\Assertion\InstanceAssertion',
            'entity.trash' => 'Authorization\Assertion\InstanceAssertion',
            'entity.purge' => 'Authorization\Assertion\InstanceAssertion',
            'entity.restore' => 'Authorization\Assertion\InstanceAssertion',
            'entity.revision.create' => 'Authorization\Assertion\InstanceAssertion',
            'entity.revision.purge' => 'Authorization\Assertion\InstanceAssertion',
            'entity.revision.restore' => 'Authorization\Assertion\InstanceAssertion',
            'entity.revision.trash' => 'Authorization\Assertion\InstanceAssertion',
            'entity.revision.checkout' => 'Authorization\Assertion\InstanceAssertion',
            'entity.repository.history' => 'Authorization\Assertion\InstanceAssertion',
            'entity.link.create' => 'Authorization\Assertion\InstanceAssertion',
            'entity.link.purge' => 'Authorization\Assertion\InstanceAssertion',
            'entity.link.order' => 'Authorization\Assertion\InstanceAssertion',
            'entity.license.update' => 'Authorization\Assertion\InstanceAssertion',
        ],
    ],
    'class_resolver' => [
        'Entity\Entity\EntityInterface' => 'Entity\Entity\Entity',
        'Entity\Entity\TypeInterface' => 'Entity\Entity\Type',
        'Entity\Entity\RevisionInterface' => 'Entity\Entity\Revision',
    ],
    'di' => [
        'allowed_controllers' => [
            __NAMESPACE__ . '\Controller\EntityController',
            __NAMESPACE__ . '\Controller\RepositoryController',
            __NAMESPACE__ . '\Controller\PageController',
            __NAMESPACE__ . '\Controller\TaxonomyController',
            __NAMESPACE__ . '\Controller\LinkController',
            __NAMESPACE__ . '\Controller\LicenseController',
            __NAMESPACE__ . '\Controller\TOCController',
        ],
        'definition' => [
            'class' => [
                __NAMESPACE__ . '\Controller\TaxonomyController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setTaxonomyManager' => [
                        'required' => true,
                    ],
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\LinkController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setLinkService' => [
                        'required' => true,
                    ],
                    'setModuleOptions' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\LicenseController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                    'setLicenseManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\EntityController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\RepositoryController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setInstanceManager' => [
                        'required' => true,
                    ],
                    'setUserManager' => [
                        'required' => true,
                    ],
                    'setRepositoryManager' => [
                        'required' => true,
                    ],
                    'setModuleOptions' => [
                        'required' => true,
                    ],
                    'setAuthorizationService' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Controller\PageController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setModuleOptions' => [
                        'required' => true,
                    ],
                ],

                __NAMESPACE__ . '\Controller\TOCController' => [
                    'setEntityManager' => [
                        'required' => true,
                    ],
                    'setModuleOptions' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Manager\EntityManager' => [
                    'setUuidManager' => [
                        'required' => true,
                    ],
                    'setObjectManager' => [
                        'required' => true,
                    ],
                    'setClassResolver' => [
                        'required' => true,
                    ],
                    'setTypeManager' => [
                        'required' => true,
                    ],
                    'setAuthorizationService' => [
                        'required' => true,
                    ],
                ],
                __NAMESPACE__ . '\Provider\TokenProvider' => [],
            ],
        ],
        'instance' => [
            'preferences' => [
                'Entity\Manager\EntityManagerInterface' => 'Entity\Manager\EntityManager',
            ],
        ],
    ],
    'service_manager' => [
        'factories' => [
            __NAMESPACE__ . '\Options\ModuleOptions' => __NAMESPACE__ . '\Factory\ModuleOptionsFactory',
            __NAMESPACE__ . '\Form\SingleChoiceAnswerForm' => __NAMESPACE__ . '\Factory\SingleChoiceAnswerFormFactory',
            __NAMESPACE__ . '\Form\MultipleChoiceWrongAnswerForm' => __NAMESPACE__ . '\Factory\MultipleChoiceWrongAnswerFormFactory',
            __NAMESPACE__ . '\Form\MultipleChoiceRightAnswerForm' => __NAMESPACE__ . '\Factory\MultipleChoiceRightAnswerFormFactory',
            __NAMESPACE__ . '\Form\ArticleForm' => __NAMESPACE__ . '\Factory\ArticleFormFactory',
            __NAMESPACE__ . '\Form\GroupedTextExerciseForm' => __NAMESPACE__ . '\Factory\GroupedTextExerciseFormFactory',
            __NAMESPACE__ . '\Form\ModuleForm' => __NAMESPACE__ . '\Factory\ModuleFormFactory',
            __NAMESPACE__ . '\Form\ModulePageForm' => __NAMESPACE__ . '\Factory\ModulePageFormFactory',
            __NAMESPACE__ . '\Form\TextExerciseForm' => __NAMESPACE__ . '\Factory\TextExerciseFormFactory',
            __NAMESPACE__ . '\Form\TextExerciseGroupForm' => __NAMESPACE__ . '\Factory\TextExerciseGroupFormFactory',
            __NAMESPACE__ . '\Form\TextSolutionForm' => __NAMESPACE__ . '\Factory\TextSolutionFormFactory',
            __NAMESPACE__ . '\Form\TextHintForm' => __NAMESPACE__ . '\Factory\TextHintFormFactory',
            __NAMESPACE__ . '\Form\VideoForm' => __NAMESPACE__ . '\Factory\VideoFormFactory',
            __NAMESPACE__ . '\Form\MathPuzzleForm' => __NAMESPACE__ . '\Factory\MathPuzzleFormFactory',
            __NAMESPACE__ . '\Form\InputChallengeForm' => __NAMESPACE__ . '\Factory\InputChallengeFormFactory',
            __NAMESPACE__ . '\Form\AppletForm' => __NAMESPACE__ . '\Factory\AppletFormFactory',
        ],
    ],
    'controllers' => [
        'factories' => [
            __NAMESPACE__ . '\Controller\ApiController' => __NAMESPACE__ . '\Factory\ApiControllerFactory',
        ],
    ],
    'view_helpers' => [
        'invokables' => [
            'singleChoice' => __NAMESPACE__ . '\View\Helper\SingleChoiceHelper',
            'multipleChoice' => __NAMESPACE__ . '\View\Helper\MultipleChoiceHelper',
            'inputChallenge' => __NAMESPACE__ . '\View\Helper\InputChallengeHelper',
        ],
        'factories' => [
            'entity' => __NAMESPACE__ . '\Factory\EntityHelperFactory',
        ],
    ],
    'uuid' => [
        'permissions' => [
            'Entity\Entity\Revision' => [
                'trash' => 'entity.revision.trash',
                'restore' => 'entity.revision.restore',
                'purge' => 'entity.revision.purge',
            ],
            'Entity\Entity\Entity' => [
                'trash' => 'entity.trash',
                'restore' => 'entity.restore',
                'purge' => 'entity.purge',
            ],
        ],
    ],
    'versioning' => [
        'permissions' => [
            'Entity\Entity\Entity' => [
                'commit' => 'entity.revision.create',
                'checkout' => 'entity.revision.checkout',
                'reject' => 'entity.revision.trash',
            ],
        ],
    ],
    'doctrine' => [
        'driver' => [
            __NAMESPACE__ . '_driver' => [
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Entity',
                ],
            ],
            'orm_default' => [
                'drivers' => [
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
                ],
            ],
        ],
    ],
];
