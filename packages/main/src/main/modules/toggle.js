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
/* global MathJax */
import $ from 'jquery'

var ToggleAction

ToggleAction = function() {
  return $(this).each(function() {
    // Edit mode toggle
    if ($(this).data('toggle') === 'edit-controls') {
      $(this)
        .unbind('click')
        .click(function(e) {
          e.preventDefault()
          var $that = $(this)
          $that.toggleClass('active')
          $('.edit-control').toggleClass('hidden')
          return false
        })
    } else if ($(this).data('toggle') === 'discussions') {
      $(this)
        .unbind('click')
        .click(function(e) {
          e.preventDefault()
          var $that = $(this)
          var $target = $($that.data('target'))

          $that.toggleClass('active')
          $target.toggleClass('hidden')
          $('html, body').animate(
            {
              scrollTop: $target.offset().top
            },
            500
          )
          return false
        })
    } else if ($(this).data('toggle') === 'visibility') {
      $(this)
        .unbind('click')
        .click(function() {
          var $that = $(this)
          var $target = $($that.data('target'))

          $target.toggleClass('hidden')
        })
    } else if ($(this).data('toggle') === 'collapse') {
      if (/#solution-\d+/.test($(this).data('target'))) {
        var $target = $($(this).data('target'))
        var $base = $(this).closest('article')

        if (!$base.length) {
          $base = $target
        }
        $target.one('show.bs.collapse', function() {
          MathJax.Hub.Queue(['Reprocess', MathJax.Hub, $target.get()])
        })
      }
    }
  })
}

$.fn.ToggleAction = ToggleAction
