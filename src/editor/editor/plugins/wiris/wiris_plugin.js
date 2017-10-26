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

function ajax (url, data, method) {
  return $.ajax({
    url: url,
    method: method || 'get',
    data: data
  })
}

FormulaPlugin = function () {
  this.state = 'math'
  this.init()
}

FormulaPlugin.prototype = new EditorPlugin()
FormulaPlugin.prototype.constructor = FormulaPlugin

FormulaPlugin.prototype.init = function () {
  var that = this

  that.template = _.template(pluginHtmlTemplate)

  that.data.name = 'Wiris'
  that.wrap = '$$'

  that.$el = $(that.template(that.data))

  that.$el.on('click', '.btn-cancel', function (e) {
    e.preventDefault()
    that.trigger('close')
  })

  $('.content', that.$el).height(450)
}

FormulaPlugin.prototype.activate = function (token) {
  var that = this
  var formular

  that.token = token

  function asyncActivate () {
    formular = token.state.string
    that.data.content = formular.substr(2, formular.length - 4)

    wiris.insertInto($('.content', that.$el)[0])

    ajax(latex2mml, 'latex=' + encodeURIComponent(that.data.content))
      .done(function (mml) {
        wiris.setMathML(mml)
      })
      .fail(Common.genericError)

    that.$el.on('click', '.btn-save', function () {
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

FormulaPlugin.prototype.deactivate = function () {
  this.$el.detach()
  wiris.close()
}

FormulaPlugin.prototype.save = function () {
  var that = this
  var data = wiris.getMathML()

  ajax(mml2latex, 'mml=' + encodeURIComponent(data), 'post')
    .done(function (latex) {
      that.data.content = that.wrap + latex + that.wrap
      that.trigger('save', that)
    })
    .fail(Common.genericError)
}

EditorPlugin.Wiris = FormulaPlugin
