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
import 'jquery-ui'
import _ from 'underscore'

import eventScope from '../../../libs/eventscope'
import t from '../../../modules/translator'
import pluginHtmlTemplate from '../templates/plugins/default.html'

var EditorPlugin
var defaults = {}

EditorPlugin = function(settings) {
  eventScope(this)
  this.settings = $.extend(settings, defaults)
  this.state = this.settings.state

  this.data = {
    name: 'Plugin',
    content: 'Default Plugin'
  }

  this.template = _.template(pluginHtmlTemplate)
}

EditorPlugin.prototype.setData = function(key, value) {
  this.data[key] = value
  this.updateContentString()
  this.trigger('update', this)
}

EditorPlugin.prototype.updateContentString = function() {
  // rebuild markdown query
  this.data.content = '**' + this.name + '**'
}

EditorPlugin.prototype.save = function() {
  this.trigger('save')
  return this.data
}

EditorPlugin.prototype.close = function() {
  this.trigger('close')
}

EditorPlugin.prototype.render = function() {
  // should be called, after a Plugins $el has been added to the dom
}

EditorPlugin.prototype.activate = function() {
  this.$el = $(this.template(this.data))

  this.makeRezisable()

  return this.$el
}

EditorPlugin.prototype.makeRezisable = function() {
  var that = this
  var $iframe = $('iframe', that.$el)

  if (!$('.ui-resizable-se', that.$el).length) {
    $(
      '<div class="ui-resizable-handle ui-resizable-se fa fa-arrows">'
    ).appendTo($('.panel-body', that.$el))
  }

  $('.panel-body', that.$el).resizable({
    handles: {
      se: $('.ui-resizable-se', that.$el)
    },
    resize: function(event, ui) {
      var newWidth =
        ui.originalSize.width + (ui.size.width - ui.originalSize.width) * 2

      // ui.size.height -= 40;

      $(this)
        .width(newWidth)
        .position({
          of: that.$el,
          my: 'center center',
          at: 'center center'
        })

      if ($iframe.length) {
        $iframe.width(newWidth).height(ui.size.height - 140)
      }
    }
  })
}

EditorPlugin.prototype.deactivate = function() {
  this.$el.detach()
}

EditorPlugin.prototype.getActivateLink = function() {
  return (
    this.widget ||
    (this.widget = $('<a class="editor-widget" href="#">').text(
      t('Edit %s', this.data.name)
    ))
  )
}

export default EditorPlugin
