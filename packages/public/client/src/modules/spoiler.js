/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { reprocess } from '@serlo/mathjax'
import $ from 'jquery'

var Spoiler

Spoiler = function () {
  return $(this).each(function () {
    $('> .spoiler-teaser', this)
      .unbind('click')
      .first()
      .click(function (e) {
        var icon = $(this).find('.fa')
        var $content = $(this).next('.spoiler-content')
        e.preventDefault()
        $content.slideToggle()
        icon.toggleClass('fa-caret-square-o-up')
        icon.toggleClass('fa-caret-square-o-down')
      })
    $('> .spoiler-teaser', this).one('click', function () {
      var $content = $(this).next('.spoiler-content')
      reprocess($content.get())
    })
  })
}

$.fn.Spoiler = Spoiler
