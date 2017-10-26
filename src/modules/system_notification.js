import $ from 'jquery'

import t from './translator'

var rootSelector = '#content-layout'
var $wrapper
var uniqueNotifications = {}
var SystemNotification
var errorMessage = t('An error occured, please reload.')

/**
 * allowed status:
 *   success, info, warning, danger
 **/
var showNotification = function (message, status, html, uniqueID) {
  var notification

  if (!$wrapper) {
    $wrapper = $('<div id="system-notification">')
    $(rootSelector).prepend($wrapper)
  }

  if (uniqueID) {
    if (uniqueNotifications[uniqueID]) {
      notification = uniqueNotifications[uniqueID]
      notification.$el.remove()
    } else {
      notification = uniqueNotifications[uniqueID] = new SystemNotification(
        message,
        status,
        html
      )
    }
  } else {
    notification = new SystemNotification(message, status, html)
  }

  $wrapper.append(notification.$el)
}

SystemNotification = function (message, status, html) {
  var self = this
  var $close = $(
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
  ).click(function () {
    self.$el.remove()
  })

  status = status || 'info'
  self.$el = $('<div class="alert">')

  if (status) {
    self.$el.addClass('alert-' + status)
  }

  if (html) {
    self.$el.html(message)
  } else {
    self.$el.text(message)
  }

  self.$el.append($close)
}

const SN = {
  notify: function (message, status, html, uniqueID) {
    showNotification(message, status, html, uniqueID)
  },
  error: function (message) {
    this.notify(message || errorMessage, 'danger', false, 'generic-error')
  }
}

export default SN
