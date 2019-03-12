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


namespace Page\Form;

use Common\Form\Element\CsrfToken;
use Doctrine\Common\Persistence\ObjectManager;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject;
use Page\Entity\PageRepositoryInterface;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Zend\Form\Element\Submit;
use Zend\Form\Element\Text;
use Zend\Form\Element\Checkbox;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class RepositoryForm extends Form
{
    public function __construct(ObjectManager $objectManager, PageRepositoryInterface $pageRepository, TaxonomyManagerInterface $taxonomyManager)
    {
        parent::__construct('createPage');
        $this->add(new CsrfToken());

        $hydrator = new DoctrineObject($objectManager);
        $filter   = new InputFilter();

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'form-horizontal');
        $this->setInputFilter($filter);
        $this->setHydrator($hydrator);
        $this->setObject($pageRepository);

        $this->add((new Text('slug'))->setLabel('Url:'));
        $this->add((new Checkbox('discussionsEnabled'))->setLabel('Discussions enabled'));
        $this->add(
            [
                'type'    => 'Common\Form\Element\ObjectHidden',
                'name'    => 'instance',
                'options' => [
                    'object_manager' => $objectManager,
                    'target_class'   => 'Instance\Entity\Instance',
                ],
            ]
        );

        $this->add(
            array(
                'type'    => 'DoctrineModule\Form\Element\ObjectSelect',
                'name'    => 'license',
                'options' => array(
                    'object_manager' => $objectManager,
                    'label'          => 'License',
                    'target_class'   => 'License\Entity\License',
                    'property'       => 'title',
                ),
            )
        );

        $this->add(
            array(
                'type'    => 'DoctrineModule\Form\Element\ObjectMultiCheckbox',
                'name'    => 'roles',
                'options' => array(
                    'object_manager' => $objectManager,
                    'label'          => 'Roles',
                    'target_class'   => 'User\Entity\Role',
                ),
            )
        );

        $this->add((new Submit('submit'))->setValue('Save')->setAttribute('class', 'btn btn-success pull-right'));

        $filter->add(
            [

                'name'       => 'forum',
                'required'   => false,
                'validators' => [
                    [
                        'name'    => 'Taxonomy\Validator\ValidAssociation',
                        'options' => [
                            'target'           => $this,
                            'taxonomy_manager' => $taxonomyManager,
                        ],
                    ],
                ],
            ]
        );
    }
}
