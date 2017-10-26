/* global define */
var strikethrough = function (converter) {
  return [
    {
      // strike-through
      // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
      type: 'lang',
      regex: '(~T){2}([^~]+)(~T){2}',
      replace: function (match, prefix, content, suffix) {
        return '<del>' + content + '</del>'
      }
    }
  ]
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_strikethrough', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.strikethrough = strikethrough
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.strikethrough = strikethrough
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = strikethrough
}
