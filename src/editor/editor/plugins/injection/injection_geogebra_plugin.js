/* global atob, Blob, FormData */
import $ from 'jquery'
import _ from 'underscore'

import Common from '../../../../modules/common'
import SystemNotification from '../../../../modules/system_notification'
import t from '../../../../modules/translator'
import pluginHtmlTemplate from '../../templates/plugins/injection/injection_plugin_geogebra.html'
import EditorPlugin from '../serlo_texteditor_plugin'

var GeogebraInjectionPlugin, titleRegexp, hrefRegexp

titleRegexp = new RegExp(/\[[^\]]*\]\(/)
hrefRegexp = new RegExp(/\([^)]*\)/)

// cruel helper function that
// checks for 20seconds if the
// global ggbApplet variable
// is available. geogebra does not
// seem to have a 'ready' event..
function waitForGgbApplet (context, fn) {
  var threshold = 0
  var timeout = setInterval(function () {
    threshold += 100
    if (context.ggbApplet) {
      clearTimeout(timeout)
      fn(null, context.ggbApplet)
    }
    if (threshold >= 20000) {
      clearTimeout(timeout)
      fn(new Error('Could not initialize Geogebra'))
    }
  }, 100)
}

// Geogebra Plugin requires
// some technologies that
// may not be available:
function browserSupported () {
  return !!window.Blob && !!window.FormData && !!window.Uint8Array
}

GeogebraInjectionPlugin = function () {
  this.state = 'geogebra-injection'

  this.init()
}

GeogebraInjectionPlugin.prototype = new EditorPlugin()
GeogebraInjectionPlugin.prototype.constructor = GeogebraInjectionPlugin

GeogebraInjectionPlugin.prototype.init = function () {
  this.template = _.template(pluginHtmlTemplate)

  this.data = {}
  this.data.name = 'Geogebra'

  if (!browserSupported()) {
    this.activate = function () {
      SystemNotification.notify(
        t('You need to update your browser to use the Geogebra plugin.'),
        'error'
      )
    }
  }
}

GeogebraInjectionPlugin.prototype.activate = function (token, data) {
  var that = this
  var title
  var href

  this.isActive = true

  that.data.info = data

  that.data.content = token.string
  title = _.first(that.data.content.match(titleRegexp))
  that.data.title = title.substr(1, title.length - 3)

  href = _.first(that.data.content.match(hrefRegexp))
  that.data.href = href.substr(1, href.length - 2)

  that.$el = $(that.template(that.data))

  that.$el.on('click', '.btn-save', function () {
    that.save($(this).hasClass('save-as-image'))
  })

  that.$el.on('click', '.btn-cancel', function (e) {
    e.preventDefault()
    that.trigger('close')
  })

  // set default width
  $('.panel-body', this.$el).width(800)
  // that.makeRezisable();
}

GeogebraInjectionPlugin.prototype.render = function () {
  var that = this

  that.ggbApplet = null

  function loadOriginalXML () {
    var xmlUrl
    var i = 0
    var length = that.data.info.files.length

    while (i < length) {
      if (that.data.info.files[i].type.indexOf('/xml') !== -1) {
        xmlUrl = that.data.info.files[i].location
        i = length
      }
      i += 1
    }

    $.ajax({
      url: xmlUrl
    })
      .then(function (xml) {
        that.ggbApplet.setXML(xml.documentElement.outerHTML)
        that.ggbApplet.startEditing()
      })
      .error(Common.genericError)
  }

  that.$iframe = $('.geogebraweb-app-iframe', that.$el)

  that.$iframe.css({
    height: 720,
    width: '100%',
    borderWidth: 0
  })

  waitForGgbApplet(that.$iframe[0].contentWindow, function (err, applet) {
    if (err) {
      SystemNotification.notify(
        t('Geogebra plugin could not be loaded, please try again.')
      )
    } else {
      if (!that.isActive) {
        return
      }

      $('.gwt-MenuItem.signIn', that.$iframe[0].contentDocument).hide()

      that.ggbApplet = applet

      if (that.data.info && that.data.info.files) {
        loadOriginalXML()
      }
    }
  })
}

GeogebraInjectionPlugin.prototype.deactivate = function () {
  this.isActive = false
  this.$el.detach()
}

GeogebraInjectionPlugin.prototype.save = function (asImage) {
  if (!this.ggbApplet) {
    return
  }

  var that = this
  var context
  var imageData
  var formData
  var xml = that.ggbApplet.getXML()

  function toUtf8 (string) {
    return unescape(encodeURIComponent(string))
  }

  function uploadFile (formData, url) {
    return $.ajax({
      url: url || '/attachment/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    }).error(Common.genericError)
  }

  function proceedSave (attachment) {
    var href = (asImage ? _.last(attachment.files) : _.first(attachment.files))
      .location
    $('.href', that.$el).val(href)

    that.data.content = '>[' + $('.title', that.$el).val() + '](' + href + ')'
    that.trigger('save', that)
  }

  // Prepare XML File Upload
  // Geogebra XMLs are always utf8 encoded (as a matter of fact, almost every xml is encoded in uft8)
  // We enforce this, so there are no encoding issues
  var utf8xml = toUtf8(xml)
  formData = that.createUploadFormData(
    utf8xml,
    'application/xml',
    'geogebra.xml'
  )

  uploadFile(formData).then(function (attachment) {
    if (asImage) {
      // Prepare Image File Upload
      context = that.ggbApplet.getContext2D()
      imageData = context.canvas.toDataURL('image/jpeg')
      imageData = atob(imageData.split(',')[1])
      formData = that.createUploadFormData(
        imageData,
        'image/jpeg',
        'geogebra.jpg'
      )

      // Append image to newly created attachment
      uploadFile(formData, '/attachment/upload/' + attachment.id).then(function (
        attachment
      ) {
        proceedSave(attachment)
      })
    } else {
      proceedSave(attachment)
    }
  })

  // if (asImage) {
  //     // Generate image
  //     context = ggbApplet.getContext2D();
  //     imageData = context.canvas.toDataURL('image/jpeg');

  //     this.showImagePreview(imageData);

  // } else {

  // }

  // console.log(xml);

  // this.data.content = '>[' + $('.title', this.$el).val() + '](' + $('.href', this.$el).val() + ')';
  // this.trigger('save', this);
}

GeogebraInjectionPlugin.prototype.createUploadFormData = function (
  data,
  type,
  filename
) {
  var array = []
  var file
  var formdata

  for (var i = 0; i < data.length; i++) {
    array.push(data.charCodeAt(i))
  }

  file = new Blob([new Uint8Array(array)], {
    type: type
  })

  formdata = new FormData()
  formdata.append('attachment[file]', file, filename)
  formdata.append('type', 'geogebra')
  return formdata
}

EditorPlugin.GeogebraInjection = GeogebraInjectionPlugin
