/* global define */
var atusername = function (converter) {
  return [
    // @username syntax
    {
      type: 'lang',
      regex: '\\B(\\\\)?@([\\S]+)\\b',
      replace: function (match, leadingSlash, username) {
        // Check if we matched the leading \ and return nothing changed if so
        if (leadingSlash === '\\') {
          return match
        } else {
          return (
            '<a class="user-mention" href="/user/profile/' +
            username +
            '">@' +
            username +
            '</a>'
          )
        }
      }
    },

    // Escaped @'s so we don't get into trouble
    //
    { type: 'lang', regex: '\\\\@', replace: '@' }
  ]
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_atusername', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.atusername = atusername
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.atusername = atusername
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = atusername
}
