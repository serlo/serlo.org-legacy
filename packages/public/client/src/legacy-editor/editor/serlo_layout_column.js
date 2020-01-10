/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import $ from 'jquery'
import _ from 'underscore'
import eventScope from '../../libs/eventscope'
import t from '../../modules/translator'
import columnHtmlTemplate from './templates/layout/column.html'

var Column
var columnTemplate = _.template(columnHtmlTemplate)
var emptyColumnHtml = '<p>' + t('Click to edit') + '</p>'

Column = function(width, data) {
  var that = this
  eventScope(that)

  that.data = data || ''

  that.$el = $(
    columnTemplate({
      width: width
    })
  )

  that.type = width

  // prevent links from being clicked
  that.$el.on('click', 'a', function(e) {
    e.preventDefault()
  })

  that.$el.click(function(e) {
    e.preventDefault()
    e.stopPropagation()
    that.trigger('select', that)
  })
}

Column.prototype.update = function(data, html) {
  var patch

  this.data = data
  html = html && html !== '' ? html : emptyColumnHtml

  patch = this.$el.quickdiff('patch', $('<div></div>').html(html), [
    'mathSpan',
    'mathSpanInline'
  ])

  this.trigger('update', this)
  return patch
}

Column.prototype.set = function(html) {
  this.$el.html(html || emptyColumnHtml)
}

Column.prototype.focus = function() {
  this.$el.focus().trigger('click')
}

export default Column
