/* global define */
var newline = function (converter) {
  var filter
  var findNewlines = new RegExp(/^\n--$/gm)

  filter = function (text) {
    return text.replace(findNewlines, function () {
      return '<br>'
    })
  }

  return [
    {
      type: 'lang',
      filter: filter
    }
  ]
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_newline', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.newline = newline
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.newline = newline
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = newline
}
