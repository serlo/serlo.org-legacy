/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import $ from 'jquery'
import _ from 'underscore'

import Common from '../../../../modules/common'
import t from '../../../../modules/translator'
import pluginHtmlTemplate from '../../templates/plugins/injection/injection_plugin.html'
import EditorPlugin from '../serlo_texteditor_plugin'

var InjectionPlugin, hrefRegexp

hrefRegexp = new RegExp(/\([^)]*\)/)

InjectionPlugin = function(fileuploadOptions) {
  this.state = 'injection'
  this.init(fileuploadOptions)
}

InjectionPlugin.prototype = new EditorPlugin()
InjectionPlugin.prototype.constructor = InjectionPlugin

InjectionPlugin.prototype.init = function() {
  var that = this

  that.template = _.template(pluginHtmlTemplate)

  that.data.name = 'Injection'
}

InjectionPlugin.prototype.activate = function(token) {
  var that = this
  var href
  var availablePlugins
  var $body
  var $group

  that.$el = $(that.template(that.data))

  href = _.first(token.string.match(hrefRegexp))
  href = href.substr(1, href.length - 2)

  $body = $('.panel-body', that.$el)

  that.$el.on('click', '.btn-cancel', function(e) {
    e.preventDefault()
    that.trigger('close')
  })

  if (href !== '') {
    href = href.split('/')
    // check for attachment
    if (href[1] === 'attachment' && href[2] === 'file' && href[3] && href[4]) {
      $body.html(
        '<div class="alert alert-info">' +
          t('Loading injection data') +
          '</div>'
      )

      // Load attachments info:
      // /attachment/info/:aid
      href[2] = 'info'
      href.pop()
      $.ajax(href.join('/'))
        .then(function(data) {
          //
          if (data && data.success) {
            if (data.type === 'geogebra' || data.files.length === 2) {
              that.trigger('toggle-plugin', 'geogebra-injection', token, data)
            } else if (
              data.type === 'geogebratube' ||
              data.files.length === 2
            ) {
              that.trigger(
                'toggle-plugin',
                'geogebratube-injection',
                token,
                data
              )
            } else {
              that.trigger('toggle-plugin', 'default-injection', token)
            }
          } else {
            Common.genericError()
            that.trigger('close')
          }
        })
        .error(function() {
          Common.genericError()
          that.trigger('close')
        }) //   /ggt/123456
    } else if (href[0] === 'ggt') {
      that.trigger(
        'toggle-plugin',
        'geogebratube-injection',
        token,
        href.join('/')
      )
    } else {
      // normal injections get treated as
      // default injections
      // Could also be invalid!
      that.trigger('toggle-plugin', 'default-injection', token)
    }
  } else {
    // to be done
    availablePlugins = [
      {
        name: t('Normal'),
        key: 'default-injection'
      },
      {
        name: t('GeogebraTube'),
        key: 'geogebratube-injection'
      }
    ]

    $body.empty()
    $group = $('<div class="btn-group">')

    $group.append(
      $('<a class="btn btn-default disabled" disabled>').text(
        t('Pick a injection type:')
      )
    )

    _.each(availablePlugins, function(plugin) {
      var key = plugin.key

      $('<a>')
        .text(plugin.name)
        .attr({
          class: 'btn btn-default',
          href: '#'
        })
        .click(function(e) {
          e.preventDefault()
          that.trigger('toggle-plugin', key, token)
        })
        .appendTo($group)
        .data(plugin)
    })

    $body.append($group)
  }
}

EditorPlugin.Injection = InjectionPlugin
