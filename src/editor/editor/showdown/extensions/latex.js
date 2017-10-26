/* global define */
var _EncodeCode
var serloSpecificCharsToEscape
var latex = function () {
  var filter

  filter = function (text) {
    // text = text.replace(/(^|[^\\])(%%)([^\r]*?[^%])\2(?!%)/gm,
    text = text.replace(/(^|[^\\])(%%)([^\r]*?[^%])(%%?%)/gm, function (
      wholeMatch,
      m1,
      m2,
      m3,
      m4
    ) {
      var c = m3
      c = c.replace(/^([ \t]*)/g, '') // leading whitespace
      c = c.replace(/[ \t]*$/g, '') // trailing whitespace
      // Solves an issue where the formula would end with %%% and therefore the last %
      // isn't added to c. However, this is a regex issue and should be solved there instead of here
      if (m4 === '%%%') {
        c += '% '
      }
      // Escape latex environment thingies
      text = text.replace(/\$/g, '\\$')
      text = text.replace(/%/g, '\\%')

      c = _EncodeCode(c)

      return m1 + '<span class="mathInline">%%' + c + '%%</span>'
    })

    text = text.replace(/(^|[^\\])(~D~D)([^\r]*?[^~])\2(?!~D)/gm, function (
      wholeMatch,
      m1,
      m2,
      m3
    ) {
      var c = m3
      c = c.replace(/^([ \t]*)/g, '') // leading whitespace
      c = c.replace(/[ \t]*$/g, '') // trailing whitespace
      c = _EncodeCode(c)
      // Escape already transliterated $
      // However, do not escape already escaped $s
      text = text.replace(/[^\\]~D/g, '\\~D')
      return m1 + '<span class="math">~D~D' + c + '~D~D</span>'
    })

    return text
  }

  return [
    {
      type: 'lang',
      filter: filter
    }
  ]
}

// FROM shodown.js
_EncodeCode = function (text) {
  //
  // Encode/escape certain characters inside Markdown code runs.
  // The point is that in code, these characters are literals,
  // and lose their special Markdown meanings.
  //
  // Encode all ampersands; HTML entities are not
  // entities within a Markdown code span.
  // text = text.replace(/&/g, "&amp;");

  // Do the angle bracket song and dance:
  // text = text.replace(/</g, "&lt;");

  text = escapeSerloSpecificCharacters(text)

  return text
}

serloSpecificCharsToEscape = (function () {
  var regexp = ''
  var chars = ['*', '`', '_', '{', '}', '[', ']', '<', '\\']
  var replacements = {}
  var l = chars.length
  var i = 0

  for (; i < l; i++) {
    regexp += '\\' + chars[i]
    replacements[chars[i]] = '§LT' + i
  }

  regexp = new RegExp('([' + regexp + '])', 'gm')

  function replace (match) {
    return replacements[match] || match
  }

  return {
    regexp: regexp,
    replace: replace
  }
})()

function escapeSerloSpecificCharacters (text) {
  return text.replace(
    serloSpecificCharsToEscape.regexp,
    serloSpecificCharsToEscape.replace
  )
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_latex', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.latex = latex
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.latex = latex
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = latex
}
