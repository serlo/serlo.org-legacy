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
import _ from 'underscore'

function eventScope(element) {
  var Events = {}
  var fn = {}

  fn.addEventListener = function(type, fn) {
    Events[type] = Events[type] || []
    Events[type].push(fn)
    return true
  }

  fn.removeEventListener = function(type, fn) {
    return (
      !Events[type] ||
      (function() {
        if (fn === undefined) {
          delete Events[type]
          return true
        }

        _.each(Events[type], function(i) {
          if (Events[type][i] === fn) {
            Events[type].splice(i, 1)
            return false
          }
        })
      })()
    )
  }

  fn.trigger = function(type) {
    var self = this
    var slice = Array.prototype.slice.bind(arguments)

    if (!Events.hasOwnProperty(type)) {
      return true
    }

    _.each(Events[type], function(fn) {
      fn.apply(self, slice(1))
    })
  }

  switch (element.constructor.name) {
    case 'Function':
      _.extend(element.prototype, fn)
      break
    default:
      _.extend(element, fn)
  }
}

export default eventScope
