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
import $ from 'jquery'
import _ from 'underscore'

import eventScope from '../../libs/eventscope'
import t from '../../modules/translator'
import LayoutAdd from './serlo_layout_add'
import Column from './serlo_layout_column'
import rowHtmlTemplate from './templates/layout/row.html'

var Row
var rowTemplate = _.template(rowHtmlTemplate)

Row = function (columns, index, data, layouts) {
  var that = this
  eventScope(that)

  that.data = data || []
  that.title = columns.toString()
  that.index = index

  that.columns = []

  that.$el = $(rowTemplate())
  that.$el.mouseenter(function (e) {
    that.onMouseEnter(e)
  })
  that.$el.mouseleave(function (e) {
    that.onMouseLeave(e)
  })

  that.$actions = $('<div class="row-actions btn-group"></div>')
  that.$remove = $('<a href="#" class="btn btn-xs btn-danger">').text(
    t('Remove Row')
  )
  that.$up = $('<a href="#" class="btn btn-xs btn-default">')
    .attr({
      title: t('Move up'),
    })
    .click(function () {
      that.trigger('move-up')
    })
    .html('<i class="fa fa-chevron-up"/>')

  that.$down = $('<a href="#" class="btn btn-xs btn-default">')
    .attr({
      title: t('Move down'),
    })
    .click(function () {
      that.trigger('move-down')
    })
    .html('<i class="fa fa-chevron-down"/>')

  that.$remove.click(function (e) {
    e.preventDefault()
    that.trigger('remove', that)
  })

  that.$actions.append(that.$remove)
  that.$actions.append(that.$up)
  that.$actions.append(that.$down)

  _.each(columns, function (width, index) {
    var column = new Column(width, that.data[index])

    column.addEventListener('select', function (column) {
      that.activeColumn = index
      that.trigger('select', column)
    })

    column.addEventListener('update', function (column) {
      that.trigger('update', column)
    })

    that.$el.append(column.$el)
    that.columns.push(column)
  })

  that.activeColumn = 0

  that.layoutAdd = new LayoutAdd(layouts)

  that.layoutAdd.addEventListener('add-layout', function (layout) {
    that.trigger('add-layout', layout)
  })

  that.$el.prepend(that.layoutAdd.$el)
}

Row.prototype.onMouseEnter = function () {
  this.$el.append(this.$actions)
}

Row.prototype.onMouseLeave = function () {
  this.$actions.detach()
}

export default Row
