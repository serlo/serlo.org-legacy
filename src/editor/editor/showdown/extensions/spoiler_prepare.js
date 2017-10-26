/* global define */
/**
 * Serlo Flavored Markdown
 * Spoilers:
 * Transforms ///.../// blocks into spoilers
 **/
var spoilerprepare = function (converter) {
  var filter
  var findSpoilers = new RegExp(/^\/\/\/ (.*)\n([\s\S]*?)(\n|\r)+\/\/\//gm)

  filter = function (text) {
    // convert all "///"s into "=,sp."s
    return text.replace(findSpoilers, function (original, title, content) {
      return '<p>=,sp. ' + title + '</p>\n' + content + '<p>=,sp.</p>'
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
  define('showdown_spoiler_prepare', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.spoilerprepare = spoilerprepare
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.spoilerprepare = spoilerprepare
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = spoilerprepare
}
