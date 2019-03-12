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

namespace Subject\Route;

use Instance\Manager\InstanceManagerAwareTrait;
use Instance\Manager\InstanceManagerInterface;
use Subject\Exception;
use Subject\Manager\SubjectManagerAwareTrait;
use Subject\Manager\SubjectManagerInterface;
use Traversable;
use Zend\Mvc\Router\Http\Segment;
use Zend\Mvc\Router\RouteMatch;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorAwareTrait;
use Zend\Stdlib\ArrayUtils;
use Zend\Stdlib\RequestInterface as Request;

class SubjectRoute extends Segment implements ServiceLocatorAwareInterface
{
    use ServiceLocatorAwareTrait;

    /**
     * @var string
     */
    protected $identifier;

    public function __construct($route, array $constraints, array $defaults, $identifier)
    {
        $this->defaults   = $defaults;
        $this->parts      = $this->parseRouteDefinition($route);
        $this->regex      = $this->buildRegex($this->parts, $constraints);
        $this->identifier = $identifier;
    }

    /**
     * factory(): defined by RouteInterface interface.
     *
     * @see    \Zend\Mvc\Router\RouteInterface::factory()
     * @param  array|Traversable $options
     * @return Segment
     * @throws Exception\InvalidArgumentException
     */
    public static function factory($options = array())
    {
        if ($options instanceof Traversable) {
            $options = ArrayUtils::iteratorToArray($options);
        } elseif (!is_array($options)) {
            throw new Exception\InvalidArgumentException(__METHOD__ . ' expects an array or Traversable set of options');
        }

        if (!isset($options['route'])) {
            throw new Exception\InvalidArgumentException('Missing "route" in options array');
        }

        if (!isset($options['identifier'])) {
            $options['identifier'] = 'subject';
        }

        if (!isset($options['constraints'])) {
            $options['constraints'] = array();
        }

        if (!isset($options['defaults'])) {
            $options['defaults'] = array();
        }

        return new static($options['route'], $options['constraints'], $options['defaults'], $options['identifier']);
    }

    /**
     * @return InstanceManagerInterface
     */
    public function getInstanceManager()
    {
        // TODO: Wait for zf2 route refactor.
        return $this->getServiceLocator()->getServiceLocator()->get('Instance\Manager\InstanceManager');
    }

    /**
     * @return SubjectManagerInterface
     */
    public function getSubjectManager()
    {
        // TODO: Wait for zf2 route refactor.
        return $this->getServiceLocator()->getServiceLocator()->get('Subject\Manager\SubjectManager');
    }

    /**
     * @param Request $request
     * @param null    $pathOffset
     * @param array   $options
     * @return null|RouteMatch
     */
    public function match(Request $request, $pathOffset = null, array $options = array())
    {
        $routeMatch = parent::match($request, $pathOffset, $options);

        if (!$routeMatch) {
            return null;
        }

        $subject = $routeMatch->getParam($this->identifier);

        try {
            $this->getSubjectManager()->findSubjectByString($subject, $this->getInstanceManager()->getInstanceFromRequest());
            return $routeMatch;
        } catch (\Exception $e) {
            return null;
        }
    }
}
