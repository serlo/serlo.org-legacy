/* global define */
var allowedTags =
  'a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|' +
  'i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr|span|' +
  'table|th|tr|td|tbody|thead|tfoot|div'
var allowedAttributes = {
  img: 'src|width|height|alt',
  a: 'href|name',
  '*': 'title',
  span: 'class',
  table: 'class',
  tr: 'rowspan',
  td: 'colspan|align',
  th: 'rowspan|align',
  div: 'class',
  b: 'class',
  h1: 'id',
  h2: 'id',
  h3: 'id',
  h4: 'id',
  h5: 'id',
  h6: 'id'
}
var forceProtocol = false
var testAllowed = new RegExp('^(' + allowedTags.toLowerCase() + ')$')
var findTags = /<(\/?)\s*([\w:-]+)([^>]*)>/g
var findAttribs = /(\s*)([\w:-]+)\s*=\s*(?:(?:(["'])([^\3]+?)(?:\3))|([^\s]+))/g

var htmlstrip = function (converter) {
  var filter

  filter = function (text) {
    return stripUnwantedHTML(text)
  }

  return [
    {
      type: 'output',
      filter: filter
    }
  ]
}

function stripUnwantedHTML (html) {
  // convert all strings patterns into regexp objects (if not already converted)
  for (var i in allowedAttributes) {
    if (
      allowedAttributes.hasOwnProperty(i) &&
      typeof allowedAttributes[i] === 'string'
    ) {
      allowedAttributes[i] = new RegExp(
        '^(' + allowedAttributes[i].toLowerCase() + ')$'
      )
    }
  }

  // find and match html tags
  return html.replace(findTags, function (original, lslash, tag, params) {
    var tagAttr
    var wildcardAttr
    var rslash = (params.substr(-1) === '/' && '/') || ''

    tag = tag.toLowerCase()

    // tag is not allowed, return empty string
    if (!tag.match(testAllowed)) return ''
    else {
      // tag is allowed
      // regexp objects for a particular tag
      tagAttr = tag in allowedAttributes && allowedAttributes[tag]
      wildcardAttr = '*' in allowedAttributes && allowedAttributes['*']

      // if no attribs are allowed
      if (!tagAttr && !wildcardAttr) return '<' + lslash + tag + rslash + '>'

      // remove trailing slash if any
      params = params.trim()
      if (rslash) {
        params = params.substr(0, params.length - 1)
      }

      // find and remove unwanted attributes
      params = params.replace(findAttribs, function (
        original,
        space,
        name,
        quot,
        value
      ) {
        name = name.toLowerCase()

        if (!value && !quot) {
          value = ''
          quot = '"'
        } else if (!value) {
          value = quot
          quot = '"'
        }

        // force data: and javascript: links and images to #
        if (
          (name === 'href' || name === 'src') &&
          (value.trim().substr(0, 'javascript:'.length) === 'javascript:' ||
            value.trim().substr(0, 'data:'.length) === 'data:')
        ) {
          value = '#'
        }

        // scope links and sources to http protocol
        if (
          forceProtocol &&
          (name === 'href' || name === 'src') &&
          !/^[a-zA-Z]{3,5}:\/\//.test(value)
        ) {
          value = 'http://' + value
        }

        if (
          (wildcardAttr && name.match(wildcardAttr)) ||
          (tagAttr && name.match(tagAttr))
        ) {
          return space + name + '=' + quot + value + quot
        } else return ''
      })

      return '<' + lslash + tag + (params ? ' ' + params : '') + rslash + '>'
    }
  })
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_htmlstrip', ['showdown'], function (Showdown) {
    Showdown.extensions = Showdown.extensions || {}
    Showdown.extensions.htmlstrip = htmlstrip
  })
} else if (
  typeof window !== 'undefined' &&
  window.Showdown &&
  window.Showdown.extensions
) {
  window.Showdown.extensions.htmlstrip = htmlstrip
}
// Server-side export
if (typeof module !== 'undefined') {
  module.exports = htmlstrip
}
