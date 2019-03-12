/**
 * This file is part of Serlo.org.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import $ from 'jquery'

var Tracking, ga

Tracking = function($context) {
  this.$context = $context
  if (ga === undefined) {
    return
  }

  this.trackCollapse()
  this.trackControls()
  this.trackSideNavigation()
  this.trackCenterNavigation()
}

Tracking.prototype.trackCollapse = function() {
  return $('[data-toggle="collapse"]', this.$context).on('click', function() {
    ga('send', 'event', 'button', 'click', 'Collapsed an item')
  })
}

Tracking.prototype.trackControls = function() {
  return $('[data-toggle="edit-controls"]', this.$context).on(
    'click',
    function() {
      ga('send', 'event', 'button', 'click', 'Clicked on edit controls')
    }
  )
}

Tracking.prototype.trackSideNavigation = function() {
  return $('#main-nav a', this.$context).on('click', function() {
    ga('send', 'event', 'button', 'click', 'Clicked left drop down')
  })
}

Tracking.prototype.trackCenterNavigation = function() {
  return $('.subject-dropdown-toggle', this.$context).on('click', function() {
    ga('send', 'event', 'button', 'click', 'Clicked center drop down')
  })
}

export default $context => {
  ga = window[window['GoogleAnalyticsObject'] || 'ga']
  if (ga !== undefined) {
    ga('provide', 'advancedTracking', Tracking)
  }
  return new Tracking($context)
}
