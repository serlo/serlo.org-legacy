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
  },
}

export default SN
