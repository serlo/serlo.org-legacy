import $ from 'jquery'
import _ from 'underscore'

import pluginHtmlTemplate from '../../templates/plugins/injection/injection_plugin_geogebratube.html'
import EditorPlugin from '../serlo_texteditor_plugin'

var GeogebraTubeInjectionPlugin, titleRegexp, hrefRegexp

titleRegexp = new RegExp(/\[[^\]]*\]\(/)
hrefRegexp = new RegExp(/\([^)]*\)/)

GeogebraTubeInjectionPlugin = function (data) {
  this.state = 'geogebratube-injection'
  this.info = data || {}
  this.init()
}

GeogebraTubeInjectionPlugin.prototype = new EditorPlugin()
GeogebraTubeInjectionPlugin.prototype.constructor = GeogebraTubeInjectionPlugin

GeogebraTubeInjectionPlugin.prototype.init = function () {
  var that = this

  that.template = _.template(pluginHtmlTemplate)

  that.data.name = 'GeogebraTube'
}

GeogebraTubeInjectionPlugin.prototype.activate = function (token) {
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

GeogebraTubeInjectionPlugin.prototype.save = function () {
  this.setAndValidateContent()
  this.trigger('save', this)
}

GeogebraTubeInjectionPlugin.prototype.setAndValidateContent = function () {
  var href = $('.href', this.$el).val()
  if (href.substr(0, 4) !== 'ggt/') {
    var l
    var hrefSplit = href.split('/')
    l = hrefSplit[hrefSplit.length - 1]
    if (l.substr(0, 1) === 'm') {
      href = l.substr(1)
    } else {
      href = l
    }
    href = 'ggt/' + href
  }

  this.data.content = '>[' + $('.title', this.$el).val() + '](' + href + ')'
}

EditorPlugin.GeogebraTubeInjection = GeogebraTubeInjectionPlugin
