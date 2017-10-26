import 'blueimp-load-image'
import 'blueimp-file-upload'
import 'blueimp-file-upload/js/jquery.iframe-transport'
import $ from 'jquery'
import _ from 'underscore'

import Common from '../../../../modules/common'
import t from '../../../../modules/translator'
import pluginHtmlTemplate from '../../templates/plugins/image/image_plugin.html'
import EditorPlugin from '../serlo_texteditor_plugin'

var ImagePlugin, titleRegexp, hrefRegexp

titleRegexp = new RegExp(/\[[^\]]*\]\(/)
hrefRegexp = new RegExp(/\([^)]*\)/)

ImagePlugin = function (fileuploadOptions) {
  this.state = 'image'
  this.init(fileuploadOptions)
}

ImagePlugin.prototype = new EditorPlugin()
ImagePlugin.prototype.constructor = ImagePlugin

ImagePlugin.prototype.init = function (fileuploadOptions) {
  var that = this

  that.fileuploadOptions = fileuploadOptions || {}

  that.template = _.template(pluginHtmlTemplate)

  that.data.name = 'Image'
}

ImagePlugin.prototype.updateContentString = function () {
  this.data.content = '![' + this.data.title + '](' + this.data.href + ')'
}

ImagePlugin.prototype.onError = function (err) {
  this.$uploadStatus.text(err.join('\n'))
}

ImagePlugin.prototype.activate = function (token) {
  var that = this
  var title
  var href

  that.data.content = token.string
  title = _.first(that.data.content.match(titleRegexp))
  that.data.title = title.substr(1, title.length - 3)

  href = _.first(that.data.content.match(hrefRegexp))
  that.data.href = href.substr(1, href.length - 2)

  that.$el = $(that.template(that.data))

  that.$el.on('change', '.title', function () {
    that.setData('title', this.value)
  })

  that.$el.on('change', '.href', function () {
    that.setData('href', this.value)
  })

  that.$el.on('click', '.btn-save', function (e) {
    e.preventDefault()
    that.trigger('save', that)
  })

  that.$el.on('click', '.btn-cancel', function (e) {
    e.preventDefault()
    that.trigger('close')
  })

  // Simple status message object
  that.$uploadStatus = $('.fileupload-process', that.$el)

  // the upload form
  that.$upload = $('#fileupload', that.$el)

  that.$upload.bind('fileuploadsubmit', function (e, data) {
    var $csrf = $('input[name="csrf"]')
    data.formData = that.$upload.serializeArray()
    if ($csrf) {
      data.formData.push({
        name: 'csrf',
        value: $csrf.val()
      })
    } else {
      that.$uploadStatus.text(t('An error occured: %s', 'Form not valid'))
      return false
    }
  })

  // initialize fileupload
  that.$upload.fileupload(
    _.extend({}, that.fileuploadOptions, {
      add: function (e, data) {
        that.$el.addClass('uploading')
        that.$uploadStatus.text(t('Uploading.'))

        var uploadErrors = []
        var acceptFileTypes =
          that.fileuploadOptions.acceptFileTypes ||
          /^image\/(gif|jpe?g|png|svg\+xml)$/i

        if (
          data.originalFiles.length > that.fileuploadOptions.maxNumberOfFiles
        ) {
          uploadErrors.push(t('You only can upload one file'))
        }

        if (
          data.originalFiles[0].type &&
          !acceptFileTypes.test(data.originalFiles[0].type)
        ) {
          uploadErrors.push(t('Not an accepted file type'))
        }

        if (
          data.originalFiles[0].size &&
          data.originalFiles[0].size >
            that.fileuploadOptions.loadImageMaxFileSize
        ) {
          uploadErrors.push(t('Filesize is too big'))
        }

        if (uploadErrors.length > 0) {
          that.onError(uploadErrors)
        } else {
          data.submit()
        }
      },
      error: function () {
        that.$el.removeClass('uploading')
        that.$uploadStatus.text(t('An error occured: %s', arguments[2]))
        Common.genericError(arguments)
      },
      done: function () {
        var upload = arguments[1]
        that.$el.removeClass('uploading')

        if (
          upload.result &&
          upload.result.success &&
          upload.result.files.length
        ) {
          $('.href', that.$el)
            .val(upload.result.files[0].location)
            .trigger('change')
          that.$uploadStatus.text(t('Image successfully uploaded.'))
        } else {
          Common.genericError()
          that.$uploadStatus.text(t('An error occured.'))
        }
      }
    })
  )
}

EditorPlugin.Image = ImagePlugin
