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
function mayTranslate (string) {
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
function replace (string, replacements) {
  _.each(replacements, function (partial) {
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
t = Common.memoize(function () {
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
t.config = function (configuration) {
  _.extend(config, configuration)
}

t.getLanguage = function () {
  return config.language
}

if (config.debug) {
  window.t = t
}

export default t
