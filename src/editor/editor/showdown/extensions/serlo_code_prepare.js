/* global define */
/* Prepares Github Style Code */
var codeprepare = function (converter) {
  return [
    {
      type: 'lang',
      filter: (function () {
        var replacements = {}
        var replacementRegexp = ''
        var codeRegexp = /(?:^|\n)```(.*)\n([\s\S]*?)\n```/gm
        var charsToDecode = ['~D', '%', '\\|', '/']
        var i
        var l

        for (i = 0, l = charsToDecode.length; i < l; i++) {
          // replacementRegexp += '\\' + charsToDecode[i];
          // charsToDecode[i] = '\\' + charsToDecode[i];
          replacements[charsToDecode[i].replace(/\\/g, '')] = '§SC' + i
        }

        // (~D|\$|/|%)
        // (~D|%|\||\/)/gm
        replacementRegexp = new RegExp(
          '(' + charsToDecode.join('|') + ')',
          'gm'
        )

        function replace (whole, language, code) {
          // escape all chars in code
          code = code.replace(replacementRegexp, function (match) {
            return replacements[match] || match
          })

          return '\n```' + language + '\n' + code + '\n```'
        }

        return function (text) {
          return text.replace(codeRegexp, replace)
        }
      })()
    }
  ]
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_code_prepare', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.codeprepare = codeprepare
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.codeprepare = codeprepare
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = codeprepare
}
