import $ from 'jquery'
import _ from 'underscore'

import eventScope from '../../libs/eventscope'
import Common from '../../modules/common'

var Shortcuts, checkWrapper, commandWrapper

// contains special keyCodes
// that should be printed
// as words: 'left' instead of 37
commandWrapper = {
  left: Common.KeyCode.left,
  up: Common.KeyCode.up,
  right: Common.KeyCode.right,
  down: Common.KeyCode.down,
  enter: Common.KeyCode.enter,
  backspace: Common.KeyCode.backspace,
  entf: Common.KeyCode.entf,
  esc: Common.KeyCode.esc,
  shift: Common.KeyCode.shift
}

checkWrapper = Common.memoize(function (keyCode) {
  var key
  var result = keyCode

  for (key in commandWrapper) {
    if (commandWrapper[key] === keyCode) {
      result = key
      break
    }
  }

  return result
})

function triggerShortcut (e) {
  var commands = []

  if (e.metaKey) {
    commands.push('cmd')
  }
  if (e.ctrlKey) {
    commands.push('ctrl')
  }
  if (e.altKey) {
    commands.push('alt')
  }
  if (e.shiftKey) {
    commands.push('shift')
  }

  if (
    e.which !== Common.KeyCode.cmd &&
    e.which !== Common.KeyCode.ctrl &&
    e.which !== Common.KeyCode.alt &&
    e.which !== Common.KeyCode.shift
  ) {
    commands.push(checkWrapper(e.which))
  }

  commands = commands.join('+')
  /* jshint validthis:true */
  this.trigger(commands, e)
  this.trigger('always', commands, e)
}

Shortcuts = function () {
  var that = this

  eventScope(that)

  $(window).keydown(
    _.throttle(function (e) {
      triggerShortcut.call(that, e)
    }, 150)
  )
}

export default Shortcuts
