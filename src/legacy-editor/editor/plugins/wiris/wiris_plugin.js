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
/* global com */
import $ from 'jquery'
import _ from 'underscore'

import Common from '../../../../modules/common'
import pluginHtmlTemplate from '../../templates/plugins/wiris/wiris_plugin.html'
import EditorPlugin from '../serlo_texteditor_plugin'

var FormulaPlugin
var wiris
var latex2mml = 'https://www.wiris.net/demo/editor/latex2mathml'
var mml2latex = 'https://www.wiris.net/demo/editor/mathml2latex'

function ajax(url, data, method) {
  return $.ajax({
    url: url,
    method: method || 'get',
    data: data
  })
}

FormulaPlugin = function() {
  this.state = 'math'
  this.init()
}

FormulaPlugin.prototype = new EditorPlugin()
FormulaPlugin.prototype.constructor = FormulaPlugin

FormulaPlugin.prototype.init = function() {
  var that = this

  that.template = _.template(pluginHtmlTemplate)

  that.data.name = 'Wiris'
  that.wrap = '$$'

  that.$el = $(that.template(that.data))

  that.$el.on('click', '.btn-cancel', function(e) {
    e.preventDefault()
    that.trigger('close')
  })

  $('.content', that.$el).height(450)
}

FormulaPlugin.prototype.activate = function(token) {
  var that = this
  var formular

  that.token = token

  function asyncActivate() {
    formular = token.state.string
    that.data.content = formular.substr(2, formular.length - 4)

    wiris.insertInto($('.content', that.$el)[0])

    ajax(latex2mml, 'latex=' + encodeURIComponent(that.data.content))
      .done(function(mml) {
        wiris.setMathML(mml)
      })
      .fail(Common.genericError)

    that.$el.on('click', '.btn-save', function() {
      that.save()
    })
  }

  if (wiris) {
    asyncActivate()
  } else {
    require('https://www.wiris.net/demo/editor/editor').then(() => {
      wiris = com.wiris.jsEditor.JsEditor.newInstance({
        language: 'en'
      })
      asyncActivate()
    })
  }
}

FormulaPlugin.prototype.deactivate = function() {
  this.$el.detach()
  wiris.close()
}

FormulaPlugin.prototype.save = function() {
  var that = this
  var data = wiris.getMathML()

  ajax(mml2latex, 'mml=' + encodeURIComponent(data), 'post')
    .done(function(latex) {
      that.data.content = that.wrap + latex + that.wrap
      that.trigger('save', that)
    })
    .fail(Common.genericError)
}

EditorPlugin.Wiris = FormulaPlugin
