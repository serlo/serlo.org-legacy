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

import Common from './common'
import i18n from './i18n'

var t
var config
var untranslated = []
var defaultLanguage = 'de'

config = {
  language: defaultLanguage,
  // with debugging active,
  // the translator will log
  //  untranslated strings
  debug: false
}

/**
 * @function mayTranslate
 * @param {String} string The string to translate
 * @return {String} The translated string OR the untouched string
 **/
function mayTranslate(string) {
  if (
    i18n[config.language] &&
    i18n[config.language][string] &&
    i18n[config.language][string] !== ''
  ) {
    return i18n[config.language][string]
  }

  Common.expr(config.debug && untranslated.push(string))

  return string
}

/**
 * @function replace
 * @param {String} string The string to translate
 * @param {Array} replacements An array of strings, to replace placeholders in @param string
 * @return {String} The string, with placeholders replaced by replacement partials
 **/
function replace(string, replacements) {
  _.each(replacements, function(partial) {
    switch (typeof partial) {
      case 'string':
        string = string.replace(/%s/, partial)
        break
      case 'number':
        string = string.replace(/%d/, partial)
        break
      case 'boolean':
        string = string.replace(/%b/, partial ? 'true' : 'false')
        break
    }
  })
  return string
}

/**
 * @function t
 * @param {String} The string to translate
 * ...
 * @param {String} String replacements
 * @return {String} The translated string or the original
 **/
t = Common.memoize(function() {
  var args = Array.prototype.slice.call(arguments)
  var string = args.shift()

  return replace(mayTranslate(string), args)
})

/**
 * @method config
 * @param {Object} configuration
 *
 * sets configurations
 **/
t.config = function(configuration) {
  _.extend(config, configuration)
}

t.getLanguage = function() {
  return config.language
}

if (config.debug) {
  window.t = t
}

export default t
