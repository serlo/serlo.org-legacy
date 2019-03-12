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
namespace Taxonomy\Validator;

use Taxonomy\Entity\TaxonomyTermAwareInterface;
use Taxonomy\Manager\TaxonomyManagerInterface;
use Zend\Form\FormInterface;
use Zend\Stdlib\ArrayUtils;
use Zend\Validator\AbstractValidator;
use Zend\Validator\Exception;
use ZfcRbac\Exception\UnauthorizedException;

class ValidAssociation extends AbstractValidator
{
    /**
     * Error constants
     */
    const NOT_AUTHORIZED = 'notAuthorized';

    /**
     * Error constants
     */
    const NOT_ALLOWED = 'notAllowed';

    /**
     * @var array Message templates
     */
    protected $messageTemplates = [
        self::NOT_AUTHORIZED => "You do not have permission to associate those two objects.",
        self::NOT_ALLOWED    => "You can't associate those two objects.",
    ];

    /**
     * @var TaxonomyManagerInterface
     */
    protected $taxonomyManager;

    /**
     * @var TaxonomyTermAwareInterface
     */
    protected $target;

    public function __construct($options = null)
    {
        if ($options instanceof \Traversable) {
            $options = ArrayUtils::iteratorToArray($options);
        }

        if (!isset($options['target'])) {
            throw new Exception\RuntimeException('target_interface not set');
        }
        if (!isset($options['taxonomy_manager'])) {
            throw new Exception\RuntimeException('taxonomy_manager not set');
        }

        if (!$options['taxonomy_manager'] instanceof TaxonomyManagerInterface) {
            throw new Exception\RuntimeException(sprintf(
                'Expected taxonomy_manager to be of type TaxonomyManagerInterface but got %s',
                is_object($options['taxonomy_manager']) ? get_class($options['taxonomy_manager']) :
                    gettype($options['taxonomy_manager'])
            ));
        }

        if (!$options['target'] instanceof TaxonomyTermAwareInterface && !$options['target'] instanceof FormInterface) {
            throw new Exception\RuntimeException(sprintf(
                'Expected target to be of type TaxonomyTermAwareInterface or FormInterface but got %s',
                is_object($options['target']) ? get_class($options['target']) : gettype($options['target'])
            ));
        }

        $this->taxonomyManager = $options['taxonomy_manager'];
        $this->target          = $options['target'];
    }

    /**
     * Returns true if and only if $value meets the validation requirements
     * If $value fails validation, then this method returns false, and
     * getMessages() will return an array of messages that explain why the
     * validation failed.
     *
     * @param  mixed $value
     * @return bool
     * @throws Exception\RuntimeException If validation of $value is impossible
     */
    public function isValid($value)
    {
        try {
            $target = $this->target;
            if ($target instanceof FormInterface) {
                $target = $target->getObject();
                if (!$target instanceof TaxonomyTermAwareInterface) {
                    throw new Exception\RuntimeException(sprintf(
                        'Target supplied by FormInterface is not of type TaxonomyTermAwareInterface',
                        is_object($target) ? get_class($target) : gettype($target)
                    ));
                }
            }

            $result = $this->taxonomyManager->isAssociableWith($value, $target);
            if ($result) {
                return true;
            }
            $this->error(self::NOT_ALLOWED);

            return false;
        } catch (UnauthorizedException $e) {
            $this->error(self::NOT_AUTHORIZED);
        } catch (\Exception $e) {
            throw new Exception\RuntimeException($e->getMessage());
        }

        throw new Exception\RuntimeException("Validation failed");
    }
}
