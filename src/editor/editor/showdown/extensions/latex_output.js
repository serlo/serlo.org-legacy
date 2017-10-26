/* global define */
var serloSpecificCharsToEncode
var latexoutput = function () {
  return [
    {
      type: 'output',
      filter: function (text) {
        return encodeSerloSpecificChars(text)
      }
    }
  ]
}

serloSpecificCharsToEncode = (function () {
  var regexp
  var chars = ['*', '`', '_', '{', '}', '[', ']', '&lt;', '\\']
  var replacements = {}
  var l = chars.length
  var i = 0

  for (; i < l; i++) {
    replacements['' + i] = chars[i]
  }

  regexp = new RegExp('§LT([0-9])', 'gm')

  function replace (whole, match) {
    return replacements[parseInt(match)] || match
  }

  return {
    regexp: regexp,
    replace: replace
  }
})()

function encodeSerloSpecificChars (text) {
  return text.replace(
    serloSpecificCharsToEncode.regexp,
    serloSpecificCharsToEncode.replace
  )
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_latex_output', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.latexoutput = latexoutput
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.latexoutput = latexoutput
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = latexoutput
}
