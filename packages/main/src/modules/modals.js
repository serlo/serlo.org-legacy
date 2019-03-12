/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import $ from 'jquery'

import Router from './router'

var SerloModals
var Modal
var modals = {}
var modalTemplate = '#modalTemplate'

Modal = function(options, successCallback) {
  this.$el = $(modalTemplate).clone()

  this.type = options.type || false
  this.title = options.title || false
  this.content = options.content
  this.href = options.href && options.href !== '#' ? options.href : false
  this.cancel = options.cancel === undefined ? true : options.cancel
  this.okayLabel = options.okayLabel || false

  this.render().show(successCallback)
}

Modal.prototype.render = function() {
  var self = this
  var $btn = $('.btn-primary', self.$el)

  $('.modal-body', self.$el).html(self.content)
  $('body').append(self.$el)

  $btn.click(function() {
    if (self.successCallback) {
      self.successCallback()
      self.successCallback = null

      self.hide()
    } else if (self.href) {
      Router.navigate(self.href)
    } else {
      self.hide()
    }
  })

  if (!self.cancel) {
    $('.btn-default, .close', self.$el).remove()
  }

  if (self.type) {
    $btn.removeClass('btn-primary').addClass('btn-' + this.type)
  }

  if (self.title) {
    $('.modal-title', self.$el).text(self.title)
  }

  if (self.label) {
    $btn.text(self.label)
  }

  return self
}

Modal.prototype.show = function(cb) {
  this.successCallback = cb
  this.$el.modal('show')
  return this
}

Modal.prototype.hide = function() {
  this.$el.modal('hide')
  return this
}

Modal.prototype.remove = function() {
  this.$el.remove()
  return this
}

SerloModals = function() {
  return $(this).each(function() {
    var $self = $(this)
    var options = {
      type: $self.attr('data-type'),
      title: $self.attr('data-title'),
      content: $self.attr('data-content'),
      href: $self.attr('href'),
      cancel: $self.attr('data-cancel') !== 'false',
      label: $self.attr('data-label')
    }

    $self.click(function(e) {
      e.preventDefault()
      if ($self.parent('form')) {
        // eslint-disable-next-line no-new
        new Modal(options, function() {
          $self.parent('form').submit()
        })
      } else {
        // eslint-disable-next-line no-new
        new Modal(options)
      }
    })
  })
}

$.fn.SerloModals = SerloModals

const Modals = {
  show: function(options, uid, cb) {
    if (uid) {
      return modals[uid]
        ? modals[uid].show(cb)
        : (modals[uid] = new Modal(options, cb))
    }
    return new Modal(options, cb)
  },
  remove: function(uid) {
    if (modals[uid]) {
      modals[uid].remove()
      modals[uid] = undefined
    }
  }
}

export default Modals
