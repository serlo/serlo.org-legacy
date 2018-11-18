/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2018 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
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

checkWrapper = Common.memoize(function(keyCode) {
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

function triggerShortcut(e) {
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

Shortcuts = function() {
  var that = this

  eventScope(that)

  $(window).keydown(
    _.throttle(function(e) {
      triggerShortcut.call(that, e)
    }, 150)
  )
}

export default Shortcuts
