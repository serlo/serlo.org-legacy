/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2018 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import $ from 'jquery'
import _ from 'underscore'

import Cache from '../../libs/cache'
import eventScope from '../../libs/eventscope'

var LayoutAdd
var imageCache = new Cache('athene2-editor-image')

function createIconTag(columns) {
  var canvas = $('<canvas>')[0]
  var context
  var width = 90
  var height = 60
  var gutter = 5
  var iterateX = 5
  var iconName = columns.toString()
  var cached = imageCache.remember() || {}

  function drawColumn(column) {
    var x = iterateX + gutter
    var w = ((width - 20 - 23 * gutter) / 24) * column + (column - 1) * gutter

    iterateX += w + gutter

    context.beginPath()
    context.fillStyle = '#C5C5C5'
    context.rect(x, 10, w, height - 20)
    context.fill()
  }

  function buildImageTag(dataURL, iconName) {
    return '<img src="' + dataURL + '" alt="' + iconName + '" />'
  }

  if (cached[iconName]) {
    return buildImageTag(cached[iconName], iconName)
  }

  canvas.width = width
  canvas.height = height

  context = canvas.getContext('2d')
  context.beginPath()
  context.fillStyle = '#EEEEEE'
  context.rect(0, 0, width, height)

  context.fill()

  _.each(columns, function(column, index) {
    drawColumn(column, index)
  })

  cached[iconName] = canvas.toDataURL('image/png')
  imageCache.memorize(cached)

  return buildImageTag(cached[iconName], iconName)
}

LayoutAdd = function(layouts) {
  var that = this

  eventScope(that)

  that.$el = $('<div class="add-layout"></div>')
  that.$plus = $('<a href="#" class="plus">+</a>')
  that.$layoutList = $('<div class="layout-list">')

  _.each(layouts, function(columns) {
    var $addLayout = $('<a href="#">' + createIconTag(columns) + '</a>')

    $addLayout.click(function(e) {
      e.stopPropagation()
      that.trigger('add-layout', columns)
      that.toggleLayouts(true)
    })

    that.$layoutList.append($addLayout)
  })

  that.$el.append(that.$plus)
  that.$plus.click(function(e) {
    e.preventDefault()
    e.stopPropagation()
    that.toggleLayouts()
  })

  that.addEventListener('close', function() {
    that.toggleLayouts(true)
  })
}

LayoutAdd.prototype.toggleLayouts = function(forceClose) {
  if (forceClose || this.opened) {
    this.$layoutList.detach()
    this.opened = false
  } else {
    this.$el.append(this.$layoutList)
    this.opened = true
  }
}

export default LayoutAdd
