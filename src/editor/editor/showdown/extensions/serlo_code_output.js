/* global define */
/* Prepares Github Style Code */
var codeoutput = function (converter) {
  return [
    {
      type: 'lang',
      filter: (function () {
        var charsToEncode = ['~D', '%', '|', '/']
        var replacements = {}
        var regexp
        var i
        var l

        for (i = 0, l = charsToEncode.length; i < l; i++) {
          replacements['' + i] = charsToEncode[i]
        }

        regexp = new RegExp('§SC([0-9])', 'gm')

        function replace (whole, match) {
          return replacements[parseInt(match)] || match
        }

        return function (text) {
          return text.replace(regexp, replace)
        }
      })()
    }
  ]
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_code_output', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.codeoutput = codeoutput
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.codeoutput = codeoutput
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = codeoutput
}
