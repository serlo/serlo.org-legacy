import $ from 'jquery'
import _ from 'underscore'

import pluginHtmlTemplate from '../../templates/plugins/injection/injection_plugin_default.html'
import EditorPlugin from '../serlo_texteditor_plugin'

var DefaultInjectionPlugin, titleRegexp, hrefRegexp

titleRegexp = new RegExp(/\[[^\]]*\]\(/)
hrefRegexp = new RegExp(/\([^)]*\)/)

DefaultInjectionPlugin = function (data) {
  this.state = 'default-injection'
  this.info = data || {}
  this.init()
}

DefaultInjectionPlugin.prototype = new EditorPlugin()
DefaultInjectionPlugin.prototype.constructor = DefaultInjectionPlugin

DefaultInjectionPlugin.prototype.init = function () {
  var that = this

  that.template = _.template(pluginHtmlTemplate)

  that.data.name = 'Injection'
}

DefaultInjectionPlugin.prototype.activate = function (token) {
  var that = this
  var title
  var href

  that.data.content = token.string
  title = _.first(that.data.content.match(titleRegexp))
  that.data.title = title.substr(1, title.length - 3)

  href = _.first(that.data.content.match(hrefRegexp))
  that.data.href = href.substr(1, href.length - 2)

  that.$el = $(that.template(that.data))

  that.$el.on('click', '.btn-save', function () {
    that.save()
  })

  that.$el.on('click', '.btn-cancel', function (e) {
    e.preventDefault()
    that.trigger('close')
  })
}

DefaultInjectionPlugin.prototype.save = function () {
  this.setAndValidateContent()
  this.trigger('save', this)
}

DefaultInjectionPlugin.prototype.setAndValidateContent = function () {
  var href = $('.href', this.$el).val()

  if (href.substr(0, 1) !== '/') {
    href = '/' + href
  }

  this.data.content = '>[' + $('.title', this.$el).val() + '](' + href + ')'
}

EditorPlugin.DefaultInjection = DefaultInjectionPlugin
