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
import _ from 'underscore'

var SideElement
var defaults = {
  visibleClass: 'visible',
  // Full Stack Breakpoint Grid
  fullStackBreakPoint: 1350,
  // Sidebar Breakpoint Grid
  sidebarBreakPoint: 980,
  // Navigation Breakpoint Grid
  navigationBreakPoint: 1140
}

SideElement = function(options) {
  this.options = options
    ? $.extend({}, defaults, options)
    : $.extend({}, defaults)

  this.$window = $(window)

  this.$elements = $('.side-element')

  this.attachHandler()
}

SideElement.prototype.attachHandler = function() {
  var that = this

  that.$elements.each(function() {
    var $element = $(this)

    $('.layout-toggle', $element).click(function() {
      that.$elements.not($element).removeClass(that.options.visibleClass)

      $element.toggleClass(that.options.visibleClass)
    })
  })

  that.$window.resize(
    _.debounce(function() {
      that.$elements.removeClass(that.options.visibleClass)
    }, 300)
  )
}

const sideelement = {
  init: function(options) {
    return new SideElement(options)
  }
}

export default sideelement
