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
