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
namespace Ads\View\Helper;

use Zend\Http\Request;
use Zend\View\Helper\AbstractHelper;

class Banner extends AbstractHelper
{
    use \Ads\Manager\AdsManagerAwareTrait;
    use \Instance\Manager\InstanceManagerAwareTrait;

    protected $ads;


    /**
     * @var \Zend\Http\Request
     */
    protected $request;

    public function __construct(
        Request $request
    ) {
        $this->request = $request;
    }

    public function __invoke()
    {
        $instance = $this->getInstanceManager()->getInstanceFromRequest();
        $this->ads = $this->getAdsManager()->findShuffledAds($instance, 1, true);

        if (!$this->request->isXmlHttpRequest()) {
            return $this->getView()->partial(
                'ads/helper/banner-helper',
                [
                    'ads' => $this->ads,
                ]
            );
        } else {
            return '';
        }
    }
}
