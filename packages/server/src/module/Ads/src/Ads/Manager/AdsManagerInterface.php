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
namespace Ads\Manager;

use Ads\Entity\AdInterface;
use Common\ObjectManager\Flushable;
use Instance\Entity\InstanceInterface;

interface AdsManagerInterface extends Flushable
{

    /**
     * @param int $id
     * @return AdInterface
     */
    public function getAd($id);

    /**
     * @param array $data
     * @param AdInterface $ad
     * @return AdInterface
     */
    public function updateAd(array $data, AdInterface $ad);

    /**
     * @param AdInterface $ad
     * @return void
     */
    public function removeAd(AdInterface $ad);

    /**
     * @param InstanceInterface $instance
     * @param int $number
     * @param boolean $isBanner
     * @return array
     */
    public function findShuffledAds(InstanceInterface $instance, $number, $isBanner = false);

    /**
     * @param array $data
     * @return AdInterface
     */
    public function createAd(array $data);

    /**
     * @param InstanceInterface $instance
     * @return AdInterface
     */
    public function findAllAds(InstanceInterface $instance);

    /**
     * @param AdInterface|int $id
     * @return void
     */
    public function clickAd($id);
}
