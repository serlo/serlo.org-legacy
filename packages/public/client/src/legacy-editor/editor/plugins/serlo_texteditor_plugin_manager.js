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
import _ from 'underscore'

import eventScope from '../../../libs/eventscope'

var slice = Array.prototype.slice
var PluginManager

PluginManager = function () {
  eventScope(this)
  this.plugins = []
  this.updateChain()
}

PluginManager.prototype.addPlugin = function (plugin) {
  var that = this
  that.plugins.push(plugin)

  plugin.addEventListener('save', function (plugin) {
    that.trigger('save', plugin)
    that.trigger('close')
  })

  plugin.addEventListener('close', function () {
    that.trigger('close')
  })

  plugin.addEventListener('update', function (plugin) {
    that.trigger('update', plugin)
  })

  plugin.addEventListener('toggle-plugin', function (pluginName, token, data) {
    var newPlugin = that.matchState(pluginName)
    if (newPlugin) {
      that.deactivate()
      that.activate(newPlugin, token, data)
      that.trigger('toggle-plugin', newPlugin)
    } else {
      throw new Error('Cannot load plugin: ' + pluginName)
    }
  })

  this.updateChain()
  return this
}

PluginManager.prototype.updateChain = function () {
  this.chain = _.chain(this.plugins)
}

PluginManager.prototype.matchState = function (state) {
  return (
    this.chain
      .filter(function (plugin) {
        if (plugin.state === state) {
          return plugin
        }
      })
      .value()[0] || null
  )
}

PluginManager.prototype.activate = function (plugin) {
  this.active = plugin
  this.active.activate.apply(this.active, slice.call(arguments, 1))
}

PluginManager.prototype.deactivate = function () {
  if (this.active) {
    this.active.deactivate()
  }
}

export default PluginManager
