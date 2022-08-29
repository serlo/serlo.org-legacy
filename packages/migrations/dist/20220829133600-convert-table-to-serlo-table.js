/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1033:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";



if (process.env.NODE_ENV === 'production') {
  module.exports = __nccwpck_require__(6337)
} else {
  module.exports = __nccwpck_require__(138)
}


/***/ }),

/***/ 138:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Showdown = _interopDefault(__nccwpck_require__(1872));

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */

/* Prepares Github Style Code */
var codeprepare = function codeprepare() {
  return [{
    type: 'lang',
    filter: function () {
      var replacements = {};
      var replacementRegexp = '';
      var codeRegexp = /(?:^|\n)```(.*)\n([\s\S]*?)\n```/gm;
      var charsToDecode = ['~D', '%', '\\|', '/'];
      var i;
      var l;

      for (i = 0, l = charsToDecode.length; i < l; i++) {
        // replacementRegexp += '\\' + charsToDecode[i];
        // charsToDecode[i] = '\\' + charsToDecode[i];
        replacements[charsToDecode[i].replace(/\\/g, '')] = '§SC' + i;
      } // (~D|\$|/|%)
      // (~D|%|\||\/)/gm


      replacementRegexp = new RegExp('(' + charsToDecode.join('|') + ')', 'gm');

      function replace(whole, language, code) {
        // escape all chars in code
        code = code.replace(replacementRegexp, function (match) {
          return replacements[match] || match;
        });
        return '\n```' + language + '\n' + code + '\n```';
      }

      return function (text) {
        return text.replace(codeRegexp, replace);
      };
    }()
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */

/**
 * Serlo Flavored Markdown
 * Injections:
 * Transforms >[Title](injectionUrl)
 * into <div class="injection"><a href="injectionUrl" class="injection-link">Title</a></div>
 **/
var injections = function injections() {
  var filter;
  var findInjections = new RegExp(/>\[(.*)\]\((.*)\)/g); // Corrects relative urls with missing leading slash

  function correctUrl(url) {
    url = url.split('/'); // Url does start with http

    if (url[0] === 'http:' || url[0] === 'https:') {
      // is invalid for injections, but do nothing
      return url.join('/');
    } // first item is empty, means there already is a leading slash


    if (url[0] === '') {
      url.shift();
    } // Url does not start with / or http


    return '/' + url.join('/');
  }

  filter = function filter(text) {
    return text.replace(findInjections, function (original, title, url) {
      var href = correctUrl(url);

      if (/assets\.serlo\.org\/legacy\/.*\.xml/.test(href)) {
        return "<div class=\"legacy-injection\">Legacy GeoGebra applets aren't supported anymore. Please upload the applet to GeoGebra instead.</div>";
      }

      if (/assets\.serlo\.org\/legacy\//.test(href)) {
        return "<div>\n            <div class=\"injection\"><a href=\"" + href + "\" class=\"injection-link\">" + title + "</a></div>\n            <div class=\"legacy-injection\">Please don't use injections for images. Change <code>>[...](...)</code> to <code>![...](...)</code></div>\n          </div>";
      }

      return "<div class=\"injection\"><a href=\"" + href + "\" class=\"injection-link\">" + title + "</a></div>";
    });
  };

  return [{
    type: 'lang',
    filter: filter
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */

/*
 * Basic table support with re-entrant parsing, where cell content
 * can also specify markdown.
 *
 * Tables
 * ======
 *
 * | Col 1   | Col 2                                              |
 * |======== |====================================================|
 * |**bold** | ![Valid XHTML] (http://w3.org/Icons/valid-xhtml10) |
 * | Plain   | Value                                              |
 *
 */
var table = function table() {
  var tables = {};
  var style = 'text-align:left;';
  var filter;
  var callbackConverter;

  tables.th = function (header) {
    return '<th style="' + style + '">' + callbackConverter.makeHtml(header) + '</th>';
  };

  tables.td = function (cell) {
    return '<td style="' + style + '">' + callbackConverter.makeHtml(cell) + '</td>';
  };

  tables.ths = function () {
    var out = '';
    var i = 0;
    var hs = [].slice.apply(arguments);

    for (i; i < hs.length; i += 1) {
      out += tables.th(hs[i]) + '\n';
    }

    return out;
  };

  tables.tds = function () {
    var out = '';
    var i = 0;
    var ds = [].slice.apply(arguments);

    for (i; i < ds.length; i += 1) {
      out += tables.td(ds[i]) + '\n';
    }

    return out;
  };

  tables.thead = function () {
    var out;
    var hs = [].slice.apply(arguments);
    out = '<thead>\n';
    out += '<tr>\n';
    out += tables.ths.apply(this, hs);
    out += '</tr>\n';
    out += '</thead>\n';
    return out;
  };

  tables.tr = function () {
    var out;
    var cs = [].slice.apply(arguments);
    out = '<tr>\n';
    out += tables.tds.apply(this, cs);
    out += '</tr>\n';
    return out;
  };

  filter = function filter(text, converter) {
    var i = 0;
    var lines = text.split('\n');
    var tbl = [];
    var line;
    var hs;
    var out = [];
    callbackConverter = converter;

    for (i; i < lines.length; i += 1) {
      line = lines[i]; // looks like a table heading

      if (line.trim().match(/^[|]{1}.*[|]{1}$/)) {
        line = line.trim();
        tbl.push('<div class="table-responsive">');
        tbl.push('<table class="table table-striped">');
        hs = line.substring(1, line.length - 1).split('|');
        tbl.push(tables.thead.apply(this, hs));
        line = lines[++i];

        if (!line.trim().match(/^[|]{1}[-=| ]+[|]{1}$/)) {
          // not a table rolling back
          line = lines[--i];
        } else {
          line = lines[++i];
          tbl.push('<tbody>');

          while (line.trim().match(/^[|]{1}.*[|]{1}$/)) {
            line = line.trim();
            tbl.push(tables.tr.apply(this, line.substring(1, line.length - 1).split('|')));
            line = lines[++i];
          }

          tbl.push('</tbody>');
          tbl.push('</table>');
          tbl.push('</div>'); // we are done with this table and we move along

          out.push(tbl.join('\n'));
          tbl = [];
          continue;
        }
      }

      out.push(line);
    }

    return out.join('\n');
  };

  return [{
    type: 'lang',
    filter: filter
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */
var allowedTags = 'a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|' + 'i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr|span|' + 'table|th|tr|td|tbody|thead|tfoot|div';
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
};
var testAllowed = /*#__PURE__*/new RegExp('^(' + /*#__PURE__*/allowedTags.toLowerCase() + ')$');
var findTags = /<(\/?)\s*([\w:-]+)([^>]*)>/g;
var findAttribs = /(\s*)([\w:-]+)\s*=\s*(?:(?:(["'])([^\3]+?)(?:\3))|([^\s]+))/g;

var htmlstrip = function htmlstrip() {
  var filter;

  filter = function filter(text) {
    return stripUnwantedHTML(text);
  };

  return [{
    type: 'output',
    filter: filter
  }];
};

function stripUnwantedHTML(html) {
  // convert all strings patterns into regexp objects (if not already converted)
  for (var i in allowedAttributes) {
    if (allowedAttributes.hasOwnProperty(i) && typeof allowedAttributes[i] === 'string') {
      allowedAttributes[i] = new RegExp('^(' + allowedAttributes[i].toLowerCase() + ')$');
    }
  } // find and match html tags


  return html.replace(findTags, function (original, lslash, tag, params) {
    var tagAttr;
    var wildcardAttr;
    var rslash = params.substr(-1) === '/' && '/' || '';
    tag = tag.toLowerCase(); // tag is not allowed, return empty string

    if (!tag.match(testAllowed)) return '';else {
      // tag is allowed
      // regexp objects for a particular tag
      tagAttr = tag in allowedAttributes && allowedAttributes[tag];
      wildcardAttr = '*' in allowedAttributes && allowedAttributes['*']; // if no attribs are allowed

      if (!tagAttr && !wildcardAttr) return '<' + lslash + tag + rslash + '>'; // remove trailing slash if any

      params = params.trim();

      if (rslash) {
        params = params.substr(0, params.length - 1);
      } // find and remove unwanted attributes


      params = params.replace(findAttribs, function (original, space, name, quot, value) {
        name = name.toLowerCase();

        if (!value && !quot) {
          value = '';
          quot = '"';
        } else if (!value) {
          value = quot;
          quot = '"';
        } // force data: and javascript: links and images to #


        if ((name === 'href' || name === 'src') && (value.trim().substr(0, 'javascript:'.length) === 'javascript:' || value.trim().substr(0, 'data:'.length) === 'data:')) {
          value = '#';
        } // scope links and sources to http protocol

        if (wildcardAttr && name.match(wildcardAttr) || tagAttr && name.match(tagAttr)) {
          return space + name + '=' + quot + value + quot;
        } else return '';
      });
      return '<' + lslash + tag + (params ? ' ' + params : '') + rslash + '>';
    }
  });
}

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */
var _EncodeCode;

var serloSpecificCharsToEscape;

var latex = function latex() {
  var filter;

  filter = function filter(text) {
    // text = text.replace(/(^|[^\\])(%%)([^\r]*?[^%])\2(?!%)/gm,
    text = text.replace(/(^|[^\\])(%%)([^\r]*?[^%])(%%?%)/gm, function (wholeMatch, m1, m2, m3, m4) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, ''); // leading whitespace

      c = c.replace(/[ \t]*$/g, ''); // trailing whitespace
      // Solves an issue where the formula would end with %%% and therefore the last %
      // isn't added to c. However, this is a regex issue and should be solved there instead of here

      if (m4 === '%%%') {
        c += '% ';
      } // Escape latex environment thingies


      text = text.replace(/\$/g, '\\$');
      text = text.replace(/%/g, '\\%');
      c = _EncodeCode(c);
      return m1 + '<span class="mathInline">%%' + c + '%%</span>';
    });
    text = text.replace(/(^|[^\\])(¨D¨D)([^\r]*?[^~])\2(?!¨D)/gm, function (wholeMatch, m1, m2, m3) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, ''); // leading whitespace

      c = c.replace(/[ \t]*$/g, ''); // trailing whitespace

      c = _EncodeCode(c); // Escape already transliterated $
      // However, do not escape already escaped $s

      text = text.replace(/[^\\]¨D/g, '\\¨D');
      return m1 + '<span class="math">¨D¨D' + c + '¨D¨D</span>';
    });
    return text;
  };

  return [{
    type: 'lang',
    filter: filter
  }];
}; // FROM shodown.js


_EncodeCode = function _EncodeCode(text) {
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
  text = escapeSerloSpecificCharacters(text);
  return text;
};

serloSpecificCharsToEscape = /*#__PURE__*/function () {
  var regexp = '';
  var chars = ['*', '`', '_', '{', '}', '[', ']', '<', '\\'];
  var replacements = {};
  var l = chars.length;
  var i = 0;

  for (; i < l; i++) {
    regexp += '\\' + chars[i];
    replacements[chars[i]] = '§LT' + i;
  }

  regexp = /*#__PURE__*/new RegExp('([' + regexp + '])', 'gm');

  function replace(match) {
    return replacements[match] || match;
  }

  return {
    regexp: regexp,
    replace: replace
  };
}();

function escapeSerloSpecificCharacters(text) {
  return text.replace(serloSpecificCharsToEscape.regexp, serloSpecificCharsToEscape.replace);
}

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */
var atusername = function atusername() {
  return [// @username syntax
  {
    type: 'lang',
    regex: '\\B(\\\\)?@([\\S]+)\\b',
    replace: function replace(match, leadingSlash, username) {
      // Check if we matched the leading \ and return nothing changed if so
      if (leadingSlash === '\\') {
        return match;
      } else {
        return '<a class="user-mention" href="/user/profile/' + username + '">@' + username + '</a>';
      }
    }
  }, // Escaped @'s so we don't get into trouble
  //
  {
    type: 'lang',
    regex: '\\\\@',
    replace: '@'
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */
var strikethrough = function strikethrough() {
  return [{
    // strike-through
    // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
    type: 'lang',
    regex: '(~T){2}([^~]+)(~T){2}',
    replace: function replace(match, prefix, content, suffix) {
      return '<del>' + content + '</del>';
    }
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */

/**
 * Serlo Flavored Markdown
 * Spoilers:
 * Transforms ///.../// blocks into spoilers
 **/
var spoiler = function spoiler() {
  var filter;
  var findSpoilers = new RegExp(/^<p>=,sp. (.*)<\/p>([\s\S]*?)<p>=,sp.<\/p>/gm);

  filter = function filter(text) {
    return text.replace(findSpoilers, function (original, title, content) {
      return '<div class="spoiler panel panel-default"><div class="spoiler-teaser panel-heading"><span class="fa fa-caret-square-o-down"></span>' + title + '</div><div class="spoiler-content panel-body">' + content + '</div></div>';
    });
  };

  return [{
    type: 'output',
    filter: filter
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */

/**
 * Serlo Flavored Markdown
 * Spoilers:
 * Transforms ///.../// blocks into spoilers
 **/
var spoilerprepare = function spoilerprepare() {
  var filter;
  var findSpoilers = new RegExp(/^\/\/\/ (.*)\n([\s\S]*?)(\n|\r)+\/\/\//gm);

  filter = function filter(text) {
    // convert all "///"s into "=,sp."s
    return text.replace(findSpoilers, function (original, title, content) {
      return '<p>=,sp. ' + title + '</p>\n' + content + '<p>=,sp.</p>';
    });
  };

  return [{
    type: 'lang',
    filter: filter
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */
var serloSpecificCharsToEncode;

var latexoutput = function latexoutput() {
  return [{
    type: 'output',
    filter: function filter(text) {
      return encodeSerloSpecificChars(text);
    }
  }];
};

serloSpecificCharsToEncode = /*#__PURE__*/function () {
  var regexp;
  var chars = ['*', '`', '_', '{', '}', '[', ']', '&lt;', '\\'];
  var replacements = {};
  var l = chars.length;
  var i = 0;

  for (; i < l; i++) {
    replacements['' + i] = chars[i];
  }

  regexp = /*#__PURE__*/new RegExp('§LT([0-9])', 'gm');

  function replace(whole, match) {
    return replacements[parseInt(match)] || match;
  }

  return {
    regexp: regexp,
    replace: replace
  };
}();

function encodeSerloSpecificChars(text) {
  return text.replace(serloSpecificCharsToEncode.regexp, serloSpecificCharsToEncode.replace);
}

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/* global define */

/* Prepares Github Style Code */
var codeoutput = function codeoutput() {
  return [{
    type: 'lang',
    filter: function () {
      var charsToEncode = ['~D', '%', '|', '/'];
      var replacements = {};
      var regexp;
      var i;
      var l;

      for (i = 0, l = charsToEncode.length; i < l; i++) {
        replacements['' + i] = charsToEncode[i];
      }

      regexp = new RegExp('§SC([0-9])', 'gm');

      function replace(whole, match) {
        return replacements[parseInt(match)] || match;
      }

      return function (text) {
        return text.replace(regexp, replace);
      };
    }()
  }];
};

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
var converter = /*#__PURE__*/new Showdown.Converter({
  extensions: [codeprepare, injections, table, htmlstrip, latex, atusername, strikethrough, spoiler, spoilerprepare, latexoutput, codeoutput]
});

exports.converter = converter;
//# sourceMappingURL=markdown.cjs.development.js.map


/***/ }),

/***/ 6337:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:!0}));var e,t,n,r,a=(e=__nccwpck_require__(1872))&&"object"==typeof e&&"default"in e?e.default:e,i={img:"src|width|height|alt",a:"href|name","*":"title",span:"class",table:"class",tr:"rowspan",td:"colspan|align",th:"rowspan|align",div:"class",b:"class",h1:"id",h2:"id",h3:"id",h4:"id",h5:"id",h6:"id"},s=new RegExp("^("+"a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr|span|table|th|tr|td|tbody|thead|tfoot|div".toLowerCase()+")$"),l=/<(\/?)\s*([\w:-]+)([^>]*)>/g,p=/(\s*)([\w:-]+)\s*=\s*(?:(?:(["'])([^\3]+?)(?:\3))|([^\s]+))/g;t=function(e){return function(e){return e.replace(n.regexp,n.replace)}(e)},n=function(){for(var e="",t=["*","`","_","{","}","[","]","<","\\"],n={},r=t.length,a=0;a<r;a++)e+="\\"+t[a],n[t[a]]="§LT"+a;return{regexp:e=new RegExp("(["+e+"])","gm"),replace:function(e){return n[e]||e}}}(),r=function(){for(var e=["*","`","_","{","}","[","]","&lt;","\\"],t={},n=e.length,r=0;r<n;r++)t[""+r]=e[r];return{regexp:new RegExp("§LT([0-9])","gm"),replace:function(e,n){return t[parseInt(n)]||n}}}(),exports.converter=new a.Converter({extensions:[function(){return[{type:"lang",filter:function(){var e,t,n,r={},a=/(?:^|\n)```(.*)\n([\s\S]*?)\n```/gm,i=["~D","%","\\|","/"];for(t=0,n=i.length;t<n;t++)r[i[t].replace(/\\/g,"")]="§SC"+t;function s(t,n,a){return"\n```"+n+"\n"+(a=a.replace(e,(function(e){return r[e]||e})))+"\n```"}return e=new RegExp("("+i.join("|")+")","gm"),function(e){return e.replace(a,s)}}()}]},function(){var e=new RegExp(/>\[(.*)\]\((.*)\)/g);return[{type:"lang",filter:function(t){return t.replace(e,(function(e,t,n){var r=function(e){return"http:"===(e=e.split("/"))[0]||"https:"===e[0]?e.join("/"):(""===e[0]&&e.shift(),"/"+e.join("/"))}(n);return/assets\.serlo\.org\/legacy\/.*\.xml/.test(r)?'<div class="legacy-injection">Legacy GeoGebra applets aren\'t supported anymore. Please upload the applet to GeoGebra instead.</div>':/assets\.serlo\.org\/legacy\//.test(r)?'<div>\n            <div class="injection"><a href="'+r+'" class="injection-link">'+t+'</a></div>\n            <div class="legacy-injection">Please don\'t use injections for images. Change <code>>[...](...)</code> to <code>![...](...)</code></div>\n          </div>':'<div class="injection"><a href="'+r+'" class="injection-link">'+t+"</a></div>"}))}}]},function(){var e,t={},n="text-align:left;";return t.th=function(t){return'<th style="'+n+'">'+e.makeHtml(t)+"</th>"},t.td=function(t){return'<td style="'+n+'">'+e.makeHtml(t)+"</td>"},t.ths=function(){for(var e="",n=0,r=[].slice.apply(arguments);n<r.length;n+=1)e+=t.th(r[n])+"\n";return e},t.tds=function(){for(var e="",n=0,r=[].slice.apply(arguments);n<r.length;n+=1)e+=t.td(r[n])+"\n";return e},t.thead=function(){var e,n=[].slice.apply(arguments);return e="<thead>\n",e+="<tr>\n",e+=t.ths.apply(this,n),(e+="</tr>\n")+"</thead>\n"},t.tr=function(){var e,n=[].slice.apply(arguments);return e="<tr>\n",(e+=t.tds.apply(this,n))+"</tr>\n"},[{type:"lang",filter:function(n,r){var a,i,s=0,l=n.split("\n"),p=[],u=[];for(e=r;s<l.length;s+=1){if((a=l[s]).trim().match(/^[|]{1}.*[|]{1}$/)){if(a=a.trim(),p.push('<div class="table-responsive">'),p.push('<table class="table table-striped">'),i=a.substring(1,a.length-1).split("|"),p.push(t.thead.apply(this,i)),(a=l[++s]).trim().match(/^[|]{1}[-=| ]+[|]{1}$/)){for(a=l[++s],p.push("<tbody>");a.trim().match(/^[|]{1}.*[|]{1}$/);)a=a.trim(),p.push(t.tr.apply(this,a.substring(1,a.length-1).split("|"))),a=l[++s];p.push("</tbody>"),p.push("</table>"),p.push("</div>"),u.push(p.join("\n")),p=[];continue}a=l[--s]}u.push(a)}return u.join("\n")}}]},function(){return[{type:"output",filter:function(e){return function(e){for(var t in i)i.hasOwnProperty(t)&&"string"==typeof i[t]&&(i[t]=new RegExp("^("+i[t].toLowerCase()+")$"));return e.replace(l,(function(e,t,n,r){var a,l,u="/"===r.substr(-1)?"/":"";return(n=n.toLowerCase()).match(s)?(l="*"in i&&i["*"],(a=n in i&&i[n])||l?(r=r.trim(),u&&(r=r.substr(0,r.length-1)),"<"+t+n+((r=r.replace(p,(function(e,t,n,r,i){return i||r?i||(i=r,r='"'):(i="",r='"'),"href"!==(n=n.toLowerCase())&&"src"!==n||"javascript:"!==i.trim().substr(0,"javascript:".length)&&"data:"!==i.trim().substr(0,"data:".length)||(i="#"),l&&n.match(l)||a&&n.match(a)?t+n+"="+r+i+r:""})))?" "+r:"")+u+">"):"<"+t+n+u+">"):""}))}(e)}}]},function(){return[{type:"lang",filter:function(e){return e=(e=e.replace(/(^|[^\\])(%%)([^\r]*?[^%])(%%?%)/gm,(function(n,r,a,i,s){var l=i;return l=(l=l.replace(/^([ \t]*)/g,"")).replace(/[ \t]*$/g,""),"%%%"===s&&(l+="% "),e=(e=e.replace(/\$/g,"\\$")).replace(/%/g,"\\%"),r+'<span class="mathInline">%%'+(l=t(l))+"%%</span>"}))).replace(/(^|[^\\])(¨D¨D)([^\r]*?[^~])\2(?!¨D)/gm,(function(n,r,a,i){var s=i;return s=(s=s.replace(/^([ \t]*)/g,"")).replace(/[ \t]*$/g,""),s=t(s),e=e.replace(/[^\\]¨D/g,"\\¨D"),r+'<span class="math">¨D¨D'+s+"¨D¨D</span>"}))}}]},function(){return[{type:"lang",regex:"\\B(\\\\)?@([\\S]+)\\b",replace:function(e,t,n){return"\\"===t?e:'<a class="user-mention" href="/user/profile/'+n+'">@'+n+"</a>"}},{type:"lang",regex:"\\\\@",replace:"@"}]},function(){return[{type:"lang",regex:"(~T){2}([^~]+)(~T){2}",replace:function(e,t,n,r){return"<del>"+n+"</del>"}}]},function(){var e=new RegExp(/^<p>=,sp. (.*)<\/p>([\s\S]*?)<p>=,sp.<\/p>/gm);return[{type:"output",filter:function(t){return t.replace(e,(function(e,t,n){return'<div class="spoiler panel panel-default"><div class="spoiler-teaser panel-heading"><span class="fa fa-caret-square-o-down"></span>'+t+'</div><div class="spoiler-content panel-body">'+n+"</div></div>"}))}}]},function(){var e=new RegExp(/^\/\/\/ (.*)\n([\s\S]*?)(\n|\r)+\/\/\//gm);return[{type:"lang",filter:function(t){return t.replace(e,(function(e,t,n){return"<p>=,sp. "+t+"</p>\n"+n+"<p>=,sp.</p>"}))}}]},function(){return[{type:"output",filter:function(e){return function(e){return e.replace(r.regexp,r.replace)}(e)}}]},function(){return[{type:"lang",filter:function(){var e,t,n,r=["~D","%","|","/"],a={};for(t=0,n=r.length;t<n;t++)a[""+t]=r[t];function i(e,t){return a[parseInt(t)]||t}return e=new RegExp("§SC([0-9])","gm"),function(t){return t.replace(e,i)}}()}]}]});
//# sourceMappingURL=markdown.cjs.production.min.js.map


/***/ }),

/***/ 4802:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.attributeNames = exports.elementNames = void 0;
exports.elementNames = new Map([
    ["altglyph", "altGlyph"],
    ["altglyphdef", "altGlyphDef"],
    ["altglyphitem", "altGlyphItem"],
    ["animatecolor", "animateColor"],
    ["animatemotion", "animateMotion"],
    ["animatetransform", "animateTransform"],
    ["clippath", "clipPath"],
    ["feblend", "feBlend"],
    ["fecolormatrix", "feColorMatrix"],
    ["fecomponenttransfer", "feComponentTransfer"],
    ["fecomposite", "feComposite"],
    ["feconvolvematrix", "feConvolveMatrix"],
    ["fediffuselighting", "feDiffuseLighting"],
    ["fedisplacementmap", "feDisplacementMap"],
    ["fedistantlight", "feDistantLight"],
    ["fedropshadow", "feDropShadow"],
    ["feflood", "feFlood"],
    ["fefunca", "feFuncA"],
    ["fefuncb", "feFuncB"],
    ["fefuncg", "feFuncG"],
    ["fefuncr", "feFuncR"],
    ["fegaussianblur", "feGaussianBlur"],
    ["feimage", "feImage"],
    ["femerge", "feMerge"],
    ["femergenode", "feMergeNode"],
    ["femorphology", "feMorphology"],
    ["feoffset", "feOffset"],
    ["fepointlight", "fePointLight"],
    ["fespecularlighting", "feSpecularLighting"],
    ["fespotlight", "feSpotLight"],
    ["fetile", "feTile"],
    ["feturbulence", "feTurbulence"],
    ["foreignobject", "foreignObject"],
    ["glyphref", "glyphRef"],
    ["lineargradient", "linearGradient"],
    ["radialgradient", "radialGradient"],
    ["textpath", "textPath"],
]);
exports.attributeNames = new Map([
    ["definitionurl", "definitionURL"],
    ["attributename", "attributeName"],
    ["attributetype", "attributeType"],
    ["basefrequency", "baseFrequency"],
    ["baseprofile", "baseProfile"],
    ["calcmode", "calcMode"],
    ["clippathunits", "clipPathUnits"],
    ["diffuseconstant", "diffuseConstant"],
    ["edgemode", "edgeMode"],
    ["filterunits", "filterUnits"],
    ["glyphref", "glyphRef"],
    ["gradienttransform", "gradientTransform"],
    ["gradientunits", "gradientUnits"],
    ["kernelmatrix", "kernelMatrix"],
    ["kernelunitlength", "kernelUnitLength"],
    ["keypoints", "keyPoints"],
    ["keysplines", "keySplines"],
    ["keytimes", "keyTimes"],
    ["lengthadjust", "lengthAdjust"],
    ["limitingconeangle", "limitingConeAngle"],
    ["markerheight", "markerHeight"],
    ["markerunits", "markerUnits"],
    ["markerwidth", "markerWidth"],
    ["maskcontentunits", "maskContentUnits"],
    ["maskunits", "maskUnits"],
    ["numoctaves", "numOctaves"],
    ["pathlength", "pathLength"],
    ["patterncontentunits", "patternContentUnits"],
    ["patterntransform", "patternTransform"],
    ["patternunits", "patternUnits"],
    ["pointsatx", "pointsAtX"],
    ["pointsaty", "pointsAtY"],
    ["pointsatz", "pointsAtZ"],
    ["preservealpha", "preserveAlpha"],
    ["preserveaspectratio", "preserveAspectRatio"],
    ["primitiveunits", "primitiveUnits"],
    ["refx", "refX"],
    ["refy", "refY"],
    ["repeatcount", "repeatCount"],
    ["repeatdur", "repeatDur"],
    ["requiredextensions", "requiredExtensions"],
    ["requiredfeatures", "requiredFeatures"],
    ["specularconstant", "specularConstant"],
    ["specularexponent", "specularExponent"],
    ["spreadmethod", "spreadMethod"],
    ["startoffset", "startOffset"],
    ["stddeviation", "stdDeviation"],
    ["stitchtiles", "stitchTiles"],
    ["surfacescale", "surfaceScale"],
    ["systemlanguage", "systemLanguage"],
    ["tablevalues", "tableValues"],
    ["targetx", "targetX"],
    ["targety", "targetY"],
    ["textlength", "textLength"],
    ["viewbox", "viewBox"],
    ["viewtarget", "viewTarget"],
    ["xchannelselector", "xChannelSelector"],
    ["ychannelselector", "yChannelSelector"],
    ["zoomandpan", "zoomAndPan"],
]);


/***/ }),

/***/ 8621:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Module dependencies
 */
var ElementType = __importStar(__nccwpck_require__(3944));
var entities_1 = __nccwpck_require__(3000);
/**
 * Mixed-case SVG and MathML tags & attributes
 * recognized by the HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
 */
var foreignNames_1 = __nccwpck_require__(4802);
var unencodedElements = new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript",
]);
/**
 * Format attributes
 */
function formatAttributes(attributes, opts) {
    if (!attributes)
        return;
    return Object.keys(attributes)
        .map(function (key) {
        var _a, _b;
        var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
        if (opts.xmlMode === "foreign") {
            /* Fix up mixed-case attribute names */
            key = (_b = foreignNames_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
        }
        if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
            return key;
        }
        return key + "=\"" + (opts.decodeEntities !== false
            ? entities_1.encodeXML(value)
            : value.replace(/"/g, "&quot;")) + "\"";
    })
        .join(" ");
}
/**
 * Self-enclosing tags
 */
var singleTag = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);
/**
 * Renders a DOM node or an array of DOM nodes to a string.
 *
 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
 *
 * @param node Node to be rendered.
 * @param options Changes serialization behavior
 */
function render(node, options) {
    if (options === void 0) { options = {}; }
    var nodes = "length" in node ? node : [node];
    var output = "";
    for (var i = 0; i < nodes.length; i++) {
        output += renderNode(nodes[i], options);
    }
    return output;
}
exports["default"] = render;
function renderNode(node, options) {
    switch (node.type) {
        case ElementType.Root:
            return render(node.children, options);
        case ElementType.Directive:
        case ElementType.Doctype:
            return renderDirective(node);
        case ElementType.Comment:
            return renderComment(node);
        case ElementType.CDATA:
            return renderCdata(node);
        case ElementType.Script:
        case ElementType.Style:
        case ElementType.Tag:
            return renderTag(node, options);
        case ElementType.Text:
            return renderText(node, options);
    }
}
var foreignModeIntegrationPoints = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title",
]);
var foreignElements = new Set(["svg", "math"]);
function renderTag(elem, opts) {
    var _a;
    // Handle SVG / MathML in HTML
    if (opts.xmlMode === "foreign") {
        /* Fix up mixed-case element names */
        elem.name = (_a = foreignNames_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
        /* Exit foreign mode at integration points */
        if (elem.parent &&
            foreignModeIntegrationPoints.has(elem.parent.name)) {
            opts = __assign(__assign({}, opts), { xmlMode: false });
        }
    }
    if (!opts.xmlMode && foreignElements.has(elem.name)) {
        opts = __assign(__assign({}, opts), { xmlMode: "foreign" });
    }
    var tag = "<" + elem.name;
    var attribs = formatAttributes(elem.attribs, opts);
    if (attribs) {
        tag += " " + attribs;
    }
    if (elem.children.length === 0 &&
        (opts.xmlMode
            ? // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
                opts.selfClosingTags !== false
            : // User explicitly asked for self-closing tags, even in HTML mode
                opts.selfClosingTags && singleTag.has(elem.name))) {
        if (!opts.xmlMode)
            tag += " ";
        tag += "/>";
    }
    else {
        tag += ">";
        if (elem.children.length > 0) {
            tag += render(elem.children, opts);
        }
        if (opts.xmlMode || !singleTag.has(elem.name)) {
            tag += "</" + elem.name + ">";
        }
    }
    return tag;
}
function renderDirective(elem) {
    return "<" + elem.data + ">";
}
function renderText(elem, opts) {
    var data = elem.data || "";
    // If entities weren't decoded, no need to encode them back
    if (opts.decodeEntities !== false &&
        !(!opts.xmlMode &&
            elem.parent &&
            unencodedElements.has(elem.parent.name))) {
        data = entities_1.encodeXML(data);
    }
    return data;
}
function renderCdata(elem) {
    return "<![CDATA[" + elem.children[0].data + "]]>";
}
function renderComment(elem) {
    return "<!--" + elem.data + "-->";
}


/***/ }),

/***/ 3944:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
/** Types of elements found in htmlparser2's DOM */
var ElementType;
(function (ElementType) {
    /** Type for the root element of a document */
    ElementType["Root"] = "root";
    /** Type for Text */
    ElementType["Text"] = "text";
    /** Type for <? ... ?> */
    ElementType["Directive"] = "directive";
    /** Type for <!-- ... --> */
    ElementType["Comment"] = "comment";
    /** Type for <script> tags */
    ElementType["Script"] = "script";
    /** Type for <style> tags */
    ElementType["Style"] = "style";
    /** Type for Any tag */
    ElementType["Tag"] = "tag";
    /** Type for <![CDATA[ ... ]]> */
    ElementType["CDATA"] = "cdata";
    /** Type for <!doctype ...> */
    ElementType["Doctype"] = "doctype";
})(ElementType = exports.ElementType || (exports.ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */
function isTag(elem) {
    return (elem.type === ElementType.Tag ||
        elem.type === ElementType.Script ||
        elem.type === ElementType.Style);
}
exports.isTag = isTag;
// Exports for backwards compatibility
/** Type for the root element of a document */
exports.Root = ElementType.Root;
/** Type for Text */
exports.Text = ElementType.Text;
/** Type for <? ... ?> */
exports.Directive = ElementType.Directive;
/** Type for <!-- ... --> */
exports.Comment = ElementType.Comment;
/** Type for <script> tags */
exports.Script = ElementType.Script;
/** Type for <style> tags */
exports.Style = ElementType.Style;
/** Type for Any tag */
exports.Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */
exports.CDATA = ElementType.CDATA;
/** Type for <!doctype ...> */
exports.Doctype = ElementType.Doctype;


/***/ }),

/***/ 4038:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomHandler = void 0;
var domelementtype_1 = __nccwpck_require__(3944);
var node_1 = __nccwpck_require__(7822);
__exportStar(__nccwpck_require__(7822), exports);
var reWhitespace = /\s+/g;
// Default options
var defaultOpts = {
    normalizeWhitespace: false,
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false,
};
var DomHandler = /** @class */ (function () {
    /**
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */
    function DomHandler(callback, options, elementCB) {
        /** The elements of the DOM */
        this.dom = [];
        /** The root element for the DOM */
        this.root = new node_1.Document(this.dom);
        /** Indicated whether parsing has been completed. */
        this.done = false;
        /** Stack of open tags. */
        this.tagStack = [this.root];
        /** A data node that is still being written to. */
        this.lastNode = null;
        /** Reference to the parser instance. Used for location information. */
        this.parser = null;
        // Make it possible to skip arguments, for backwards-compatibility
        if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
        }
        if (typeof callback === "object") {
            options = callback;
            callback = undefined;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    DomHandler.prototype.onparserinit = function (parser) {
        this.parser = parser;
    };
    // Resets the handler back to starting state
    DomHandler.prototype.onreset = function () {
        this.dom = [];
        this.root = new node_1.Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
    };
    // Signals the handler that parsing is done
    DomHandler.prototype.onend = function () {
        if (this.done)
            return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
    };
    DomHandler.prototype.onerror = function (error) {
        this.handleCallback(error);
    };
    DomHandler.prototype.onclosetag = function () {
        this.lastNode = null;
        var elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB)
            this.elementCB(elem);
    };
    DomHandler.prototype.onopentag = function (name, attribs) {
        var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : undefined;
        var element = new node_1.Element(name, attribs, undefined, type);
        this.addNode(element);
        this.tagStack.push(element);
    };
    DomHandler.prototype.ontext = function (data) {
        var normalizeWhitespace = this.options.normalizeWhitespace;
        var lastNode = this.lastNode;
        if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            if (normalizeWhitespace) {
                lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
            }
            else {
                lastNode.data += data;
            }
            if (this.options.withEndIndices) {
                lastNode.endIndex = this.parser.endIndex;
            }
        }
        else {
            if (normalizeWhitespace) {
                data = data.replace(reWhitespace, " ");
            }
            var node = new node_1.Text(data);
            this.addNode(node);
            this.lastNode = node;
        }
    };
    DomHandler.prototype.oncomment = function (data) {
        if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
        }
        var node = new node_1.Comment(data);
        this.addNode(node);
        this.lastNode = node;
    };
    DomHandler.prototype.oncommentend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.oncdatastart = function () {
        var text = new node_1.Text("");
        var node = new node_1.NodeWithChildren(domelementtype_1.ElementType.CDATA, [text]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
    };
    DomHandler.prototype.oncdataend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.onprocessinginstruction = function (name, data) {
        var node = new node_1.ProcessingInstruction(name, data);
        this.addNode(node);
    };
    DomHandler.prototype.handleCallback = function (error) {
        if (typeof this.callback === "function") {
            this.callback(error, this.dom);
        }
        else if (error) {
            throw error;
        }
    };
    DomHandler.prototype.addNode = function (node) {
        var parent = this.tagStack[this.tagStack.length - 1];
        var previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
            node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
            node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
            node.prev = previousSibling;
            previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
    };
    return DomHandler;
}());
exports.DomHandler = DomHandler;
exports["default"] = DomHandler;


/***/ }),

/***/ 7822:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
var domelementtype_1 = __nccwpck_require__(3944);
var nodeTypes = new Map([
    [domelementtype_1.ElementType.Tag, 1],
    [domelementtype_1.ElementType.Script, 1],
    [domelementtype_1.ElementType.Style, 1],
    [domelementtype_1.ElementType.Directive, 1],
    [domelementtype_1.ElementType.Text, 3],
    [domelementtype_1.ElementType.CDATA, 4],
    [domelementtype_1.ElementType.Comment, 8],
    [domelementtype_1.ElementType.Root, 9],
]);
/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */
var Node = /** @class */ (function () {
    /**
     *
     * @param type The type of the node.
     */
    function Node(type) {
        this.type = type;
        /** Parent of the node */
        this.parent = null;
        /** Previous sibling */
        this.prev = null;
        /** Next sibling */
        this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
        this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
        this.endIndex = null;
    }
    Object.defineProperty(Node.prototype, "nodeType", {
        // Read-only aliases
        /**
         * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
         * node {@link type}.
         */
        get: function () {
            var _a;
            return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.parent;
        },
        set: function (parent) {
            this.parent = parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.prev;
        },
        set: function (prev) {
            this.prev = prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.next;
        },
        set: function (next) {
            this.next = next;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */
    Node.prototype.cloneNode = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        return cloneNode(this, recursive);
    };
    return Node;
}());
exports.Node = Node;
/**
 * A node that contains some data.
 */
var DataNode = /** @class */ (function (_super) {
    __extends(DataNode, _super);
    /**
     * @param type The type of the node
     * @param data The content of the data node
     */
    function DataNode(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(DataNode.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DataNode;
}(Node));
exports.DataNode = DataNode;
/**
 * Text within the document.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(data) {
        return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
    }
    return Text;
}(DataNode));
exports.Text = Text;
/**
 * Comments within the document.
 */
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment(data) {
        return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
    }
    return Comment;
}(DataNode));
exports.Comment = Comment;
/**
 * Processing instructions, including doc types.
 */
var ProcessingInstruction = /** @class */ (function (_super) {
    __extends(ProcessingInstruction, _super);
    function ProcessingInstruction(name, data) {
        var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
        _this.name = name;
        return _this;
    }
    return ProcessingInstruction;
}(DataNode));
exports.ProcessingInstruction = ProcessingInstruction;
/**
 * A `Node` that can have children.
 */
var NodeWithChildren = /** @class */ (function (_super) {
    __extends(NodeWithChildren, _super);
    /**
     * @param type Type of the node.
     * @param children Children of the node. Only certain node types can have children.
     */
    function NodeWithChildren(type, children) {
        var _this = _super.call(this, type) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function () {
            var _a;
            return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
        /** Last child of the node. */
        get: function () {
            return this.children.length > 0
                ? this.children[this.children.length - 1]
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.children;
        },
        set: function (children) {
            this.children = children;
        },
        enumerable: false,
        configurable: true
    });
    return NodeWithChildren;
}(Node));
exports.NodeWithChildren = NodeWithChildren;
/**
 * The root node of the document.
 */
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(children) {
        return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
    }
    return Document;
}(NodeWithChildren));
exports.Document = Document;
/**
 * An element within the DOM.
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */
    function Element(name, attribs, children, type) {
        if (children === void 0) { children = []; }
        if (type === void 0) { type = name === "script"
            ? domelementtype_1.ElementType.Script
            : name === "style"
                ? domelementtype_1.ElementType.Style
                : domelementtype_1.ElementType.Tag; }
        var _this = _super.call(this, type, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        return _this;
    }
    Object.defineProperty(Element.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function () {
            var _this = this;
            return Object.keys(this.attribs).map(function (name) {
                var _a, _b;
                return ({
                    name: name,
                    value: _this.attribs[name],
                    namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                    prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name],
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    return Element;
}(NodeWithChildren));
exports.Element = Element;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */
function isTag(node) {
    return (0, domelementtype_1.isTag)(node);
}
exports.isTag = isTag;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */
function isCDATA(node) {
    return node.type === domelementtype_1.ElementType.CDATA;
}
exports.isCDATA = isCDATA;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */
function isText(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.isText = isText;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */
function isComment(node) {
    return node.type === domelementtype_1.ElementType.Comment;
}
exports.isComment = isComment;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDirective(node) {
    return node.type === domelementtype_1.ElementType.Directive;
}
exports.isDirective = isDirective;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDocument(node) {
    return node.type === domelementtype_1.ElementType.Root;
}
exports.isDocument = isDocument;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
 */
function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
exports.hasChildren = hasChildren;
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */
function cloneNode(node, recursive) {
    if (recursive === void 0) { recursive = false; }
    var result;
    if (isText(node)) {
        result = new Text(node.data);
    }
    else if (isComment(node)) {
        result = new Comment(node.data);
    }
    else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function (child) { return (child.parent = clone_1); });
        if (node.namespace != null) {
            clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
            clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
    }
    else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
        children.forEach(function (child) { return (child.parent = clone_2); });
        result = clone_2;
    }
    else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function (child) { return (child.parent = clone_3); });
        if (node["x-mode"]) {
            clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
    }
    else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    }
    else {
        throw new Error("Not implemented yet: ".concat(node.type));
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
exports.cloneNode = cloneNode;
function cloneChildren(childs) {
    var children = childs.map(function (child) { return cloneNode(child, true); });
    for (var i = 1; i < children.length; i++) {
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}


/***/ }),

/***/ 1503:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFeed = void 0;
var stringify_1 = __nccwpck_require__(9561);
var legacy_1 = __nccwpck_require__(2185);
/**
 * Get the feed object from the root of a DOM tree.
 *
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */
function getFeed(doc) {
    var feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot
        ? null
        : feedRoot.name === "feed"
            ? getAtomFeed(feedRoot)
            : getRssFeed(feedRoot);
}
exports.getFeed = getFeed;
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getAtomFeed(feedRoot) {
    var _a;
    var childs = feedRoot.children;
    var feed = {
        type: "atom",
        items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function (item) {
            var _a;
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs.href;
            if (href) {
                entry.link = href;
            }
            var description = fetch("summary", children) || fetch("content", children);
            if (description) {
                entry.description = description;
            }
            var pubDate = fetch("updated", children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }
            return entry;
        }),
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    var updated = fetch("updated", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getRssFeed(feedRoot) {
    var _a, _b;
    var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
    var feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function (item) {
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            var pubDate = fetch("pubDate", children);
            if (pubDate)
                entry.pubDate = new Date(pubDate);
            return entry;
        }),
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    var updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width",
];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */
function getMediaElements(where) {
    return (0, legacy_1.getElementsByTagName)("media:content", where).map(function (elem) {
        var attribs = elem.attribs;
        var media = {
            medium: attribs.medium,
            isDefault: !!attribs.isDefault,
        };
        for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
            var attrib = MEDIA_KEYS_STRING_1[_i];
            if (attribs[attrib]) {
                media[attrib] = attribs[attrib];
            }
        }
        for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
            var attrib = MEDIA_KEYS_INT_1[_a];
            if (attribs[attrib]) {
                media[attrib] = parseInt(attribs[attrib], 10);
            }
        }
        if (attribs.expression) {
            media.expression =
                attribs.expression;
        }
        return media;
    });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */
function getOneElement(tagName, node) {
    return (0, legacy_1.getElementsByTagName)(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where  Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */
function fetch(tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */
function addConditionally(obj, prop, tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    var val = fetch(tagName, where, recurse);
    if (val)
        obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */
function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
}


/***/ }),

/***/ 1447:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniqueSort = exports.compareDocumentPosition = exports.removeSubsets = void 0;
var domhandler_1 = __nccwpck_require__(4038);
/**
 * Given an array of nodes, remove any member that is contained by another.
 *
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't subtrees of each other.
 */
function removeSubsets(nodes) {
    var idx = nodes.length;
    /*
     * Check if each node (or one of its ancestors) is already contained in the
     * array.
     */
    while (--idx >= 0) {
        var node = nodes[idx];
        /*
         * Remove the node if it is not unique.
         * We are going through the array from the end, so we only
         * have to check nodes that preceed the node under consideration in the array.
         */
        if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
            nodes.splice(idx, 1);
            continue;
        }
        for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
            if (nodes.includes(ancestor)) {
                nodes.splice(idx, 1);
                break;
            }
        }
    }
    return nodes;
}
exports.removeSubsets = removeSubsets;
/**
 * Compare the position of one node against another node in any other document.
 * The return value is a bitmask with the following values:
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent./
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */
function compareDocumentPosition(nodeA, nodeB) {
    var aParents = [];
    var bParents = [];
    if (nodeA === nodeB) {
        return 0;
    }
    var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
    while (current) {
        aParents.unshift(current);
        current = current.parent;
    }
    current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
    while (current) {
        bParents.unshift(current);
        current = current.parent;
    }
    var maxIdx = Math.min(aParents.length, bParents.length);
    var idx = 0;
    while (idx < maxIdx && aParents[idx] === bParents[idx]) {
        idx++;
    }
    if (idx === 0) {
        return 1 /* DISCONNECTED */;
    }
    var sharedParent = aParents[idx - 1];
    var siblings = sharedParent.children;
    var aSibling = aParents[idx];
    var bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
            return 4 /* FOLLOWING */ | 16 /* CONTAINED_BY */;
        }
        return 4 /* FOLLOWING */;
    }
    if (sharedParent === nodeA) {
        return 2 /* PRECEDING */ | 8 /* CONTAINS */;
    }
    return 2 /* PRECEDING */;
}
exports.compareDocumentPosition = compareDocumentPosition;
/**
 * Sort an array of nodes based on their relative position in the document and
 * remove any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */
function uniqueSort(nodes) {
    nodes = nodes.filter(function (node, i, arr) { return !arr.includes(node, i + 1); });
    nodes.sort(function (a, b) {
        var relative = compareDocumentPosition(a, b);
        if (relative & 2 /* PRECEDING */) {
            return -1;
        }
        else if (relative & 4 /* FOLLOWING */) {
            return 1;
        }
        return 0;
    });
    return nodes;
}
exports.uniqueSort = uniqueSort;


/***/ }),

/***/ 1754:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
__exportStar(__nccwpck_require__(9561), exports);
__exportStar(__nccwpck_require__(9228), exports);
__exportStar(__nccwpck_require__(177), exports);
__exportStar(__nccwpck_require__(9908), exports);
__exportStar(__nccwpck_require__(2185), exports);
__exportStar(__nccwpck_require__(1447), exports);
__exportStar(__nccwpck_require__(1503), exports);
/** @deprecated Use these methods from `domhandler` directly. */
var domhandler_1 = __nccwpck_require__(4038);
Object.defineProperty(exports, "isTag", ({ enumerable: true, get: function () { return domhandler_1.isTag; } }));
Object.defineProperty(exports, "isCDATA", ({ enumerable: true, get: function () { return domhandler_1.isCDATA; } }));
Object.defineProperty(exports, "isText", ({ enumerable: true, get: function () { return domhandler_1.isText; } }));
Object.defineProperty(exports, "isComment", ({ enumerable: true, get: function () { return domhandler_1.isComment; } }));
Object.defineProperty(exports, "isDocument", ({ enumerable: true, get: function () { return domhandler_1.isDocument; } }));
Object.defineProperty(exports, "hasChildren", ({ enumerable: true, get: function () { return domhandler_1.hasChildren; } }));


/***/ }),

/***/ 2185:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getElementsByTagType = exports.getElementsByTagName = exports.getElementById = exports.getElements = exports.testElement = void 0;
var domhandler_1 = __nccwpck_require__(4038);
var querying_1 = __nccwpck_require__(9908);
var Checks = {
    tag_name: function (name) {
        if (typeof name === "function") {
            return function (elem) { return (0, domhandler_1.isTag)(elem) && name(elem.name); };
        }
        else if (name === "*") {
            return domhandler_1.isTag;
        }
        return function (elem) { return (0, domhandler_1.isTag)(elem) && elem.name === name; };
    },
    tag_type: function (type) {
        if (typeof type === "function") {
            return function (elem) { return type(elem.type); };
        }
        return function (elem) { return elem.type === type; };
    },
    tag_contains: function (data) {
        if (typeof data === "function") {
            return function (elem) { return (0, domhandler_1.isText)(elem) && data(elem.data); };
        }
        return function (elem) { return (0, domhandler_1.isText)(elem) && elem.data === data; };
    },
};
/**
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a particular value.
 */
function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
        return function (elem) { return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]); };
    }
    return function (elem) { return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value; };
}
/**
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either
 * of the input functions returns `true` for the node.
 */
function combineFuncs(a, b) {
    return function (elem) { return a(elem) || b(elem); };
}
/**
 * @param options An object describing nodes to look for.
 * @returns A function executing all checks in `options` and returning `true`
 * if any of them match a node.
 */
function compileTest(options) {
    var funcs = Object.keys(options).map(function (key) {
        var value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key)
            ? Checks[key](value)
            : getAttribCheck(key, value);
    });
    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */
function testElement(options, node) {
    var test = compileTest(options);
    return test ? test(node) : true;
}
exports.testElement = testElement;
/**
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */
function getElements(options, nodes, recurse, limit) {
    if (limit === void 0) { limit = Infinity; }
    var test = compileTest(options);
    return test ? (0, querying_1.filter)(test, nodes, recurse, limit) : [];
}
exports.getElements = getElements;
/**
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */
function getElementById(id, nodes, recurse) {
    if (recurse === void 0) { recurse = true; }
    if (!Array.isArray(nodes))
        nodes = [nodes];
    return (0, querying_1.findOne)(getAttribCheck("id", id), nodes, recurse);
}
exports.getElementById = getElementById;
/**
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */
function getElementsByTagName(tagName, nodes, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    return (0, querying_1.filter)(Checks.tag_name(tagName), nodes, recurse, limit);
}
exports.getElementsByTagName = getElementsByTagName;
/**
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */
function getElementsByTagType(type, nodes, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    return (0, querying_1.filter)(Checks.tag_type(type), nodes, recurse, limit);
}
exports.getElementsByTagType = getElementsByTagType;


/***/ }),

/***/ 177:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepend = exports.prependChild = exports.append = exports.appendChild = exports.replaceElement = exports.removeElement = void 0;
/**
 * Remove an element from the dom
 *
 * @param elem The element to be removed
 */
function removeElement(elem) {
    if (elem.prev)
        elem.prev.next = elem.next;
    if (elem.next)
        elem.next.prev = elem.prev;
    if (elem.parent) {
        var childs = elem.parent.children;
        childs.splice(childs.lastIndexOf(elem), 1);
    }
}
exports.removeElement = removeElement;
/**
 * Replace an element in the dom
 *
 * @param elem The element to be replaced
 * @param replacement The element to be added
 */
function replaceElement(elem, replacement) {
    var prev = (replacement.prev = elem.prev);
    if (prev) {
        prev.next = replacement;
    }
    var next = (replacement.next = elem.next);
    if (next) {
        next.prev = replacement;
    }
    var parent = (replacement.parent = elem.parent);
    if (parent) {
        var childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
    }
}
exports.replaceElement = replaceElement;
/**
 * Append a child to an element.
 *
 * @param elem The element to append to.
 * @param child The element to be added as a child.
 */
function appendChild(elem, child) {
    removeElement(child);
    child.next = null;
    child.parent = elem;
    if (elem.children.push(child) > 1) {
        var sibling = elem.children[elem.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
    }
    else {
        child.prev = null;
    }
}
exports.appendChild = appendChild;
/**
 * Append an element after another.
 *
 * @param elem The element to append after.
 * @param next The element be added.
 */
function append(elem, next) {
    removeElement(next);
    var parent = elem.parent;
    var currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
        currNext.prev = next;
        if (parent) {
            var childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
    }
    else if (parent) {
        parent.children.push(next);
    }
}
exports.append = append;
/**
 * Prepend a child to an element.
 *
 * @param elem The element to prepend before.
 * @param child The element to be added as a child.
 */
function prependChild(elem, child) {
    removeElement(child);
    child.parent = elem;
    child.prev = null;
    if (elem.children.unshift(child) !== 1) {
        var sibling = elem.children[1];
        sibling.prev = child;
        child.next = sibling;
    }
    else {
        child.next = null;
    }
}
exports.prependChild = prependChild;
/**
 * Prepend an element before another.
 *
 * @param elem The element to prepend before.
 * @param prev The element be added.
 */
function prepend(elem, prev) {
    removeElement(prev);
    var parent = elem.parent;
    if (parent) {
        var childs = parent.children;
        childs.splice(childs.indexOf(elem), 0, prev);
    }
    if (elem.prev) {
        elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
}
exports.prepend = prepend;


/***/ }),

/***/ 9908:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findAll = exports.existsOne = exports.findOne = exports.findOneChild = exports.find = exports.filter = void 0;
var domhandler_1 = __nccwpck_require__(4038);
/**
 * Search a node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
function filter(test, node, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    if (!Array.isArray(node))
        node = [node];
    return find(test, node, recurse, limit);
}
exports.filter = filter;
/**
 * Search an array of node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
function find(test, nodes, recurse, limit) {
    var result = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var elem = nodes_1[_i];
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0)
                break;
        }
        if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
            var children = find(test, elem.children, recurse, limit);
            result.push.apply(result, children);
            limit -= children.length;
            if (limit <= 0)
                break;
        }
    }
    return result;
}
exports.find = find;
/**
 * Finds the first element inside of an array that matches a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 */
function findOneChild(test, nodes) {
    return nodes.find(test);
}
exports.findOneChild = findOneChild;
/**
 * Finds one element in a tree that passes a test.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first child node that passes `test`.
 */
function findOne(test, nodes, recurse) {
    if (recurse === void 0) { recurse = true; }
    var elem = null;
    for (var i = 0; i < nodes.length && !elem; i++) {
        var checked = nodes[i];
        if (!(0, domhandler_1.isTag)(checked)) {
            continue;
        }
        else if (test(checked)) {
            elem = checked;
        }
        else if (recurse && checked.children.length > 0) {
            elem = findOne(test, checked.children);
        }
    }
    return elem;
}
exports.findOne = findOne;
/**
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing a test.
 */
function existsOne(test, nodes) {
    return nodes.some(function (checked) {
        return (0, domhandler_1.isTag)(checked) &&
            (test(checked) ||
                (checked.children.length > 0 &&
                    existsOne(test, checked.children)));
    });
}
exports.existsOne = existsOne;
/**
 * Search and array of nodes and its children for nodes passing a test function.
 *
 * Same as `find`, only with less options, leading to reduced complexity.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */
function findAll(test, nodes) {
    var _a;
    var result = [];
    var stack = nodes.filter(domhandler_1.isTag);
    var elem;
    while ((elem = stack.shift())) {
        var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler_1.isTag);
        if (children && children.length > 0) {
            stack.unshift.apply(stack, children);
        }
        if (test(elem))
            result.push(elem);
    }
    return result;
}
exports.findAll = findAll;


/***/ }),

/***/ 9561:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.innerText = exports.textContent = exports.getText = exports.getInnerHTML = exports.getOuterHTML = void 0;
var domhandler_1 = __nccwpck_require__(4038);
var dom_serializer_1 = __importDefault(__nccwpck_require__(8621));
var domelementtype_1 = __nccwpck_require__(3944);
/**
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s outer HTML.
 */
function getOuterHTML(node, options) {
    return (0, dom_serializer_1.default)(node, options);
}
exports.getOuterHTML = getOuterHTML;
/**
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s inner HTML.
 */
function getInnerHTML(node, options) {
    return (0, domhandler_1.hasChildren)(node)
        ? node.children.map(function (node) { return getOuterHTML(node, options); }).join("")
        : "";
}
exports.getInnerHTML = getInnerHTML;
/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags.
 *
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */
function getText(node) {
    if (Array.isArray(node))
        return node.map(getText).join("");
    if ((0, domhandler_1.isTag)(node))
        return node.name === "br" ? "\n" : getText(node.children);
    if ((0, domhandler_1.isCDATA)(node))
        return getText(node.children);
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.getText = getText;
/**
 * Get a node's text content.
 *
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */
function textContent(node) {
    if (Array.isArray(node))
        return node.map(textContent).join("");
    if ((0, domhandler_1.hasChildren)(node) && !(0, domhandler_1.isComment)(node)) {
        return textContent(node.children);
    }
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.textContent = textContent;
/**
 * Get a node's inner text.
 *
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */
function innerText(node) {
    if (Array.isArray(node))
        return node.map(innerText).join("");
    if ((0, domhandler_1.hasChildren)(node) && (node.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node))) {
        return innerText(node.children);
    }
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.innerText = innerText;


/***/ }),

/***/ 9228:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prevElementSibling = exports.nextElementSibling = exports.getName = exports.hasAttrib = exports.getAttributeValue = exports.getSiblings = exports.getParent = exports.getChildren = void 0;
var domhandler_1 = __nccwpck_require__(4038);
var emptyArray = [];
/**
 * Get a node's children.
 *
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */
function getChildren(elem) {
    var _a;
    return (_a = elem.children) !== null && _a !== void 0 ? _a : emptyArray;
}
exports.getChildren = getChildren;
/**
 * Get a node's parent.
 *
 * @param elem Node to get the parent of.
 * @returns `elem`'s parent node.
 */
function getParent(elem) {
    return elem.parent || null;
}
exports.getParent = getParent;
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first.
 * If we don't have a parent (the element is a root node),
 * we walk the element's `prev` & `next` to get all remaining nodes.
 *
 * @param elem Element to get the siblings of.
 * @returns `elem`'s siblings.
 */
function getSiblings(elem) {
    var _a, _b;
    var parent = getParent(elem);
    if (parent != null)
        return getChildren(parent);
    var siblings = [elem];
    var prev = elem.prev, next = elem.next;
    while (prev != null) {
        siblings.unshift(prev);
        (_a = prev, prev = _a.prev);
    }
    while (next != null) {
        siblings.push(next);
        (_b = next, next = _b.next);
    }
    return siblings;
}
exports.getSiblings = getSiblings;
/**
 * Gets an attribute from an element.
 *
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */
function getAttributeValue(elem, name) {
    var _a;
    return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
exports.getAttributeValue = getAttributeValue;
/**
 * Checks whether an element has an attribute.
 *
 * @param elem Element to check.
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */
function hasAttrib(elem, name) {
    return (elem.attribs != null &&
        Object.prototype.hasOwnProperty.call(elem.attribs, name) &&
        elem.attribs[name] != null);
}
exports.hasAttrib = hasAttrib;
/**
 * Get the tag name of an element.
 *
 * @param elem The element to get the name for.
 * @returns The tag name of `elem`.
 */
function getName(elem) {
    return elem.name;
}
exports.getName = getName;
/**
 * Returns the next element sibling of a node.
 *
 * @param elem The element to get the next sibling of.
 * @returns `elem`'s next sibling that is a tag.
 */
function nextElementSibling(elem) {
    var _a;
    var next = elem.next;
    while (next !== null && !(0, domhandler_1.isTag)(next))
        (_a = next, next = _a.next);
    return next;
}
exports.nextElementSibling = nextElementSibling;
/**
 * Returns the previous element sibling of a node.
 *
 * @param elem The element to get the previous sibling of.
 * @returns `elem`'s previous sibling that is a tag.
 */
function prevElementSibling(elem) {
    var _a;
    var prev = elem.prev;
    while (prev !== null && !(0, domhandler_1.isTag)(prev))
        (_a = prev, prev = _a.prev);
    return prev;
}
exports.prevElementSibling = prevElementSibling;


/***/ }),

/***/ 5107:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
var entities_json_1 = __importDefault(__nccwpck_require__(9323));
var legacy_json_1 = __importDefault(__nccwpck_require__(9591));
var xml_json_1 = __importDefault(__nccwpck_require__(2586));
var decode_codepoint_1 = __importDefault(__nccwpck_require__(1227));
var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
exports.decodeXML = getStrictDecoder(xml_json_1.default);
exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
function getStrictDecoder(map) {
    var replace = getReplacer(map);
    return function (str) { return String(str).replace(strictEntityRe, replace); };
}
var sorter = function (a, b) { return (a < b ? 1 : -1); };
exports.decodeHTML = (function () {
    var legacy = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1.default).sort(sorter);
    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        }
        else {
            keys[i] += ";";
        }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1.default);
    function replacer(str) {
        if (str.substr(-1) !== ";")
            str += ";";
        return replace(str);
    }
    // TODO consider creating a merged map
    return function (str) { return String(str).replace(re, replacer); };
})();
function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            var secondChar = str.charAt(2);
            if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
            }
            return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return map[str.slice(1, -1)] || str;
    };
}


/***/ }),

/***/ 1227:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decode_json_1 = __importDefault(__nccwpck_require__(3600));
// Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
var fromCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.fromCodePoint ||
    function (codePoint) {
        var output = "";
        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }
        output += String.fromCharCode(codePoint);
        return output;
    };
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
    }
    return fromCodePoint(codePoint);
}
exports["default"] = decodeCodePoint;


/***/ }),

/***/ 2006:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
var xml_json_1 = __importDefault(__nccwpck_require__(2586));
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeXML = getASCIIEncoder(inverseXML);
var entities_json_1 = __importDefault(__nccwpck_require__(9323));
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
/**
 * Encodes all entities and non-ASCII characters in the input.
 *
 * This includes characters that are valid ASCII characters in HTML documents.
 * For example `#` will be encoded as `&num;`. To get a more compact output,
 * consider using the `encodeNonAsciiHTML` function.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
    }, {});
}
function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
            // Add value to single array
            single.push("\\" + k);
        }
        else {
            // Add value to multiple array
            multiple.push(k);
        }
    }
    // Add ranges to single characters.
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
        // Find the end of a run of characters
        var end = start;
        while (end < single.length - 1 &&
            single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
            end += 1;
        }
        var count = 1 + end - start;
        // We want to replace at least three characters
        if (count < 3)
            continue;
        single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
}
// /[^\0-\x7F]/gu
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
var getCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function (str) { return str.codePointAt(0); }
    : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function (c) {
            return (c.charCodeAt(0) - 0xd800) * 0x400 +
                c.charCodeAt(1) -
                0xdc00 +
                0x10000;
        };
function singleCharReplacer(c) {
    return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
        .toString(16)
        .toUpperCase() + ";";
}
function getInverse(inverse, re) {
    return function (data) {
        return data
            .replace(re, function (name) { return inverse[name]; })
            .replace(reNonASCII, singleCharReplacer);
    };
}
var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */
function escape(data) {
    return data.replace(reEscapeChars, singleCharReplacer);
}
exports.escape = escape;
/**
 * Encodes all characters not valid in XML documents using numeric hexadecimal
 * reference (eg. `&#xfc;`).
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */
function escapeUTF8(data) {
    return data.replace(xmlReplacer, singleCharReplacer);
}
exports.escapeUTF8 = escapeUTF8;
function getASCIIEncoder(obj) {
    return function (data) {
        return data.replace(reEscapeChars, function (c) { return obj[c] || singleCharReplacer(c); });
    };
}


/***/ }),

/***/ 3000:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
var decode_1 = __nccwpck_require__(5107);
var encode_1 = __nccwpck_require__(2006);
/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeXML` or `decodeHTML` directly.
 */
function decode(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
}
exports.decode = decode;
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
 */
function decodeStrict(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
}
exports.decodeStrict = decodeStrict;
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
 */
function encode(data, level) {
    return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
}
exports.encode = encode;
var encode_2 = __nccwpck_require__(2006);
Object.defineProperty(exports, "encodeXML", ({ enumerable: true, get: function () { return encode_2.encodeXML; } }));
Object.defineProperty(exports, "encodeHTML", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
Object.defineProperty(exports, "encodeNonAsciiHTML", ({ enumerable: true, get: function () { return encode_2.encodeNonAsciiHTML; } }));
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return encode_2.escape; } }));
Object.defineProperty(exports, "escapeUTF8", ({ enumerable: true, get: function () { return encode_2.escapeUTF8; } }));
// Legacy aliases (deprecated)
Object.defineProperty(exports, "encodeHTML4", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
Object.defineProperty(exports, "encodeHTML5", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
var decode_2 = __nccwpck_require__(5107);
Object.defineProperty(exports, "decodeXML", ({ enumerable: true, get: function () { return decode_2.decodeXML; } }));
Object.defineProperty(exports, "decodeHTML", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTMLStrict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
// Legacy aliases (deprecated)
Object.defineProperty(exports, "decodeHTML4", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTML5", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTML4Strict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
Object.defineProperty(exports, "decodeHTML5Strict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
Object.defineProperty(exports, "decodeXMLStrict", ({ enumerable: true, get: function () { return decode_2.decodeXML; } }));


/***/ }),

/***/ 7725:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseFeed = exports.FeedHandler = exports.getFeed = void 0;
var domhandler_1 = __importDefault(__nccwpck_require__(4038));
var domutils_1 = __nccwpck_require__(1754);
Object.defineProperty(exports, "getFeed", ({ enumerable: true, get: function () { return domutils_1.getFeed; } }));
var Parser_1 = __nccwpck_require__(8460);
/** @deprecated Handler is no longer necessary; use `getFeed` or `parseFeed` instead. */
var FeedHandler = /** @class */ (function (_super) {
    __extends(FeedHandler, _super);
    /**
     *
     * @param callback
     * @param options
     */
    function FeedHandler(callback, options) {
        var _this = this;
        if (typeof callback === "object") {
            callback = undefined;
            options = callback;
        }
        _this = _super.call(this, callback, options) || this;
        return _this;
    }
    FeedHandler.prototype.onend = function () {
        var feed = (0, domutils_1.getFeed)(this.dom);
        if (feed) {
            this.feed = feed;
            this.handleCallback(null);
        }
        else {
            this.handleCallback(new Error("couldn't find root of feed"));
        }
    };
    return FeedHandler;
}(domhandler_1.default));
exports.FeedHandler = FeedHandler;
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */
function parseFeed(feed, options) {
    if (options === void 0) { options = { xmlMode: true }; }
    var handler = new domhandler_1.default(null, options);
    new Parser_1.Parser(handler, options).end(feed);
    return (0, domutils_1.getFeed)(handler.dom);
}
exports.parseFeed = parseFeed;


/***/ }),

/***/ 8460:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
var Tokenizer_1 = __importDefault(__nccwpck_require__(2689));
var formTags = new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea",
]);
var pTag = new Set(["p"]);
var tableSectionTags = new Set(["thead", "tbody"]);
var ddtTags = new Set(["dd", "dt"]);
var rtpTags = new Set(["rt", "rp"]);
var openImpliesClose = new Map([
    ["tr", new Set(["tr", "th", "td"])],
    ["th", new Set(["th"])],
    ["td", new Set(["thead", "th", "td"])],
    ["body", new Set(["head", "link", "script"])],
    ["li", new Set(["li"])],
    ["p", pTag],
    ["h1", pTag],
    ["h2", pTag],
    ["h3", pTag],
    ["h4", pTag],
    ["h5", pTag],
    ["h6", pTag],
    ["select", formTags],
    ["input", formTags],
    ["output", formTags],
    ["button", formTags],
    ["datalist", formTags],
    ["textarea", formTags],
    ["option", new Set(["option"])],
    ["optgroup", new Set(["optgroup", "option"])],
    ["dd", ddtTags],
    ["dt", ddtTags],
    ["address", pTag],
    ["article", pTag],
    ["aside", pTag],
    ["blockquote", pTag],
    ["details", pTag],
    ["div", pTag],
    ["dl", pTag],
    ["fieldset", pTag],
    ["figcaption", pTag],
    ["figure", pTag],
    ["footer", pTag],
    ["form", pTag],
    ["header", pTag],
    ["hr", pTag],
    ["main", pTag],
    ["nav", pTag],
    ["ol", pTag],
    ["pre", pTag],
    ["section", pTag],
    ["table", pTag],
    ["ul", pTag],
    ["rt", rtpTags],
    ["rp", rtpTags],
    ["tbody", tableSectionTags],
    ["tfoot", tableSectionTags],
]);
var voidElements = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);
var foreignContextElements = new Set(["math", "svg"]);
var htmlIntegrationElements = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignobject",
    "desc",
    "title",
]);
var reNameEnd = /\s|\//;
var Parser = /** @class */ (function () {
    function Parser(cbs, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e;
        this.options = options;
        /** The start index of the last event. */
        this.startIndex = 0;
        /** The end index of the last event. */
        this.endIndex = 0;
        /**
         * Store the start index of the current open tag,
         * so we can update the start index for attributes.
         */
        this.openTagStart = 0;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
        this.lowerCaseAttributeNames =
            (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_1.default)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
    }
    // Tokenizer event handlers
    /** @internal */
    Parser.prototype.ontext = function (data) {
        var _a, _b;
        var idx = this.tokenizer.getAbsoluteIndex();
        this.endIndex = idx - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
        this.startIndex = idx;
    };
    Parser.prototype.isVoidElement = function (name) {
        return !this.options.xmlMode && voidElements.has(name);
    };
    /** @internal */
    Parser.prototype.onopentagname = function (name) {
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        this.emitOpenTag(name);
    };
    Parser.prototype.emitOpenTag = function (name) {
        var _a, _b, _c, _d;
        this.openTagStart = this.startIndex;
        this.tagname = name;
        var impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
        if (impliesClose) {
            while (this.stack.length > 0 &&
                impliesClose.has(this.stack[this.stack.length - 1])) {
                var el = this.stack.pop();
                (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, el, true);
            }
        }
        if (!this.isVoidElement(name)) {
            this.stack.push(name);
            if (foreignContextElements.has(name)) {
                this.foreignContext.push(true);
            }
            else if (htmlIntegrationElements.has(name)) {
                this.foreignContext.push(false);
            }
        }
        (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
        if (this.cbs.onopentag)
            this.attribs = {};
    };
    Parser.prototype.endOpenTag = function (isImplied) {
        var _a, _b;
        this.startIndex = this.openTagStart;
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        if (this.attribs) {
            (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs, isImplied);
            this.attribs = null;
        }
        if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
            this.cbs.onclosetag(this.tagname, true);
        }
        this.tagname = "";
    };
    /** @internal */
    Parser.prototype.onopentagend = function () {
        this.endOpenTag(false);
        // Set `startIndex` for next node
        this.startIndex = this.endIndex + 1;
    };
    /** @internal */
    Parser.prototype.onclosetag = function (name) {
        var _a, _b, _c, _d, _e, _f;
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) ||
            htmlIntegrationElements.has(name)) {
            this.foreignContext.pop();
        }
        if (!this.isVoidElement(name)) {
            var pos = this.stack.lastIndexOf(name);
            if (pos !== -1) {
                if (this.cbs.onclosetag) {
                    var count = this.stack.length - pos;
                    while (count--) {
                        // We know the stack has sufficient elements.
                        this.cbs.onclosetag(this.stack.pop(), count !== 0);
                    }
                }
                else
                    this.stack.length = pos;
            }
            else if (!this.options.xmlMode && name === "p") {
                this.emitOpenTag(name);
                this.closeCurrentTag(true);
            }
        }
        else if (!this.options.xmlMode && name === "br") {
            // We can't go through `emitOpenTag` here, as `br` would be implicitly closed.
            (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, name);
            (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, name, {}, true);
            (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, name, false);
        }
        // Set `startIndex` for next node
        this.startIndex = this.endIndex + 1;
    };
    /** @internal */
    Parser.prototype.onselfclosingtag = function () {
        if (this.options.xmlMode ||
            this.options.recognizeSelfClosing ||
            this.foreignContext[this.foreignContext.length - 1]) {
            this.closeCurrentTag(false);
            // Set `startIndex` for next node
            this.startIndex = this.endIndex + 1;
        }
        else {
            // Ignore the fact that the tag is self-closing.
            this.onopentagend();
        }
    };
    Parser.prototype.closeCurrentTag = function (isOpenImplied) {
        var _a, _b;
        var name = this.tagname;
        this.endOpenTag(isOpenImplied);
        // Self-closing tags will be on the top of the stack
        if (this.stack[this.stack.length - 1] === name) {
            // If the opening tag isn't implied, the closing tag has to be implied.
            (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, !isOpenImplied);
            this.stack.pop();
        }
    };
    /** @internal */
    Parser.prototype.onattribname = function (name) {
        this.startIndex = this.tokenizer.getAbsoluteSectionStart();
        if (this.lowerCaseAttributeNames) {
            name = name.toLowerCase();
        }
        this.attribname = name;
    };
    /** @internal */
    Parser.prototype.onattribdata = function (value) {
        this.attribvalue += value;
    };
    /** @internal */
    Parser.prototype.onattribend = function (quote) {
        var _a, _b;
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote);
        if (this.attribs &&
            !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
            this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribname = "";
        this.attribvalue = "";
    };
    Parser.prototype.getInstructionName = function (value) {
        var idx = value.search(reNameEnd);
        var name = idx < 0 ? value : value.substr(0, idx);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        return name;
    };
    /** @internal */
    Parser.prototype.ondeclaration = function (value) {
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        if (this.cbs.onprocessinginstruction) {
            var name_1 = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("!" + name_1, "!" + value);
        }
        // Set `startIndex` for next node
        this.startIndex = this.endIndex + 1;
    };
    /** @internal */
    Parser.prototype.onprocessinginstruction = function (value) {
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        if (this.cbs.onprocessinginstruction) {
            var name_2 = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("?" + name_2, "?" + value);
        }
        // Set `startIndex` for next node
        this.startIndex = this.endIndex + 1;
    };
    /** @internal */
    Parser.prototype.oncomment = function (value) {
        var _a, _b, _c, _d;
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
        // Set `startIndex` for next node
        this.startIndex = this.endIndex + 1;
    };
    /** @internal */
    Parser.prototype.oncdata = function (value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.endIndex = this.tokenizer.getAbsoluteIndex();
        if (this.options.xmlMode || this.options.recognizeCDATA) {
            (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
            (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        }
        else {
            (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, "[CDATA[" + value + "]]");
            (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
        }
        // Set `startIndex` for next node
        this.startIndex = this.endIndex + 1;
    };
    /** @internal */
    Parser.prototype.onerror = function (err) {
        var _a, _b;
        (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    /** @internal */
    Parser.prototype.onend = function () {
        var _a, _b;
        if (this.cbs.onclosetag) {
            // Set the end index for all remaining tags
            this.endIndex = this.startIndex;
            for (var i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i], true))
                ;
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    /**
     * Resets the parser to a blank state, ready to parse a new HTML document
     */
    Parser.prototype.reset = function () {
        var _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack = [];
        this.startIndex = 0;
        this.endIndex = 0;
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    };
    /**
     * Resets the parser, then parses a complete document and
     * pushes it to the handler.
     *
     * @param data Document to parse.
     */
    Parser.prototype.parseComplete = function (data) {
        this.reset();
        this.end(data);
    };
    /**
     * Parses a chunk of data and calls the corresponding callbacks.
     *
     * @param chunk Chunk to parse.
     */
    Parser.prototype.write = function (chunk) {
        this.tokenizer.write(chunk);
    };
    /**
     * Parses the end of the buffer and clears the stack, calls onend.
     *
     * @param chunk Optional final chunk to parse.
     */
    Parser.prototype.end = function (chunk) {
        this.tokenizer.end(chunk);
    };
    /**
     * Pauses parsing. The parser won't emit events until `resume` is called.
     */
    Parser.prototype.pause = function () {
        this.tokenizer.pause();
    };
    /**
     * Resumes parsing after `pause` was called.
     */
    Parser.prototype.resume = function () {
        this.tokenizer.resume();
    };
    /**
     * Alias of `write`, for backwards compatibility.
     *
     * @param chunk Chunk to parse.
     * @deprecated
     */
    Parser.prototype.parseChunk = function (chunk) {
        this.write(chunk);
    };
    /**
     * Alias of `end`, for backwards compatibility.
     *
     * @param chunk Optional final chunk to parse.
     * @deprecated
     */
    Parser.prototype.done = function (chunk) {
        this.end(chunk);
    };
    return Parser;
}());
exports.Parser = Parser;


/***/ }),

/***/ 2689:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decode_codepoint_1 = __importDefault(__nccwpck_require__(4520));
var decode_1 = __nccwpck_require__(3738);
function isWhitespace(c) {
    return (c === 32 /* Space */ ||
        c === 10 /* NewLine */ ||
        c === 9 /* Tab */ ||
        c === 12 /* FormFeed */ ||
        c === 13 /* CarriageReturn */);
}
function isEndOfTagSection(c) {
    return c === 47 /* Slash */ || c === 62 /* Gt */ || isWhitespace(c);
}
function isNumber(c) {
    return c >= 48 /* Zero */ && c <= 57 /* Nine */;
}
function isASCIIAlpha(c) {
    return ((c >= 97 /* LowerA */ && c <= 122 /* LowerZ */) ||
        (c >= 65 /* UpperA */ && c <= 90 /* UpperZ */));
}
/**
 * Sequences used to match longer strings.
 *
 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
 * sequences with an increased offset.
 */
var Sequences = {
    Cdata: new Uint16Array([0x43, 0x44, 0x41, 0x54, 0x41, 0x5b]),
    CdataEnd: new Uint16Array([0x5d, 0x5d, 0x3e]),
    CommentEnd: new Uint16Array([0x2d, 0x2d, 0x3e]),
    ScriptEnd: new Uint16Array([
        0x3c, 0x2f, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74,
    ]),
    StyleEnd: new Uint16Array([0x3c, 0x2f, 0x73, 0x74, 0x79, 0x6c, 0x65]),
    TitleEnd: new Uint16Array([0x3c, 0x2f, 0x74, 0x69, 0x74, 0x6c, 0x65]), // `</title`
};
var Tokenizer = /** @class */ (function () {
    function Tokenizer(_a, cbs) {
        var _b = _a.xmlMode, xmlMode = _b === void 0 ? false : _b, _c = _a.decodeEntities, decodeEntities = _c === void 0 ? true : _c;
        this.cbs = cbs;
        /** The current state the tokenizer is in. */
        this._state = 1 /* Text */;
        /** The read buffer. */
        this.buffer = "";
        /** The beginning of the section that is currently being read. */
        this.sectionStart = 0;
        /** The index within the buffer that we are currently looking at. */
        this._index = 0;
        /**
         * Data that has already been processed will be removed from the buffer occasionally.
         * `_bufferOffset` keeps track of how many characters have been removed, to make sure position information is accurate.
         */
        this.bufferOffset = 0;
        /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
        this.baseState = 1 /* Text */;
        /** For special parsing behavior inside of script and style tags. */
        this.isSpecial = false;
        /** Indicates whether the tokenizer has been paused. */
        this.running = true;
        /** Indicates whether the tokenizer has finished running / `.end` has been called. */
        this.ended = false;
        this.sequenceIndex = 0;
        this.trieIndex = 0;
        this.trieCurrent = 0;
        this.trieResult = null;
        this.entityExcess = 0;
        this.xmlMode = xmlMode;
        this.decodeEntities = decodeEntities;
        this.entityTrie = xmlMode ? decode_1.xmlDecodeTree : decode_1.htmlDecodeTree;
    }
    Tokenizer.prototype.reset = function () {
        this._state = 1 /* Text */;
        this.buffer = "";
        this.sectionStart = 0;
        this._index = 0;
        this.bufferOffset = 0;
        this.baseState = 1 /* Text */;
        this.currentSequence = undefined;
        this.running = true;
        this.ended = false;
    };
    Tokenizer.prototype.write = function (chunk) {
        if (this.ended)
            return this.cbs.onerror(Error(".write() after done!"));
        this.buffer += chunk;
        this.parse();
    };
    Tokenizer.prototype.end = function (chunk) {
        if (this.ended)
            return this.cbs.onerror(Error(".end() after done!"));
        if (chunk)
            this.write(chunk);
        this.ended = true;
        if (this.running)
            this.finish();
    };
    Tokenizer.prototype.pause = function () {
        this.running = false;
    };
    Tokenizer.prototype.resume = function () {
        this.running = true;
        if (this._index < this.buffer.length) {
            this.parse();
        }
        if (this.ended) {
            this.finish();
        }
    };
    /**
     * The start of the current section.
     */
    Tokenizer.prototype.getAbsoluteSectionStart = function () {
        return this.sectionStart + this.bufferOffset;
    };
    /**
     * The current index within all of the written data.
     */
    Tokenizer.prototype.getAbsoluteIndex = function () {
        return this.bufferOffset + this._index;
    };
    Tokenizer.prototype.stateText = function (c) {
        if (c === 60 /* Lt */ ||
            (!this.decodeEntities && this.fastForwardTo(60 /* Lt */))) {
            if (this._index > this.sectionStart) {
                this.cbs.ontext(this.getSection());
            }
            this._state = 2 /* BeforeTagName */;
            this.sectionStart = this._index;
        }
        else if (this.decodeEntities && c === 38 /* Amp */) {
            this._state = 25 /* BeforeEntity */;
        }
    };
    Tokenizer.prototype.stateSpecialStartSequence = function (c) {
        var isEnd = this.sequenceIndex === this.currentSequence.length;
        var isMatch = isEnd
            ? // If we are at the end of the sequence, make sure the tag name has ended
                isEndOfTagSection(c)
            : // Otherwise, do a case-insensitive comparison
                (c | 0x20) === this.currentSequence[this.sequenceIndex];
        if (!isMatch) {
            this.isSpecial = false;
        }
        else if (!isEnd) {
            this.sequenceIndex++;
            return;
        }
        this.sequenceIndex = 0;
        this._state = 3 /* InTagName */;
        this.stateInTagName(c);
    };
    /** Look for an end tag. For <title> tags, also decode entities. */
    Tokenizer.prototype.stateInSpecialTag = function (c) {
        if (this.sequenceIndex === this.currentSequence.length) {
            if (c === 62 /* Gt */ || isWhitespace(c)) {
                var endOfText = this._index - this.currentSequence.length;
                if (this.sectionStart < endOfText) {
                    // Spoof the index so that reported locations match up.
                    var actualIndex = this._index;
                    this._index = endOfText;
                    this.cbs.ontext(this.getSection());
                    this._index = actualIndex;
                }
                this.isSpecial = false;
                this.sectionStart = endOfText + 2; // Skip over the `</`
                this.stateInClosingTagName(c);
                return; // We are done; skip the rest of the function.
            }
            this.sequenceIndex = 0;
        }
        if ((c | 0x20) === this.currentSequence[this.sequenceIndex]) {
            this.sequenceIndex += 1;
        }
        else if (this.sequenceIndex === 0) {
            if (this.currentSequence === Sequences.TitleEnd) {
                // We have to parse entities in <title> tags.
                if (this.decodeEntities && c === 38 /* Amp */) {
                    this._state = 25 /* BeforeEntity */;
                }
            }
            else if (this.fastForwardTo(60 /* Lt */)) {
                // Outside of <title> tags, we can fast-forward.
                this.sequenceIndex = 1;
            }
        }
        else {
            // If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
            this.sequenceIndex = Number(c === 60 /* Lt */);
        }
    };
    Tokenizer.prototype.stateCDATASequence = function (c) {
        if (c === Sequences.Cdata[this.sequenceIndex]) {
            if (++this.sequenceIndex === Sequences.Cdata.length) {
                this._state = 21 /* InCommentLike */;
                this.currentSequence = Sequences.CdataEnd;
                this.sequenceIndex = 0;
                this.sectionStart = this._index + 1;
            }
        }
        else {
            this.sequenceIndex = 0;
            this._state = 16 /* InDeclaration */;
            this.stateInDeclaration(c); // Reconsume the character
        }
    };
    /**
     * When we wait for one specific character, we can speed things up
     * by skipping through the buffer until we find it.
     *
     * @returns Whether the character was found.
     */
    Tokenizer.prototype.fastForwardTo = function (c) {
        while (++this._index < this.buffer.length) {
            if (this.buffer.charCodeAt(this._index) === c) {
                return true;
            }
        }
        /*
         * We increment the index at the end of the `parse` loop,
         * so set it to `buffer.length - 1` here.
         *
         * TODO: Refactor `parse` to increment index before calling states.
         */
        this._index = this.buffer.length - 1;
        return false;
    };
    /**
     * Comments and CDATA end with `-->` and `]]>`.
     *
     * Their common qualities are:
     * - Their end sequences have a distinct character they start with.
     * - That character is then repeated, so we have to check multiple repeats.
     * - All characters but the start character of the sequence can be skipped.
     */
    Tokenizer.prototype.stateInCommentLike = function (c) {
        if (c === this.currentSequence[this.sequenceIndex]) {
            if (++this.sequenceIndex === this.currentSequence.length) {
                // Remove 2 trailing chars
                var section = this.buffer.slice(this.sectionStart, this._index - 2);
                if (this.currentSequence === Sequences.CdataEnd) {
                    this.cbs.oncdata(section);
                }
                else {
                    this.cbs.oncomment(section);
                }
                this.sequenceIndex = 0;
                this.sectionStart = this._index + 1;
                this._state = 1 /* Text */;
            }
        }
        else if (this.sequenceIndex === 0) {
            // Fast-forward to the first character of the sequence
            if (this.fastForwardTo(this.currentSequence[0])) {
                this.sequenceIndex = 1;
            }
        }
        else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
            // Allow long sequences, eg. --->, ]]]>
            this.sequenceIndex = 0;
        }
    };
    /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */
    Tokenizer.prototype.isTagStartChar = function (c) {
        return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
    };
    Tokenizer.prototype.startSpecial = function (sequence, offset) {
        this.isSpecial = true;
        this.currentSequence = sequence;
        this.sequenceIndex = offset;
        this._state = 23 /* SpecialStartSequence */;
    };
    Tokenizer.prototype.stateBeforeTagName = function (c) {
        if (c === 33 /* ExclamationMark */) {
            this._state = 15 /* BeforeDeclaration */;
            this.sectionStart = this._index + 1;
        }
        else if (c === 63 /* Questionmark */) {
            this._state = 17 /* InProcessingInstruction */;
            this.sectionStart = this._index + 1;
        }
        else if (this.isTagStartChar(c)) {
            var lower = c | 0x20;
            this.sectionStart = this._index;
            if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
                this.startSpecial(Sequences.TitleEnd, 3);
            }
            else {
                this._state =
                    !this.xmlMode && lower === Sequences.ScriptEnd[2]
                        ? 22 /* BeforeSpecialS */
                        : 3 /* InTagName */;
            }
        }
        else if (c === 47 /* Slash */) {
            this._state = 5 /* BeforeClosingTagName */;
        }
        else {
            this._state = 1 /* Text */;
            this.stateText(c);
        }
    };
    Tokenizer.prototype.stateInTagName = function (c) {
        if (isEndOfTagSection(c)) {
            this.cbs.onopentagname(this.getSection());
            this.sectionStart = -1;
            this._state = 8 /* BeforeAttributeName */;
            this.stateBeforeAttributeName(c);
        }
    };
    Tokenizer.prototype.stateBeforeClosingTagName = function (c) {
        if (isWhitespace(c)) {
            // Ignore
        }
        else if (c === 62 /* Gt */) {
            this._state = 1 /* Text */;
        }
        else {
            this._state = this.isTagStartChar(c)
                ? 6 /* InClosingTagName */
                : 20 /* InSpecialComment */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInClosingTagName = function (c) {
        if (c === 62 /* Gt */ || isWhitespace(c)) {
            this.cbs.onclosetag(this.getSection());
            this.sectionStart = -1;
            this._state = 7 /* AfterClosingTagName */;
            this.stateAfterClosingTagName(c);
        }
    };
    Tokenizer.prototype.stateAfterClosingTagName = function (c) {
        // Skip everything until ">"
        if (c === 62 /* Gt */ || this.fastForwardTo(62 /* Gt */)) {
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeName = function (c) {
        if (c === 62 /* Gt */) {
            this.cbs.onopentagend();
            if (this.isSpecial) {
                this._state = 24 /* InSpecialTag */;
                this.sequenceIndex = 0;
            }
            else {
                this._state = 1 /* Text */;
            }
            this.baseState = this._state;
            this.sectionStart = this._index + 1;
        }
        else if (c === 47 /* Slash */) {
            this._state = 4 /* InSelfClosingTag */;
        }
        else if (!isWhitespace(c)) {
            this._state = 9 /* InAttributeName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInSelfClosingTag = function (c) {
        if (c === 62 /* Gt */) {
            this.cbs.onselfclosingtag();
            this._state = 1 /* Text */;
            this.baseState = 1 /* Text */;
            this.sectionStart = this._index + 1;
            this.isSpecial = false; // Reset special state, in case of self-closing special tags
        }
        else if (!isWhitespace(c)) {
            this._state = 8 /* BeforeAttributeName */;
            this.stateBeforeAttributeName(c);
        }
    };
    Tokenizer.prototype.stateInAttributeName = function (c) {
        if (c === 61 /* Eq */ || isEndOfTagSection(c)) {
            this.cbs.onattribname(this.getSection());
            this.sectionStart = -1;
            this._state = 10 /* AfterAttributeName */;
            this.stateAfterAttributeName(c);
        }
    };
    Tokenizer.prototype.stateAfterAttributeName = function (c) {
        if (c === 61 /* Eq */) {
            this._state = 11 /* BeforeAttributeValue */;
        }
        else if (c === 47 /* Slash */ || c === 62 /* Gt */) {
            this.cbs.onattribend(undefined);
            this._state = 8 /* BeforeAttributeName */;
            this.stateBeforeAttributeName(c);
        }
        else if (!isWhitespace(c)) {
            this.cbs.onattribend(undefined);
            this._state = 9 /* InAttributeName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeValue = function (c) {
        if (c === 34 /* DoubleQuote */) {
            this._state = 12 /* InAttributeValueDq */;
            this.sectionStart = this._index + 1;
        }
        else if (c === 39 /* SingleQuote */) {
            this._state = 13 /* InAttributeValueSq */;
            this.sectionStart = this._index + 1;
        }
        else if (!isWhitespace(c)) {
            this.sectionStart = this._index;
            this._state = 14 /* InAttributeValueNq */;
            this.stateInAttributeValueNoQuotes(c); // Reconsume token
        }
    };
    Tokenizer.prototype.handleInAttributeValue = function (c, quote) {
        if (c === quote ||
            (!this.decodeEntities && this.fastForwardTo(quote))) {
            this.cbs.onattribdata(this.getSection());
            this.sectionStart = -1;
            this.cbs.onattribend(String.fromCharCode(quote));
            this._state = 8 /* BeforeAttributeName */;
        }
        else if (this.decodeEntities && c === 38 /* Amp */) {
            this.baseState = this._state;
            this._state = 25 /* BeforeEntity */;
        }
    };
    Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function (c) {
        this.handleInAttributeValue(c, 34 /* DoubleQuote */);
    };
    Tokenizer.prototype.stateInAttributeValueSingleQuotes = function (c) {
        this.handleInAttributeValue(c, 39 /* SingleQuote */);
    };
    Tokenizer.prototype.stateInAttributeValueNoQuotes = function (c) {
        if (isWhitespace(c) || c === 62 /* Gt */) {
            this.cbs.onattribdata(this.getSection());
            this.sectionStart = -1;
            this.cbs.onattribend(null);
            this._state = 8 /* BeforeAttributeName */;
            this.stateBeforeAttributeName(c);
        }
        else if (this.decodeEntities && c === 38 /* Amp */) {
            this.baseState = this._state;
            this._state = 25 /* BeforeEntity */;
        }
    };
    Tokenizer.prototype.stateBeforeDeclaration = function (c) {
        if (c === 91 /* OpeningSquareBracket */) {
            this._state = 19 /* CDATASequence */;
            this.sequenceIndex = 0;
        }
        else {
            this._state =
                c === 45 /* Dash */
                    ? 18 /* BeforeComment */
                    : 16 /* InDeclaration */;
        }
    };
    Tokenizer.prototype.stateInDeclaration = function (c) {
        if (c === 62 /* Gt */ || this.fastForwardTo(62 /* Gt */)) {
            this.cbs.ondeclaration(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateInProcessingInstruction = function (c) {
        if (c === 62 /* Gt */ || this.fastForwardTo(62 /* Gt */)) {
            this.cbs.onprocessinginstruction(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeComment = function (c) {
        if (c === 45 /* Dash */) {
            this._state = 21 /* InCommentLike */;
            this.currentSequence = Sequences.CommentEnd;
            // Allow short comments (eg. <!-->)
            this.sequenceIndex = 2;
            this.sectionStart = this._index + 1;
        }
        else {
            this._state = 16 /* InDeclaration */;
        }
    };
    Tokenizer.prototype.stateInSpecialComment = function (c) {
        if (c === 62 /* Gt */ || this.fastForwardTo(62 /* Gt */)) {
            this.cbs.oncomment(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeSpecialS = function (c) {
        var lower = c | 0x20;
        if (lower === Sequences.ScriptEnd[3]) {
            this.startSpecial(Sequences.ScriptEnd, 4);
        }
        else if (lower === Sequences.StyleEnd[3]) {
            this.startSpecial(Sequences.StyleEnd, 4);
        }
        else {
            this._state = 3 /* InTagName */;
            this.stateInTagName(c); // Consume the token again
        }
    };
    Tokenizer.prototype.stateBeforeEntity = function (c) {
        // Start excess with 1 to include the '&'
        this.entityExcess = 1;
        if (c === 35 /* Num */) {
            this._state = 26 /* BeforeNumericEntity */;
        }
        else if (c === 38 /* Amp */) {
            // We have two `&` characters in a row. Stay in the current state.
        }
        else {
            this.trieIndex = 0;
            this.trieCurrent = this.entityTrie[0];
            this.trieResult = null;
            this._state = 27 /* InNamedEntity */;
            this.stateInNamedEntity(c);
        }
    };
    Tokenizer.prototype.stateInNamedEntity = function (c) {
        this.entityExcess += 1;
        this.trieIndex = (0, decode_1.determineBranch)(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
        if (this.trieIndex < 0) {
            this.emitNamedEntity();
            this._index--;
            return;
        }
        this.trieCurrent = this.entityTrie[this.trieIndex];
        // If the branch is a value, store it and continue
        if (this.trieCurrent & decode_1.BinTrieFlags.HAS_VALUE) {
            // If we have a legacy entity while parsing strictly, just skip the number of bytes
            if (!this.allowLegacyEntity() && c !== 59 /* Semi */) {
                // No need to consider multi-byte values, as the legacy entity is always a single byte
                this.trieIndex += 1;
            }
            else {
                // Add 1 as we have already incremented the excess
                var entityStart = this._index - this.entityExcess + 1;
                if (entityStart > this.sectionStart) {
                    this.emitPartial(this.buffer.substring(this.sectionStart, entityStart));
                }
                // If this is a surrogate pair, combine the higher bits from the node with the next byte
                this.trieResult =
                    this.trieCurrent & decode_1.BinTrieFlags.MULTI_BYTE
                        ? String.fromCharCode(this.entityTrie[++this.trieIndex], this.entityTrie[++this.trieIndex])
                        : String.fromCharCode(this.entityTrie[++this.trieIndex]);
                this.entityExcess = 0;
                this.sectionStart = this._index + 1;
            }
        }
    };
    Tokenizer.prototype.emitNamedEntity = function () {
        if (this.trieResult) {
            this.emitPartial(this.trieResult);
        }
        this._state = this.baseState;
    };
    Tokenizer.prototype.stateBeforeNumericEntity = function (c) {
        if ((c | 0x20) === 120 /* LowerX */) {
            this.entityExcess++;
            this._state = 29 /* InHexEntity */;
        }
        else {
            this._state = 28 /* InNumericEntity */;
            this.stateInNumericEntity(c);
        }
    };
    Tokenizer.prototype.decodeNumericEntity = function (base, strict) {
        var entityStart = this._index - this.entityExcess - 1;
        var numberStart = entityStart + 2 + (base >> 4);
        if (numberStart !== this._index) {
            // Emit leading data if any
            if (entityStart > this.sectionStart) {
                this.emitPartial(this.buffer.substring(this.sectionStart, entityStart));
            }
            // Parse entity
            var entity = this.buffer.substring(numberStart, this._index);
            var parsed = parseInt(entity, base);
            this.emitPartial((0, decode_codepoint_1.default)(parsed));
            this.sectionStart = this._index + Number(strict);
        }
        this._state = this.baseState;
    };
    Tokenizer.prototype.stateInNumericEntity = function (c) {
        if (c === 59 /* Semi */) {
            this.decodeNumericEntity(10, true);
        }
        else if (!isNumber(c)) {
            if (this.allowLegacyEntity()) {
                this.decodeNumericEntity(10, false);
            }
            else {
                this._state = this.baseState;
            }
            this._index--;
        }
        else {
            this.entityExcess++;
        }
    };
    Tokenizer.prototype.stateInHexEntity = function (c) {
        if (c === 59 /* Semi */) {
            this.decodeNumericEntity(16, true);
        }
        else if ((c < 97 /* LowerA */ || c > 102 /* LowerF */) &&
            (c < 65 /* UpperA */ || c > 70 /* UpperF */) &&
            !isNumber(c)) {
            if (this.allowLegacyEntity()) {
                this.decodeNumericEntity(16, false);
            }
            else {
                this._state = this.baseState;
            }
            this._index--;
        }
        else {
            this.entityExcess++;
        }
    };
    Tokenizer.prototype.allowLegacyEntity = function () {
        return (!this.xmlMode &&
            (this.baseState === 1 /* Text */ ||
                this.baseState === 24 /* InSpecialTag */));
    };
    /**
     * Remove data that has already been consumed from the buffer.
     */
    Tokenizer.prototype.cleanup = function () {
        // If we are inside of text, emit what we already have.
        if (this.running &&
            this.sectionStart !== this._index &&
            (this._state === 1 /* Text */ ||
                (this._state === 24 /* InSpecialTag */ &&
                    this.sequenceIndex === 0))) {
            // TODO: We could emit attribute data here as well.
            this.cbs.ontext(this.buffer.substr(this.sectionStart));
            this.sectionStart = this._index;
        }
        var start = this.sectionStart < 0 ? this._index : this.sectionStart;
        this.buffer =
            start === this.buffer.length ? "" : this.buffer.substr(start);
        this._index -= start;
        this.bufferOffset += start;
        if (this.sectionStart > 0) {
            this.sectionStart = 0;
        }
    };
    Tokenizer.prototype.shouldContinue = function () {
        return this._index < this.buffer.length && this.running;
    };
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */
    Tokenizer.prototype.parse = function () {
        while (this.shouldContinue()) {
            var c = this.buffer.charCodeAt(this._index);
            if (this._state === 1 /* Text */) {
                this.stateText(c);
            }
            else if (this._state === 23 /* SpecialStartSequence */) {
                this.stateSpecialStartSequence(c);
            }
            else if (this._state === 24 /* InSpecialTag */) {
                this.stateInSpecialTag(c);
            }
            else if (this._state === 19 /* CDATASequence */) {
                this.stateCDATASequence(c);
            }
            else if (this._state === 12 /* InAttributeValueDq */) {
                this.stateInAttributeValueDoubleQuotes(c);
            }
            else if (this._state === 9 /* InAttributeName */) {
                this.stateInAttributeName(c);
            }
            else if (this._state === 21 /* InCommentLike */) {
                this.stateInCommentLike(c);
            }
            else if (this._state === 20 /* InSpecialComment */) {
                this.stateInSpecialComment(c);
            }
            else if (this._state === 8 /* BeforeAttributeName */) {
                this.stateBeforeAttributeName(c);
            }
            else if (this._state === 3 /* InTagName */) {
                this.stateInTagName(c);
            }
            else if (this._state === 6 /* InClosingTagName */) {
                this.stateInClosingTagName(c);
            }
            else if (this._state === 2 /* BeforeTagName */) {
                this.stateBeforeTagName(c);
            }
            else if (this._state === 10 /* AfterAttributeName */) {
                this.stateAfterAttributeName(c);
            }
            else if (this._state === 13 /* InAttributeValueSq */) {
                this.stateInAttributeValueSingleQuotes(c);
            }
            else if (this._state === 11 /* BeforeAttributeValue */) {
                this.stateBeforeAttributeValue(c);
            }
            else if (this._state === 5 /* BeforeClosingTagName */) {
                this.stateBeforeClosingTagName(c);
            }
            else if (this._state === 7 /* AfterClosingTagName */) {
                this.stateAfterClosingTagName(c);
            }
            else if (this._state === 22 /* BeforeSpecialS */) {
                this.stateBeforeSpecialS(c);
            }
            else if (this._state === 14 /* InAttributeValueNq */) {
                this.stateInAttributeValueNoQuotes(c);
            }
            else if (this._state === 4 /* InSelfClosingTag */) {
                this.stateInSelfClosingTag(c);
            }
            else if (this._state === 16 /* InDeclaration */) {
                this.stateInDeclaration(c);
            }
            else if (this._state === 15 /* BeforeDeclaration */) {
                this.stateBeforeDeclaration(c);
            }
            else if (this._state === 18 /* BeforeComment */) {
                this.stateBeforeComment(c);
            }
            else if (this._state === 17 /* InProcessingInstruction */) {
                this.stateInProcessingInstruction(c);
            }
            else if (this._state === 27 /* InNamedEntity */) {
                this.stateInNamedEntity(c);
            }
            else if (this._state === 25 /* BeforeEntity */) {
                this.stateBeforeEntity(c);
            }
            else if (this._state === 29 /* InHexEntity */) {
                this.stateInHexEntity(c);
            }
            else if (this._state === 28 /* InNumericEntity */) {
                this.stateInNumericEntity(c);
            }
            else {
                // `this._state === State.BeforeNumericEntity`
                this.stateBeforeNumericEntity(c);
            }
            this._index++;
        }
        this.cleanup();
    };
    Tokenizer.prototype.finish = function () {
        if (this._state === 27 /* InNamedEntity */) {
            this.emitNamedEntity();
        }
        // If there is remaining data, emit it in a reasonable way
        if (this.sectionStart < this._index) {
            this.handleTrailingData();
        }
        this.cbs.onend();
    };
    /** Handle any trailing data. */
    Tokenizer.prototype.handleTrailingData = function () {
        var data = this.buffer.substr(this.sectionStart);
        if (this._state === 21 /* InCommentLike */) {
            if (this.currentSequence === Sequences.CdataEnd) {
                this.cbs.oncdata(data);
            }
            else {
                this.cbs.oncomment(data);
            }
        }
        else if (this._state === 28 /* InNumericEntity */ &&
            this.allowLegacyEntity()) {
            this.decodeNumericEntity(10, false);
            // All trailing data will have been consumed
        }
        else if (this._state === 29 /* InHexEntity */ &&
            this.allowLegacyEntity()) {
            this.decodeNumericEntity(16, false);
            // All trailing data will have been consumed
        }
        else if (this._state === 3 /* InTagName */ ||
            this._state === 8 /* BeforeAttributeName */ ||
            this._state === 11 /* BeforeAttributeValue */ ||
            this._state === 10 /* AfterAttributeName */ ||
            this._state === 9 /* InAttributeName */ ||
            this._state === 13 /* InAttributeValueSq */ ||
            this._state === 12 /* InAttributeValueDq */ ||
            this._state === 14 /* InAttributeValueNq */ ||
            this._state === 6 /* InClosingTagName */) {
            /*
             * If we are currently in an opening or closing tag, us not calling the
             * respective callback signals that the tag should be ignored.
             */
        }
        else {
            this.cbs.ontext(data);
        }
    };
    Tokenizer.prototype.getSection = function () {
        return this.buffer.substring(this.sectionStart, this._index);
    };
    Tokenizer.prototype.emitPartial = function (value) {
        if (this.baseState !== 1 /* Text */ &&
            this.baseState !== 24 /* InSpecialTag */) {
            this.cbs.onattribdata(value);
        }
        else {
            this.cbs.ontext(value);
        }
    };
    return Tokenizer;
}());
exports["default"] = Tokenizer;


/***/ }),

/***/ 2928:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RssHandler = exports.DefaultHandler = exports.DomUtils = exports.ElementType = exports.Tokenizer = exports.createDomStream = exports.parseDOM = exports.parseDocument = exports.DomHandler = exports.Parser = void 0;
var Parser_1 = __nccwpck_require__(8460);
Object.defineProperty(exports, "Parser", ({ enumerable: true, get: function () { return Parser_1.Parser; } }));
var domhandler_1 = __nccwpck_require__(4038);
Object.defineProperty(exports, "DomHandler", ({ enumerable: true, get: function () { return domhandler_1.DomHandler; } }));
Object.defineProperty(exports, "DefaultHandler", ({ enumerable: true, get: function () { return domhandler_1.DomHandler; } }));
// Helper methods
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */
function parseDocument(data, options) {
    var handler = new domhandler_1.DomHandler(undefined, options);
    new Parser_1.Parser(handler, options).end(data);
    return handler.root;
}
exports.parseDocument = parseDocument;
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */
function parseDOM(data, options) {
    return parseDocument(data, options).children;
}
exports.parseDOM = parseDOM;
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param cb A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
 */
function createDomStream(cb, options, elementCb) {
    var handler = new domhandler_1.DomHandler(cb, options, elementCb);
    return new Parser_1.Parser(handler, options);
}
exports.createDomStream = createDomStream;
var Tokenizer_1 = __nccwpck_require__(2689);
Object.defineProperty(exports, "Tokenizer", ({ enumerable: true, get: function () { return __importDefault(Tokenizer_1).default; } }));
var ElementType = __importStar(__nccwpck_require__(3944));
exports.ElementType = ElementType;
/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */
__exportStar(__nccwpck_require__(7725), exports);
exports.DomUtils = __importStar(__nccwpck_require__(1754));
var FeedHandler_1 = __nccwpck_require__(7725);
Object.defineProperty(exports, "RssHandler", ({ enumerable: true, get: function () { return FeedHandler_1.FeedHandler; } }));


/***/ }),

/***/ 3738:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeXML = exports.decodeHTMLStrict = exports.decodeHTML = exports.determineBranch = exports.JUMP_OFFSET_BASE = exports.BinTrieFlags = exports.xmlDecodeTree = exports.htmlDecodeTree = void 0;
var decode_data_html_1 = __importDefault(__nccwpck_require__(6347));
exports.htmlDecodeTree = decode_data_html_1.default;
var decode_data_xml_1 = __importDefault(__nccwpck_require__(7938));
exports.xmlDecodeTree = decode_data_xml_1.default;
var decode_codepoint_1 = __importDefault(__nccwpck_require__(4520));
var BinTrieFlags;
(function (BinTrieFlags) {
    BinTrieFlags[BinTrieFlags["HAS_VALUE"] = 32768] = "HAS_VALUE";
    BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 32512] = "BRANCH_LENGTH";
    BinTrieFlags[BinTrieFlags["MULTI_BYTE"] = 128] = "MULTI_BYTE";
    BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags = exports.BinTrieFlags || (exports.BinTrieFlags = {}));
exports.JUMP_OFFSET_BASE = 48 /* ZERO */ - 1;
function getDecoder(decodeTree) {
    return function decodeHTMLBinary(str, strict) {
        var ret = "";
        var lastIdx = 0;
        var strIdx = 0;
        while ((strIdx = str.indexOf("&", strIdx)) >= 0) {
            ret += str.slice(lastIdx, strIdx);
            lastIdx = strIdx;
            // Skip the "&"
            strIdx += 1;
            // If we have a numeric entity, handle this separately.
            if (str.charCodeAt(strIdx) === 35 /* NUM */) {
                // Skip the leading "&#". For hex entities, also skip the leading "x".
                var start = strIdx + 1;
                var base = 10;
                var cp = str.charCodeAt(start);
                if ((cp | 32 /* To_LOWER_BIT */) === 120 /* LOWER_X */) {
                    base = 16;
                    strIdx += 1;
                    start += 1;
                }
                while (((cp = str.charCodeAt(++strIdx)) >= 48 /* ZERO */ &&
                    cp <= 57 /* NINE */) ||
                    (base === 16 &&
                        (cp | 32 /* To_LOWER_BIT */) >= 97 /* LOWER_A */ &&
                        (cp | 32 /* To_LOWER_BIT */) <= 102 /* LOWER_F */))
                    ;
                if (start !== strIdx) {
                    var entity = str.substring(start, strIdx);
                    var parsed = parseInt(entity, base);
                    if (str.charCodeAt(strIdx) === 59 /* SEMI */) {
                        strIdx += 1;
                    }
                    else if (strict) {
                        continue;
                    }
                    ret += decode_codepoint_1.default(parsed);
                    lastIdx = strIdx;
                }
                continue;
            }
            var result = null;
            var excess = 1;
            var treeIdx = 0;
            var current = decodeTree[treeIdx];
            for (; strIdx < str.length; strIdx++, excess++) {
                treeIdx = determineBranch(decodeTree, current, treeIdx + 1, str.charCodeAt(strIdx));
                if (treeIdx < 0)
                    break;
                current = decodeTree[treeIdx];
                // If the branch is a value, store it and continue
                if (current & BinTrieFlags.HAS_VALUE) {
                    // If we have a legacy entity while parsing strictly, just skip the number of bytes
                    if (strict && str.charCodeAt(strIdx) !== 59 /* SEMI */) {
                        // No need to consider multi-byte values, as the legacy entity is always a single byte
                        treeIdx += 1;
                    }
                    else {
                        // If this is a surrogate pair, combine the higher bits from the node with the next byte
                        result =
                            current & BinTrieFlags.MULTI_BYTE
                                ? String.fromCharCode(decodeTree[++treeIdx], decodeTree[++treeIdx])
                                : String.fromCharCode(decodeTree[++treeIdx]);
                        excess = 0;
                    }
                }
            }
            if (result != null) {
                ret += result;
                lastIdx = strIdx - excess + 1;
            }
        }
        return ret + str.slice(lastIdx);
    };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
    if (current <= 128) {
        return char === current ? nodeIdx : -1;
    }
    var branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 8;
    if (branchCount === 0) {
        return -1;
    }
    if (branchCount === 1) {
        return char === decodeTree[nodeIdx] ? nodeIdx + 1 : -1;
    }
    var jumpOffset = current & BinTrieFlags.JUMP_TABLE;
    if (jumpOffset) {
        var value = char - exports.JUMP_OFFSET_BASE - jumpOffset;
        return value < 0 || value > branchCount
            ? -1
            : decodeTree[nodeIdx + value] - 1;
    }
    // Binary search for the character.
    var lo = nodeIdx;
    var hi = lo + branchCount - 1;
    while (lo <= hi) {
        var mid = (lo + hi) >>> 1;
        var midVal = decodeTree[mid];
        if (midVal < char) {
            lo = mid + 1;
        }
        else if (midVal > char) {
            hi = mid - 1;
        }
        else {
            return decodeTree[mid + branchCount];
        }
    }
    return -1;
}
exports.determineBranch = determineBranch;
var htmlDecoder = getDecoder(decode_data_html_1.default);
var xmlDecoder = getDecoder(decode_data_xml_1.default);
function decodeHTML(str) {
    return htmlDecoder(str, false);
}
exports.decodeHTML = decodeHTML;
function decodeHTMLStrict(str) {
    return htmlDecoder(str, true);
}
exports.decodeHTMLStrict = decodeHTMLStrict;
function decodeXML(str) {
    return xmlDecoder(str, true);
}
exports.decodeXML = decodeXML;


/***/ }),

/***/ 4520:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decodeMap = new Map([
    [0, 65533],
    [128, 8364],
    [130, 8218],
    [131, 402],
    [132, 8222],
    [133, 8230],
    [134, 8224],
    [135, 8225],
    [136, 710],
    [137, 8240],
    [138, 352],
    [139, 8249],
    [140, 338],
    [142, 381],
    [145, 8216],
    [146, 8217],
    [147, 8220],
    [148, 8221],
    [149, 8226],
    [150, 8211],
    [151, 8212],
    [152, 732],
    [153, 8482],
    [154, 353],
    [155, 8250],
    [156, 339],
    [158, 382],
    [159, 376],
]);
var fromCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
String.fromCodePoint ||
    function (codePoint) {
        var output = "";
        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }
        output += String.fromCharCode(codePoint);
        return output;
    };
function decodeCodePoint(codePoint) {
    var _a;
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    return fromCodePoint((_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint);
}
exports["default"] = decodeCodePoint;


/***/ }),

/***/ 6347:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Generated using scripts/write-decode-map.ts
// prettier-ignore
exports["default"] = new Uint16Array([14866, 60, 237, 340, 721, 1312, 1562, 1654, 1838, 1957, 2183, 2239, 2301, 2958, 3037, 3893, 4123, 4298, 4330, 4801, 5191, 5395, 5752, 5903, 5943, 5972, 6050, 0, 0, 0, 0, 0, 0, 6135, 6565, 7422, 8183, 8738, 9242, 9503, 9938, 10189, 10573, 10637, 10715, 11950, 12246, 13539, 13950, 14445, 14533, 15364, 16514, 16980, 17390, 17763, 17849, 18036, 18125, 4096, 69, 77, 97, 98, 99, 102, 103, 108, 109, 110, 111, 112, 114, 115, 116, 117, 92, 100, 106, 115, 122, 137, 142, 151, 157, 163, 167, 182, 196, 204, 220, 229, 108, 105, 103, 33024, 198, 59, 32768, 198, 80, 33024, 38, 59, 32768, 38, 99, 117, 116, 101, 33024, 193, 59, 32768, 193, 114, 101, 118, 101, 59, 32768, 258, 512, 105, 121, 127, 134, 114, 99, 33024, 194, 59, 32768, 194, 59, 32768, 1040, 114, 59, 32896, 55349, 56580, 114, 97, 118, 101, 33024, 192, 59, 32768, 192, 112, 104, 97, 59, 32768, 913, 97, 99, 114, 59, 32768, 256, 100, 59, 32768, 10835, 512, 103, 112, 172, 177, 111, 110, 59, 32768, 260, 102, 59, 32896, 55349, 56632, 112, 108, 121, 70, 117, 110, 99, 116, 105, 111, 110, 59, 32768, 8289, 105, 110, 103, 33024, 197, 59, 32768, 197, 512, 99, 115, 209, 214, 114, 59, 32896, 55349, 56476, 105, 103, 110, 59, 32768, 8788, 105, 108, 100, 101, 33024, 195, 59, 32768, 195, 109, 108, 33024, 196, 59, 32768, 196, 2048, 97, 99, 101, 102, 111, 114, 115, 117, 253, 278, 282, 310, 315, 321, 327, 332, 512, 99, 114, 258, 267, 107, 115, 108, 97, 115, 104, 59, 32768, 8726, 583, 271, 274, 59, 32768, 10983, 101, 100, 59, 32768, 8966, 121, 59, 32768, 1041, 768, 99, 114, 116, 289, 296, 306, 97, 117, 115, 101, 59, 32768, 8757, 110, 111, 117, 108, 108, 105, 115, 59, 32768, 8492, 97, 59, 32768, 914, 114, 59, 32896, 55349, 56581, 112, 102, 59, 32896, 55349, 56633, 101, 118, 101, 59, 32768, 728, 99, 114, 59, 32768, 8492, 109, 112, 101, 113, 59, 32768, 8782, 3584, 72, 79, 97, 99, 100, 101, 102, 104, 105, 108, 111, 114, 115, 117, 368, 373, 380, 426, 461, 466, 487, 491, 495, 533, 593, 695, 701, 707, 99, 121, 59, 32768, 1063, 80, 89, 33024, 169, 59, 32768, 169, 768, 99, 112, 121, 387, 393, 419, 117, 116, 101, 59, 32768, 262, 512, 59, 105, 398, 400, 32768, 8914, 116, 97, 108, 68, 105, 102, 102, 101, 114, 101, 110, 116, 105, 97, 108, 68, 59, 32768, 8517, 108, 101, 121, 115, 59, 32768, 8493, 1024, 97, 101, 105, 111, 435, 441, 449, 454, 114, 111, 110, 59, 32768, 268, 100, 105, 108, 33024, 199, 59, 32768, 199, 114, 99, 59, 32768, 264, 110, 105, 110, 116, 59, 32768, 8752, 111, 116, 59, 32768, 266, 512, 100, 110, 471, 478, 105, 108, 108, 97, 59, 32768, 184, 116, 101, 114, 68, 111, 116, 59, 32768, 183, 114, 59, 32768, 8493, 105, 59, 32768, 935, 114, 99, 108, 101, 1024, 68, 77, 80, 84, 508, 513, 520, 526, 111, 116, 59, 32768, 8857, 105, 110, 117, 115, 59, 32768, 8854, 108, 117, 115, 59, 32768, 8853, 105, 109, 101, 115, 59, 32768, 8855, 111, 512, 99, 115, 539, 562, 107, 119, 105, 115, 101, 67, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 32768, 8754, 101, 67, 117, 114, 108, 121, 512, 68, 81, 573, 586, 111, 117, 98, 108, 101, 81, 117, 111, 116, 101, 59, 32768, 8221, 117, 111, 116, 101, 59, 32768, 8217, 1024, 108, 110, 112, 117, 602, 614, 648, 664, 111, 110, 512, 59, 101, 609, 611, 32768, 8759, 59, 32768, 10868, 768, 103, 105, 116, 621, 629, 634, 114, 117, 101, 110, 116, 59, 32768, 8801, 110, 116, 59, 32768, 8751, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 32768, 8750, 512, 102, 114, 653, 656, 59, 32768, 8450, 111, 100, 117, 99, 116, 59, 32768, 8720, 110, 116, 101, 114, 67, 108, 111, 99, 107, 119, 105, 115, 101, 67, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 32768, 8755, 111, 115, 115, 59, 32768, 10799, 99, 114, 59, 32896, 55349, 56478, 112, 512, 59, 67, 713, 715, 32768, 8915, 97, 112, 59, 32768, 8781, 2816, 68, 74, 83, 90, 97, 99, 101, 102, 105, 111, 115, 743, 758, 763, 768, 773, 795, 809, 821, 826, 910, 1295, 512, 59, 111, 748, 750, 32768, 8517, 116, 114, 97, 104, 100, 59, 32768, 10513, 99, 121, 59, 32768, 1026, 99, 121, 59, 32768, 1029, 99, 121, 59, 32768, 1039, 768, 103, 114, 115, 780, 786, 790, 103, 101, 114, 59, 32768, 8225, 114, 59, 32768, 8609, 104, 118, 59, 32768, 10980, 512, 97, 121, 800, 806, 114, 111, 110, 59, 32768, 270, 59, 32768, 1044, 108, 512, 59, 116, 815, 817, 32768, 8711, 97, 59, 32768, 916, 114, 59, 32896, 55349, 56583, 512, 97, 102, 831, 897, 512, 99, 109, 836, 891, 114, 105, 116, 105, 99, 97, 108, 1024, 65, 68, 71, 84, 852, 859, 877, 884, 99, 117, 116, 101, 59, 32768, 180, 111, 581, 864, 867, 59, 32768, 729, 98, 108, 101, 65, 99, 117, 116, 101, 59, 32768, 733, 114, 97, 118, 101, 59, 32768, 96, 105, 108, 100, 101, 59, 32768, 732, 111, 110, 100, 59, 32768, 8900, 102, 101, 114, 101, 110, 116, 105, 97, 108, 68, 59, 32768, 8518, 2113, 920, 0, 0, 0, 925, 946, 0, 1139, 102, 59, 32896, 55349, 56635, 768, 59, 68, 69, 931, 933, 938, 32768, 168, 111, 116, 59, 32768, 8412, 113, 117, 97, 108, 59, 32768, 8784, 98, 108, 101, 1536, 67, 68, 76, 82, 85, 86, 961, 978, 996, 1080, 1101, 1125, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 32768, 8751, 111, 1093, 985, 0, 0, 988, 59, 32768, 168, 110, 65, 114, 114, 111, 119, 59, 32768, 8659, 512, 101, 111, 1001, 1034, 102, 116, 768, 65, 82, 84, 1010, 1017, 1029, 114, 114, 111, 119, 59, 32768, 8656, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 8660, 101, 101, 59, 32768, 10980, 110, 103, 512, 76, 82, 1041, 1068, 101, 102, 116, 512, 65, 82, 1049, 1056, 114, 114, 111, 119, 59, 32768, 10232, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 10234, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 10233, 105, 103, 104, 116, 512, 65, 84, 1089, 1096, 114, 114, 111, 119, 59, 32768, 8658, 101, 101, 59, 32768, 8872, 112, 1042, 1108, 0, 0, 1115, 114, 114, 111, 119, 59, 32768, 8657, 111, 119, 110, 65, 114, 114, 111, 119, 59, 32768, 8661, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 32768, 8741, 110, 1536, 65, 66, 76, 82, 84, 97, 1152, 1179, 1186, 1236, 1272, 1288, 114, 114, 111, 119, 768, 59, 66, 85, 1163, 1165, 1170, 32768, 8595, 97, 114, 59, 32768, 10515, 112, 65, 114, 114, 111, 119, 59, 32768, 8693, 114, 101, 118, 101, 59, 32768, 785, 101, 102, 116, 1315, 1196, 0, 1209, 0, 1220, 105, 103, 104, 116, 86, 101, 99, 116, 111, 114, 59, 32768, 10576, 101, 101, 86, 101, 99, 116, 111, 114, 59, 32768, 10590, 101, 99, 116, 111, 114, 512, 59, 66, 1229, 1231, 32768, 8637, 97, 114, 59, 32768, 10582, 105, 103, 104, 116, 805, 1245, 0, 1256, 101, 101, 86, 101, 99, 116, 111, 114, 59, 32768, 10591, 101, 99, 116, 111, 114, 512, 59, 66, 1265, 1267, 32768, 8641, 97, 114, 59, 32768, 10583, 101, 101, 512, 59, 65, 1279, 1281, 32768, 8868, 114, 114, 111, 119, 59, 32768, 8615, 114, 114, 111, 119, 59, 32768, 8659, 512, 99, 116, 1300, 1305, 114, 59, 32896, 55349, 56479, 114, 111, 107, 59, 32768, 272, 4096, 78, 84, 97, 99, 100, 102, 103, 108, 109, 111, 112, 113, 115, 116, 117, 120, 1344, 1348, 1354, 1363, 1386, 1391, 1396, 1405, 1413, 1460, 1475, 1483, 1514, 1527, 1531, 1538, 71, 59, 32768, 330, 72, 33024, 208, 59, 32768, 208, 99, 117, 116, 101, 33024, 201, 59, 32768, 201, 768, 97, 105, 121, 1370, 1376, 1383, 114, 111, 110, 59, 32768, 282, 114, 99, 33024, 202, 59, 32768, 202, 59, 32768, 1069, 111, 116, 59, 32768, 278, 114, 59, 32896, 55349, 56584, 114, 97, 118, 101, 33024, 200, 59, 32768, 200, 101, 109, 101, 110, 116, 59, 32768, 8712, 512, 97, 112, 1418, 1423, 99, 114, 59, 32768, 274, 116, 121, 1060, 1431, 0, 0, 1444, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 32768, 9723, 101, 114, 121, 83, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 32768, 9643, 512, 103, 112, 1465, 1470, 111, 110, 59, 32768, 280, 102, 59, 32896, 55349, 56636, 115, 105, 108, 111, 110, 59, 32768, 917, 117, 512, 97, 105, 1489, 1504, 108, 512, 59, 84, 1495, 1497, 32768, 10869, 105, 108, 100, 101, 59, 32768, 8770, 108, 105, 98, 114, 105, 117, 109, 59, 32768, 8652, 512, 99, 105, 1519, 1523, 114, 59, 32768, 8496, 109, 59, 32768, 10867, 97, 59, 32768, 919, 109, 108, 33024, 203, 59, 32768, 203, 512, 105, 112, 1543, 1549, 115, 116, 115, 59, 32768, 8707, 111, 110, 101, 110, 116, 105, 97, 108, 69, 59, 32768, 8519, 1280, 99, 102, 105, 111, 115, 1572, 1576, 1581, 1620, 1648, 121, 59, 32768, 1060, 114, 59, 32896, 55349, 56585, 108, 108, 101, 100, 1060, 1591, 0, 0, 1604, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 32768, 9724, 101, 114, 121, 83, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 32768, 9642, 1601, 1628, 0, 1633, 0, 0, 1639, 102, 59, 32896, 55349, 56637, 65, 108, 108, 59, 32768, 8704, 114, 105, 101, 114, 116, 114, 102, 59, 32768, 8497, 99, 114, 59, 32768, 8497, 3072, 74, 84, 97, 98, 99, 100, 102, 103, 111, 114, 115, 116, 1678, 1683, 1688, 1701, 1708, 1729, 1734, 1739, 1742, 1748, 1828, 1834, 99, 121, 59, 32768, 1027, 33024, 62, 59, 32768, 62, 109, 109, 97, 512, 59, 100, 1696, 1698, 32768, 915, 59, 32768, 988, 114, 101, 118, 101, 59, 32768, 286, 768, 101, 105, 121, 1715, 1721, 1726, 100, 105, 108, 59, 32768, 290, 114, 99, 59, 32768, 284, 59, 32768, 1043, 111, 116, 59, 32768, 288, 114, 59, 32896, 55349, 56586, 59, 32768, 8921, 112, 102, 59, 32896, 55349, 56638, 101, 97, 116, 101, 114, 1536, 69, 70, 71, 76, 83, 84, 1766, 1783, 1794, 1803, 1809, 1821, 113, 117, 97, 108, 512, 59, 76, 1775, 1777, 32768, 8805, 101, 115, 115, 59, 32768, 8923, 117, 108, 108, 69, 113, 117, 97, 108, 59, 32768, 8807, 114, 101, 97, 116, 101, 114, 59, 32768, 10914, 101, 115, 115, 59, 32768, 8823, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32768, 10878, 105, 108, 100, 101, 59, 32768, 8819, 99, 114, 59, 32896, 55349, 56482, 59, 32768, 8811, 2048, 65, 97, 99, 102, 105, 111, 115, 117, 1854, 1861, 1874, 1880, 1884, 1897, 1919, 1934, 82, 68, 99, 121, 59, 32768, 1066, 512, 99, 116, 1866, 1871, 101, 107, 59, 32768, 711, 59, 32768, 94, 105, 114, 99, 59, 32768, 292, 114, 59, 32768, 8460, 108, 98, 101, 114, 116, 83, 112, 97, 99, 101, 59, 32768, 8459, 833, 1902, 0, 1906, 102, 59, 32768, 8461, 105, 122, 111, 110, 116, 97, 108, 76, 105, 110, 101, 59, 32768, 9472, 512, 99, 116, 1924, 1928, 114, 59, 32768, 8459, 114, 111, 107, 59, 32768, 294, 109, 112, 533, 1940, 1950, 111, 119, 110, 72, 117, 109, 112, 59, 32768, 8782, 113, 117, 97, 108, 59, 32768, 8783, 3584, 69, 74, 79, 97, 99, 100, 102, 103, 109, 110, 111, 115, 116, 117, 1985, 1990, 1996, 2001, 2010, 2025, 2030, 2034, 2043, 2077, 2134, 2155, 2160, 2167, 99, 121, 59, 32768, 1045, 108, 105, 103, 59, 32768, 306, 99, 121, 59, 32768, 1025, 99, 117, 116, 101, 33024, 205, 59, 32768, 205, 512, 105, 121, 2015, 2022, 114, 99, 33024, 206, 59, 32768, 206, 59, 32768, 1048, 111, 116, 59, 32768, 304, 114, 59, 32768, 8465, 114, 97, 118, 101, 33024, 204, 59, 32768, 204, 768, 59, 97, 112, 2050, 2052, 2070, 32768, 8465, 512, 99, 103, 2057, 2061, 114, 59, 32768, 298, 105, 110, 97, 114, 121, 73, 59, 32768, 8520, 108, 105, 101, 115, 59, 32768, 8658, 837, 2082, 0, 2110, 512, 59, 101, 2086, 2088, 32768, 8748, 512, 103, 114, 2093, 2099, 114, 97, 108, 59, 32768, 8747, 115, 101, 99, 116, 105, 111, 110, 59, 32768, 8898, 105, 115, 105, 98, 108, 101, 512, 67, 84, 2120, 2127, 111, 109, 109, 97, 59, 32768, 8291, 105, 109, 101, 115, 59, 32768, 8290, 768, 103, 112, 116, 2141, 2146, 2151, 111, 110, 59, 32768, 302, 102, 59, 32896, 55349, 56640, 97, 59, 32768, 921, 99, 114, 59, 32768, 8464, 105, 108, 100, 101, 59, 32768, 296, 828, 2172, 0, 2177, 99, 121, 59, 32768, 1030, 108, 33024, 207, 59, 32768, 207, 1280, 99, 102, 111, 115, 117, 2193, 2206, 2211, 2217, 2232, 512, 105, 121, 2198, 2203, 114, 99, 59, 32768, 308, 59, 32768, 1049, 114, 59, 32896, 55349, 56589, 112, 102, 59, 32896, 55349, 56641, 820, 2222, 0, 2227, 114, 59, 32896, 55349, 56485, 114, 99, 121, 59, 32768, 1032, 107, 99, 121, 59, 32768, 1028, 1792, 72, 74, 97, 99, 102, 111, 115, 2253, 2258, 2263, 2269, 2283, 2288, 2294, 99, 121, 59, 32768, 1061, 99, 121, 59, 32768, 1036, 112, 112, 97, 59, 32768, 922, 512, 101, 121, 2274, 2280, 100, 105, 108, 59, 32768, 310, 59, 32768, 1050, 114, 59, 32896, 55349, 56590, 112, 102, 59, 32896, 55349, 56642, 99, 114, 59, 32896, 55349, 56486, 2816, 74, 84, 97, 99, 101, 102, 108, 109, 111, 115, 116, 2323, 2328, 2333, 2374, 2396, 2775, 2780, 2797, 2804, 2934, 2954, 99, 121, 59, 32768, 1033, 33024, 60, 59, 32768, 60, 1280, 99, 109, 110, 112, 114, 2344, 2350, 2356, 2360, 2370, 117, 116, 101, 59, 32768, 313, 98, 100, 97, 59, 32768, 923, 103, 59, 32768, 10218, 108, 97, 99, 101, 116, 114, 102, 59, 32768, 8466, 114, 59, 32768, 8606, 768, 97, 101, 121, 2381, 2387, 2393, 114, 111, 110, 59, 32768, 317, 100, 105, 108, 59, 32768, 315, 59, 32768, 1051, 512, 102, 115, 2401, 2702, 116, 2560, 65, 67, 68, 70, 82, 84, 85, 86, 97, 114, 2423, 2470, 2479, 2530, 2537, 2561, 2618, 2666, 2683, 2690, 512, 110, 114, 2428, 2441, 103, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 32768, 10216, 114, 111, 119, 768, 59, 66, 82, 2451, 2453, 2458, 32768, 8592, 97, 114, 59, 32768, 8676, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 8646, 101, 105, 108, 105, 110, 103, 59, 32768, 8968, 111, 838, 2485, 0, 2498, 98, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 32768, 10214, 110, 805, 2503, 0, 2514, 101, 101, 86, 101, 99, 116, 111, 114, 59, 32768, 10593, 101, 99, 116, 111, 114, 512, 59, 66, 2523, 2525, 32768, 8643, 97, 114, 59, 32768, 10585, 108, 111, 111, 114, 59, 32768, 8970, 105, 103, 104, 116, 512, 65, 86, 2546, 2553, 114, 114, 111, 119, 59, 32768, 8596, 101, 99, 116, 111, 114, 59, 32768, 10574, 512, 101, 114, 2566, 2591, 101, 768, 59, 65, 86, 2574, 2576, 2583, 32768, 8867, 114, 114, 111, 119, 59, 32768, 8612, 101, 99, 116, 111, 114, 59, 32768, 10586, 105, 97, 110, 103, 108, 101, 768, 59, 66, 69, 2604, 2606, 2611, 32768, 8882, 97, 114, 59, 32768, 10703, 113, 117, 97, 108, 59, 32768, 8884, 112, 768, 68, 84, 86, 2626, 2638, 2649, 111, 119, 110, 86, 101, 99, 116, 111, 114, 59, 32768, 10577, 101, 101, 86, 101, 99, 116, 111, 114, 59, 32768, 10592, 101, 99, 116, 111, 114, 512, 59, 66, 2659, 2661, 32768, 8639, 97, 114, 59, 32768, 10584, 101, 99, 116, 111, 114, 512, 59, 66, 2676, 2678, 32768, 8636, 97, 114, 59, 32768, 10578, 114, 114, 111, 119, 59, 32768, 8656, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8660, 115, 1536, 69, 70, 71, 76, 83, 84, 2716, 2730, 2741, 2750, 2756, 2768, 113, 117, 97, 108, 71, 114, 101, 97, 116, 101, 114, 59, 32768, 8922, 117, 108, 108, 69, 113, 117, 97, 108, 59, 32768, 8806, 114, 101, 97, 116, 101, 114, 59, 32768, 8822, 101, 115, 115, 59, 32768, 10913, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32768, 10877, 105, 108, 100, 101, 59, 32768, 8818, 114, 59, 32896, 55349, 56591, 512, 59, 101, 2785, 2787, 32768, 8920, 102, 116, 97, 114, 114, 111, 119, 59, 32768, 8666, 105, 100, 111, 116, 59, 32768, 319, 768, 110, 112, 119, 2811, 2899, 2904, 103, 1024, 76, 82, 108, 114, 2821, 2848, 2860, 2887, 101, 102, 116, 512, 65, 82, 2829, 2836, 114, 114, 111, 119, 59, 32768, 10229, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 10231, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 10230, 101, 102, 116, 512, 97, 114, 2868, 2875, 114, 114, 111, 119, 59, 32768, 10232, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 10234, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 10233, 102, 59, 32896, 55349, 56643, 101, 114, 512, 76, 82, 2911, 2922, 101, 102, 116, 65, 114, 114, 111, 119, 59, 32768, 8601, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 8600, 768, 99, 104, 116, 2941, 2945, 2948, 114, 59, 32768, 8466, 59, 32768, 8624, 114, 111, 107, 59, 32768, 321, 59, 32768, 8810, 2048, 97, 99, 101, 102, 105, 111, 115, 117, 2974, 2978, 2982, 3007, 3012, 3022, 3028, 3033, 112, 59, 32768, 10501, 121, 59, 32768, 1052, 512, 100, 108, 2987, 2998, 105, 117, 109, 83, 112, 97, 99, 101, 59, 32768, 8287, 108, 105, 110, 116, 114, 102, 59, 32768, 8499, 114, 59, 32896, 55349, 56592, 110, 117, 115, 80, 108, 117, 115, 59, 32768, 8723, 112, 102, 59, 32896, 55349, 56644, 99, 114, 59, 32768, 8499, 59, 32768, 924, 2304, 74, 97, 99, 101, 102, 111, 115, 116, 117, 3055, 3060, 3067, 3089, 3201, 3206, 3874, 3880, 3889, 99, 121, 59, 32768, 1034, 99, 117, 116, 101, 59, 32768, 323, 768, 97, 101, 121, 3074, 3080, 3086, 114, 111, 110, 59, 32768, 327, 100, 105, 108, 59, 32768, 325, 59, 32768, 1053, 768, 103, 115, 119, 3096, 3160, 3194, 97, 116, 105, 118, 101, 768, 77, 84, 86, 3108, 3121, 3145, 101, 100, 105, 117, 109, 83, 112, 97, 99, 101, 59, 32768, 8203, 104, 105, 512, 99, 110, 3128, 3137, 107, 83, 112, 97, 99, 101, 59, 32768, 8203, 83, 112, 97, 99, 101, 59, 32768, 8203, 101, 114, 121, 84, 104, 105, 110, 83, 112, 97, 99, 101, 59, 32768, 8203, 116, 101, 100, 512, 71, 76, 3168, 3184, 114, 101, 97, 116, 101, 114, 71, 114, 101, 97, 116, 101, 114, 59, 32768, 8811, 101, 115, 115, 76, 101, 115, 115, 59, 32768, 8810, 76, 105, 110, 101, 59, 32768, 10, 114, 59, 32896, 55349, 56593, 1024, 66, 110, 112, 116, 3215, 3222, 3238, 3242, 114, 101, 97, 107, 59, 32768, 8288, 66, 114, 101, 97, 107, 105, 110, 103, 83, 112, 97, 99, 101, 59, 32768, 160, 102, 59, 32768, 8469, 3328, 59, 67, 68, 69, 71, 72, 76, 78, 80, 82, 83, 84, 86, 3269, 3271, 3293, 3312, 3352, 3430, 3455, 3551, 3589, 3625, 3678, 3821, 3861, 32768, 10988, 512, 111, 117, 3276, 3286, 110, 103, 114, 117, 101, 110, 116, 59, 32768, 8802, 112, 67, 97, 112, 59, 32768, 8813, 111, 117, 98, 108, 101, 86, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 32768, 8742, 768, 108, 113, 120, 3319, 3327, 3345, 101, 109, 101, 110, 116, 59, 32768, 8713, 117, 97, 108, 512, 59, 84, 3335, 3337, 32768, 8800, 105, 108, 100, 101, 59, 32896, 8770, 824, 105, 115, 116, 115, 59, 32768, 8708, 114, 101, 97, 116, 101, 114, 1792, 59, 69, 70, 71, 76, 83, 84, 3373, 3375, 3382, 3394, 3404, 3410, 3423, 32768, 8815, 113, 117, 97, 108, 59, 32768, 8817, 117, 108, 108, 69, 113, 117, 97, 108, 59, 32896, 8807, 824, 114, 101, 97, 116, 101, 114, 59, 32896, 8811, 824, 101, 115, 115, 59, 32768, 8825, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32896, 10878, 824, 105, 108, 100, 101, 59, 32768, 8821, 117, 109, 112, 533, 3437, 3448, 111, 119, 110, 72, 117, 109, 112, 59, 32896, 8782, 824, 113, 117, 97, 108, 59, 32896, 8783, 824, 101, 512, 102, 115, 3461, 3492, 116, 84, 114, 105, 97, 110, 103, 108, 101, 768, 59, 66, 69, 3477, 3479, 3485, 32768, 8938, 97, 114, 59, 32896, 10703, 824, 113, 117, 97, 108, 59, 32768, 8940, 115, 1536, 59, 69, 71, 76, 83, 84, 3506, 3508, 3515, 3524, 3531, 3544, 32768, 8814, 113, 117, 97, 108, 59, 32768, 8816, 114, 101, 97, 116, 101, 114, 59, 32768, 8824, 101, 115, 115, 59, 32896, 8810, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32896, 10877, 824, 105, 108, 100, 101, 59, 32768, 8820, 101, 115, 116, 101, 100, 512, 71, 76, 3561, 3578, 114, 101, 97, 116, 101, 114, 71, 114, 101, 97, 116, 101, 114, 59, 32896, 10914, 824, 101, 115, 115, 76, 101, 115, 115, 59, 32896, 10913, 824, 114, 101, 99, 101, 100, 101, 115, 768, 59, 69, 83, 3603, 3605, 3613, 32768, 8832, 113, 117, 97, 108, 59, 32896, 10927, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32768, 8928, 512, 101, 105, 3630, 3645, 118, 101, 114, 115, 101, 69, 108, 101, 109, 101, 110, 116, 59, 32768, 8716, 103, 104, 116, 84, 114, 105, 97, 110, 103, 108, 101, 768, 59, 66, 69, 3663, 3665, 3671, 32768, 8939, 97, 114, 59, 32896, 10704, 824, 113, 117, 97, 108, 59, 32768, 8941, 512, 113, 117, 3683, 3732, 117, 97, 114, 101, 83, 117, 512, 98, 112, 3694, 3712, 115, 101, 116, 512, 59, 69, 3702, 3705, 32896, 8847, 824, 113, 117, 97, 108, 59, 32768, 8930, 101, 114, 115, 101, 116, 512, 59, 69, 3722, 3725, 32896, 8848, 824, 113, 117, 97, 108, 59, 32768, 8931, 768, 98, 99, 112, 3739, 3757, 3801, 115, 101, 116, 512, 59, 69, 3747, 3750, 32896, 8834, 8402, 113, 117, 97, 108, 59, 32768, 8840, 99, 101, 101, 100, 115, 1024, 59, 69, 83, 84, 3771, 3773, 3781, 3793, 32768, 8833, 113, 117, 97, 108, 59, 32896, 10928, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32768, 8929, 105, 108, 100, 101, 59, 32896, 8831, 824, 101, 114, 115, 101, 116, 512, 59, 69, 3811, 3814, 32896, 8835, 8402, 113, 117, 97, 108, 59, 32768, 8841, 105, 108, 100, 101, 1024, 59, 69, 70, 84, 3834, 3836, 3843, 3854, 32768, 8769, 113, 117, 97, 108, 59, 32768, 8772, 117, 108, 108, 69, 113, 117, 97, 108, 59, 32768, 8775, 105, 108, 100, 101, 59, 32768, 8777, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 32768, 8740, 99, 114, 59, 32896, 55349, 56489, 105, 108, 100, 101, 33024, 209, 59, 32768, 209, 59, 32768, 925, 3584, 69, 97, 99, 100, 102, 103, 109, 111, 112, 114, 115, 116, 117, 118, 3921, 3927, 3936, 3951, 3958, 3963, 3972, 3996, 4002, 4034, 4037, 4055, 4071, 4078, 108, 105, 103, 59, 32768, 338, 99, 117, 116, 101, 33024, 211, 59, 32768, 211, 512, 105, 121, 3941, 3948, 114, 99, 33024, 212, 59, 32768, 212, 59, 32768, 1054, 98, 108, 97, 99, 59, 32768, 336, 114, 59, 32896, 55349, 56594, 114, 97, 118, 101, 33024, 210, 59, 32768, 210, 768, 97, 101, 105, 3979, 3984, 3989, 99, 114, 59, 32768, 332, 103, 97, 59, 32768, 937, 99, 114, 111, 110, 59, 32768, 927, 112, 102, 59, 32896, 55349, 56646, 101, 110, 67, 117, 114, 108, 121, 512, 68, 81, 4014, 4027, 111, 117, 98, 108, 101, 81, 117, 111, 116, 101, 59, 32768, 8220, 117, 111, 116, 101, 59, 32768, 8216, 59, 32768, 10836, 512, 99, 108, 4042, 4047, 114, 59, 32896, 55349, 56490, 97, 115, 104, 33024, 216, 59, 32768, 216, 105, 573, 4060, 4067, 100, 101, 33024, 213, 59, 32768, 213, 101, 115, 59, 32768, 10807, 109, 108, 33024, 214, 59, 32768, 214, 101, 114, 512, 66, 80, 4085, 4109, 512, 97, 114, 4090, 4094, 114, 59, 32768, 8254, 97, 99, 512, 101, 107, 4101, 4104, 59, 32768, 9182, 101, 116, 59, 32768, 9140, 97, 114, 101, 110, 116, 104, 101, 115, 105, 115, 59, 32768, 9180, 2304, 97, 99, 102, 104, 105, 108, 111, 114, 115, 4141, 4150, 4154, 4159, 4163, 4166, 4176, 4198, 4284, 114, 116, 105, 97, 108, 68, 59, 32768, 8706, 121, 59, 32768, 1055, 114, 59, 32896, 55349, 56595, 105, 59, 32768, 934, 59, 32768, 928, 117, 115, 77, 105, 110, 117, 115, 59, 32768, 177, 512, 105, 112, 4181, 4194, 110, 99, 97, 114, 101, 112, 108, 97, 110, 101, 59, 32768, 8460, 102, 59, 32768, 8473, 1024, 59, 101, 105, 111, 4207, 4209, 4251, 4256, 32768, 10939, 99, 101, 100, 101, 115, 1024, 59, 69, 83, 84, 4223, 4225, 4232, 4244, 32768, 8826, 113, 117, 97, 108, 59, 32768, 10927, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32768, 8828, 105, 108, 100, 101, 59, 32768, 8830, 109, 101, 59, 32768, 8243, 512, 100, 112, 4261, 4267, 117, 99, 116, 59, 32768, 8719, 111, 114, 116, 105, 111, 110, 512, 59, 97, 4278, 4280, 32768, 8759, 108, 59, 32768, 8733, 512, 99, 105, 4289, 4294, 114, 59, 32896, 55349, 56491, 59, 32768, 936, 1024, 85, 102, 111, 115, 4306, 4313, 4318, 4323, 79, 84, 33024, 34, 59, 32768, 34, 114, 59, 32896, 55349, 56596, 112, 102, 59, 32768, 8474, 99, 114, 59, 32896, 55349, 56492, 3072, 66, 69, 97, 99, 101, 102, 104, 105, 111, 114, 115, 117, 4354, 4360, 4366, 4395, 4417, 4473, 4477, 4481, 4743, 4764, 4776, 4788, 97, 114, 114, 59, 32768, 10512, 71, 33024, 174, 59, 32768, 174, 768, 99, 110, 114, 4373, 4379, 4383, 117, 116, 101, 59, 32768, 340, 103, 59, 32768, 10219, 114, 512, 59, 116, 4389, 4391, 32768, 8608, 108, 59, 32768, 10518, 768, 97, 101, 121, 4402, 4408, 4414, 114, 111, 110, 59, 32768, 344, 100, 105, 108, 59, 32768, 342, 59, 32768, 1056, 512, 59, 118, 4422, 4424, 32768, 8476, 101, 114, 115, 101, 512, 69, 85, 4433, 4458, 512, 108, 113, 4438, 4446, 101, 109, 101, 110, 116, 59, 32768, 8715, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 32768, 8651, 112, 69, 113, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 32768, 10607, 114, 59, 32768, 8476, 111, 59, 32768, 929, 103, 104, 116, 2048, 65, 67, 68, 70, 84, 85, 86, 97, 4501, 4547, 4556, 4607, 4614, 4671, 4719, 4736, 512, 110, 114, 4506, 4519, 103, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 32768, 10217, 114, 111, 119, 768, 59, 66, 76, 4529, 4531, 4536, 32768, 8594, 97, 114, 59, 32768, 8677, 101, 102, 116, 65, 114, 114, 111, 119, 59, 32768, 8644, 101, 105, 108, 105, 110, 103, 59, 32768, 8969, 111, 838, 4562, 0, 4575, 98, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 32768, 10215, 110, 805, 4580, 0, 4591, 101, 101, 86, 101, 99, 116, 111, 114, 59, 32768, 10589, 101, 99, 116, 111, 114, 512, 59, 66, 4600, 4602, 32768, 8642, 97, 114, 59, 32768, 10581, 108, 111, 111, 114, 59, 32768, 8971, 512, 101, 114, 4619, 4644, 101, 768, 59, 65, 86, 4627, 4629, 4636, 32768, 8866, 114, 114, 111, 119, 59, 32768, 8614, 101, 99, 116, 111, 114, 59, 32768, 10587, 105, 97, 110, 103, 108, 101, 768, 59, 66, 69, 4657, 4659, 4664, 32768, 8883, 97, 114, 59, 32768, 10704, 113, 117, 97, 108, 59, 32768, 8885, 112, 768, 68, 84, 86, 4679, 4691, 4702, 111, 119, 110, 86, 101, 99, 116, 111, 114, 59, 32768, 10575, 101, 101, 86, 101, 99, 116, 111, 114, 59, 32768, 10588, 101, 99, 116, 111, 114, 512, 59, 66, 4712, 4714, 32768, 8638, 97, 114, 59, 32768, 10580, 101, 99, 116, 111, 114, 512, 59, 66, 4729, 4731, 32768, 8640, 97, 114, 59, 32768, 10579, 114, 114, 111, 119, 59, 32768, 8658, 512, 112, 117, 4748, 4752, 102, 59, 32768, 8477, 110, 100, 73, 109, 112, 108, 105, 101, 115, 59, 32768, 10608, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8667, 512, 99, 104, 4781, 4785, 114, 59, 32768, 8475, 59, 32768, 8625, 108, 101, 68, 101, 108, 97, 121, 101, 100, 59, 32768, 10740, 3328, 72, 79, 97, 99, 102, 104, 105, 109, 111, 113, 115, 116, 117, 4827, 4842, 4849, 4856, 4889, 4894, 4949, 4955, 4967, 4973, 5059, 5065, 5070, 512, 67, 99, 4832, 4838, 72, 99, 121, 59, 32768, 1065, 121, 59, 32768, 1064, 70, 84, 99, 121, 59, 32768, 1068, 99, 117, 116, 101, 59, 32768, 346, 1280, 59, 97, 101, 105, 121, 4867, 4869, 4875, 4881, 4886, 32768, 10940, 114, 111, 110, 59, 32768, 352, 100, 105, 108, 59, 32768, 350, 114, 99, 59, 32768, 348, 59, 32768, 1057, 114, 59, 32896, 55349, 56598, 111, 114, 116, 1024, 68, 76, 82, 85, 4906, 4917, 4928, 4940, 111, 119, 110, 65, 114, 114, 111, 119, 59, 32768, 8595, 101, 102, 116, 65, 114, 114, 111, 119, 59, 32768, 8592, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 8594, 112, 65, 114, 114, 111, 119, 59, 32768, 8593, 103, 109, 97, 59, 32768, 931, 97, 108, 108, 67, 105, 114, 99, 108, 101, 59, 32768, 8728, 112, 102, 59, 32896, 55349, 56650, 1091, 4979, 0, 0, 4983, 116, 59, 32768, 8730, 97, 114, 101, 1024, 59, 73, 83, 85, 4994, 4996, 5010, 5052, 32768, 9633, 110, 116, 101, 114, 115, 101, 99, 116, 105, 111, 110, 59, 32768, 8851, 117, 512, 98, 112, 5016, 5033, 115, 101, 116, 512, 59, 69, 5024, 5026, 32768, 8847, 113, 117, 97, 108, 59, 32768, 8849, 101, 114, 115, 101, 116, 512, 59, 69, 5043, 5045, 32768, 8848, 113, 117, 97, 108, 59, 32768, 8850, 110, 105, 111, 110, 59, 32768, 8852, 99, 114, 59, 32896, 55349, 56494, 97, 114, 59, 32768, 8902, 1024, 98, 99, 109, 112, 5079, 5102, 5155, 5158, 512, 59, 115, 5084, 5086, 32768, 8912, 101, 116, 512, 59, 69, 5093, 5095, 32768, 8912, 113, 117, 97, 108, 59, 32768, 8838, 512, 99, 104, 5107, 5148, 101, 101, 100, 115, 1024, 59, 69, 83, 84, 5120, 5122, 5129, 5141, 32768, 8827, 113, 117, 97, 108, 59, 32768, 10928, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 32768, 8829, 105, 108, 100, 101, 59, 32768, 8831, 84, 104, 97, 116, 59, 32768, 8715, 59, 32768, 8721, 768, 59, 101, 115, 5165, 5167, 5185, 32768, 8913, 114, 115, 101, 116, 512, 59, 69, 5176, 5178, 32768, 8835, 113, 117, 97, 108, 59, 32768, 8839, 101, 116, 59, 32768, 8913, 2816, 72, 82, 83, 97, 99, 102, 104, 105, 111, 114, 115, 5213, 5221, 5227, 5241, 5252, 5274, 5279, 5323, 5362, 5368, 5378, 79, 82, 78, 33024, 222, 59, 32768, 222, 65, 68, 69, 59, 32768, 8482, 512, 72, 99, 5232, 5237, 99, 121, 59, 32768, 1035, 121, 59, 32768, 1062, 512, 98, 117, 5246, 5249, 59, 32768, 9, 59, 32768, 932, 768, 97, 101, 121, 5259, 5265, 5271, 114, 111, 110, 59, 32768, 356, 100, 105, 108, 59, 32768, 354, 59, 32768, 1058, 114, 59, 32896, 55349, 56599, 512, 101, 105, 5284, 5300, 835, 5289, 0, 5297, 101, 102, 111, 114, 101, 59, 32768, 8756, 97, 59, 32768, 920, 512, 99, 110, 5305, 5315, 107, 83, 112, 97, 99, 101, 59, 32896, 8287, 8202, 83, 112, 97, 99, 101, 59, 32768, 8201, 108, 100, 101, 1024, 59, 69, 70, 84, 5335, 5337, 5344, 5355, 32768, 8764, 113, 117, 97, 108, 59, 32768, 8771, 117, 108, 108, 69, 113, 117, 97, 108, 59, 32768, 8773, 105, 108, 100, 101, 59, 32768, 8776, 112, 102, 59, 32896, 55349, 56651, 105, 112, 108, 101, 68, 111, 116, 59, 32768, 8411, 512, 99, 116, 5383, 5388, 114, 59, 32896, 55349, 56495, 114, 111, 107, 59, 32768, 358, 5426, 5417, 5444, 5458, 5473, 0, 5480, 5485, 0, 0, 0, 0, 0, 5494, 5500, 5564, 5579, 0, 5726, 5732, 5738, 5745, 512, 99, 114, 5421, 5429, 117, 116, 101, 33024, 218, 59, 32768, 218, 114, 512, 59, 111, 5435, 5437, 32768, 8607, 99, 105, 114, 59, 32768, 10569, 114, 820, 5449, 0, 5453, 121, 59, 32768, 1038, 118, 101, 59, 32768, 364, 512, 105, 121, 5462, 5469, 114, 99, 33024, 219, 59, 32768, 219, 59, 32768, 1059, 98, 108, 97, 99, 59, 32768, 368, 114, 59, 32896, 55349, 56600, 114, 97, 118, 101, 33024, 217, 59, 32768, 217, 97, 99, 114, 59, 32768, 362, 512, 100, 105, 5504, 5548, 101, 114, 512, 66, 80, 5511, 5535, 512, 97, 114, 5516, 5520, 114, 59, 32768, 95, 97, 99, 512, 101, 107, 5527, 5530, 59, 32768, 9183, 101, 116, 59, 32768, 9141, 97, 114, 101, 110, 116, 104, 101, 115, 105, 115, 59, 32768, 9181, 111, 110, 512, 59, 80, 5555, 5557, 32768, 8899, 108, 117, 115, 59, 32768, 8846, 512, 103, 112, 5568, 5573, 111, 110, 59, 32768, 370, 102, 59, 32896, 55349, 56652, 2048, 65, 68, 69, 84, 97, 100, 112, 115, 5595, 5624, 5635, 5648, 5664, 5671, 5682, 5712, 114, 114, 111, 119, 768, 59, 66, 68, 5606, 5608, 5613, 32768, 8593, 97, 114, 59, 32768, 10514, 111, 119, 110, 65, 114, 114, 111, 119, 59, 32768, 8645, 111, 119, 110, 65, 114, 114, 111, 119, 59, 32768, 8597, 113, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 32768, 10606, 101, 101, 512, 59, 65, 5655, 5657, 32768, 8869, 114, 114, 111, 119, 59, 32768, 8613, 114, 114, 111, 119, 59, 32768, 8657, 111, 119, 110, 97, 114, 114, 111, 119, 59, 32768, 8661, 101, 114, 512, 76, 82, 5689, 5700, 101, 102, 116, 65, 114, 114, 111, 119, 59, 32768, 8598, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 32768, 8599, 105, 512, 59, 108, 5718, 5720, 32768, 978, 111, 110, 59, 32768, 933, 105, 110, 103, 59, 32768, 366, 99, 114, 59, 32896, 55349, 56496, 105, 108, 100, 101, 59, 32768, 360, 109, 108, 33024, 220, 59, 32768, 220, 2304, 68, 98, 99, 100, 101, 102, 111, 115, 118, 5770, 5776, 5781, 5785, 5798, 5878, 5883, 5889, 5895, 97, 115, 104, 59, 32768, 8875, 97, 114, 59, 32768, 10987, 121, 59, 32768, 1042, 97, 115, 104, 512, 59, 108, 5793, 5795, 32768, 8873, 59, 32768, 10982, 512, 101, 114, 5803, 5806, 59, 32768, 8897, 768, 98, 116, 121, 5813, 5818, 5866, 97, 114, 59, 32768, 8214, 512, 59, 105, 5823, 5825, 32768, 8214, 99, 97, 108, 1024, 66, 76, 83, 84, 5837, 5842, 5848, 5859, 97, 114, 59, 32768, 8739, 105, 110, 101, 59, 32768, 124, 101, 112, 97, 114, 97, 116, 111, 114, 59, 32768, 10072, 105, 108, 100, 101, 59, 32768, 8768, 84, 104, 105, 110, 83, 112, 97, 99, 101, 59, 32768, 8202, 114, 59, 32896, 55349, 56601, 112, 102, 59, 32896, 55349, 56653, 99, 114, 59, 32896, 55349, 56497, 100, 97, 115, 104, 59, 32768, 8874, 1280, 99, 101, 102, 111, 115, 5913, 5919, 5925, 5930, 5936, 105, 114, 99, 59, 32768, 372, 100, 103, 101, 59, 32768, 8896, 114, 59, 32896, 55349, 56602, 112, 102, 59, 32896, 55349, 56654, 99, 114, 59, 32896, 55349, 56498, 1024, 102, 105, 111, 115, 5951, 5956, 5959, 5965, 114, 59, 32896, 55349, 56603, 59, 32768, 926, 112, 102, 59, 32896, 55349, 56655, 99, 114, 59, 32896, 55349, 56499, 2304, 65, 73, 85, 97, 99, 102, 111, 115, 117, 5990, 5995, 6000, 6005, 6014, 6027, 6032, 6038, 6044, 99, 121, 59, 32768, 1071, 99, 121, 59, 32768, 1031, 99, 121, 59, 32768, 1070, 99, 117, 116, 101, 33024, 221, 59, 32768, 221, 512, 105, 121, 6019, 6024, 114, 99, 59, 32768, 374, 59, 32768, 1067, 114, 59, 32896, 55349, 56604, 112, 102, 59, 32896, 55349, 56656, 99, 114, 59, 32896, 55349, 56500, 109, 108, 59, 32768, 376, 2048, 72, 97, 99, 100, 101, 102, 111, 115, 6066, 6071, 6078, 6092, 6097, 6119, 6123, 6128, 99, 121, 59, 32768, 1046, 99, 117, 116, 101, 59, 32768, 377, 512, 97, 121, 6083, 6089, 114, 111, 110, 59, 32768, 381, 59, 32768, 1047, 111, 116, 59, 32768, 379, 835, 6102, 0, 6116, 111, 87, 105, 100, 116, 104, 83, 112, 97, 99, 101, 59, 32768, 8203, 97, 59, 32768, 918, 114, 59, 32768, 8488, 112, 102, 59, 32768, 8484, 99, 114, 59, 32896, 55349, 56501, 5938, 6159, 6168, 6175, 0, 6214, 6222, 6233, 0, 0, 0, 0, 6242, 6267, 6290, 6429, 6444, 0, 6495, 6503, 6531, 6540, 0, 6547, 99, 117, 116, 101, 33024, 225, 59, 32768, 225, 114, 101, 118, 101, 59, 32768, 259, 1536, 59, 69, 100, 105, 117, 121, 6187, 6189, 6193, 6196, 6203, 6210, 32768, 8766, 59, 32896, 8766, 819, 59, 32768, 8767, 114, 99, 33024, 226, 59, 32768, 226, 116, 101, 33024, 180, 59, 32768, 180, 59, 32768, 1072, 108, 105, 103, 33024, 230, 59, 32768, 230, 512, 59, 114, 6226, 6228, 32768, 8289, 59, 32896, 55349, 56606, 114, 97, 118, 101, 33024, 224, 59, 32768, 224, 512, 101, 112, 6246, 6261, 512, 102, 112, 6251, 6257, 115, 121, 109, 59, 32768, 8501, 104, 59, 32768, 8501, 104, 97, 59, 32768, 945, 512, 97, 112, 6271, 6284, 512, 99, 108, 6276, 6280, 114, 59, 32768, 257, 103, 59, 32768, 10815, 33024, 38, 59, 32768, 38, 1077, 6295, 0, 0, 6326, 1280, 59, 97, 100, 115, 118, 6305, 6307, 6312, 6315, 6322, 32768, 8743, 110, 100, 59, 32768, 10837, 59, 32768, 10844, 108, 111, 112, 101, 59, 32768, 10840, 59, 32768, 10842, 1792, 59, 101, 108, 109, 114, 115, 122, 6340, 6342, 6345, 6349, 6391, 6410, 6422, 32768, 8736, 59, 32768, 10660, 101, 59, 32768, 8736, 115, 100, 512, 59, 97, 6356, 6358, 32768, 8737, 2098, 6368, 6371, 6374, 6377, 6380, 6383, 6386, 6389, 59, 32768, 10664, 59, 32768, 10665, 59, 32768, 10666, 59, 32768, 10667, 59, 32768, 10668, 59, 32768, 10669, 59, 32768, 10670, 59, 32768, 10671, 116, 512, 59, 118, 6397, 6399, 32768, 8735, 98, 512, 59, 100, 6405, 6407, 32768, 8894, 59, 32768, 10653, 512, 112, 116, 6415, 6419, 104, 59, 32768, 8738, 59, 32768, 197, 97, 114, 114, 59, 32768, 9084, 512, 103, 112, 6433, 6438, 111, 110, 59, 32768, 261, 102, 59, 32896, 55349, 56658, 1792, 59, 69, 97, 101, 105, 111, 112, 6458, 6460, 6463, 6469, 6472, 6476, 6480, 32768, 8776, 59, 32768, 10864, 99, 105, 114, 59, 32768, 10863, 59, 32768, 8778, 100, 59, 32768, 8779, 115, 59, 32768, 39, 114, 111, 120, 512, 59, 101, 6488, 6490, 32768, 8776, 113, 59, 32768, 8778, 105, 110, 103, 33024, 229, 59, 32768, 229, 768, 99, 116, 121, 6509, 6514, 6517, 114, 59, 32896, 55349, 56502, 59, 32768, 42, 109, 112, 512, 59, 101, 6524, 6526, 32768, 8776, 113, 59, 32768, 8781, 105, 108, 100, 101, 33024, 227, 59, 32768, 227, 109, 108, 33024, 228, 59, 32768, 228, 512, 99, 105, 6551, 6559, 111, 110, 105, 110, 116, 59, 32768, 8755, 110, 116, 59, 32768, 10769, 4096, 78, 97, 98, 99, 100, 101, 102, 105, 107, 108, 110, 111, 112, 114, 115, 117, 6597, 6602, 6673, 6688, 6701, 6707, 6768, 6773, 6891, 6898, 6999, 7023, 7309, 7316, 7334, 7383, 111, 116, 59, 32768, 10989, 512, 99, 114, 6607, 6652, 107, 1024, 99, 101, 112, 115, 6617, 6623, 6632, 6639, 111, 110, 103, 59, 32768, 8780, 112, 115, 105, 108, 111, 110, 59, 32768, 1014, 114, 105, 109, 101, 59, 32768, 8245, 105, 109, 512, 59, 101, 6646, 6648, 32768, 8765, 113, 59, 32768, 8909, 583, 6656, 6661, 101, 101, 59, 32768, 8893, 101, 100, 512, 59, 103, 6667, 6669, 32768, 8965, 101, 59, 32768, 8965, 114, 107, 512, 59, 116, 6680, 6682, 32768, 9141, 98, 114, 107, 59, 32768, 9142, 512, 111, 121, 6693, 6698, 110, 103, 59, 32768, 8780, 59, 32768, 1073, 113, 117, 111, 59, 32768, 8222, 1280, 99, 109, 112, 114, 116, 6718, 6731, 6738, 6743, 6749, 97, 117, 115, 512, 59, 101, 6726, 6728, 32768, 8757, 59, 32768, 8757, 112, 116, 121, 118, 59, 32768, 10672, 115, 105, 59, 32768, 1014, 110, 111, 117, 59, 32768, 8492, 768, 97, 104, 119, 6756, 6759, 6762, 59, 32768, 946, 59, 32768, 8502, 101, 101, 110, 59, 32768, 8812, 114, 59, 32896, 55349, 56607, 103, 1792, 99, 111, 115, 116, 117, 118, 119, 6789, 6809, 6834, 6850, 6872, 6879, 6884, 768, 97, 105, 117, 6796, 6800, 6805, 112, 59, 32768, 8898, 114, 99, 59, 32768, 9711, 112, 59, 32768, 8899, 768, 100, 112, 116, 6816, 6821, 6827, 111, 116, 59, 32768, 10752, 108, 117, 115, 59, 32768, 10753, 105, 109, 101, 115, 59, 32768, 10754, 1090, 6840, 0, 0, 6846, 99, 117, 112, 59, 32768, 10758, 97, 114, 59, 32768, 9733, 114, 105, 97, 110, 103, 108, 101, 512, 100, 117, 6862, 6868, 111, 119, 110, 59, 32768, 9661, 112, 59, 32768, 9651, 112, 108, 117, 115, 59, 32768, 10756, 101, 101, 59, 32768, 8897, 101, 100, 103, 101, 59, 32768, 8896, 97, 114, 111, 119, 59, 32768, 10509, 768, 97, 107, 111, 6905, 6976, 6994, 512, 99, 110, 6910, 6972, 107, 768, 108, 115, 116, 6918, 6927, 6935, 111, 122, 101, 110, 103, 101, 59, 32768, 10731, 113, 117, 97, 114, 101, 59, 32768, 9642, 114, 105, 97, 110, 103, 108, 101, 1024, 59, 100, 108, 114, 6951, 6953, 6959, 6965, 32768, 9652, 111, 119, 110, 59, 32768, 9662, 101, 102, 116, 59, 32768, 9666, 105, 103, 104, 116, 59, 32768, 9656, 107, 59, 32768, 9251, 770, 6981, 0, 6991, 771, 6985, 0, 6988, 59, 32768, 9618, 59, 32768, 9617, 52, 59, 32768, 9619, 99, 107, 59, 32768, 9608, 512, 101, 111, 7004, 7019, 512, 59, 113, 7009, 7012, 32896, 61, 8421, 117, 105, 118, 59, 32896, 8801, 8421, 116, 59, 32768, 8976, 1024, 112, 116, 119, 120, 7032, 7037, 7049, 7055, 102, 59, 32896, 55349, 56659, 512, 59, 116, 7042, 7044, 32768, 8869, 111, 109, 59, 32768, 8869, 116, 105, 101, 59, 32768, 8904, 3072, 68, 72, 85, 86, 98, 100, 104, 109, 112, 116, 117, 118, 7080, 7101, 7126, 7147, 7182, 7187, 7208, 7233, 7240, 7246, 7253, 7274, 1024, 76, 82, 108, 114, 7089, 7092, 7095, 7098, 59, 32768, 9559, 59, 32768, 9556, 59, 32768, 9558, 59, 32768, 9555, 1280, 59, 68, 85, 100, 117, 7112, 7114, 7117, 7120, 7123, 32768, 9552, 59, 32768, 9574, 59, 32768, 9577, 59, 32768, 9572, 59, 32768, 9575, 1024, 76, 82, 108, 114, 7135, 7138, 7141, 7144, 59, 32768, 9565, 59, 32768, 9562, 59, 32768, 9564, 59, 32768, 9561, 1792, 59, 72, 76, 82, 104, 108, 114, 7162, 7164, 7167, 7170, 7173, 7176, 7179, 32768, 9553, 59, 32768, 9580, 59, 32768, 9571, 59, 32768, 9568, 59, 32768, 9579, 59, 32768, 9570, 59, 32768, 9567, 111, 120, 59, 32768, 10697, 1024, 76, 82, 108, 114, 7196, 7199, 7202, 7205, 59, 32768, 9557, 59, 32768, 9554, 59, 32768, 9488, 59, 32768, 9484, 1280, 59, 68, 85, 100, 117, 7219, 7221, 7224, 7227, 7230, 32768, 9472, 59, 32768, 9573, 59, 32768, 9576, 59, 32768, 9516, 59, 32768, 9524, 105, 110, 117, 115, 59, 32768, 8863, 108, 117, 115, 59, 32768, 8862, 105, 109, 101, 115, 59, 32768, 8864, 1024, 76, 82, 108, 114, 7262, 7265, 7268, 7271, 59, 32768, 9563, 59, 32768, 9560, 59, 32768, 9496, 59, 32768, 9492, 1792, 59, 72, 76, 82, 104, 108, 114, 7289, 7291, 7294, 7297, 7300, 7303, 7306, 32768, 9474, 59, 32768, 9578, 59, 32768, 9569, 59, 32768, 9566, 59, 32768, 9532, 59, 32768, 9508, 59, 32768, 9500, 114, 105, 109, 101, 59, 32768, 8245, 512, 101, 118, 7321, 7326, 118, 101, 59, 32768, 728, 98, 97, 114, 33024, 166, 59, 32768, 166, 1024, 99, 101, 105, 111, 7343, 7348, 7353, 7364, 114, 59, 32896, 55349, 56503, 109, 105, 59, 32768, 8271, 109, 512, 59, 101, 7359, 7361, 32768, 8765, 59, 32768, 8909, 108, 768, 59, 98, 104, 7372, 7374, 7377, 32768, 92, 59, 32768, 10693, 115, 117, 98, 59, 32768, 10184, 573, 7387, 7399, 108, 512, 59, 101, 7392, 7394, 32768, 8226, 116, 59, 32768, 8226, 112, 768, 59, 69, 101, 7406, 7408, 7411, 32768, 8782, 59, 32768, 10926, 512, 59, 113, 7416, 7418, 32768, 8783, 59, 32768, 8783, 6450, 7448, 0, 7523, 7571, 7576, 7613, 0, 7618, 7647, 0, 0, 7764, 0, 0, 7779, 0, 0, 7899, 7914, 7949, 7955, 0, 8158, 0, 8176, 768, 99, 112, 114, 7454, 7460, 7509, 117, 116, 101, 59, 32768, 263, 1536, 59, 97, 98, 99, 100, 115, 7473, 7475, 7480, 7487, 7500, 7505, 32768, 8745, 110, 100, 59, 32768, 10820, 114, 99, 117, 112, 59, 32768, 10825, 512, 97, 117, 7492, 7496, 112, 59, 32768, 10827, 112, 59, 32768, 10823, 111, 116, 59, 32768, 10816, 59, 32896, 8745, 65024, 512, 101, 111, 7514, 7518, 116, 59, 32768, 8257, 110, 59, 32768, 711, 1024, 97, 101, 105, 117, 7531, 7544, 7552, 7557, 833, 7536, 0, 7540, 115, 59, 32768, 10829, 111, 110, 59, 32768, 269, 100, 105, 108, 33024, 231, 59, 32768, 231, 114, 99, 59, 32768, 265, 112, 115, 512, 59, 115, 7564, 7566, 32768, 10828, 109, 59, 32768, 10832, 111, 116, 59, 32768, 267, 768, 100, 109, 110, 7582, 7589, 7596, 105, 108, 33024, 184, 59, 32768, 184, 112, 116, 121, 118, 59, 32768, 10674, 116, 33280, 162, 59, 101, 7603, 7605, 32768, 162, 114, 100, 111, 116, 59, 32768, 183, 114, 59, 32896, 55349, 56608, 768, 99, 101, 105, 7624, 7628, 7643, 121, 59, 32768, 1095, 99, 107, 512, 59, 109, 7635, 7637, 32768, 10003, 97, 114, 107, 59, 32768, 10003, 59, 32768, 967, 114, 1792, 59, 69, 99, 101, 102, 109, 115, 7662, 7664, 7667, 7742, 7745, 7752, 7757, 32768, 9675, 59, 32768, 10691, 768, 59, 101, 108, 7674, 7676, 7680, 32768, 710, 113, 59, 32768, 8791, 101, 1074, 7687, 0, 0, 7709, 114, 114, 111, 119, 512, 108, 114, 7695, 7701, 101, 102, 116, 59, 32768, 8634, 105, 103, 104, 116, 59, 32768, 8635, 1280, 82, 83, 97, 99, 100, 7719, 7722, 7725, 7730, 7736, 59, 32768, 174, 59, 32768, 9416, 115, 116, 59, 32768, 8859, 105, 114, 99, 59, 32768, 8858, 97, 115, 104, 59, 32768, 8861, 59, 32768, 8791, 110, 105, 110, 116, 59, 32768, 10768, 105, 100, 59, 32768, 10991, 99, 105, 114, 59, 32768, 10690, 117, 98, 115, 512, 59, 117, 7771, 7773, 32768, 9827, 105, 116, 59, 32768, 9827, 1341, 7785, 7804, 7850, 0, 7871, 111, 110, 512, 59, 101, 7791, 7793, 32768, 58, 512, 59, 113, 7798, 7800, 32768, 8788, 59, 32768, 8788, 1086, 7809, 0, 0, 7820, 97, 512, 59, 116, 7814, 7816, 32768, 44, 59, 32768, 64, 768, 59, 102, 108, 7826, 7828, 7832, 32768, 8705, 110, 59, 32768, 8728, 101, 512, 109, 120, 7838, 7844, 101, 110, 116, 59, 32768, 8705, 101, 115, 59, 32768, 8450, 824, 7854, 0, 7866, 512, 59, 100, 7858, 7860, 32768, 8773, 111, 116, 59, 32768, 10861, 110, 116, 59, 32768, 8750, 768, 102, 114, 121, 7877, 7881, 7886, 59, 32896, 55349, 56660, 111, 100, 59, 32768, 8720, 33280, 169, 59, 115, 7892, 7894, 32768, 169, 114, 59, 32768, 8471, 512, 97, 111, 7903, 7908, 114, 114, 59, 32768, 8629, 115, 115, 59, 32768, 10007, 512, 99, 117, 7918, 7923, 114, 59, 32896, 55349, 56504, 512, 98, 112, 7928, 7938, 512, 59, 101, 7933, 7935, 32768, 10959, 59, 32768, 10961, 512, 59, 101, 7943, 7945, 32768, 10960, 59, 32768, 10962, 100, 111, 116, 59, 32768, 8943, 1792, 100, 101, 108, 112, 114, 118, 119, 7969, 7983, 7996, 8009, 8057, 8147, 8152, 97, 114, 114, 512, 108, 114, 7977, 7980, 59, 32768, 10552, 59, 32768, 10549, 1089, 7989, 0, 0, 7993, 114, 59, 32768, 8926, 99, 59, 32768, 8927, 97, 114, 114, 512, 59, 112, 8004, 8006, 32768, 8630, 59, 32768, 10557, 1536, 59, 98, 99, 100, 111, 115, 8022, 8024, 8031, 8044, 8049, 8053, 32768, 8746, 114, 99, 97, 112, 59, 32768, 10824, 512, 97, 117, 8036, 8040, 112, 59, 32768, 10822, 112, 59, 32768, 10826, 111, 116, 59, 32768, 8845, 114, 59, 32768, 10821, 59, 32896, 8746, 65024, 1024, 97, 108, 114, 118, 8066, 8078, 8116, 8123, 114, 114, 512, 59, 109, 8073, 8075, 32768, 8631, 59, 32768, 10556, 121, 768, 101, 118, 119, 8086, 8104, 8109, 113, 1089, 8093, 0, 0, 8099, 114, 101, 99, 59, 32768, 8926, 117, 99, 99, 59, 32768, 8927, 101, 101, 59, 32768, 8910, 101, 100, 103, 101, 59, 32768, 8911, 101, 110, 33024, 164, 59, 32768, 164, 101, 97, 114, 114, 111, 119, 512, 108, 114, 8134, 8140, 101, 102, 116, 59, 32768, 8630, 105, 103, 104, 116, 59, 32768, 8631, 101, 101, 59, 32768, 8910, 101, 100, 59, 32768, 8911, 512, 99, 105, 8162, 8170, 111, 110, 105, 110, 116, 59, 32768, 8754, 110, 116, 59, 32768, 8753, 108, 99, 116, 121, 59, 32768, 9005, 4864, 65, 72, 97, 98, 99, 100, 101, 102, 104, 105, 106, 108, 111, 114, 115, 116, 117, 119, 122, 8221, 8226, 8231, 8267, 8282, 8296, 8327, 8351, 8366, 8379, 8466, 8471, 8487, 8621, 8647, 8676, 8697, 8712, 8720, 114, 114, 59, 32768, 8659, 97, 114, 59, 32768, 10597, 1024, 103, 108, 114, 115, 8240, 8246, 8252, 8256, 103, 101, 114, 59, 32768, 8224, 101, 116, 104, 59, 32768, 8504, 114, 59, 32768, 8595, 104, 512, 59, 118, 8262, 8264, 32768, 8208, 59, 32768, 8867, 572, 8271, 8278, 97, 114, 111, 119, 59, 32768, 10511, 97, 99, 59, 32768, 733, 512, 97, 121, 8287, 8293, 114, 111, 110, 59, 32768, 271, 59, 32768, 1076, 768, 59, 97, 111, 8303, 8305, 8320, 32768, 8518, 512, 103, 114, 8310, 8316, 103, 101, 114, 59, 32768, 8225, 114, 59, 32768, 8650, 116, 115, 101, 113, 59, 32768, 10871, 768, 103, 108, 109, 8334, 8339, 8344, 33024, 176, 59, 32768, 176, 116, 97, 59, 32768, 948, 112, 116, 121, 118, 59, 32768, 10673, 512, 105, 114, 8356, 8362, 115, 104, 116, 59, 32768, 10623, 59, 32896, 55349, 56609, 97, 114, 512, 108, 114, 8373, 8376, 59, 32768, 8643, 59, 32768, 8642, 1280, 97, 101, 103, 115, 118, 8390, 8418, 8421, 8428, 8433, 109, 768, 59, 111, 115, 8398, 8400, 8415, 32768, 8900, 110, 100, 512, 59, 115, 8407, 8409, 32768, 8900, 117, 105, 116, 59, 32768, 9830, 59, 32768, 9830, 59, 32768, 168, 97, 109, 109, 97, 59, 32768, 989, 105, 110, 59, 32768, 8946, 768, 59, 105, 111, 8440, 8442, 8461, 32768, 247, 100, 101, 33280, 247, 59, 111, 8450, 8452, 32768, 247, 110, 116, 105, 109, 101, 115, 59, 32768, 8903, 110, 120, 59, 32768, 8903, 99, 121, 59, 32768, 1106, 99, 1088, 8478, 0, 0, 8483, 114, 110, 59, 32768, 8990, 111, 112, 59, 32768, 8973, 1280, 108, 112, 116, 117, 119, 8498, 8504, 8509, 8556, 8570, 108, 97, 114, 59, 32768, 36, 102, 59, 32896, 55349, 56661, 1280, 59, 101, 109, 112, 115, 8520, 8522, 8535, 8542, 8548, 32768, 729, 113, 512, 59, 100, 8528, 8530, 32768, 8784, 111, 116, 59, 32768, 8785, 105, 110, 117, 115, 59, 32768, 8760, 108, 117, 115, 59, 32768, 8724, 113, 117, 97, 114, 101, 59, 32768, 8865, 98, 108, 101, 98, 97, 114, 119, 101, 100, 103, 101, 59, 32768, 8966, 110, 768, 97, 100, 104, 8578, 8585, 8597, 114, 114, 111, 119, 59, 32768, 8595, 111, 119, 110, 97, 114, 114, 111, 119, 115, 59, 32768, 8650, 97, 114, 112, 111, 111, 110, 512, 108, 114, 8608, 8614, 101, 102, 116, 59, 32768, 8643, 105, 103, 104, 116, 59, 32768, 8642, 563, 8625, 8633, 107, 97, 114, 111, 119, 59, 32768, 10512, 1088, 8638, 0, 0, 8643, 114, 110, 59, 32768, 8991, 111, 112, 59, 32768, 8972, 768, 99, 111, 116, 8654, 8666, 8670, 512, 114, 121, 8659, 8663, 59, 32896, 55349, 56505, 59, 32768, 1109, 108, 59, 32768, 10742, 114, 111, 107, 59, 32768, 273, 512, 100, 114, 8681, 8686, 111, 116, 59, 32768, 8945, 105, 512, 59, 102, 8692, 8694, 32768, 9663, 59, 32768, 9662, 512, 97, 104, 8702, 8707, 114, 114, 59, 32768, 8693, 97, 114, 59, 32768, 10607, 97, 110, 103, 108, 101, 59, 32768, 10662, 512, 99, 105, 8725, 8729, 121, 59, 32768, 1119, 103, 114, 97, 114, 114, 59, 32768, 10239, 4608, 68, 97, 99, 100, 101, 102, 103, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 120, 8774, 8788, 8807, 8844, 8849, 8852, 8866, 8895, 8929, 8977, 8989, 9004, 9046, 9136, 9151, 9171, 9184, 9199, 512, 68, 111, 8779, 8784, 111, 116, 59, 32768, 10871, 116, 59, 32768, 8785, 512, 99, 115, 8793, 8801, 117, 116, 101, 33024, 233, 59, 32768, 233, 116, 101, 114, 59, 32768, 10862, 1024, 97, 105, 111, 121, 8816, 8822, 8835, 8841, 114, 111, 110, 59, 32768, 283, 114, 512, 59, 99, 8828, 8830, 32768, 8790, 33024, 234, 59, 32768, 234, 108, 111, 110, 59, 32768, 8789, 59, 32768, 1101, 111, 116, 59, 32768, 279, 59, 32768, 8519, 512, 68, 114, 8857, 8862, 111, 116, 59, 32768, 8786, 59, 32896, 55349, 56610, 768, 59, 114, 115, 8873, 8875, 8883, 32768, 10906, 97, 118, 101, 33024, 232, 59, 32768, 232, 512, 59, 100, 8888, 8890, 32768, 10902, 111, 116, 59, 32768, 10904, 1024, 59, 105, 108, 115, 8904, 8906, 8914, 8917, 32768, 10905, 110, 116, 101, 114, 115, 59, 32768, 9191, 59, 32768, 8467, 512, 59, 100, 8922, 8924, 32768, 10901, 111, 116, 59, 32768, 10903, 768, 97, 112, 115, 8936, 8941, 8960, 99, 114, 59, 32768, 275, 116, 121, 768, 59, 115, 118, 8950, 8952, 8957, 32768, 8709, 101, 116, 59, 32768, 8709, 59, 32768, 8709, 112, 512, 49, 59, 8966, 8975, 516, 8970, 8973, 59, 32768, 8196, 59, 32768, 8197, 32768, 8195, 512, 103, 115, 8982, 8985, 59, 32768, 331, 112, 59, 32768, 8194, 512, 103, 112, 8994, 8999, 111, 110, 59, 32768, 281, 102, 59, 32896, 55349, 56662, 768, 97, 108, 115, 9011, 9023, 9028, 114, 512, 59, 115, 9017, 9019, 32768, 8917, 108, 59, 32768, 10723, 117, 115, 59, 32768, 10865, 105, 768, 59, 108, 118, 9036, 9038, 9043, 32768, 949, 111, 110, 59, 32768, 949, 59, 32768, 1013, 1024, 99, 115, 117, 118, 9055, 9071, 9099, 9128, 512, 105, 111, 9060, 9065, 114, 99, 59, 32768, 8790, 108, 111, 110, 59, 32768, 8789, 1082, 9077, 0, 0, 9081, 109, 59, 32768, 8770, 97, 110, 116, 512, 103, 108, 9088, 9093, 116, 114, 59, 32768, 10902, 101, 115, 115, 59, 32768, 10901, 768, 97, 101, 105, 9106, 9111, 9116, 108, 115, 59, 32768, 61, 115, 116, 59, 32768, 8799, 118, 512, 59, 68, 9122, 9124, 32768, 8801, 68, 59, 32768, 10872, 112, 97, 114, 115, 108, 59, 32768, 10725, 512, 68, 97, 9141, 9146, 111, 116, 59, 32768, 8787, 114, 114, 59, 32768, 10609, 768, 99, 100, 105, 9158, 9162, 9167, 114, 59, 32768, 8495, 111, 116, 59, 32768, 8784, 109, 59, 32768, 8770, 512, 97, 104, 9176, 9179, 59, 32768, 951, 33024, 240, 59, 32768, 240, 512, 109, 114, 9189, 9195, 108, 33024, 235, 59, 32768, 235, 111, 59, 32768, 8364, 768, 99, 105, 112, 9206, 9210, 9215, 108, 59, 32768, 33, 115, 116, 59, 32768, 8707, 512, 101, 111, 9220, 9230, 99, 116, 97, 116, 105, 111, 110, 59, 32768, 8496, 110, 101, 110, 116, 105, 97, 108, 101, 59, 32768, 8519, 4914, 9262, 0, 9276, 0, 9280, 9287, 0, 0, 9318, 9324, 0, 9331, 0, 9352, 9357, 9386, 0, 9395, 9497, 108, 108, 105, 110, 103, 100, 111, 116, 115, 101, 113, 59, 32768, 8786, 121, 59, 32768, 1092, 109, 97, 108, 101, 59, 32768, 9792, 768, 105, 108, 114, 9293, 9299, 9313, 108, 105, 103, 59, 32768, 64259, 1082, 9305, 0, 0, 9309, 103, 59, 32768, 64256, 105, 103, 59, 32768, 64260, 59, 32896, 55349, 56611, 108, 105, 103, 59, 32768, 64257, 108, 105, 103, 59, 32896, 102, 106, 768, 97, 108, 116, 9337, 9341, 9346, 116, 59, 32768, 9837, 105, 103, 59, 32768, 64258, 110, 115, 59, 32768, 9649, 111, 102, 59, 32768, 402, 833, 9361, 0, 9366, 102, 59, 32896, 55349, 56663, 512, 97, 107, 9370, 9375, 108, 108, 59, 32768, 8704, 512, 59, 118, 9380, 9382, 32768, 8916, 59, 32768, 10969, 97, 114, 116, 105, 110, 116, 59, 32768, 10765, 512, 97, 111, 9399, 9491, 512, 99, 115, 9404, 9487, 1794, 9413, 9443, 9453, 9470, 9474, 0, 9484, 1795, 9421, 9426, 9429, 9434, 9437, 0, 9440, 33024, 189, 59, 32768, 189, 59, 32768, 8531, 33024, 188, 59, 32768, 188, 59, 32768, 8533, 59, 32768, 8537, 59, 32768, 8539, 772, 9447, 0, 9450, 59, 32768, 8532, 59, 32768, 8534, 1285, 9459, 9464, 0, 0, 9467, 33024, 190, 59, 32768, 190, 59, 32768, 8535, 59, 32768, 8540, 53, 59, 32768, 8536, 775, 9478, 0, 9481, 59, 32768, 8538, 59, 32768, 8541, 56, 59, 32768, 8542, 108, 59, 32768, 8260, 119, 110, 59, 32768, 8994, 99, 114, 59, 32896, 55349, 56507, 4352, 69, 97, 98, 99, 100, 101, 102, 103, 105, 106, 108, 110, 111, 114, 115, 116, 118, 9537, 9547, 9575, 9582, 9595, 9600, 9679, 9684, 9694, 9700, 9705, 9725, 9773, 9779, 9785, 9810, 9917, 512, 59, 108, 9542, 9544, 32768, 8807, 59, 32768, 10892, 768, 99, 109, 112, 9554, 9560, 9572, 117, 116, 101, 59, 32768, 501, 109, 97, 512, 59, 100, 9567, 9569, 32768, 947, 59, 32768, 989, 59, 32768, 10886, 114, 101, 118, 101, 59, 32768, 287, 512, 105, 121, 9587, 9592, 114, 99, 59, 32768, 285, 59, 32768, 1075, 111, 116, 59, 32768, 289, 1024, 59, 108, 113, 115, 9609, 9611, 9614, 9633, 32768, 8805, 59, 32768, 8923, 768, 59, 113, 115, 9621, 9623, 9626, 32768, 8805, 59, 32768, 8807, 108, 97, 110, 116, 59, 32768, 10878, 1024, 59, 99, 100, 108, 9642, 9644, 9648, 9667, 32768, 10878, 99, 59, 32768, 10921, 111, 116, 512, 59, 111, 9655, 9657, 32768, 10880, 512, 59, 108, 9662, 9664, 32768, 10882, 59, 32768, 10884, 512, 59, 101, 9672, 9675, 32896, 8923, 65024, 115, 59, 32768, 10900, 114, 59, 32896, 55349, 56612, 512, 59, 103, 9689, 9691, 32768, 8811, 59, 32768, 8921, 109, 101, 108, 59, 32768, 8503, 99, 121, 59, 32768, 1107, 1024, 59, 69, 97, 106, 9714, 9716, 9719, 9722, 32768, 8823, 59, 32768, 10898, 59, 32768, 10917, 59, 32768, 10916, 1024, 69, 97, 101, 115, 9734, 9737, 9751, 9768, 59, 32768, 8809, 112, 512, 59, 112, 9743, 9745, 32768, 10890, 114, 111, 120, 59, 32768, 10890, 512, 59, 113, 9756, 9758, 32768, 10888, 512, 59, 113, 9763, 9765, 32768, 10888, 59, 32768, 8809, 105, 109, 59, 32768, 8935, 112, 102, 59, 32896, 55349, 56664, 97, 118, 101, 59, 32768, 96, 512, 99, 105, 9790, 9794, 114, 59, 32768, 8458, 109, 768, 59, 101, 108, 9802, 9804, 9807, 32768, 8819, 59, 32768, 10894, 59, 32768, 10896, 34304, 62, 59, 99, 100, 108, 113, 114, 9824, 9826, 9838, 9843, 9849, 9856, 32768, 62, 512, 99, 105, 9831, 9834, 59, 32768, 10919, 114, 59, 32768, 10874, 111, 116, 59, 32768, 8919, 80, 97, 114, 59, 32768, 10645, 117, 101, 115, 116, 59, 32768, 10876, 1280, 97, 100, 101, 108, 115, 9867, 9882, 9887, 9906, 9912, 833, 9872, 0, 9879, 112, 114, 111, 120, 59, 32768, 10886, 114, 59, 32768, 10616, 111, 116, 59, 32768, 8919, 113, 512, 108, 113, 9893, 9899, 101, 115, 115, 59, 32768, 8923, 108, 101, 115, 115, 59, 32768, 10892, 101, 115, 115, 59, 32768, 8823, 105, 109, 59, 32768, 8819, 512, 101, 110, 9922, 9932, 114, 116, 110, 101, 113, 113, 59, 32896, 8809, 65024, 69, 59, 32896, 8809, 65024, 2560, 65, 97, 98, 99, 101, 102, 107, 111, 115, 121, 9958, 9963, 10015, 10020, 10026, 10060, 10065, 10085, 10147, 10171, 114, 114, 59, 32768, 8660, 1024, 105, 108, 109, 114, 9972, 9978, 9982, 9988, 114, 115, 112, 59, 32768, 8202, 102, 59, 32768, 189, 105, 108, 116, 59, 32768, 8459, 512, 100, 114, 9993, 9998, 99, 121, 59, 32768, 1098, 768, 59, 99, 119, 10005, 10007, 10012, 32768, 8596, 105, 114, 59, 32768, 10568, 59, 32768, 8621, 97, 114, 59, 32768, 8463, 105, 114, 99, 59, 32768, 293, 768, 97, 108, 114, 10033, 10048, 10054, 114, 116, 115, 512, 59, 117, 10041, 10043, 32768, 9829, 105, 116, 59, 32768, 9829, 108, 105, 112, 59, 32768, 8230, 99, 111, 110, 59, 32768, 8889, 114, 59, 32896, 55349, 56613, 115, 512, 101, 119, 10071, 10078, 97, 114, 111, 119, 59, 32768, 10533, 97, 114, 111, 119, 59, 32768, 10534, 1280, 97, 109, 111, 112, 114, 10096, 10101, 10107, 10136, 10141, 114, 114, 59, 32768, 8703, 116, 104, 116, 59, 32768, 8763, 107, 512, 108, 114, 10113, 10124, 101, 102, 116, 97, 114, 114, 111, 119, 59, 32768, 8617, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8618, 102, 59, 32896, 55349, 56665, 98, 97, 114, 59, 32768, 8213, 768, 99, 108, 116, 10154, 10159, 10165, 114, 59, 32896, 55349, 56509, 97, 115, 104, 59, 32768, 8463, 114, 111, 107, 59, 32768, 295, 512, 98, 112, 10176, 10182, 117, 108, 108, 59, 32768, 8259, 104, 101, 110, 59, 32768, 8208, 5426, 10211, 0, 10220, 0, 10239, 10255, 10267, 0, 10276, 10312, 0, 0, 10318, 10371, 10458, 10485, 10491, 0, 10500, 10545, 10558, 99, 117, 116, 101, 33024, 237, 59, 32768, 237, 768, 59, 105, 121, 10226, 10228, 10235, 32768, 8291, 114, 99, 33024, 238, 59, 32768, 238, 59, 32768, 1080, 512, 99, 120, 10243, 10247, 121, 59, 32768, 1077, 99, 108, 33024, 161, 59, 32768, 161, 512, 102, 114, 10259, 10262, 59, 32768, 8660, 59, 32896, 55349, 56614, 114, 97, 118, 101, 33024, 236, 59, 32768, 236, 1024, 59, 105, 110, 111, 10284, 10286, 10300, 10306, 32768, 8520, 512, 105, 110, 10291, 10296, 110, 116, 59, 32768, 10764, 116, 59, 32768, 8749, 102, 105, 110, 59, 32768, 10716, 116, 97, 59, 32768, 8489, 108, 105, 103, 59, 32768, 307, 768, 97, 111, 112, 10324, 10361, 10365, 768, 99, 103, 116, 10331, 10335, 10357, 114, 59, 32768, 299, 768, 101, 108, 112, 10342, 10345, 10351, 59, 32768, 8465, 105, 110, 101, 59, 32768, 8464, 97, 114, 116, 59, 32768, 8465, 104, 59, 32768, 305, 102, 59, 32768, 8887, 101, 100, 59, 32768, 437, 1280, 59, 99, 102, 111, 116, 10381, 10383, 10389, 10403, 10409, 32768, 8712, 97, 114, 101, 59, 32768, 8453, 105, 110, 512, 59, 116, 10396, 10398, 32768, 8734, 105, 101, 59, 32768, 10717, 100, 111, 116, 59, 32768, 305, 1280, 59, 99, 101, 108, 112, 10420, 10422, 10427, 10444, 10451, 32768, 8747, 97, 108, 59, 32768, 8890, 512, 103, 114, 10432, 10438, 101, 114, 115, 59, 32768, 8484, 99, 97, 108, 59, 32768, 8890, 97, 114, 104, 107, 59, 32768, 10775, 114, 111, 100, 59, 32768, 10812, 1024, 99, 103, 112, 116, 10466, 10470, 10475, 10480, 121, 59, 32768, 1105, 111, 110, 59, 32768, 303, 102, 59, 32896, 55349, 56666, 97, 59, 32768, 953, 114, 111, 100, 59, 32768, 10812, 117, 101, 115, 116, 33024, 191, 59, 32768, 191, 512, 99, 105, 10504, 10509, 114, 59, 32896, 55349, 56510, 110, 1280, 59, 69, 100, 115, 118, 10521, 10523, 10526, 10531, 10541, 32768, 8712, 59, 32768, 8953, 111, 116, 59, 32768, 8949, 512, 59, 118, 10536, 10538, 32768, 8948, 59, 32768, 8947, 59, 32768, 8712, 512, 59, 105, 10549, 10551, 32768, 8290, 108, 100, 101, 59, 32768, 297, 828, 10562, 0, 10567, 99, 121, 59, 32768, 1110, 108, 33024, 239, 59, 32768, 239, 1536, 99, 102, 109, 111, 115, 117, 10585, 10598, 10603, 10609, 10615, 10630, 512, 105, 121, 10590, 10595, 114, 99, 59, 32768, 309, 59, 32768, 1081, 114, 59, 32896, 55349, 56615, 97, 116, 104, 59, 32768, 567, 112, 102, 59, 32896, 55349, 56667, 820, 10620, 0, 10625, 114, 59, 32896, 55349, 56511, 114, 99, 121, 59, 32768, 1112, 107, 99, 121, 59, 32768, 1108, 2048, 97, 99, 102, 103, 104, 106, 111, 115, 10653, 10666, 10680, 10685, 10692, 10697, 10702, 10708, 112, 112, 97, 512, 59, 118, 10661, 10663, 32768, 954, 59, 32768, 1008, 512, 101, 121, 10671, 10677, 100, 105, 108, 59, 32768, 311, 59, 32768, 1082, 114, 59, 32896, 55349, 56616, 114, 101, 101, 110, 59, 32768, 312, 99, 121, 59, 32768, 1093, 99, 121, 59, 32768, 1116, 112, 102, 59, 32896, 55349, 56668, 99, 114, 59, 32896, 55349, 56512, 5888, 65, 66, 69, 72, 97, 98, 99, 100, 101, 102, 103, 104, 106, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 10761, 10783, 10789, 10799, 10804, 10957, 11011, 11047, 11094, 11349, 11372, 11382, 11409, 11414, 11451, 11478, 11526, 11698, 11711, 11755, 11823, 11910, 11929, 768, 97, 114, 116, 10768, 10773, 10777, 114, 114, 59, 32768, 8666, 114, 59, 32768, 8656, 97, 105, 108, 59, 32768, 10523, 97, 114, 114, 59, 32768, 10510, 512, 59, 103, 10794, 10796, 32768, 8806, 59, 32768, 10891, 97, 114, 59, 32768, 10594, 4660, 10824, 0, 10830, 0, 10838, 0, 0, 0, 0, 0, 10844, 10850, 0, 10867, 10870, 10877, 0, 10933, 117, 116, 101, 59, 32768, 314, 109, 112, 116, 121, 118, 59, 32768, 10676, 114, 97, 110, 59, 32768, 8466, 98, 100, 97, 59, 32768, 955, 103, 768, 59, 100, 108, 10857, 10859, 10862, 32768, 10216, 59, 32768, 10641, 101, 59, 32768, 10216, 59, 32768, 10885, 117, 111, 33024, 171, 59, 32768, 171, 114, 2048, 59, 98, 102, 104, 108, 112, 115, 116, 10894, 10896, 10907, 10911, 10915, 10919, 10923, 10928, 32768, 8592, 512, 59, 102, 10901, 10903, 32768, 8676, 115, 59, 32768, 10527, 115, 59, 32768, 10525, 107, 59, 32768, 8617, 112, 59, 32768, 8619, 108, 59, 32768, 10553, 105, 109, 59, 32768, 10611, 108, 59, 32768, 8610, 768, 59, 97, 101, 10939, 10941, 10946, 32768, 10923, 105, 108, 59, 32768, 10521, 512, 59, 115, 10951, 10953, 32768, 10925, 59, 32896, 10925, 65024, 768, 97, 98, 114, 10964, 10969, 10974, 114, 114, 59, 32768, 10508, 114, 107, 59, 32768, 10098, 512, 97, 107, 10979, 10991, 99, 512, 101, 107, 10985, 10988, 59, 32768, 123, 59, 32768, 91, 512, 101, 115, 10996, 10999, 59, 32768, 10635, 108, 512, 100, 117, 11005, 11008, 59, 32768, 10639, 59, 32768, 10637, 1024, 97, 101, 117, 121, 11020, 11026, 11040, 11044, 114, 111, 110, 59, 32768, 318, 512, 100, 105, 11031, 11036, 105, 108, 59, 32768, 316, 108, 59, 32768, 8968, 98, 59, 32768, 123, 59, 32768, 1083, 1024, 99, 113, 114, 115, 11056, 11060, 11072, 11090, 97, 59, 32768, 10550, 117, 111, 512, 59, 114, 11067, 11069, 32768, 8220, 59, 32768, 8222, 512, 100, 117, 11077, 11083, 104, 97, 114, 59, 32768, 10599, 115, 104, 97, 114, 59, 32768, 10571, 104, 59, 32768, 8626, 1280, 59, 102, 103, 113, 115, 11105, 11107, 11228, 11231, 11250, 32768, 8804, 116, 1280, 97, 104, 108, 114, 116, 11119, 11136, 11157, 11169, 11216, 114, 114, 111, 119, 512, 59, 116, 11128, 11130, 32768, 8592, 97, 105, 108, 59, 32768, 8610, 97, 114, 112, 111, 111, 110, 512, 100, 117, 11147, 11153, 111, 119, 110, 59, 32768, 8637, 112, 59, 32768, 8636, 101, 102, 116, 97, 114, 114, 111, 119, 115, 59, 32768, 8647, 105, 103, 104, 116, 768, 97, 104, 115, 11180, 11194, 11204, 114, 114, 111, 119, 512, 59, 115, 11189, 11191, 32768, 8596, 59, 32768, 8646, 97, 114, 112, 111, 111, 110, 115, 59, 32768, 8651, 113, 117, 105, 103, 97, 114, 114, 111, 119, 59, 32768, 8621, 104, 114, 101, 101, 116, 105, 109, 101, 115, 59, 32768, 8907, 59, 32768, 8922, 768, 59, 113, 115, 11238, 11240, 11243, 32768, 8804, 59, 32768, 8806, 108, 97, 110, 116, 59, 32768, 10877, 1280, 59, 99, 100, 103, 115, 11261, 11263, 11267, 11286, 11298, 32768, 10877, 99, 59, 32768, 10920, 111, 116, 512, 59, 111, 11274, 11276, 32768, 10879, 512, 59, 114, 11281, 11283, 32768, 10881, 59, 32768, 10883, 512, 59, 101, 11291, 11294, 32896, 8922, 65024, 115, 59, 32768, 10899, 1280, 97, 100, 101, 103, 115, 11309, 11317, 11322, 11339, 11344, 112, 112, 114, 111, 120, 59, 32768, 10885, 111, 116, 59, 32768, 8918, 113, 512, 103, 113, 11328, 11333, 116, 114, 59, 32768, 8922, 103, 116, 114, 59, 32768, 10891, 116, 114, 59, 32768, 8822, 105, 109, 59, 32768, 8818, 768, 105, 108, 114, 11356, 11362, 11368, 115, 104, 116, 59, 32768, 10620, 111, 111, 114, 59, 32768, 8970, 59, 32896, 55349, 56617, 512, 59, 69, 11377, 11379, 32768, 8822, 59, 32768, 10897, 562, 11386, 11405, 114, 512, 100, 117, 11391, 11394, 59, 32768, 8637, 512, 59, 108, 11399, 11401, 32768, 8636, 59, 32768, 10602, 108, 107, 59, 32768, 9604, 99, 121, 59, 32768, 1113, 1280, 59, 97, 99, 104, 116, 11425, 11427, 11432, 11440, 11446, 32768, 8810, 114, 114, 59, 32768, 8647, 111, 114, 110, 101, 114, 59, 32768, 8990, 97, 114, 100, 59, 32768, 10603, 114, 105, 59, 32768, 9722, 512, 105, 111, 11456, 11462, 100, 111, 116, 59, 32768, 320, 117, 115, 116, 512, 59, 97, 11470, 11472, 32768, 9136, 99, 104, 101, 59, 32768, 9136, 1024, 69, 97, 101, 115, 11487, 11490, 11504, 11521, 59, 32768, 8808, 112, 512, 59, 112, 11496, 11498, 32768, 10889, 114, 111, 120, 59, 32768, 10889, 512, 59, 113, 11509, 11511, 32768, 10887, 512, 59, 113, 11516, 11518, 32768, 10887, 59, 32768, 8808, 105, 109, 59, 32768, 8934, 2048, 97, 98, 110, 111, 112, 116, 119, 122, 11543, 11556, 11561, 11616, 11640, 11660, 11667, 11680, 512, 110, 114, 11548, 11552, 103, 59, 32768, 10220, 114, 59, 32768, 8701, 114, 107, 59, 32768, 10214, 103, 768, 108, 109, 114, 11569, 11596, 11604, 101, 102, 116, 512, 97, 114, 11577, 11584, 114, 114, 111, 119, 59, 32768, 10229, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 10231, 97, 112, 115, 116, 111, 59, 32768, 10236, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 10230, 112, 97, 114, 114, 111, 119, 512, 108, 114, 11627, 11633, 101, 102, 116, 59, 32768, 8619, 105, 103, 104, 116, 59, 32768, 8620, 768, 97, 102, 108, 11647, 11651, 11655, 114, 59, 32768, 10629, 59, 32896, 55349, 56669, 117, 115, 59, 32768, 10797, 105, 109, 101, 115, 59, 32768, 10804, 562, 11671, 11676, 115, 116, 59, 32768, 8727, 97, 114, 59, 32768, 95, 768, 59, 101, 102, 11687, 11689, 11695, 32768, 9674, 110, 103, 101, 59, 32768, 9674, 59, 32768, 10731, 97, 114, 512, 59, 108, 11705, 11707, 32768, 40, 116, 59, 32768, 10643, 1280, 97, 99, 104, 109, 116, 11722, 11727, 11735, 11747, 11750, 114, 114, 59, 32768, 8646, 111, 114, 110, 101, 114, 59, 32768, 8991, 97, 114, 512, 59, 100, 11742, 11744, 32768, 8651, 59, 32768, 10605, 59, 32768, 8206, 114, 105, 59, 32768, 8895, 1536, 97, 99, 104, 105, 113, 116, 11768, 11774, 11779, 11782, 11798, 11817, 113, 117, 111, 59, 32768, 8249, 114, 59, 32896, 55349, 56513, 59, 32768, 8624, 109, 768, 59, 101, 103, 11790, 11792, 11795, 32768, 8818, 59, 32768, 10893, 59, 32768, 10895, 512, 98, 117, 11803, 11806, 59, 32768, 91, 111, 512, 59, 114, 11812, 11814, 32768, 8216, 59, 32768, 8218, 114, 111, 107, 59, 32768, 322, 34816, 60, 59, 99, 100, 104, 105, 108, 113, 114, 11841, 11843, 11855, 11860, 11866, 11872, 11878, 11885, 32768, 60, 512, 99, 105, 11848, 11851, 59, 32768, 10918, 114, 59, 32768, 10873, 111, 116, 59, 32768, 8918, 114, 101, 101, 59, 32768, 8907, 109, 101, 115, 59, 32768, 8905, 97, 114, 114, 59, 32768, 10614, 117, 101, 115, 116, 59, 32768, 10875, 512, 80, 105, 11890, 11895, 97, 114, 59, 32768, 10646, 768, 59, 101, 102, 11902, 11904, 11907, 32768, 9667, 59, 32768, 8884, 59, 32768, 9666, 114, 512, 100, 117, 11916, 11923, 115, 104, 97, 114, 59, 32768, 10570, 104, 97, 114, 59, 32768, 10598, 512, 101, 110, 11934, 11944, 114, 116, 110, 101, 113, 113, 59, 32896, 8808, 65024, 69, 59, 32896, 8808, 65024, 3584, 68, 97, 99, 100, 101, 102, 104, 105, 108, 110, 111, 112, 115, 117, 11978, 11984, 12061, 12075, 12081, 12095, 12100, 12104, 12170, 12181, 12188, 12204, 12207, 12223, 68, 111, 116, 59, 32768, 8762, 1024, 99, 108, 112, 114, 11993, 11999, 12019, 12055, 114, 33024, 175, 59, 32768, 175, 512, 101, 116, 12004, 12007, 59, 32768, 9794, 512, 59, 101, 12012, 12014, 32768, 10016, 115, 101, 59, 32768, 10016, 512, 59, 115, 12024, 12026, 32768, 8614, 116, 111, 1024, 59, 100, 108, 117, 12037, 12039, 12045, 12051, 32768, 8614, 111, 119, 110, 59, 32768, 8615, 101, 102, 116, 59, 32768, 8612, 112, 59, 32768, 8613, 107, 101, 114, 59, 32768, 9646, 512, 111, 121, 12066, 12072, 109, 109, 97, 59, 32768, 10793, 59, 32768, 1084, 97, 115, 104, 59, 32768, 8212, 97, 115, 117, 114, 101, 100, 97, 110, 103, 108, 101, 59, 32768, 8737, 114, 59, 32896, 55349, 56618, 111, 59, 32768, 8487, 768, 99, 100, 110, 12111, 12118, 12146, 114, 111, 33024, 181, 59, 32768, 181, 1024, 59, 97, 99, 100, 12127, 12129, 12134, 12139, 32768, 8739, 115, 116, 59, 32768, 42, 105, 114, 59, 32768, 10992, 111, 116, 33024, 183, 59, 32768, 183, 117, 115, 768, 59, 98, 100, 12155, 12157, 12160, 32768, 8722, 59, 32768, 8863, 512, 59, 117, 12165, 12167, 32768, 8760, 59, 32768, 10794, 564, 12174, 12178, 112, 59, 32768, 10971, 114, 59, 32768, 8230, 112, 108, 117, 115, 59, 32768, 8723, 512, 100, 112, 12193, 12199, 101, 108, 115, 59, 32768, 8871, 102, 59, 32896, 55349, 56670, 59, 32768, 8723, 512, 99, 116, 12212, 12217, 114, 59, 32896, 55349, 56514, 112, 111, 115, 59, 32768, 8766, 768, 59, 108, 109, 12230, 12232, 12240, 32768, 956, 116, 105, 109, 97, 112, 59, 32768, 8888, 97, 112, 59, 32768, 8888, 6144, 71, 76, 82, 86, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 111, 112, 114, 115, 116, 117, 118, 119, 12294, 12315, 12364, 12376, 12393, 12472, 12496, 12547, 12553, 12636, 12641, 12703, 12725, 12747, 12752, 12876, 12881, 12957, 13033, 13089, 13294, 13359, 13384, 13499, 512, 103, 116, 12299, 12303, 59, 32896, 8921, 824, 512, 59, 118, 12308, 12311, 32896, 8811, 8402, 59, 32896, 8811, 824, 768, 101, 108, 116, 12322, 12348, 12352, 102, 116, 512, 97, 114, 12329, 12336, 114, 114, 111, 119, 59, 32768, 8653, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8654, 59, 32896, 8920, 824, 512, 59, 118, 12357, 12360, 32896, 8810, 8402, 59, 32896, 8810, 824, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8655, 512, 68, 100, 12381, 12387, 97, 115, 104, 59, 32768, 8879, 97, 115, 104, 59, 32768, 8878, 1280, 98, 99, 110, 112, 116, 12404, 12409, 12415, 12420, 12452, 108, 97, 59, 32768, 8711, 117, 116, 101, 59, 32768, 324, 103, 59, 32896, 8736, 8402, 1280, 59, 69, 105, 111, 112, 12431, 12433, 12437, 12442, 12446, 32768, 8777, 59, 32896, 10864, 824, 100, 59, 32896, 8779, 824, 115, 59, 32768, 329, 114, 111, 120, 59, 32768, 8777, 117, 114, 512, 59, 97, 12459, 12461, 32768, 9838, 108, 512, 59, 115, 12467, 12469, 32768, 9838, 59, 32768, 8469, 836, 12477, 0, 12483, 112, 33024, 160, 59, 32768, 160, 109, 112, 512, 59, 101, 12489, 12492, 32896, 8782, 824, 59, 32896, 8783, 824, 1280, 97, 101, 111, 117, 121, 12507, 12519, 12525, 12540, 12544, 833, 12512, 0, 12515, 59, 32768, 10819, 111, 110, 59, 32768, 328, 100, 105, 108, 59, 32768, 326, 110, 103, 512, 59, 100, 12532, 12534, 32768, 8775, 111, 116, 59, 32896, 10861, 824, 112, 59, 32768, 10818, 59, 32768, 1085, 97, 115, 104, 59, 32768, 8211, 1792, 59, 65, 97, 100, 113, 115, 120, 12568, 12570, 12575, 12596, 12602, 12608, 12623, 32768, 8800, 114, 114, 59, 32768, 8663, 114, 512, 104, 114, 12581, 12585, 107, 59, 32768, 10532, 512, 59, 111, 12590, 12592, 32768, 8599, 119, 59, 32768, 8599, 111, 116, 59, 32896, 8784, 824, 117, 105, 118, 59, 32768, 8802, 512, 101, 105, 12613, 12618, 97, 114, 59, 32768, 10536, 109, 59, 32896, 8770, 824, 105, 115, 116, 512, 59, 115, 12631, 12633, 32768, 8708, 59, 32768, 8708, 114, 59, 32896, 55349, 56619, 1024, 69, 101, 115, 116, 12650, 12654, 12688, 12693, 59, 32896, 8807, 824, 768, 59, 113, 115, 12661, 12663, 12684, 32768, 8817, 768, 59, 113, 115, 12670, 12672, 12676, 32768, 8817, 59, 32896, 8807, 824, 108, 97, 110, 116, 59, 32896, 10878, 824, 59, 32896, 10878, 824, 105, 109, 59, 32768, 8821, 512, 59, 114, 12698, 12700, 32768, 8815, 59, 32768, 8815, 768, 65, 97, 112, 12710, 12715, 12720, 114, 114, 59, 32768, 8654, 114, 114, 59, 32768, 8622, 97, 114, 59, 32768, 10994, 768, 59, 115, 118, 12732, 12734, 12744, 32768, 8715, 512, 59, 100, 12739, 12741, 32768, 8956, 59, 32768, 8954, 59, 32768, 8715, 99, 121, 59, 32768, 1114, 1792, 65, 69, 97, 100, 101, 115, 116, 12767, 12772, 12776, 12781, 12785, 12853, 12858, 114, 114, 59, 32768, 8653, 59, 32896, 8806, 824, 114, 114, 59, 32768, 8602, 114, 59, 32768, 8229, 1024, 59, 102, 113, 115, 12794, 12796, 12821, 12842, 32768, 8816, 116, 512, 97, 114, 12802, 12809, 114, 114, 111, 119, 59, 32768, 8602, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8622, 768, 59, 113, 115, 12828, 12830, 12834, 32768, 8816, 59, 32896, 8806, 824, 108, 97, 110, 116, 59, 32896, 10877, 824, 512, 59, 115, 12847, 12850, 32896, 10877, 824, 59, 32768, 8814, 105, 109, 59, 32768, 8820, 512, 59, 114, 12863, 12865, 32768, 8814, 105, 512, 59, 101, 12871, 12873, 32768, 8938, 59, 32768, 8940, 105, 100, 59, 32768, 8740, 512, 112, 116, 12886, 12891, 102, 59, 32896, 55349, 56671, 33536, 172, 59, 105, 110, 12899, 12901, 12936, 32768, 172, 110, 1024, 59, 69, 100, 118, 12911, 12913, 12917, 12923, 32768, 8713, 59, 32896, 8953, 824, 111, 116, 59, 32896, 8949, 824, 818, 12928, 12931, 12934, 59, 32768, 8713, 59, 32768, 8951, 59, 32768, 8950, 105, 512, 59, 118, 12942, 12944, 32768, 8716, 818, 12949, 12952, 12955, 59, 32768, 8716, 59, 32768, 8958, 59, 32768, 8957, 768, 97, 111, 114, 12964, 12992, 12999, 114, 1024, 59, 97, 115, 116, 12974, 12976, 12983, 12988, 32768, 8742, 108, 108, 101, 108, 59, 32768, 8742, 108, 59, 32896, 11005, 8421, 59, 32896, 8706, 824, 108, 105, 110, 116, 59, 32768, 10772, 768, 59, 99, 101, 13006, 13008, 13013, 32768, 8832, 117, 101, 59, 32768, 8928, 512, 59, 99, 13018, 13021, 32896, 10927, 824, 512, 59, 101, 13026, 13028, 32768, 8832, 113, 59, 32896, 10927, 824, 1024, 65, 97, 105, 116, 13042, 13047, 13066, 13077, 114, 114, 59, 32768, 8655, 114, 114, 768, 59, 99, 119, 13056, 13058, 13062, 32768, 8603, 59, 32896, 10547, 824, 59, 32896, 8605, 824, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8603, 114, 105, 512, 59, 101, 13084, 13086, 32768, 8939, 59, 32768, 8941, 1792, 99, 104, 105, 109, 112, 113, 117, 13104, 13128, 13151, 13169, 13174, 13179, 13194, 1024, 59, 99, 101, 114, 13113, 13115, 13120, 13124, 32768, 8833, 117, 101, 59, 32768, 8929, 59, 32896, 10928, 824, 59, 32896, 55349, 56515, 111, 114, 116, 1086, 13137, 0, 0, 13142, 105, 100, 59, 32768, 8740, 97, 114, 97, 108, 108, 101, 108, 59, 32768, 8742, 109, 512, 59, 101, 13157, 13159, 32768, 8769, 512, 59, 113, 13164, 13166, 32768, 8772, 59, 32768, 8772, 105, 100, 59, 32768, 8740, 97, 114, 59, 32768, 8742, 115, 117, 512, 98, 112, 13186, 13190, 101, 59, 32768, 8930, 101, 59, 32768, 8931, 768, 98, 99, 112, 13201, 13241, 13254, 1024, 59, 69, 101, 115, 13210, 13212, 13216, 13219, 32768, 8836, 59, 32896, 10949, 824, 59, 32768, 8840, 101, 116, 512, 59, 101, 13226, 13229, 32896, 8834, 8402, 113, 512, 59, 113, 13235, 13237, 32768, 8840, 59, 32896, 10949, 824, 99, 512, 59, 101, 13247, 13249, 32768, 8833, 113, 59, 32896, 10928, 824, 1024, 59, 69, 101, 115, 13263, 13265, 13269, 13272, 32768, 8837, 59, 32896, 10950, 824, 59, 32768, 8841, 101, 116, 512, 59, 101, 13279, 13282, 32896, 8835, 8402, 113, 512, 59, 113, 13288, 13290, 32768, 8841, 59, 32896, 10950, 824, 1024, 103, 105, 108, 114, 13303, 13307, 13315, 13319, 108, 59, 32768, 8825, 108, 100, 101, 33024, 241, 59, 32768, 241, 103, 59, 32768, 8824, 105, 97, 110, 103, 108, 101, 512, 108, 114, 13330, 13344, 101, 102, 116, 512, 59, 101, 13338, 13340, 32768, 8938, 113, 59, 32768, 8940, 105, 103, 104, 116, 512, 59, 101, 13353, 13355, 32768, 8939, 113, 59, 32768, 8941, 512, 59, 109, 13364, 13366, 32768, 957, 768, 59, 101, 115, 13373, 13375, 13380, 32768, 35, 114, 111, 59, 32768, 8470, 112, 59, 32768, 8199, 2304, 68, 72, 97, 100, 103, 105, 108, 114, 115, 13403, 13409, 13415, 13420, 13426, 13439, 13446, 13476, 13493, 97, 115, 104, 59, 32768, 8877, 97, 114, 114, 59, 32768, 10500, 112, 59, 32896, 8781, 8402, 97, 115, 104, 59, 32768, 8876, 512, 101, 116, 13431, 13435, 59, 32896, 8805, 8402, 59, 32896, 62, 8402, 110, 102, 105, 110, 59, 32768, 10718, 768, 65, 101, 116, 13453, 13458, 13462, 114, 114, 59, 32768, 10498, 59, 32896, 8804, 8402, 512, 59, 114, 13467, 13470, 32896, 60, 8402, 105, 101, 59, 32896, 8884, 8402, 512, 65, 116, 13481, 13486, 114, 114, 59, 32768, 10499, 114, 105, 101, 59, 32896, 8885, 8402, 105, 109, 59, 32896, 8764, 8402, 768, 65, 97, 110, 13506, 13511, 13532, 114, 114, 59, 32768, 8662, 114, 512, 104, 114, 13517, 13521, 107, 59, 32768, 10531, 512, 59, 111, 13526, 13528, 32768, 8598, 119, 59, 32768, 8598, 101, 97, 114, 59, 32768, 10535, 9252, 13576, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13579, 0, 13596, 13617, 13653, 13659, 13673, 13695, 13708, 0, 0, 13713, 13750, 0, 13788, 13794, 0, 13815, 13890, 13913, 13937, 13944, 59, 32768, 9416, 512, 99, 115, 13583, 13591, 117, 116, 101, 33024, 243, 59, 32768, 243, 116, 59, 32768, 8859, 512, 105, 121, 13600, 13613, 114, 512, 59, 99, 13606, 13608, 32768, 8858, 33024, 244, 59, 32768, 244, 59, 32768, 1086, 1280, 97, 98, 105, 111, 115, 13627, 13632, 13638, 13642, 13646, 115, 104, 59, 32768, 8861, 108, 97, 99, 59, 32768, 337, 118, 59, 32768, 10808, 116, 59, 32768, 8857, 111, 108, 100, 59, 32768, 10684, 108, 105, 103, 59, 32768, 339, 512, 99, 114, 13663, 13668, 105, 114, 59, 32768, 10687, 59, 32896, 55349, 56620, 1600, 13680, 0, 0, 13684, 0, 13692, 110, 59, 32768, 731, 97, 118, 101, 33024, 242, 59, 32768, 242, 59, 32768, 10689, 512, 98, 109, 13699, 13704, 97, 114, 59, 32768, 10677, 59, 32768, 937, 110, 116, 59, 32768, 8750, 1024, 97, 99, 105, 116, 13721, 13726, 13741, 13746, 114, 114, 59, 32768, 8634, 512, 105, 114, 13731, 13735, 114, 59, 32768, 10686, 111, 115, 115, 59, 32768, 10683, 110, 101, 59, 32768, 8254, 59, 32768, 10688, 768, 97, 101, 105, 13756, 13761, 13766, 99, 114, 59, 32768, 333, 103, 97, 59, 32768, 969, 768, 99, 100, 110, 13773, 13779, 13782, 114, 111, 110, 59, 32768, 959, 59, 32768, 10678, 117, 115, 59, 32768, 8854, 112, 102, 59, 32896, 55349, 56672, 768, 97, 101, 108, 13800, 13804, 13809, 114, 59, 32768, 10679, 114, 112, 59, 32768, 10681, 117, 115, 59, 32768, 8853, 1792, 59, 97, 100, 105, 111, 115, 118, 13829, 13831, 13836, 13869, 13875, 13879, 13886, 32768, 8744, 114, 114, 59, 32768, 8635, 1024, 59, 101, 102, 109, 13845, 13847, 13859, 13864, 32768, 10845, 114, 512, 59, 111, 13853, 13855, 32768, 8500, 102, 59, 32768, 8500, 33024, 170, 59, 32768, 170, 33024, 186, 59, 32768, 186, 103, 111, 102, 59, 32768, 8886, 114, 59, 32768, 10838, 108, 111, 112, 101, 59, 32768, 10839, 59, 32768, 10843, 768, 99, 108, 111, 13896, 13900, 13908, 114, 59, 32768, 8500, 97, 115, 104, 33024, 248, 59, 32768, 248, 108, 59, 32768, 8856, 105, 573, 13917, 13924, 100, 101, 33024, 245, 59, 32768, 245, 101, 115, 512, 59, 97, 13930, 13932, 32768, 8855, 115, 59, 32768, 10806, 109, 108, 33024, 246, 59, 32768, 246, 98, 97, 114, 59, 32768, 9021, 5426, 13972, 0, 14013, 0, 14017, 14053, 0, 14058, 14086, 0, 0, 14107, 14199, 0, 14202, 0, 0, 14229, 14425, 0, 14438, 114, 1024, 59, 97, 115, 116, 13981, 13983, 13997, 14009, 32768, 8741, 33280, 182, 59, 108, 13989, 13991, 32768, 182, 108, 101, 108, 59, 32768, 8741, 1082, 14003, 0, 0, 14007, 109, 59, 32768, 10995, 59, 32768, 11005, 59, 32768, 8706, 121, 59, 32768, 1087, 114, 1280, 99, 105, 109, 112, 116, 14028, 14033, 14038, 14043, 14046, 110, 116, 59, 32768, 37, 111, 100, 59, 32768, 46, 105, 108, 59, 32768, 8240, 59, 32768, 8869, 101, 110, 107, 59, 32768, 8241, 114, 59, 32896, 55349, 56621, 768, 105, 109, 111, 14064, 14074, 14080, 512, 59, 118, 14069, 14071, 32768, 966, 59, 32768, 981, 109, 97, 116, 59, 32768, 8499, 110, 101, 59, 32768, 9742, 768, 59, 116, 118, 14092, 14094, 14103, 32768, 960, 99, 104, 102, 111, 114, 107, 59, 32768, 8916, 59, 32768, 982, 512, 97, 117, 14111, 14132, 110, 512, 99, 107, 14117, 14128, 107, 512, 59, 104, 14123, 14125, 32768, 8463, 59, 32768, 8462, 118, 59, 32768, 8463, 115, 2304, 59, 97, 98, 99, 100, 101, 109, 115, 116, 14152, 14154, 14160, 14163, 14168, 14179, 14182, 14188, 14193, 32768, 43, 99, 105, 114, 59, 32768, 10787, 59, 32768, 8862, 105, 114, 59, 32768, 10786, 512, 111, 117, 14173, 14176, 59, 32768, 8724, 59, 32768, 10789, 59, 32768, 10866, 110, 33024, 177, 59, 32768, 177, 105, 109, 59, 32768, 10790, 119, 111, 59, 32768, 10791, 59, 32768, 177, 768, 105, 112, 117, 14208, 14216, 14221, 110, 116, 105, 110, 116, 59, 32768, 10773, 102, 59, 32896, 55349, 56673, 110, 100, 33024, 163, 59, 32768, 163, 2560, 59, 69, 97, 99, 101, 105, 110, 111, 115, 117, 14249, 14251, 14254, 14258, 14263, 14336, 14348, 14367, 14413, 14418, 32768, 8826, 59, 32768, 10931, 112, 59, 32768, 10935, 117, 101, 59, 32768, 8828, 512, 59, 99, 14268, 14270, 32768, 10927, 1536, 59, 97, 99, 101, 110, 115, 14283, 14285, 14293, 14302, 14306, 14331, 32768, 8826, 112, 112, 114, 111, 120, 59, 32768, 10935, 117, 114, 108, 121, 101, 113, 59, 32768, 8828, 113, 59, 32768, 10927, 768, 97, 101, 115, 14313, 14321, 14326, 112, 112, 114, 111, 120, 59, 32768, 10937, 113, 113, 59, 32768, 10933, 105, 109, 59, 32768, 8936, 105, 109, 59, 32768, 8830, 109, 101, 512, 59, 115, 14343, 14345, 32768, 8242, 59, 32768, 8473, 768, 69, 97, 115, 14355, 14358, 14362, 59, 32768, 10933, 112, 59, 32768, 10937, 105, 109, 59, 32768, 8936, 768, 100, 102, 112, 14374, 14377, 14402, 59, 32768, 8719, 768, 97, 108, 115, 14384, 14390, 14396, 108, 97, 114, 59, 32768, 9006, 105, 110, 101, 59, 32768, 8978, 117, 114, 102, 59, 32768, 8979, 512, 59, 116, 14407, 14409, 32768, 8733, 111, 59, 32768, 8733, 105, 109, 59, 32768, 8830, 114, 101, 108, 59, 32768, 8880, 512, 99, 105, 14429, 14434, 114, 59, 32896, 55349, 56517, 59, 32768, 968, 110, 99, 115, 112, 59, 32768, 8200, 1536, 102, 105, 111, 112, 115, 117, 14457, 14462, 14467, 14473, 14480, 14486, 114, 59, 32896, 55349, 56622, 110, 116, 59, 32768, 10764, 112, 102, 59, 32896, 55349, 56674, 114, 105, 109, 101, 59, 32768, 8279, 99, 114, 59, 32896, 55349, 56518, 768, 97, 101, 111, 14493, 14513, 14526, 116, 512, 101, 105, 14499, 14508, 114, 110, 105, 111, 110, 115, 59, 32768, 8461, 110, 116, 59, 32768, 10774, 115, 116, 512, 59, 101, 14520, 14522, 32768, 63, 113, 59, 32768, 8799, 116, 33024, 34, 59, 32768, 34, 5376, 65, 66, 72, 97, 98, 99, 100, 101, 102, 104, 105, 108, 109, 110, 111, 112, 114, 115, 116, 117, 120, 14575, 14597, 14603, 14608, 14775, 14829, 14865, 14901, 14943, 14966, 15000, 15139, 15159, 15176, 15182, 15236, 15261, 15267, 15309, 15352, 15360, 768, 97, 114, 116, 14582, 14587, 14591, 114, 114, 59, 32768, 8667, 114, 59, 32768, 8658, 97, 105, 108, 59, 32768, 10524, 97, 114, 114, 59, 32768, 10511, 97, 114, 59, 32768, 10596, 1792, 99, 100, 101, 110, 113, 114, 116, 14623, 14637, 14642, 14650, 14672, 14679, 14751, 512, 101, 117, 14628, 14632, 59, 32896, 8765, 817, 116, 101, 59, 32768, 341, 105, 99, 59, 32768, 8730, 109, 112, 116, 121, 118, 59, 32768, 10675, 103, 1024, 59, 100, 101, 108, 14660, 14662, 14665, 14668, 32768, 10217, 59, 32768, 10642, 59, 32768, 10661, 101, 59, 32768, 10217, 117, 111, 33024, 187, 59, 32768, 187, 114, 2816, 59, 97, 98, 99, 102, 104, 108, 112, 115, 116, 119, 14703, 14705, 14709, 14720, 14723, 14727, 14731, 14735, 14739, 14744, 14748, 32768, 8594, 112, 59, 32768, 10613, 512, 59, 102, 14714, 14716, 32768, 8677, 115, 59, 32768, 10528, 59, 32768, 10547, 115, 59, 32768, 10526, 107, 59, 32768, 8618, 112, 59, 32768, 8620, 108, 59, 32768, 10565, 105, 109, 59, 32768, 10612, 108, 59, 32768, 8611, 59, 32768, 8605, 512, 97, 105, 14756, 14761, 105, 108, 59, 32768, 10522, 111, 512, 59, 110, 14767, 14769, 32768, 8758, 97, 108, 115, 59, 32768, 8474, 768, 97, 98, 114, 14782, 14787, 14792, 114, 114, 59, 32768, 10509, 114, 107, 59, 32768, 10099, 512, 97, 107, 14797, 14809, 99, 512, 101, 107, 14803, 14806, 59, 32768, 125, 59, 32768, 93, 512, 101, 115, 14814, 14817, 59, 32768, 10636, 108, 512, 100, 117, 14823, 14826, 59, 32768, 10638, 59, 32768, 10640, 1024, 97, 101, 117, 121, 14838, 14844, 14858, 14862, 114, 111, 110, 59, 32768, 345, 512, 100, 105, 14849, 14854, 105, 108, 59, 32768, 343, 108, 59, 32768, 8969, 98, 59, 32768, 125, 59, 32768, 1088, 1024, 99, 108, 113, 115, 14874, 14878, 14885, 14897, 97, 59, 32768, 10551, 100, 104, 97, 114, 59, 32768, 10601, 117, 111, 512, 59, 114, 14892, 14894, 32768, 8221, 59, 32768, 8221, 104, 59, 32768, 8627, 768, 97, 99, 103, 14908, 14934, 14938, 108, 1024, 59, 105, 112, 115, 14918, 14920, 14925, 14931, 32768, 8476, 110, 101, 59, 32768, 8475, 97, 114, 116, 59, 32768, 8476, 59, 32768, 8477, 116, 59, 32768, 9645, 33024, 174, 59, 32768, 174, 768, 105, 108, 114, 14950, 14956, 14962, 115, 104, 116, 59, 32768, 10621, 111, 111, 114, 59, 32768, 8971, 59, 32896, 55349, 56623, 512, 97, 111, 14971, 14990, 114, 512, 100, 117, 14977, 14980, 59, 32768, 8641, 512, 59, 108, 14985, 14987, 32768, 8640, 59, 32768, 10604, 512, 59, 118, 14995, 14997, 32768, 961, 59, 32768, 1009, 768, 103, 110, 115, 15007, 15123, 15127, 104, 116, 1536, 97, 104, 108, 114, 115, 116, 15022, 15039, 15060, 15086, 15099, 15111, 114, 114, 111, 119, 512, 59, 116, 15031, 15033, 32768, 8594, 97, 105, 108, 59, 32768, 8611, 97, 114, 112, 111, 111, 110, 512, 100, 117, 15050, 15056, 111, 119, 110, 59, 32768, 8641, 112, 59, 32768, 8640, 101, 102, 116, 512, 97, 104, 15068, 15076, 114, 114, 111, 119, 115, 59, 32768, 8644, 97, 114, 112, 111, 111, 110, 115, 59, 32768, 8652, 105, 103, 104, 116, 97, 114, 114, 111, 119, 115, 59, 32768, 8649, 113, 117, 105, 103, 97, 114, 114, 111, 119, 59, 32768, 8605, 104, 114, 101, 101, 116, 105, 109, 101, 115, 59, 32768, 8908, 103, 59, 32768, 730, 105, 110, 103, 100, 111, 116, 115, 101, 113, 59, 32768, 8787, 768, 97, 104, 109, 15146, 15151, 15156, 114, 114, 59, 32768, 8644, 97, 114, 59, 32768, 8652, 59, 32768, 8207, 111, 117, 115, 116, 512, 59, 97, 15168, 15170, 32768, 9137, 99, 104, 101, 59, 32768, 9137, 109, 105, 100, 59, 32768, 10990, 1024, 97, 98, 112, 116, 15191, 15204, 15209, 15229, 512, 110, 114, 15196, 15200, 103, 59, 32768, 10221, 114, 59, 32768, 8702, 114, 107, 59, 32768, 10215, 768, 97, 102, 108, 15216, 15220, 15224, 114, 59, 32768, 10630, 59, 32896, 55349, 56675, 117, 115, 59, 32768, 10798, 105, 109, 101, 115, 59, 32768, 10805, 512, 97, 112, 15241, 15253, 114, 512, 59, 103, 15247, 15249, 32768, 41, 116, 59, 32768, 10644, 111, 108, 105, 110, 116, 59, 32768, 10770, 97, 114, 114, 59, 32768, 8649, 1024, 97, 99, 104, 113, 15276, 15282, 15287, 15290, 113, 117, 111, 59, 32768, 8250, 114, 59, 32896, 55349, 56519, 59, 32768, 8625, 512, 98, 117, 15295, 15298, 59, 32768, 93, 111, 512, 59, 114, 15304, 15306, 32768, 8217, 59, 32768, 8217, 768, 104, 105, 114, 15316, 15322, 15328, 114, 101, 101, 59, 32768, 8908, 109, 101, 115, 59, 32768, 8906, 105, 1024, 59, 101, 102, 108, 15338, 15340, 15343, 15346, 32768, 9657, 59, 32768, 8885, 59, 32768, 9656, 116, 114, 105, 59, 32768, 10702, 108, 117, 104, 97, 114, 59, 32768, 10600, 59, 32768, 8478, 6706, 15391, 15398, 15404, 15499, 15516, 15592, 0, 15606, 15660, 0, 0, 15752, 15758, 0, 15827, 15863, 15886, 16000, 16006, 16038, 16086, 0, 16467, 0, 0, 16506, 99, 117, 116, 101, 59, 32768, 347, 113, 117, 111, 59, 32768, 8218, 2560, 59, 69, 97, 99, 101, 105, 110, 112, 115, 121, 15424, 15426, 15429, 15441, 15446, 15458, 15463, 15482, 15490, 15495, 32768, 8827, 59, 32768, 10932, 833, 15434, 0, 15437, 59, 32768, 10936, 111, 110, 59, 32768, 353, 117, 101, 59, 32768, 8829, 512, 59, 100, 15451, 15453, 32768, 10928, 105, 108, 59, 32768, 351, 114, 99, 59, 32768, 349, 768, 69, 97, 115, 15470, 15473, 15477, 59, 32768, 10934, 112, 59, 32768, 10938, 105, 109, 59, 32768, 8937, 111, 108, 105, 110, 116, 59, 32768, 10771, 105, 109, 59, 32768, 8831, 59, 32768, 1089, 111, 116, 768, 59, 98, 101, 15507, 15509, 15512, 32768, 8901, 59, 32768, 8865, 59, 32768, 10854, 1792, 65, 97, 99, 109, 115, 116, 120, 15530, 15535, 15556, 15562, 15566, 15572, 15587, 114, 114, 59, 32768, 8664, 114, 512, 104, 114, 15541, 15545, 107, 59, 32768, 10533, 512, 59, 111, 15550, 15552, 32768, 8600, 119, 59, 32768, 8600, 116, 33024, 167, 59, 32768, 167, 105, 59, 32768, 59, 119, 97, 114, 59, 32768, 10537, 109, 512, 105, 110, 15578, 15584, 110, 117, 115, 59, 32768, 8726, 59, 32768, 8726, 116, 59, 32768, 10038, 114, 512, 59, 111, 15597, 15600, 32896, 55349, 56624, 119, 110, 59, 32768, 8994, 1024, 97, 99, 111, 121, 15614, 15619, 15632, 15654, 114, 112, 59, 32768, 9839, 512, 104, 121, 15624, 15629, 99, 121, 59, 32768, 1097, 59, 32768, 1096, 114, 116, 1086, 15640, 0, 0, 15645, 105, 100, 59, 32768, 8739, 97, 114, 97, 108, 108, 101, 108, 59, 32768, 8741, 33024, 173, 59, 32768, 173, 512, 103, 109, 15664, 15681, 109, 97, 768, 59, 102, 118, 15673, 15675, 15678, 32768, 963, 59, 32768, 962, 59, 32768, 962, 2048, 59, 100, 101, 103, 108, 110, 112, 114, 15698, 15700, 15705, 15715, 15725, 15735, 15739, 15745, 32768, 8764, 111, 116, 59, 32768, 10858, 512, 59, 113, 15710, 15712, 32768, 8771, 59, 32768, 8771, 512, 59, 69, 15720, 15722, 32768, 10910, 59, 32768, 10912, 512, 59, 69, 15730, 15732, 32768, 10909, 59, 32768, 10911, 101, 59, 32768, 8774, 108, 117, 115, 59, 32768, 10788, 97, 114, 114, 59, 32768, 10610, 97, 114, 114, 59, 32768, 8592, 1024, 97, 101, 105, 116, 15766, 15788, 15796, 15808, 512, 108, 115, 15771, 15783, 108, 115, 101, 116, 109, 105, 110, 117, 115, 59, 32768, 8726, 104, 112, 59, 32768, 10803, 112, 97, 114, 115, 108, 59, 32768, 10724, 512, 100, 108, 15801, 15804, 59, 32768, 8739, 101, 59, 32768, 8995, 512, 59, 101, 15813, 15815, 32768, 10922, 512, 59, 115, 15820, 15822, 32768, 10924, 59, 32896, 10924, 65024, 768, 102, 108, 112, 15833, 15839, 15857, 116, 99, 121, 59, 32768, 1100, 512, 59, 98, 15844, 15846, 32768, 47, 512, 59, 97, 15851, 15853, 32768, 10692, 114, 59, 32768, 9023, 102, 59, 32896, 55349, 56676, 97, 512, 100, 114, 15868, 15882, 101, 115, 512, 59, 117, 15875, 15877, 32768, 9824, 105, 116, 59, 32768, 9824, 59, 32768, 8741, 768, 99, 115, 117, 15892, 15921, 15977, 512, 97, 117, 15897, 15909, 112, 512, 59, 115, 15903, 15905, 32768, 8851, 59, 32896, 8851, 65024, 112, 512, 59, 115, 15915, 15917, 32768, 8852, 59, 32896, 8852, 65024, 117, 512, 98, 112, 15927, 15952, 768, 59, 101, 115, 15934, 15936, 15939, 32768, 8847, 59, 32768, 8849, 101, 116, 512, 59, 101, 15946, 15948, 32768, 8847, 113, 59, 32768, 8849, 768, 59, 101, 115, 15959, 15961, 15964, 32768, 8848, 59, 32768, 8850, 101, 116, 512, 59, 101, 15971, 15973, 32768, 8848, 113, 59, 32768, 8850, 768, 59, 97, 102, 15984, 15986, 15996, 32768, 9633, 114, 566, 15991, 15994, 59, 32768, 9633, 59, 32768, 9642, 59, 32768, 9642, 97, 114, 114, 59, 32768, 8594, 1024, 99, 101, 109, 116, 16014, 16019, 16025, 16031, 114, 59, 32896, 55349, 56520, 116, 109, 110, 59, 32768, 8726, 105, 108, 101, 59, 32768, 8995, 97, 114, 102, 59, 32768, 8902, 512, 97, 114, 16042, 16053, 114, 512, 59, 102, 16048, 16050, 32768, 9734, 59, 32768, 9733, 512, 97, 110, 16058, 16081, 105, 103, 104, 116, 512, 101, 112, 16067, 16076, 112, 115, 105, 108, 111, 110, 59, 32768, 1013, 104, 105, 59, 32768, 981, 115, 59, 32768, 175, 1280, 98, 99, 109, 110, 112, 16096, 16221, 16288, 16291, 16295, 2304, 59, 69, 100, 101, 109, 110, 112, 114, 115, 16115, 16117, 16120, 16125, 16137, 16143, 16154, 16160, 16166, 32768, 8834, 59, 32768, 10949, 111, 116, 59, 32768, 10941, 512, 59, 100, 16130, 16132, 32768, 8838, 111, 116, 59, 32768, 10947, 117, 108, 116, 59, 32768, 10945, 512, 69, 101, 16148, 16151, 59, 32768, 10955, 59, 32768, 8842, 108, 117, 115, 59, 32768, 10943, 97, 114, 114, 59, 32768, 10617, 768, 101, 105, 117, 16173, 16206, 16210, 116, 768, 59, 101, 110, 16181, 16183, 16194, 32768, 8834, 113, 512, 59, 113, 16189, 16191, 32768, 8838, 59, 32768, 10949, 101, 113, 512, 59, 113, 16201, 16203, 32768, 8842, 59, 32768, 10955, 109, 59, 32768, 10951, 512, 98, 112, 16215, 16218, 59, 32768, 10965, 59, 32768, 10963, 99, 1536, 59, 97, 99, 101, 110, 115, 16235, 16237, 16245, 16254, 16258, 16283, 32768, 8827, 112, 112, 114, 111, 120, 59, 32768, 10936, 117, 114, 108, 121, 101, 113, 59, 32768, 8829, 113, 59, 32768, 10928, 768, 97, 101, 115, 16265, 16273, 16278, 112, 112, 114, 111, 120, 59, 32768, 10938, 113, 113, 59, 32768, 10934, 105, 109, 59, 32768, 8937, 105, 109, 59, 32768, 8831, 59, 32768, 8721, 103, 59, 32768, 9834, 3328, 49, 50, 51, 59, 69, 100, 101, 104, 108, 109, 110, 112, 115, 16322, 16327, 16332, 16337, 16339, 16342, 16356, 16368, 16382, 16388, 16394, 16405, 16411, 33024, 185, 59, 32768, 185, 33024, 178, 59, 32768, 178, 33024, 179, 59, 32768, 179, 32768, 8835, 59, 32768, 10950, 512, 111, 115, 16347, 16351, 116, 59, 32768, 10942, 117, 98, 59, 32768, 10968, 512, 59, 100, 16361, 16363, 32768, 8839, 111, 116, 59, 32768, 10948, 115, 512, 111, 117, 16374, 16378, 108, 59, 32768, 10185, 98, 59, 32768, 10967, 97, 114, 114, 59, 32768, 10619, 117, 108, 116, 59, 32768, 10946, 512, 69, 101, 16399, 16402, 59, 32768, 10956, 59, 32768, 8843, 108, 117, 115, 59, 32768, 10944, 768, 101, 105, 117, 16418, 16451, 16455, 116, 768, 59, 101, 110, 16426, 16428, 16439, 32768, 8835, 113, 512, 59, 113, 16434, 16436, 32768, 8839, 59, 32768, 10950, 101, 113, 512, 59, 113, 16446, 16448, 32768, 8843, 59, 32768, 10956, 109, 59, 32768, 10952, 512, 98, 112, 16460, 16463, 59, 32768, 10964, 59, 32768, 10966, 768, 65, 97, 110, 16473, 16478, 16499, 114, 114, 59, 32768, 8665, 114, 512, 104, 114, 16484, 16488, 107, 59, 32768, 10534, 512, 59, 111, 16493, 16495, 32768, 8601, 119, 59, 32768, 8601, 119, 97, 114, 59, 32768, 10538, 108, 105, 103, 33024, 223, 59, 32768, 223, 5938, 16538, 16552, 16557, 16579, 16584, 16591, 0, 16596, 16692, 0, 0, 0, 0, 0, 16731, 16780, 0, 16787, 16908, 0, 0, 0, 16938, 1091, 16543, 0, 0, 16549, 103, 101, 116, 59, 32768, 8982, 59, 32768, 964, 114, 107, 59, 32768, 9140, 768, 97, 101, 121, 16563, 16569, 16575, 114, 111, 110, 59, 32768, 357, 100, 105, 108, 59, 32768, 355, 59, 32768, 1090, 111, 116, 59, 32768, 8411, 108, 114, 101, 99, 59, 32768, 8981, 114, 59, 32896, 55349, 56625, 1024, 101, 105, 107, 111, 16604, 16641, 16670, 16684, 835, 16609, 0, 16624, 101, 512, 52, 102, 16614, 16617, 59, 32768, 8756, 111, 114, 101, 59, 32768, 8756, 97, 768, 59, 115, 118, 16631, 16633, 16638, 32768, 952, 121, 109, 59, 32768, 977, 59, 32768, 977, 512, 99, 110, 16646, 16665, 107, 512, 97, 115, 16652, 16660, 112, 112, 114, 111, 120, 59, 32768, 8776, 105, 109, 59, 32768, 8764, 115, 112, 59, 32768, 8201, 512, 97, 115, 16675, 16679, 112, 59, 32768, 8776, 105, 109, 59, 32768, 8764, 114, 110, 33024, 254, 59, 32768, 254, 829, 16696, 16701, 16727, 100, 101, 59, 32768, 732, 101, 115, 33536, 215, 59, 98, 100, 16710, 16712, 16723, 32768, 215, 512, 59, 97, 16717, 16719, 32768, 8864, 114, 59, 32768, 10801, 59, 32768, 10800, 116, 59, 32768, 8749, 768, 101, 112, 115, 16737, 16741, 16775, 97, 59, 32768, 10536, 1024, 59, 98, 99, 102, 16750, 16752, 16757, 16762, 32768, 8868, 111, 116, 59, 32768, 9014, 105, 114, 59, 32768, 10993, 512, 59, 111, 16767, 16770, 32896, 55349, 56677, 114, 107, 59, 32768, 10970, 97, 59, 32768, 10537, 114, 105, 109, 101, 59, 32768, 8244, 768, 97, 105, 112, 16793, 16798, 16899, 100, 101, 59, 32768, 8482, 1792, 97, 100, 101, 109, 112, 115, 116, 16813, 16868, 16873, 16876, 16883, 16889, 16893, 110, 103, 108, 101, 1280, 59, 100, 108, 113, 114, 16828, 16830, 16836, 16850, 16853, 32768, 9653, 111, 119, 110, 59, 32768, 9663, 101, 102, 116, 512, 59, 101, 16844, 16846, 32768, 9667, 113, 59, 32768, 8884, 59, 32768, 8796, 105, 103, 104, 116, 512, 59, 101, 16862, 16864, 32768, 9657, 113, 59, 32768, 8885, 111, 116, 59, 32768, 9708, 59, 32768, 8796, 105, 110, 117, 115, 59, 32768, 10810, 108, 117, 115, 59, 32768, 10809, 98, 59, 32768, 10701, 105, 109, 101, 59, 32768, 10811, 101, 122, 105, 117, 109, 59, 32768, 9186, 768, 99, 104, 116, 16914, 16926, 16931, 512, 114, 121, 16919, 16923, 59, 32896, 55349, 56521, 59, 32768, 1094, 99, 121, 59, 32768, 1115, 114, 111, 107, 59, 32768, 359, 512, 105, 111, 16942, 16947, 120, 116, 59, 32768, 8812, 104, 101, 97, 100, 512, 108, 114, 16956, 16967, 101, 102, 116, 97, 114, 114, 111, 119, 59, 32768, 8606, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 32768, 8608, 4608, 65, 72, 97, 98, 99, 100, 102, 103, 104, 108, 109, 111, 112, 114, 115, 116, 117, 119, 17016, 17021, 17026, 17043, 17057, 17072, 17095, 17110, 17119, 17139, 17172, 17187, 17202, 17290, 17330, 17336, 17365, 17381, 114, 114, 59, 32768, 8657, 97, 114, 59, 32768, 10595, 512, 99, 114, 17031, 17039, 117, 116, 101, 33024, 250, 59, 32768, 250, 114, 59, 32768, 8593, 114, 820, 17049, 0, 17053, 121, 59, 32768, 1118, 118, 101, 59, 32768, 365, 512, 105, 121, 17062, 17069, 114, 99, 33024, 251, 59, 32768, 251, 59, 32768, 1091, 768, 97, 98, 104, 17079, 17084, 17090, 114, 114, 59, 32768, 8645, 108, 97, 99, 59, 32768, 369, 97, 114, 59, 32768, 10606, 512, 105, 114, 17100, 17106, 115, 104, 116, 59, 32768, 10622, 59, 32896, 55349, 56626, 114, 97, 118, 101, 33024, 249, 59, 32768, 249, 562, 17123, 17135, 114, 512, 108, 114, 17128, 17131, 59, 32768, 8639, 59, 32768, 8638, 108, 107, 59, 32768, 9600, 512, 99, 116, 17144, 17167, 1088, 17150, 0, 0, 17163, 114, 110, 512, 59, 101, 17156, 17158, 32768, 8988, 114, 59, 32768, 8988, 111, 112, 59, 32768, 8975, 114, 105, 59, 32768, 9720, 512, 97, 108, 17177, 17182, 99, 114, 59, 32768, 363, 33024, 168, 59, 32768, 168, 512, 103, 112, 17192, 17197, 111, 110, 59, 32768, 371, 102, 59, 32896, 55349, 56678, 1536, 97, 100, 104, 108, 115, 117, 17215, 17222, 17233, 17257, 17262, 17280, 114, 114, 111, 119, 59, 32768, 8593, 111, 119, 110, 97, 114, 114, 111, 119, 59, 32768, 8597, 97, 114, 112, 111, 111, 110, 512, 108, 114, 17244, 17250, 101, 102, 116, 59, 32768, 8639, 105, 103, 104, 116, 59, 32768, 8638, 117, 115, 59, 32768, 8846, 105, 768, 59, 104, 108, 17270, 17272, 17275, 32768, 965, 59, 32768, 978, 111, 110, 59, 32768, 965, 112, 97, 114, 114, 111, 119, 115, 59, 32768, 8648, 768, 99, 105, 116, 17297, 17320, 17325, 1088, 17303, 0, 0, 17316, 114, 110, 512, 59, 101, 17309, 17311, 32768, 8989, 114, 59, 32768, 8989, 111, 112, 59, 32768, 8974, 110, 103, 59, 32768, 367, 114, 105, 59, 32768, 9721, 99, 114, 59, 32896, 55349, 56522, 768, 100, 105, 114, 17343, 17348, 17354, 111, 116, 59, 32768, 8944, 108, 100, 101, 59, 32768, 361, 105, 512, 59, 102, 17360, 17362, 32768, 9653, 59, 32768, 9652, 512, 97, 109, 17370, 17375, 114, 114, 59, 32768, 8648, 108, 33024, 252, 59, 32768, 252, 97, 110, 103, 108, 101, 59, 32768, 10663, 3840, 65, 66, 68, 97, 99, 100, 101, 102, 108, 110, 111, 112, 114, 115, 122, 17420, 17425, 17437, 17443, 17613, 17617, 17623, 17667, 17672, 17678, 17693, 17699, 17705, 17711, 17754, 114, 114, 59, 32768, 8661, 97, 114, 512, 59, 118, 17432, 17434, 32768, 10984, 59, 32768, 10985, 97, 115, 104, 59, 32768, 8872, 512, 110, 114, 17448, 17454, 103, 114, 116, 59, 32768, 10652, 1792, 101, 107, 110, 112, 114, 115, 116, 17469, 17478, 17485, 17494, 17515, 17526, 17578, 112, 115, 105, 108, 111, 110, 59, 32768, 1013, 97, 112, 112, 97, 59, 32768, 1008, 111, 116, 104, 105, 110, 103, 59, 32768, 8709, 768, 104, 105, 114, 17501, 17505, 17508, 105, 59, 32768, 981, 59, 32768, 982, 111, 112, 116, 111, 59, 32768, 8733, 512, 59, 104, 17520, 17522, 32768, 8597, 111, 59, 32768, 1009, 512, 105, 117, 17531, 17537, 103, 109, 97, 59, 32768, 962, 512, 98, 112, 17542, 17560, 115, 101, 116, 110, 101, 113, 512, 59, 113, 17553, 17556, 32896, 8842, 65024, 59, 32896, 10955, 65024, 115, 101, 116, 110, 101, 113, 512, 59, 113, 17571, 17574, 32896, 8843, 65024, 59, 32896, 10956, 65024, 512, 104, 114, 17583, 17589, 101, 116, 97, 59, 32768, 977, 105, 97, 110, 103, 108, 101, 512, 108, 114, 17600, 17606, 101, 102, 116, 59, 32768, 8882, 105, 103, 104, 116, 59, 32768, 8883, 121, 59, 32768, 1074, 97, 115, 104, 59, 32768, 8866, 768, 101, 108, 114, 17630, 17648, 17654, 768, 59, 98, 101, 17637, 17639, 17644, 32768, 8744, 97, 114, 59, 32768, 8891, 113, 59, 32768, 8794, 108, 105, 112, 59, 32768, 8942, 512, 98, 116, 17659, 17664, 97, 114, 59, 32768, 124, 59, 32768, 124, 114, 59, 32896, 55349, 56627, 116, 114, 105, 59, 32768, 8882, 115, 117, 512, 98, 112, 17685, 17689, 59, 32896, 8834, 8402, 59, 32896, 8835, 8402, 112, 102, 59, 32896, 55349, 56679, 114, 111, 112, 59, 32768, 8733, 116, 114, 105, 59, 32768, 8883, 512, 99, 117, 17716, 17721, 114, 59, 32896, 55349, 56523, 512, 98, 112, 17726, 17740, 110, 512, 69, 101, 17732, 17736, 59, 32896, 10955, 65024, 59, 32896, 8842, 65024, 110, 512, 69, 101, 17746, 17750, 59, 32896, 10956, 65024, 59, 32896, 8843, 65024, 105, 103, 122, 97, 103, 59, 32768, 10650, 1792, 99, 101, 102, 111, 112, 114, 115, 17777, 17783, 17815, 17820, 17826, 17829, 17842, 105, 114, 99, 59, 32768, 373, 512, 100, 105, 17788, 17809, 512, 98, 103, 17793, 17798, 97, 114, 59, 32768, 10847, 101, 512, 59, 113, 17804, 17806, 32768, 8743, 59, 32768, 8793, 101, 114, 112, 59, 32768, 8472, 114, 59, 32896, 55349, 56628, 112, 102, 59, 32896, 55349, 56680, 59, 32768, 8472, 512, 59, 101, 17834, 17836, 32768, 8768, 97, 116, 104, 59, 32768, 8768, 99, 114, 59, 32896, 55349, 56524, 5428, 17871, 17891, 0, 17897, 0, 17902, 17917, 0, 0, 17920, 17935, 17940, 17945, 0, 0, 17977, 17992, 0, 18008, 18024, 18029, 768, 97, 105, 117, 17877, 17881, 17886, 112, 59, 32768, 8898, 114, 99, 59, 32768, 9711, 112, 59, 32768, 8899, 116, 114, 105, 59, 32768, 9661, 114, 59, 32896, 55349, 56629, 512, 65, 97, 17906, 17911, 114, 114, 59, 32768, 10234, 114, 114, 59, 32768, 10231, 59, 32768, 958, 512, 65, 97, 17924, 17929, 114, 114, 59, 32768, 10232, 114, 114, 59, 32768, 10229, 97, 112, 59, 32768, 10236, 105, 115, 59, 32768, 8955, 768, 100, 112, 116, 17951, 17956, 17970, 111, 116, 59, 32768, 10752, 512, 102, 108, 17961, 17965, 59, 32896, 55349, 56681, 117, 115, 59, 32768, 10753, 105, 109, 101, 59, 32768, 10754, 512, 65, 97, 17981, 17986, 114, 114, 59, 32768, 10233, 114, 114, 59, 32768, 10230, 512, 99, 113, 17996, 18001, 114, 59, 32896, 55349, 56525, 99, 117, 112, 59, 32768, 10758, 512, 112, 116, 18012, 18018, 108, 117, 115, 59, 32768, 10756, 114, 105, 59, 32768, 9651, 101, 101, 59, 32768, 8897, 101, 100, 103, 101, 59, 32768, 8896, 2048, 97, 99, 101, 102, 105, 111, 115, 117, 18052, 18068, 18081, 18087, 18092, 18097, 18103, 18109, 99, 512, 117, 121, 18058, 18065, 116, 101, 33024, 253, 59, 32768, 253, 59, 32768, 1103, 512, 105, 121, 18073, 18078, 114, 99, 59, 32768, 375, 59, 32768, 1099, 110, 33024, 165, 59, 32768, 165, 114, 59, 32896, 55349, 56630, 99, 121, 59, 32768, 1111, 112, 102, 59, 32896, 55349, 56682, 99, 114, 59, 32896, 55349, 56526, 512, 99, 109, 18114, 18118, 121, 59, 32768, 1102, 108, 33024, 255, 59, 32768, 255, 2560, 97, 99, 100, 101, 102, 104, 105, 111, 115, 119, 18145, 18152, 18166, 18171, 18186, 18191, 18196, 18204, 18210, 18216, 99, 117, 116, 101, 59, 32768, 378, 512, 97, 121, 18157, 18163, 114, 111, 110, 59, 32768, 382, 59, 32768, 1079, 111, 116, 59, 32768, 380, 512, 101, 116, 18176, 18182, 116, 114, 102, 59, 32768, 8488, 97, 59, 32768, 950, 114, 59, 32896, 55349, 56631, 99, 121, 59, 32768, 1078, 103, 114, 97, 114, 114, 59, 32768, 8669, 112, 102, 59, 32896, 55349, 56683, 99, 114, 59, 32896, 55349, 56527, 512, 106, 110, 18221, 18224, 59, 32768, 8205, 106, 59, 32768, 8204]);


/***/ }),

/***/ 7938:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Generated using scripts/write-decode-map.ts
// prettier-ignore
exports["default"] = new Uint16Array([1024, 97, 103, 108, 113, 9, 23, 27, 31, 1086, 15, 0, 0, 19, 112, 59, 32768, 38, 111, 115, 59, 32768, 39, 116, 59, 32768, 62, 116, 59, 32768, 60, 117, 111, 116, 59, 32768, 34]);


/***/ }),

/***/ 4097:
/***/ ((module) => {

/**
 * A function that always returns `false`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.T
 * @example
 *
 *      R.F(); //=> false
 */
var F = function () {
  return false;
};

module.exports = F;

/***/ }),

/***/ 8554:
/***/ ((module) => {

/**
 * A function that always returns `true`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.F
 * @example
 *
 *      R.T(); //=> true
 */
var T = function () {
  return true;
};

module.exports = T;

/***/ }),

/***/ 5928:
/***/ ((module) => {

/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 *
 * If `g` is a curried ternary function and `_` is `R.__`, the following are
 * equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @name __
 * @constant
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */
module.exports = {
  '@@functional/placeholder': true
};

/***/ }),

/***/ 8100:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Adds two values.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @see R.subtract
 * @example
 *
 *      R.add(2, 3);       //=>  5
 *      R.add(7)(10);      //=> 17
 */


var add =
/*#__PURE__*/
_curry2(function add(a, b) {
  return Number(a) + Number(b);
});

module.exports = add;

/***/ }),

/***/ 8215:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Creates a new list iteration function from an existing one by adding two new
 * parameters to its callback function: the current index, and the entire list.
 *
 * This would turn, for instance, [`R.map`](#map) function into one that
 * more closely resembles `Array.prototype.map`. Note that this will only work
 * for functions in which the iteration callback function is the first
 * parameter, and where the list is the last parameter. (This latter might be
 * unimportant if the list parameter is not used.)
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Function
 * @category List
 * @sig (((a ...) -> b) ... -> [a] -> *) -> (((a ..., Int, [a]) -> b) ... -> [a] -> *)
 * @param {Function} fn A list iteration function that does not pass index or list to its callback
 * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
 * @example
 *
 *      const mapIndexed = R.addIndex(R.map);
 *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
 *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
 */


var addIndex =
/*#__PURE__*/
_curry1(function addIndex(fn) {
  return curryN(fn.length, function () {
    var idx = 0;
    var origFn = arguments[0];
    var list = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 0);

    args[0] = function () {
      var result = origFn.apply(this, _concat(arguments, [idx, list]));
      idx += 1;
      return result;
    };

    return fn.apply(this, args);
  });
});

module.exports = addIndex;

/***/ }),

/***/ 743:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Applies a function to the value at the given index of an array, returning a
 * new copy of the array with the element at the given index replaced with the
 * result of the function application.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> (a -> a) -> [a] -> [a]
 * @param {Number} idx The index.
 * @param {Function} fn The function to apply.
 * @param {Array|Arguments} list An array-like object whose value
 *        at the supplied index will be replaced.
 * @return {Array} A copy of the supplied array-like object with
 *         the element at index `idx` replaced with the value
 *         returned by applying `fn` to the existing element.
 * @see R.update
 * @example
 *
 *      R.adjust(1, R.toUpper, ['a', 'b', 'c', 'd']);      //=> ['a', 'B', 'c', 'd']
 *      R.adjust(-1, R.toUpper, ['a', 'b', 'c', 'd']);     //=> ['a', 'b', 'c', 'D']
 * @symb R.adjust(-1, f, [a, b]) = [a, f(b)]
 * @symb R.adjust(0, f, [a, b]) = [f(a), b]
 */


var adjust =
/*#__PURE__*/
_curry3(function adjust(idx, fn, list) {
  var len = list.length;

  if (idx >= len || idx < -len) {
    return list;
  }

  var _idx = (len + idx) % len;

  var _list = _concat(list);

  _list[_idx] = fn(list[_idx]);
  return _list;
});

module.exports = adjust;

/***/ }),

/***/ 6097:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xall =
/*#__PURE__*/
__nccwpck_require__(5023);
/**
 * Returns `true` if all elements of the list match the predicate, `false` if
 * there are any that don't.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
 *         otherwise.
 * @see R.any, R.none, R.transduce
 * @example
 *
 *      const equals3 = R.equals(3);
 *      R.all(equals3)([3, 3, 3, 3]); //=> true
 *      R.all(equals3)([3, 3, 1, 3]); //=> false
 */


var all =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['all'], _xall, function all(fn, list) {
  var idx = 0;

  while (idx < list.length) {
    if (!fn(list[idx])) {
      return false;
    }

    idx += 1;
  }

  return true;
}));

module.exports = all;

/***/ }),

/***/ 440:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var max =
/*#__PURE__*/
__nccwpck_require__(9356);

var pluck =
/*#__PURE__*/
__nccwpck_require__(7413);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);
/**
 * Takes a list of predicates and returns a predicate that returns true for a
 * given list of arguments if every one of the provided predicates is satisfied
 * by those arguments.
 *
 * The function returned is a curried function whose arity matches that of the
 * highest-arity predicate.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Logic
 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
 * @param {Array} predicates An array of predicates to check
 * @return {Function} The combined predicate
 * @see R.anyPass
 * @example
 *
 *      const isQueen = R.propEq('rank', 'Q');
 *      const isSpade = R.propEq('suit', '♠︎');
 *      const isQueenOfSpades = R.allPass([isQueen, isSpade]);
 *
 *      isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
 *      isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
 */


var allPass =
/*#__PURE__*/
_curry1(function allPass(preds) {
  return curryN(reduce(max, 0, pluck('length', preds)), function () {
    var idx = 0;
    var len = preds.length;

    while (idx < len) {
      if (!preds[idx].apply(this, arguments)) {
        return false;
      }

      idx += 1;
    }

    return true;
  });
});

module.exports = allPass;

/***/ }),

/***/ 7770:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      const t = R.always('Tee');
 *      t(); //=> 'Tee'
 */


var always =
/*#__PURE__*/
_curry1(function always(val) {
  return function () {
    return val;
  };
});

module.exports = always;

/***/ }),

/***/ 4208:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns the first argument if it is falsy, otherwise the second argument.
 * Acts as the boolean `and` statement if both inputs are `Boolean`s.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any}
 * @see R.both, R.or
 * @example
 *
 *      R.and(true, true); //=> true
 *      R.and(true, false); //=> false
 *      R.and(false, true); //=> false
 *      R.and(false, false); //=> false
 */


var and =
/*#__PURE__*/
_curry2(function and(a, b) {
  return a && b;
});

module.exports = and;

/***/ }),

/***/ 8935:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _assertPromise =
/*#__PURE__*/
__nccwpck_require__(4549);
/**
 * Returns the result of applying the onSuccess function to the value inside
 * a successfully resolved promise. This is useful for working with promises
 * inside function compositions.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Function
 * @sig (a -> b) -> (Promise e a) -> (Promise e b)
 * @sig (a -> (Promise e b)) -> (Promise e a) -> (Promise e b)
 * @param {Function} onSuccess The function to apply. Can return a value or a promise of a value.
 * @param {Promise} p
 * @return {Promise} The result of calling `p.then(onSuccess)`
 * @see R.otherwise
 * @example
 *
 *      const makeQuery = email => ({ query: { email }});
 *      const fetchMember = request =>
 *        Promise.resolve({ firstName: 'Bob', lastName: 'Loblaw', id: 42 });
 *
 *      //getMemberName :: String -> Promise ({ firstName, lastName })
 *      const getMemberName = R.pipe(
 *        makeQuery,
 *        fetchMember,
 *        R.andThen(R.pick(['firstName', 'lastName']))
 *      );
 *
 *      getMemberName('bob@gmail.com').then(console.log);
 */


var andThen =
/*#__PURE__*/
_curry2(function andThen(f, p) {
  _assertPromise('andThen', p);

  return p.then(f);
});

module.exports = andThen;

/***/ }),

/***/ 4648:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xany =
/*#__PURE__*/
__nccwpck_require__(5447);
/**
 * Returns `true` if at least one of the elements of the list match the predicate,
 * `false` otherwise.
 *
 * Dispatches to the `any` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
 *         otherwise.
 * @see R.all, R.none, R.transduce
 * @example
 *
 *      const lessThan0 = R.flip(R.lt)(0);
 *      const lessThan2 = R.flip(R.lt)(2);
 *      R.any(lessThan0)([1, 2]); //=> false
 *      R.any(lessThan2)([1, 2]); //=> true
 */


var any =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['any'], _xany, function any(fn, list) {
  var idx = 0;

  while (idx < list.length) {
    if (fn(list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}));

module.exports = any;

/***/ }),

/***/ 6877:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var max =
/*#__PURE__*/
__nccwpck_require__(9356);

var pluck =
/*#__PURE__*/
__nccwpck_require__(7413);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);
/**
 * Takes a list of predicates and returns a predicate that returns true for a
 * given list of arguments if at least one of the provided predicates is
 * satisfied by those arguments.
 *
 * The function returned is a curried function whose arity matches that of the
 * highest-arity predicate.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Logic
 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
 * @param {Array} predicates An array of predicates to check
 * @return {Function} The combined predicate
 * @see R.allPass
 * @example
 *
 *      const isClub = R.propEq('suit', '♣');
 *      const isSpade = R.propEq('suit', '♠');
 *      const isBlackCard = R.anyPass([isClub, isSpade]);
 *
 *      isBlackCard({rank: '10', suit: '♣'}); //=> true
 *      isBlackCard({rank: 'Q', suit: '♠'}); //=> true
 *      isBlackCard({rank: 'Q', suit: '♦'}); //=> false
 */


var anyPass =
/*#__PURE__*/
_curry1(function anyPass(preds) {
  return curryN(reduce(max, 0, pluck('length', preds)), function () {
    var idx = 0;
    var len = preds.length;

    while (idx < len) {
      if (preds[idx].apply(this, arguments)) {
        return true;
      }

      idx += 1;
    }

    return false;
  });
});

module.exports = anyPass;

/***/ }),

/***/ 2857:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);
/**
 * ap applies a list of functions to a list of values.
 *
 * Dispatches to the `ap` method of the second argument, if present. Also
 * treats curried functions as applicatives.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig [a -> b] -> [a] -> [b]
 * @sig Apply f => f (a -> b) -> f a -> f b
 * @sig (r -> a -> b) -> (r -> a) -> (r -> b)
 * @param {*} applyF
 * @param {*} applyX
 * @return {*}
 * @example
 *
 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
 *      R.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> ["tasty pizza", "tasty salad", "PIZZA", "SALAD"]
 *
 *      // R.ap can also be used as S combinator
 *      // when only two functions are passed
 *      R.ap(R.concat, R.toUpper)('Ramda') //=> 'RamdaRAMDA'
 * @symb R.ap([f, g], [a, b]) = [f(a), f(b), g(a), g(b)]
 */


var ap =
/*#__PURE__*/
_curry2(function ap(applyF, applyX) {
  return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function (x) {
    return applyF(x)(applyX(x));
  } : _reduce(function (acc, f) {
    return _concat(acc, map(f, applyX));
  }, [], applyF);
});

module.exports = ap;

/***/ }),

/***/ 63:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _aperture =
/*#__PURE__*/
__nccwpck_require__(7914);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xaperture =
/*#__PURE__*/
__nccwpck_require__(7156);
/**
 * Returns a new list, composed of n-tuples of consecutive elements. If `n` is
 * greater than the length of the list, an empty list is returned.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig Number -> [a] -> [[a]]
 * @param {Number} n The size of the tuples to create
 * @param {Array} list The list to split into `n`-length tuples
 * @return {Array} The resulting list of `n`-length tuples
 * @see R.transduce
 * @example
 *
 *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
 *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
 */


var aperture =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xaperture, _aperture));

module.exports = aperture;

/***/ }),

/***/ 5059:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns a new list containing the contents of the given list, followed by
 * the given element.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The element to add to the end of the new list.
 * @param {Array} list The list of elements to add a new item to.
 *        list.
 * @return {Array} A new list containing the elements of the old list followed by `el`.
 * @see R.prepend
 * @example
 *
 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
 *      R.append('tests', []); //=> ['tests']
 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
 */


var append =
/*#__PURE__*/
_curry2(function append(el, list) {
  return _concat(list, [el]);
});

module.exports = append;

/***/ }),

/***/ 5062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Applies function `fn` to the argument list `args`. This is useful for
 * creating a fixed-arity function from a variadic function. `fn` should be a
 * bound function if context is significant.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> a) -> [*] -> a
 * @param {Function} fn The function which will be called with `args`
 * @param {Array} args The arguments to call `fn` with
 * @return {*} result The result, equivalent to `fn(...args)`
 * @see R.call, R.unapply
 * @example
 *
 *      const nums = [1, 2, 3, -99, 42, 6, 7];
 *      R.apply(Math.max, nums); //=> 42
 * @symb R.apply(f, [a, b, c]) = f(a, b, c)
 */


var apply =
/*#__PURE__*/
_curry2(function apply(fn, args) {
  return fn.apply(this, args);
});

module.exports = apply;

/***/ }),

/***/ 3231:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var apply =
/*#__PURE__*/
__nccwpck_require__(5062);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var max =
/*#__PURE__*/
__nccwpck_require__(9356);

var pluck =
/*#__PURE__*/
__nccwpck_require__(7413);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);

var values =
/*#__PURE__*/
__nccwpck_require__(6410); // Use custom mapValues function to avoid issues with specs that include a "map" key and R.map
// delegating calls to .map


function mapValues(fn, obj) {
  return _isArray(obj) ? obj.map(fn) : keys(obj).reduce(function (acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
}
/**
 * Given a spec object recursively mapping properties to functions, creates a
 * function producing an object of the same structure, by mapping each property
 * to the result of calling its associated function with the supplied arguments.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Function
 * @sig {k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})
 * @param {Object} spec an object recursively mapping properties to functions for
 *        producing the values for these properties.
 * @return {Function} A function that returns an object of the same structure
 * as `spec', with each property set to the value returned by calling its
 * associated function with the supplied arguments.
 * @see R.converge, R.juxt
 * @example
 *
 *      const getMetrics = R.applySpec({
 *        sum: R.add,
 *        nested: { mul: R.multiply }
 *      });
 *      getMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }
 * @symb R.applySpec({ x: f, y: { z: g } })(a, b) = { x: f(a, b), y: { z: g(a, b) } }
 */


var applySpec =
/*#__PURE__*/
_curry1(function applySpec(spec) {
  spec = mapValues(function (v) {
    return typeof v == 'function' ? v : applySpec(v);
  }, spec);
  return curryN(reduce(max, 0, pluck('length', values(spec))), function () {
    var args = arguments;
    return mapValues(function (f) {
      return apply(f, args);
    }, spec);
  });
});

module.exports = applySpec;

/***/ }),

/***/ 3395:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Takes a value and applies a function to it.
 *
 * This function is also known as the `thrush` combinator.
 *
 * @func
 * @memberOf R
 * @since v0.25.0
 * @category Function
 * @sig a -> (a -> b) -> b
 * @param {*} x The value
 * @param {Function} f The function to apply
 * @return {*} The result of applying `f` to `x`
 * @example
 *
 *      const t42 = R.applyTo(42);
 *      t42(R.identity); //=> 42
 *      t42(R.add(1)); //=> 43
 */


var applyTo =
/*#__PURE__*/
_curry2(function applyTo(x, f) {
  return f(x);
});

module.exports = applyTo;

/***/ }),

/***/ 8358:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Makes an ascending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) < fn(b), `1` if fn(b) < fn(a), otherwise `0`
 * @see R.descend
 * @example
 *
 *      const byAge = R.ascend(R.prop('age'));
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByYoungestFirst = R.sort(byAge, people);
 *        //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]
 */


var ascend =
/*#__PURE__*/
_curry3(function ascend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa < bb ? -1 : aa > bb ? 1 : 0;
});

module.exports = ascend;

/***/ }),

/***/ 3295:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var assocPath =
/*#__PURE__*/
__nccwpck_require__(9947);
/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig Idx -> a -> {k: v} -> {k: v}
 * @param {String|Number} prop The property name to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except for the changed property.
 * @see R.dissoc, R.pick
 * @example
 *
 *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
 */


var assoc =
/*#__PURE__*/
_curry3(function assoc(prop, val, obj) {
  return assocPath([prop], val, obj);
});

module.exports = assoc;

/***/ }),

/***/ 9947:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);

var _assoc =
/*#__PURE__*/
__nccwpck_require__(4702);

var isNil =
/*#__PURE__*/
__nccwpck_require__(6895);
/**
 * Makes a shallow clone of an object, setting or overriding the nodes required
 * to create the given path, and placing the specific value at the tail end of
 * that path. Note that this copies and flattens prototype properties onto the
 * new object as well. All non-primitive properties are copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> a -> {a} -> {a}
 * @param {Array} path the path to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except along the specified path.
 * @see R.dissocPath
 * @example
 *
 *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
 *
 *      // Any missing or non-object keys in path will be overridden
 *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
 */


var assocPath =
/*#__PURE__*/
_curry3(function assocPath(path, val, obj) {
  if (path.length === 0) {
    return val;
  }

  var idx = path[0];

  if (path.length > 1) {
    var nextObj = !isNil(obj) && _has(idx, obj) ? obj[idx] : _isInteger(path[1]) ? [] : {};
    val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj);
  }

  return _assoc(idx, val, obj);
});

module.exports = assocPath;

/***/ }),

/***/ 6688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var nAry =
/*#__PURE__*/
__nccwpck_require__(2843);
/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly 2 parameters. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Function
 * @sig (a -> b -> c -> ... -> z) -> ((a, b) -> z)
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity 2.
 * @see R.nAry, R.unary
 * @example
 *
 *      const takesThreeArgs = function(a, b, c) {
 *        return [a, b, c];
 *      };
 *      takesThreeArgs.length; //=> 3
 *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
 *
 *      const takesTwoArgs = R.binary(takesThreeArgs);
 *      takesTwoArgs.length; //=> 2
 *      // Only 2 arguments are passed to the wrapped function
 *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
 * @symb R.binary(f)(a, b, c) = f(a, b)
 */


var binary =
/*#__PURE__*/
_curry1(function binary(fn) {
  return nAry(2, fn);
});

module.exports = binary;

/***/ }),

/***/ 4458:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      const log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */


var bind =
/*#__PURE__*/
_curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});

module.exports = bind;

/***/ }),

/***/ 7192:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isFunction =
/*#__PURE__*/
__nccwpck_require__(5997);

var and =
/*#__PURE__*/
__nccwpck_require__(4208);

var lift =
/*#__PURE__*/
__nccwpck_require__(3934);
/**
 * A function which calls the two provided functions and returns the `&&`
 * of the results.
 * It returns the result of the first function if it is false-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * false-y value.
 *
 * In addition to functions, `R.both` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f A predicate
 * @param {Function} g Another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
 * @see R.either, R.and
 * @example
 *
 *      const gt10 = R.gt(R.__, 10)
 *      const lt20 = R.lt(R.__, 20)
 *      const f = R.both(gt10, lt20);
 *      f(15); //=> true
 *      f(30); //=> false
 *
 *      R.both(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(false)
 *      R.both([false, false, 'a'], [11]); //=> [false, false, 11]
 */


var both =
/*#__PURE__*/
_curry2(function both(f, g) {
  return _isFunction(f) ? function _both() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  } : lift(and)(f, g);
});

module.exports = both;

/***/ }),

/***/ 6689:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Returns the result of calling its first argument with the remaining
 * arguments. This is occasionally useful as a converging function for
 * [`R.converge`](#converge): the first branch can produce a function while the
 * remaining branches produce values to be passed to that function as its
 * arguments.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig ((*... -> a), *...) -> a
 * @param {Function} fn The function to apply to the remaining arguments.
 * @param {...*} args Any number of positional arguments.
 * @return {*}
 * @see R.apply
 * @example
 *
 *      R.call(R.add, 1, 2); //=> 3
 *
 *      const indentN = R.pipe(
 *        R.repeat(' '),
 *        R.join(''),
 *        R.replace(/^(?!$)/gm)
 *      );
 *
 *      const format = R.converge(
 *        R.call,
 *        [
 *          R.pipe(R.prop('indent'), indentN),
 *          R.prop('value')
 *        ]
 *      );
 *
 *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
 * @symb R.call(f, a, b) = f(a, b)
 */


var call =
/*#__PURE__*/
_curry1(function call(fn) {
  return fn.apply(this, Array.prototype.slice.call(arguments, 1));
});

module.exports = call;

/***/ }),

/***/ 8210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _makeFlat =
/*#__PURE__*/
__nccwpck_require__(7840);

var _xchain =
/*#__PURE__*/
__nccwpck_require__(3620);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);
/**
 * `chain` maps a function over a list and concatenates the results. `chain`
 * is also known as `flatMap` in some libraries.
 *
 * Dispatches to the `chain` method of the second argument, if present,
 * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
 *
 * If second argument is a function, `chain(f, g)(x)` is equivalent to `f(g(x), x)`.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain m => (a -> m b) -> m a -> m b
 * @param {Function} fn The function to map with
 * @param {Array} list The list to map over
 * @return {Array} The result of flat-mapping `list` with `fn`
 * @example
 *
 *      const duplicate = n => [n, n];
 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
 *
 *      R.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]
 */


var chain =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/chain', 'chain'], _xchain, function chain(fn, monad) {
  if (typeof monad === 'function') {
    return function (x) {
      return fn(monad(x))(x);
    };
  }

  return _makeFlat(false)(map(fn, monad));
}));

module.exports = chain;

/***/ }),

/***/ 8927:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Restricts a number to be within a range.
 *
 * Also works for other ordered types such as Strings and Dates.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Relation
 * @sig Ord a => a -> a -> a -> a
 * @param {Number} minimum The lower limit of the clamp (inclusive)
 * @param {Number} maximum The upper limit of the clamp (inclusive)
 * @param {Number} value Value to be clamped
 * @return {Number} Returns `minimum` when `val < minimum`, `maximum` when `val > maximum`, returns `val` otherwise
 * @example
 *
 *      R.clamp(1, 10, -5) // => 1
 *      R.clamp(1, 10, 15) // => 10
 *      R.clamp(1, 10, 4)  // => 4
 */


var clamp =
/*#__PURE__*/
_curry3(function clamp(min, max, value) {
  if (min > max) {
    throw new Error('min must not be greater than max in clamp(min, max, value)');
  }

  return value < min ? min : value > max ? max : value;
});

module.exports = clamp;

/***/ }),

/***/ 2675:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _clone =
/*#__PURE__*/
__nccwpck_require__(2726);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Creates a deep copy of the source that can be used in place of the source
 * object without retaining any references to it.
 * The source object may contain (nested) `Array`s and `Object`s,
 * `Number`s, `String`s, `Boolean`s and `Date`s.
 * `Function`s are assigned by reference rather than copied.
 *
 * Dispatches to a `clone` method if present.
 *
 * Note that if the source object has multiple nodes that share a reference,
 * the returned object will have the same structure, but the references will
 * be pointed to the location within the cloned value.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {*} -> {*}
 * @param {*} value The object or array to clone
 * @return {*} A deeply cloned copy of `val`
 * @example
 *
 *      const objects = [{}, {}, {}];
 *      const objectsClone = R.clone(objects);
 *      objects === objectsClone; //=> false
 *      objects[0] === objectsClone[0]; //=> false
 */


var clone =
/*#__PURE__*/
_curry1(function clone(value) {
  return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
});

module.exports = clone;

/***/ }),

/***/ 441:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);
/**
 * Splits a list into sub-lists, based on the result of calling a key-returning function on each element,
 * and grouping the results according to values returned.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> [[b]]
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} list The array to group
 * @return {Array}
 *    An array of arrays where each sub-array contains items for which
 *    the String-returning function has returned the same value.
 * @see R.groupBy, R.partition
 * @example
 *      R.collectBy(R.prop('type'), [
 *        {type: 'breakfast', item: '☕️'},
 *        {type: 'lunch', item: '🌯'},
 *        {type: 'dinner', item: '🍝'},
 *        {type: 'breakfast', item: '🥐'},
 *        {type: 'lunch', item: '🍕'}
 *      ]);
 *
 *      // [ [ {type: 'breakfast', item: '☕️'},
 *      //     {type: 'breakfast', item: '🥐'} ],
 *      //   [ {type: 'lunch', item: '🌯'},
 *      //     {type: 'lunch', item: '🍕'} ],
 *      //   [ {type: 'dinner', item: '🍝'} ] ]
 */


var collectBy =
/*#__PURE__*/
_curry2(function collectBy(fn, list) {
  var group = _reduce(function (o, x) {
    var tag = fn(x);

    if (o[tag] === undefined) {
      o[tag] = [];
    }

    o[tag].push(x);
    return o;
  }, {}, list);

  var newList = [];

  for (var tag in group) {
    newList.push(group[tag]);
  }

  return newList;
});

module.exports = collectBy;

/***/ }),

/***/ 1876:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Makes a comparator function out of a function that reports whether the first
 * element is less than the second.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b) -> Boolean) -> ((a, b) -> Number)
 * @param {Function} pred A predicate function of arity two which will return `true` if the first argument
 * is less than the second, `false` otherwise
 * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`
 * @example
 *
 *      const byAge = R.comparator((a, b) => a.age < b.age);
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByIncreasingAge = R.sort(byAge, people);
 *        //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]
 */


var comparator =
/*#__PURE__*/
_curry1(function comparator(pred) {
  return function (a, b) {
    return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
  };
});

module.exports = comparator;

/***/ }),

/***/ 2679:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var lift =
/*#__PURE__*/
__nccwpck_require__(3934);

var not =
/*#__PURE__*/
__nccwpck_require__(3991);
/**
 * Takes a function `f` and returns a function `g` such that if called with the same arguments
 * when `f` returns a "truthy" value, `g` returns `false` and when `f` returns a "falsy" value `g` returns `true`.
 *
 * `R.complement` may be applied to any functor
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> *) -> (*... -> Boolean)
 * @param {Function} f
 * @return {Function}
 * @see R.not
 * @example
 *
 *      const isNotNil = R.complement(R.isNil);
 *      R.isNil(null); //=> true
 *      isNotNil(null); //=> false
 *      R.isNil(7); //=> false
 *      isNotNil(7); //=> true
 */


var complement =
/*#__PURE__*/
lift(not);
module.exports = complement;

/***/ }),

/***/ 3651:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var pipe =
/*#__PURE__*/
__nccwpck_require__(4216);

var reverse =
/*#__PURE__*/
__nccwpck_require__(8495);
/**
 * Performs right-to-left function composition. The last argument may have
 * any arity; the remaining arguments must be unary.
 *
 * **Note:** The result of compose is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
 * @param {...Function} ...functions The functions to compose
 * @return {Function}
 * @see R.pipe
 * @example
 *
 *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
 *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
 *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
 *
 * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
 * @symb R.compose(f, g, h)(a)(b) = f(g(h(a)))(b)
 */


function compose() {
  if (arguments.length === 0) {
    throw new Error('compose requires at least one argument');
  }

  return pipe.apply(this, reverse(arguments));
}

module.exports = compose;

/***/ }),

/***/ 8592:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var pipeWith =
/*#__PURE__*/
__nccwpck_require__(7709);

var reverse =
/*#__PURE__*/
__nccwpck_require__(8495);
/**
 * Performs right-to-left function composition using transforming function. The last function may have
 * any arity; the remaining functions must be unary.
 *
 * **Note:** The result of composeWith is not automatically curried. Transforming function is not used
 * on the last argument.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((* -> *), [(y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)]) -> ((a, b, ..., n) -> z)
 * @param {Function} transformer The transforming function
 * @param {Array} functions The functions to compose
 * @return {Function}
 * @see R.compose, R.pipeWith
 * @example
 *
 *      const composeWhileNotNil = R.composeWith((f, res) => R.isNil(res) ? res : f(res));
 *
 *      composeWhileNotNil([R.inc, R.prop('age')])({age: 1}) //=> 2
 *      composeWhileNotNil([R.inc, R.prop('age')])({}) //=> undefined
 *
 * @symb R.composeWith(f)([g, h, i])(...args) = f(g, f(h, i(...args)))
 */


var composeWith =
/*#__PURE__*/
_curry2(function composeWith(xf, list) {
  return pipeWith.apply(this, [xf, reverse(list)]);
});

module.exports = composeWith;

/***/ }),

/***/ 7833:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isFunction =
/*#__PURE__*/
__nccwpck_require__(5997);

var _isString =
/*#__PURE__*/
__nccwpck_require__(9076);

var toString =
/*#__PURE__*/
__nccwpck_require__(6119);
/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: `R.concat` expects both arguments to be of the same type,
 * unlike the native `Array.prototype.concat` method. It will throw
 * an error if you `concat` an Array with a non-Array value.
 *
 * Dispatches to the `concat` method of the first argument, if present.
 * Can also concatenate two members of a [fantasy-land
 * compatible semigroup](https://github.com/fantasyland/fantasy-land#semigroup).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
 * `secondList`.
 *
 * @example
 *
 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 *      R.concat([], []); //=> []
 */


var concat =
/*#__PURE__*/
_curry2(function concat(a, b) {
  if (_isArray(a)) {
    if (_isArray(b)) {
      return a.concat(b);
    }

    throw new TypeError(toString(b) + ' is not an array');
  }

  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }

    throw new TypeError(toString(b) + ' is not a string');
  }

  if (a != null && _isFunction(a['fantasy-land/concat'])) {
    return a['fantasy-land/concat'](b);
  }

  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }

  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});

module.exports = concat;

/***/ }),

/***/ 5335:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);

var max =
/*#__PURE__*/
__nccwpck_require__(9356);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);
/**
 * Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.
 * `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments
 * to `fn` are applied to each of the predicates in turn until one returns a
 * "truthy" value, at which point `fn` returns the result of applying its
 * arguments to the corresponding transformer. If none of the predicates
 * matches, `fn` returns undefined.
 *
 * **Please note**: This is not a direct substitute for a `switch` statement.
 * Remember that both elements of every pair passed to `cond` are *functions*,
 * and `cond` returns a function.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Logic
 * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
 * @param {Array} pairs A list of [predicate, transformer]
 * @return {Function}
 * @see R.ifElse, R.unless, R.when
 * @example
 *
 *      const fn = R.cond([
 *        [R.equals(0),   R.always('water freezes at 0°C')],
 *        [R.equals(100), R.always('water boils at 100°C')],
 *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
 *      ]);
 *      fn(0); //=> 'water freezes at 0°C'
 *      fn(50); //=> 'nothing special happens at 50°C'
 *      fn(100); //=> 'water boils at 100°C'
 */


var cond =
/*#__PURE__*/
_curry1(function cond(pairs) {
  var arity = reduce(max, 0, map(function (pair) {
    return pair[0].length;
  }, pairs));
  return _arity(arity, function () {
    var idx = 0;

    while (idx < pairs.length) {
      if (pairs[idx][0].apply(this, arguments)) {
        return pairs[idx][1].apply(this, arguments);
      }

      idx += 1;
    }
  });
});

module.exports = cond;

/***/ }),

/***/ 5611:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var constructN =
/*#__PURE__*/
__nccwpck_require__(2596);
/**
 * Wraps a constructor function inside a curried function that can be called
 * with the same arguments and returns the same type.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> {*}) -> (* -> {*})
 * @param {Function} fn The constructor function to wrap.
 * @return {Function} A wrapped, curried constructor function.
 * @see R.invoker
 * @example
 *
 *      // Constructor function
 *      function Animal(kind) {
 *        this.kind = kind;
 *      };
 *      Animal.prototype.sighting = function() {
 *        return "It's a " + this.kind + "!";
 *      }
 *
 *      const AnimalConstructor = R.construct(Animal)
 *
 *      // Notice we no longer need the 'new' keyword:
 *      AnimalConstructor('Pig'); //=> {"kind": "Pig", "sighting": function (){...}};
 *
 *      const animalTypes = ["Lion", "Tiger", "Bear"];
 *      const animalSighting = R.invoker(0, 'sighting');
 *      const sightNewAnimal = R.compose(animalSighting, AnimalConstructor);
 *      R.map(sightNewAnimal, animalTypes); //=> ["It's a Lion!", "It's a Tiger!", "It's a Bear!"]
 */


var construct =
/*#__PURE__*/
_curry1(function construct(Fn) {
  return constructN(Fn.length, Fn);
});

module.exports = construct;

/***/ }),

/***/ 2596:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var curry =
/*#__PURE__*/
__nccwpck_require__(838);

var nAry =
/*#__PURE__*/
__nccwpck_require__(2843);
/**
 * Wraps a constructor function inside a curried function that can be called
 * with the same arguments and returns the same type. The arity of the function
 * returned is specified to allow using variadic constructor functions.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Function
 * @sig Number -> (* -> {*}) -> (* -> {*})
 * @param {Number} n The arity of the constructor function.
 * @param {Function} Fn The constructor function to wrap.
 * @return {Function} A wrapped, curried constructor function.
 * @example
 *
 *      // Variadic Constructor function
 *      function Salad() {
 *        this.ingredients = arguments;
 *      }
 *
 *      Salad.prototype.recipe = function() {
 *        const instructions = R.map(ingredient => 'Add a dollop of ' + ingredient, this.ingredients);
 *        return R.join('\n', instructions);
 *      };
 *
 *      const ThreeLayerSalad = R.constructN(3, Salad);
 *
 *      // Notice we no longer need the 'new' keyword, and the constructor is curried for 3 arguments.
 *      const salad = ThreeLayerSalad('Mayonnaise')('Potato Chips')('Ketchup');
 *
 *      console.log(salad.recipe());
 *      // Add a dollop of Mayonnaise
 *      // Add a dollop of Potato Chips
 *      // Add a dollop of Ketchup
 */


var constructN =
/*#__PURE__*/
_curry2(function constructN(n, Fn) {
  if (n > 10) {
    throw new Error('Constructor with greater than ten arguments');
  }

  if (n === 0) {
    return function () {
      return new Fn();
    };
  }

  return curry(nAry(n, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
    switch (arguments.length) {
      case 1:
        return new Fn($0);

      case 2:
        return new Fn($0, $1);

      case 3:
        return new Fn($0, $1, $2);

      case 4:
        return new Fn($0, $1, $2, $3);

      case 5:
        return new Fn($0, $1, $2, $3, $4);

      case 6:
        return new Fn($0, $1, $2, $3, $4, $5);

      case 7:
        return new Fn($0, $1, $2, $3, $4, $5, $6);

      case 8:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7);

      case 9:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);

      case 10:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
    }
  }));
});

module.exports = constructN;

/***/ }),

/***/ 810:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _map =
/*#__PURE__*/
__nccwpck_require__(8077);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var max =
/*#__PURE__*/
__nccwpck_require__(9356);

var pluck =
/*#__PURE__*/
__nccwpck_require__(7413);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);
/**
 * Accepts a converging function and a list of branching functions and returns
 * a new function. The arity of the new function is the same as the arity of
 * the longest branching function. When invoked, this new function is applied
 * to some arguments, and each branching function is applied to those same
 * arguments. The results of each branching function are passed as arguments
 * to the converging function to produce the return value.
 *
 * @func
 * @memberOf R
 * @since v0.4.2
 * @category Function
 * @sig ((x1, x2, ...) -> z) -> [((a, b, ...) -> x1), ((a, b, ...) -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} after A function. `after` will be invoked with the return values of
 *        `fn1` and `fn2` as its arguments.
 * @param {Array} functions A list of functions.
 * @return {Function} A new function.
 * @see R.useWith
 * @example
 *
 *      const average = R.converge(R.divide, [R.sum, R.length])
 *      average([1, 2, 3, 4, 5, 6, 7]) //=> 4
 *
 *      const strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])
 *      strangeConcat("Yodel") //=> "YODELyodel"
 *
 * @symb R.converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))
 */


var converge =
/*#__PURE__*/
_curry2(function converge(after, fns) {
  return curryN(reduce(max, 0, pluck('length', fns)), function () {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function (fn) {
      return fn.apply(context, args);
    }, fns));
  });
});

module.exports = converge;

/***/ }),

/***/ 862:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var curry =
/*#__PURE__*/
__nccwpck_require__(838);
/**
 * Returns the number of items in a given `list` matching the predicate `f`
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} predicate to match items against
 * @return {Array} list of items to count in
 * @example
 *
 *      const even = x => x % 2 == 0;
 *
 *      R.count(even, [1, 2, 3, 4, 5]); // => 2
 *      R.map(R.count(even), [[1, 1, 1], [2, 3, 4, 5], [6]]); // => [0, 2, 1]
 */


var count =
/*#__PURE__*/
curry(function (pred, list) {
  return _reduce(function (a, e) {
    return pred(e) ? a + 1 : a;
  }, 0, list);
});
module.exports = count;

/***/ }),

/***/ 1126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var reduceBy =
/*#__PURE__*/
__nccwpck_require__(5645);
/**
 * Counts the elements of a list according to how many match each value of a
 * key generated by the supplied function. Returns an object mapping the keys
 * produced by `fn` to the number of occurrences in the list. Note that all
 * keys are coerced to strings because of how JavaScript objects work.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig (a -> String) -> [a] -> {*}
 * @param {Function} fn The function used to map values to keys.
 * @param {Array} list The list to count elements from.
 * @return {Object} An object mapping keys to number of occurrences in the list.
 * @example
 *
 *      const numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
 *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
 *
 *      const letters = ['a', 'b', 'A', 'a', 'B', 'c'];
 *      R.countBy(R.toLower)(letters);   //=> {'a': 3, 'b': 2, 'c': 1}
 */


var countBy =
/*#__PURE__*/
reduceBy(function (acc, elem) {
  return acc + 1;
}, 0);
module.exports = countBy;

/***/ }),

/***/ 838:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN, R.partial
 * @example
 *
 *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      const curriedAddFourNumbers = R.curry(addFourNumbers);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */


var curry =
/*#__PURE__*/
_curry1(function curry(fn) {
  return curryN(fn.length, fn);
});

module.exports = curry;

/***/ }),

/***/ 1071:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _curryN =
/*#__PURE__*/
__nccwpck_require__(4106);
/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      const sumArgs = (...args) => R.sum(args);
 *
 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */


var curryN =
/*#__PURE__*/
_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }

  return _arity(length, _curryN(length, [], fn));
});

module.exports = curryN;

/***/ }),

/***/ 6536:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var add =
/*#__PURE__*/
__nccwpck_require__(8100);
/**
 * Decrements its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n - 1
 * @see R.inc
 * @example
 *
 *      R.dec(42); //=> 41
 */


var dec =
/*#__PURE__*/
add(-1);
module.exports = dec;

/***/ }),

/***/ 8445:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns the second argument if it is not `null`, `undefined` or `NaN`;
 * otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {a} default The default value.
 * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
 * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
 * @example
 *
 *      const defaultTo42 = R.defaultTo(42);
 *
 *      defaultTo42(null);  //=> 42
 *      defaultTo42(undefined);  //=> 42
 *      defaultTo42(false);  //=> false
 *      defaultTo42('Ramda');  //=> 'Ramda'
 *      // parseInt('string') results in NaN
 *      defaultTo42(parseInt('string')); //=> 42
 */


var defaultTo =
/*#__PURE__*/
_curry2(function defaultTo(d, v) {
  return v == null || v !== v ? d : v;
});

module.exports = defaultTo;

/***/ }),

/***/ 3144:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Makes a descending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) > fn(b), `1` if fn(b) > fn(a), otherwise `0`
 * @see R.ascend
 * @example
 *
 *      const byAge = R.descend(R.prop('age'));
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByOldestFirst = R.sort(byAge, people);
 *        //=> [{ name: 'Peter', age: 78 }, { name: 'Emma', age: 70 }, { name: 'Mikhail', age: 62 }]
 */


var descend =
/*#__PURE__*/
_curry3(function descend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa > bb ? -1 : aa < bb ? 1 : 0;
});

module.exports = descend;

/***/ }),

/***/ 7013:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _Set =
/*#__PURE__*/
__nccwpck_require__(1781);
/**
 * Finds the set (i.e. no duplicates) of all elements in the first list not
 * contained in the second list. Objects and Arrays are compared in terms of
 * value equality, not reference equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` that are not in `list2`.
 * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith, R.without
 * @example
 *
 *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
 *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
 *      R.difference([{a: 1}, {b: 2}], [{a: 1}, {c: 3}]) //=> [{b: 2}]
 */


var difference =
/*#__PURE__*/
_curry2(function difference(first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;
  var secondLen = second.length;
  var toFilterOut = new _Set();

  for (var i = 0; i < secondLen; i += 1) {
    toFilterOut.add(second[i]);
  }

  while (idx < firstLen) {
    if (toFilterOut.add(first[idx])) {
      out[out.length] = first[idx];
    }

    idx += 1;
  }

  return out;
});

module.exports = difference;

/***/ }),

/***/ 1204:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includesWith =
/*#__PURE__*/
__nccwpck_require__(3968);

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Finds the set (i.e. no duplicates) of all elements in the first list not
 * contained in the second list. Duplication is determined according to the
 * value returned by applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` that are not in `list2`.
 * @see R.difference, R.symmetricDifference, R.symmetricDifferenceWith
 * @example
 *
 *      const cmp = (x, y) => x.a === y.a;
 *      const l1 = [{a: 1}, {a: 2}, {a: 3}];
 *      const l2 = [{a: 3}, {a: 4}];
 *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
 */


var differenceWith =
/*#__PURE__*/
_curry3(function differenceWith(pred, first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;

  while (idx < firstLen) {
    if (!_includesWith(pred, first[idx], second) && !_includesWith(pred, first[idx], out)) {
      out.push(first[idx]);
    }

    idx += 1;
  }

  return out;
});

module.exports = differenceWith;

/***/ }),

/***/ 5699:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var dissocPath =
/*#__PURE__*/
__nccwpck_require__(7900);
/**
 * Returns a new object that does not contain a `prop` property.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Object
 * @sig String -> {k: v} -> {k: v}
 * @param {String} prop The name of the property to dissociate
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original but without the specified property
 * @see R.assoc, R.omit
 * @example
 *
 *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
 */


var dissoc =
/*#__PURE__*/
_curry2(function dissoc(prop, obj) {
  return dissocPath([prop], obj);
});

module.exports = dissoc;

/***/ }),

/***/ 7900:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dissoc =
/*#__PURE__*/
__nccwpck_require__(5318);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var assoc =
/*#__PURE__*/
__nccwpck_require__(3295);
/**
 * Makes a shallow clone of an object. Note that this copies and flattens
 * prototype properties onto the new object as well. All non-primitive
 * properties are copied by reference.
 *
 * @private
 * @param {String|Integer} prop The prop operating
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original.
 */


function _shallowCloneObject(prop, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    return [].concat(obj);
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  return result;
}
/**
 * Makes a shallow clone of an object, omitting the property at the given path.
 * Note that this copies and flattens prototype properties onto the new object
 * as well. All non-primitive properties are copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.11.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> {k: v} -> {k: v}
 * @param {Array} path The path to the value to omit
 * @param {Object} obj The object to clone
 * @return {Object} A new object without the property at path
 * @see R.assocPath
 * @example
 *
 *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
 */


var dissocPath =
/*#__PURE__*/
_curry2(function dissocPath(path, obj) {
  if (obj == null) {
    return obj;
  }

  switch (path.length) {
    case 0:
      return obj;

    case 1:
      return _dissoc(path[0], obj);

    default:
      var head = path[0];
      var tail = Array.prototype.slice.call(path, 1);

      if (obj[head] == null) {
        return _shallowCloneObject(head, obj);
      } else {
        return assoc(head, dissocPath(tail, obj[head]), obj);
      }

  }
});

module.exports = dissocPath;

/***/ }),

/***/ 4144:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Divides two numbers. Equivalent to `a / b`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a / b`.
 * @see R.multiply
 * @example
 *
 *      R.divide(71, 100); //=> 0.71
 *
 *      const half = R.divide(R.__, 2);
 *      half(42); //=> 21
 *
 *      const reciprocal = R.divide(1);
 *      reciprocal(4);   //=> 0.25
 */


var divide =
/*#__PURE__*/
_curry2(function divide(a, b) {
  return a / b;
});

module.exports = divide;

/***/ }),

/***/ 6769:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xdrop =
/*#__PURE__*/
__nccwpck_require__(9796);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns all but the first `n` elements of the given list, string, or
 * transducer/transformer (or object with a `drop` method).
 *
 * Dispatches to the `drop` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n
 * @param {*} list
 * @return {*} A copy of list without the first `n` elements
 * @see R.take, R.transduce, R.dropLast, R.dropWhile
 * @example
 *
 *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
 *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
 *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
 *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
 *      R.drop(3, 'ramda');               //=> 'da'
 */


var drop =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['drop'], _xdrop, function drop(n, xs) {
  return slice(Math.max(0, n), Infinity, xs);
}));

module.exports = drop;

/***/ }),

/***/ 681:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _dropLast =
/*#__PURE__*/
__nccwpck_require__(1166);

var _xdropLast =
/*#__PURE__*/
__nccwpck_require__(3750);
/**
 * Returns a list containing all but the last `n` elements of the given `list`.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n The number of elements of `list` to skip.
 * @param {Array} list The list of elements to consider.
 * @return {Array} A copy of the list with only the first `list.length - n` elements
 * @see R.takeLast, R.drop, R.dropWhile, R.dropLastWhile
 * @example
 *
 *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
 *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
 *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
 *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
 *      R.dropLast(3, 'ramda');               //=> 'ra'
 */


var dropLast =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropLast, _dropLast));

module.exports = dropLast;

/***/ }),

/***/ 9494:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _dropLastWhile =
/*#__PURE__*/
__nccwpck_require__(6204);

var _xdropLastWhile =
/*#__PURE__*/
__nccwpck_require__(6957);
/**
 * Returns a new list excluding all the tailing elements of a given list which
 * satisfy the supplied predicate function. It passes each value from the right
 * to the supplied predicate function, skipping elements until the predicate
 * function returns a `falsy` value. The predicate function is applied to one argument:
 * *(value)*.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} predicate The function to be called on each element
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array without any trailing elements that return `falsy` values from the `predicate`.
 * @see R.takeLastWhile, R.addIndex, R.drop, R.dropWhile
 * @example
 *
 *      const lteThree = x => x <= 3;
 *
 *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
 *
 *      R.dropLastWhile(x => x !== 'd' , 'Ramda'); //=> 'Ramd'
 */


var dropLastWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropLastWhile, _dropLastWhile));

module.exports = dropLastWhile;

/***/ }),

/***/ 5300:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xdropRepeatsWith =
/*#__PURE__*/
__nccwpck_require__(1349);

var dropRepeatsWith =
/*#__PURE__*/
__nccwpck_require__(6395);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);
/**
 * Returns a new list without any consecutively repeating elements.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
 */


var dropRepeats =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_dispatchable([],
/*#__PURE__*/
_xdropRepeatsWith(equals),
/*#__PURE__*/
dropRepeatsWith(equals)));

module.exports = dropRepeats;

/***/ }),

/***/ 6395:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xdropRepeatsWith =
/*#__PURE__*/
__nccwpck_require__(1349);

var last =
/*#__PURE__*/
__nccwpck_require__(3855);
/**
 * Returns a new list without any consecutively repeating elements. Equality is
 * determined by applying the supplied predicate to each pair of consecutive elements. The
 * first element in a series of equal elements will be preserved.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig ((a, a) -> Boolean) -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *      const l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
 *      R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
 */


var dropRepeatsWith =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
  var result = [];
  var idx = 1;
  var len = list.length;

  if (len !== 0) {
    result[0] = list[0];

    while (idx < len) {
      if (!pred(last(result), list[idx])) {
        result[result.length] = list[idx];
      }

      idx += 1;
    }
  }

  return result;
}));

module.exports = dropRepeatsWith;

/***/ }),

/***/ 5245:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xdropWhile =
/*#__PURE__*/
__nccwpck_require__(2591);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns a new list excluding the leading elements of a given list which
 * satisfy the supplied predicate function. It passes each value to the supplied
 * predicate function, skipping elements while the predicate function returns
 * `true`. The predicate function is applied to one argument: *(value)*.
 *
 * Dispatches to the `dropWhile` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.takeWhile, R.transduce, R.addIndex
 * @example
 *
 *      const lteTwo = x => x <= 2;
 *
 *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
 *
 *      R.dropWhile(x => x !== 'd' , 'Ramda'); //=> 'da'
 */


var dropWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['dropWhile'], _xdropWhile, function dropWhile(pred, xs) {
  var idx = 0;
  var len = xs.length;

  while (idx < len && pred(xs[idx])) {
    idx += 1;
  }

  return slice(idx, Infinity, xs);
}));

module.exports = dropWhile;

/***/ }),

/***/ 7575:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isFunction =
/*#__PURE__*/
__nccwpck_require__(5997);

var lift =
/*#__PURE__*/
__nccwpck_require__(3934);

var or =
/*#__PURE__*/
__nccwpck_require__(5283);
/**
 * A function wrapping calls to the two functions in an `||` operation,
 * returning the result of the first function if it is truth-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * truth-y value.
 *
 * In addition to functions, `R.either` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f a predicate
 * @param {Function} g another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
 * @see R.both, R.or
 * @example
 *
 *      const gt10 = x => x > 10;
 *      const even = x => x % 2 === 0;
 *      const f = R.either(gt10, even);
 *      f(101); //=> true
 *      f(8); //=> true
 *
 *      R.either(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(55)
 *      R.either([false, false, 'a'], [11]) // => [11, 11, "a"]
 */


var either =
/*#__PURE__*/
_curry2(function either(f, g) {
  return _isFunction(f) ? function _either() {
    return f.apply(this, arguments) || g.apply(this, arguments);
  } : lift(or)(f, g);
});

module.exports = either;

/***/ }),

/***/ 7063:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _isArguments =
/*#__PURE__*/
__nccwpck_require__(8989);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isObject =
/*#__PURE__*/
__nccwpck_require__(774);

var _isString =
/*#__PURE__*/
__nccwpck_require__(9076);

var _isTypedArray =
/*#__PURE__*/
__nccwpck_require__(2910);
/**
 * Returns the empty value of its argument's type. Ramda defines the empty
 * value of Array (`[]`), Object (`{}`), String (`''`),
 * TypedArray (`Uint8Array []`, `Float32Array []`, etc), and Arguments. Other
 * types are supported if they define `<Type>.empty`,
 * `<Type>.prototype.empty` or implement the
 * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
 *
 * Dispatches to the `empty` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> a
 * @param {*} x
 * @return {*}
 * @example
 *
 *      R.empty(Just(42));               //=> Nothing()
 *      R.empty([1, 2, 3]);              //=> []
 *      R.empty('unicorns');             //=> ''
 *      R.empty({x: 1, y: 2});           //=> {}
 *      R.empty(Uint8Array.from('123')); //=> Uint8Array []
 */


var empty =
/*#__PURE__*/
_curry1(function empty(x) {
  return x != null && typeof x['fantasy-land/empty'] === 'function' ? x['fantasy-land/empty']() : x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function' ? x.constructor['fantasy-land/empty']() : x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
    return arguments;
  }() : _isTypedArray(x) ? x.constructor.from('') : void 0 // else
  ;
});

module.exports = empty;

/***/ }),

/***/ 9301:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);

var takeLast =
/*#__PURE__*/
__nccwpck_require__(2816);
/**
 * Checks if a list ends with the provided sublist.
 *
 * Similarly, checks if a string ends with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} suffix
 * @param {*} list
 * @return {Boolean}
 * @see R.startsWith
 * @example
 *
 *      R.endsWith('c', 'abc')                //=> true
 *      R.endsWith('b', 'abc')                //=> false
 *      R.endsWith(['c'], ['a', 'b', 'c'])    //=> true
 *      R.endsWith(['b'], ['a', 'b', 'c'])    //=> false
 */


var endsWith =
/*#__PURE__*/
_curry2(function (suffix, list) {
  return equals(takeLast(suffix.length, list), suffix);
});

module.exports = endsWith;

/***/ }),

/***/ 8878:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);
/**
 * Takes a function and two values in its domain and returns `true` if the
 * values map to the same value in the codomain; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Relation
 * @sig (a -> b) -> a -> a -> Boolean
 * @param {Function} f
 * @param {*} x
 * @param {*} y
 * @return {Boolean}
 * @example
 *
 *      R.eqBy(Math.abs, 5, -5); //=> true
 */


var eqBy =
/*#__PURE__*/
_curry3(function eqBy(f, x, y) {
  return equals(f(x), f(y));
});

module.exports = eqBy;

/***/ }),

/***/ 8919:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);
/**
 * Reports whether two objects have the same value, in [`R.equals`](#equals)
 * terms, for the specified property. Useful as a curried predicate.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig k -> {k: v} -> {k: v} -> Boolean
 * @param {String} prop The name of the property to compare
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Boolean}
 *
 * @example
 *
 *      const o1 = { a: 1, b: 2, c: 3, d: 4 };
 *      const o2 = { a: 10, b: 20, c: 3, d: 40 };
 *      R.eqProps('a', o1, o2); //=> false
 *      R.eqProps('c', o1, o2); //=> true
 */


var eqProps =
/*#__PURE__*/
_curry3(function eqProps(prop, obj1, obj2) {
  return equals(obj1[prop], obj2[prop]);
});

module.exports = eqProps;

/***/ }),

/***/ 548:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _equals =
/*#__PURE__*/
__nccwpck_require__(1611);
/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */


var equals =
/*#__PURE__*/
_curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});

module.exports = equals;

/***/ }),

/***/ 9042:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isObject =
/*#__PURE__*/
__nccwpck_require__(774);
/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {k: (v -> v)} -> {k: v} -> {k: v}
 * @param {Object} transformations The object specifying transformation functions to apply
 *        to the object.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const tomato = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
 *      const transformations = {
 *        firstName: R.trim,
 *        lastName: R.trim, // Will not get invoked.
 *        data: {elapsed: R.add(1), remaining: R.add(-1)}
 *      };
 *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
 */


var evolve =
/*#__PURE__*/
_curry2(function evolve(transformations, object) {
  if (!_isObject(object) && !_isArray(object)) {
    return object;
  }

  var result = object instanceof Array ? [] : {};
  var transformation, key, type;

  for (key in object) {
    transformation = transformations[key];
    type = typeof transformation;
    result[key] = type === 'function' ? transformation(object[key]) : transformation && type === 'object' ? evolve(transformation, object[key]) : object[key];
  }

  return result;
});

module.exports = evolve;

/***/ }),

/***/ 983:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _filter =
/*#__PURE__*/
__nccwpck_require__(9038);

var _isObject =
/*#__PURE__*/
__nccwpck_require__(774);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _xfilter =
/*#__PURE__*/
__nccwpck_require__(8114);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */


var filter =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/filter', 'filter'], _xfilter, function (pred, filterable) {
  return _isObject(filterable) ? _reduce(function (acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }

    return acc;
  }, {}, keys(filterable)) : // else
  _filter(pred, filterable);
}));

module.exports = filter;

/***/ }),

/***/ 4683:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xfind =
/*#__PURE__*/
__nccwpck_require__(3668);
/**
 * Returns the first element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Dispatches to the `find` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 *        desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
 *      R.find(R.propEq('a', 4))(xs); //=> undefined
 */


var find =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['find'], _xfind, function find(fn, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx];
    }

    idx += 1;
  }
}));

module.exports = find;

/***/ }),

/***/ 6102:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xfindIndex =
/*#__PURE__*/
__nccwpck_require__(4571);
/**
 * Returns the index of the first element of the list which matches the
 * predicate, or `-1` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Number} The index of the element found, or `-1`.
 * @see R.transduce, R.indexOf
 * @example
 *
 *      const xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
 *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
 */


var findIndex =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindIndex, function findIndex(fn, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (fn(list[idx])) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}));

module.exports = findIndex;

/***/ }),

/***/ 3696:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xfindLast =
/*#__PURE__*/
__nccwpck_require__(1639);
/**
 * Returns the last element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1, b: 0}, {a:1, b: 1}];
 *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
 *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
 */


var findLast =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindLast, function findLast(fn, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    if (fn(list[idx])) {
      return list[idx];
    }

    idx -= 1;
  }
}));

module.exports = findLast;

/***/ }),

/***/ 7747:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xfindLastIndex =
/*#__PURE__*/
__nccwpck_require__(4674);
/**
 * Returns the index of the last element of the list which matches the
 * predicate, or `-1` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Number} The index of the element found, or `-1`.
 * @see R.transduce, R.lastIndexOf
 * @example
 *
 *      const xs = [{a: 1, b: 0}, {a:1, b: 1}];
 *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
 *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
 */


var findLastIndex =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindLastIndex, function findLastIndex(fn, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    if (fn(list[idx])) {
      return idx;
    }

    idx -= 1;
  }

  return -1;
}));

module.exports = findLastIndex;

/***/ }),

/***/ 8463:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _makeFlat =
/*#__PURE__*/
__nccwpck_require__(7840);
/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b]
 * @param {Array} list The array to consider.
 * @return {Array} The flattened list.
 * @see R.unnest
 * @example
 *
 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */


var flatten =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_makeFlat(true));

module.exports = flatten;

/***/ }),

/***/ 5804:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Returns a new function much like the supplied one, except that the first two
 * arguments' order is reversed.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)
 * @param {Function} fn The function to invoke with its first two parameters reversed.
 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
 * @example
 *
 *      const mergeThree = (a, b, c) => [].concat(a, b, c);
 *
 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
 *
 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
 * @symb R.flip(f)(a, b, c) = f(b, a, c)
 */


var flip =
/*#__PURE__*/
_curry1(function flip(fn) {
  return curryN(fn.length, function (a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});

module.exports = flip;

/***/ }),

/***/ 1154:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _checkForMethod =
/*#__PURE__*/
__nccwpck_require__(1373);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Iterate over an input `list`, calling a provided function `fn` for each
 * element in the list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.forEach` method. For more
 * details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
 * the original array. In some libraries this function is named `each`.
 *
 * Dispatches to the `forEach` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @see R.addIndex
 * @example
 *
 *      const printXPlusFive = x => console.log(x + 5);
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      // logs 6
 *      // logs 7
 *      // logs 8
 * @symb R.forEach(f, [a, b, c]) = [a, b, c]
 */


var forEach =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;

  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }

  return list;
}));

module.exports = forEach;

/***/ }),

/***/ 8941:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * Iterate over an input `object`, calling a provided function `fn` for each
 * key and value in the object.
 *
 * `fn` receives three argument: *(value, key, obj)*.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Object
 * @sig ((a, String, StrMap a) -> Any) -> StrMap a -> StrMap a
 * @param {Function} fn The function to invoke. Receives three argument, `value`, `key`, `obj`.
 * @param {Object} obj The object to iterate over.
 * @return {Object} The original object.
 * @example
 *
 *      const printKeyConcatValue = (value, key) => console.log(key + ':' + value);
 *      R.forEachObjIndexed(printKeyConcatValue, {x: 1, y: 2}); //=> {x: 1, y: 2}
 *      // logs x:1
 *      // logs y:2
 * @symb R.forEachObjIndexed(f, {x: a, y: b}) = {x: a, y: b}
 */


var forEachObjIndexed =
/*#__PURE__*/
_curry2(function forEachObjIndexed(fn, obj) {
  var keyList = keys(obj);
  var idx = 0;

  while (idx < keyList.length) {
    var key = keyList[idx];
    fn(obj[key], key, obj);
    idx += 1;
  }

  return obj;
});

module.exports = forEachObjIndexed;

/***/ }),

/***/ 3626:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Creates a new object from a list key-value pairs. If a key appears in
 * multiple pairs, the rightmost pair is included in the object.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [[k,v]] -> {k: v}
 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
 * @return {Object} The object made by pairing up `keys` and `values`.
 * @see R.toPairs, R.pair
 * @example
 *
 *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
 */


var fromPairs =
/*#__PURE__*/
_curry1(function fromPairs(pairs) {
  var result = {};
  var idx = 0;

  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }

  return result;
});

module.exports = fromPairs;

/***/ }),

/***/ 3397:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _checkForMethod =
/*#__PURE__*/
__nccwpck_require__(1373);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var reduceBy =
/*#__PURE__*/
__nccwpck_require__(5645);
/**
 * Splits a list into sub-lists stored in an object, based on the result of
 * calling a key-returning function on each element, and grouping the
 * results according to values returned.
 *
 * Dispatches to the `groupBy` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> {a: [b]}
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} list The array to group
 * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
 *         that produced that key when passed to `fn`.
 * @see R.reduceBy, R.transduce, R.indexBy
 * @example
 *
 *      const byGrade = R.groupBy(function(student) {
 *        const score = student.score;
 *        return score < 65 ? 'F' :
 *               score < 70 ? 'D' :
 *               score < 80 ? 'C' :
 *               score < 90 ? 'B' : 'A';
 *      });
 *      const students = [{name: 'Abby', score: 84},
 *                      {name: 'Eddy', score: 58},
 *                      // ...
 *                      {name: 'Jack', score: 69}];
 *      byGrade(students);
 *      // {
 *      //   'A': [{name: 'Dianne', score: 99}],
 *      //   'B': [{name: 'Abby', score: 84}]
 *      //   // ...,
 *      //   'F': [{name: 'Eddy', score: 58}]
 *      // }
 */


var groupBy =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('groupBy',
/*#__PURE__*/
reduceBy(function (acc, item) {
  acc.push(item);
  return acc;
}, [])));

module.exports = groupBy;

/***/ }),

/***/ 8716:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Takes a list and returns a list of lists where each sublist's elements are
 * all satisfied pairwise comparison according to the provided function.
 * Only adjacent elements are passed to the comparison function.
 *
 * @func
 * @memberOf R
 * @since v0.21.0
 * @category List
 * @sig ((a, a) → Boolean) → [a] → [[a]]
 * @param {Function} fn Function for determining whether two given (adjacent)
 *        elements should be in the same group
 * @param {Array} list The array to group. Also accepts a string, which will be
 *        treated as a list of characters.
 * @return {List} A list that contains sublists of elements,
 *         whose concatenations are equal to the original list.
 * @example
 *
 * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a + 1 === b, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
 *
 * const isVowel = R.test(/^[aeiou]$/i);
 * R.groupWith(R.eqBy(isVowel), 'aestiou')
 * //=> ['ae', 'st', 'iou']
 */


var groupWith =
/*#__PURE__*/
_curry2(function (fn, list) {
  var res = [];
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    var nextidx = idx + 1;

    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
      nextidx += 1;
    }

    res.push(list.slice(idx, nextidx));
    idx = nextidx;
  }

  return res;
});

module.exports = groupWith;

/***/ }),

/***/ 181:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns `true` if the first argument is greater than the second; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @see R.lt
 * @example
 *
 *      R.gt(2, 1); //=> true
 *      R.gt(2, 2); //=> false
 *      R.gt(2, 3); //=> false
 *      R.gt('a', 'z'); //=> false
 *      R.gt('z', 'a'); //=> true
 */


var gt =
/*#__PURE__*/
_curry2(function gt(a, b) {
  return a > b;
});

module.exports = gt;

/***/ }),

/***/ 3945:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns `true` if the first argument is greater than or equal to the second;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @see R.lte
 * @example
 *
 *      R.gte(2, 1); //=> true
 *      R.gte(2, 2); //=> true
 *      R.gte(2, 3); //=> false
 *      R.gte('a', 'z'); //=> false
 *      R.gte('z', 'a'); //=> true
 */


var gte =
/*#__PURE__*/
_curry2(function gte(a, b) {
  return a >= b;
});

module.exports = gte;

/***/ }),

/***/ 928:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var hasPath =
/*#__PURE__*/
__nccwpck_require__(578);
/**
 * Returns whether or not an object has an own property with the specified name
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Object
 * @sig s -> {s: x} -> Boolean
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @example
 *
 *      const hasName = R.has('name');
 *      hasName({name: 'alice'});   //=> true
 *      hasName({name: 'bob'});     //=> true
 *      hasName({});                //=> false
 *
 *      const point = {x: 0, y: 0};
 *      const pointHas = R.has(R.__, point);
 *      pointHas('x');  //=> true
 *      pointHas('y');  //=> true
 *      pointHas('z');  //=> false
 */


var has =
/*#__PURE__*/
_curry2(function has(prop, obj) {
  return hasPath([prop], obj);
});

module.exports = has;

/***/ }),

/***/ 5076:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var isNil =
/*#__PURE__*/
__nccwpck_require__(6895);
/**
 * Returns whether or not an object or its prototype chain has a property with
 * the specified name
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Object
 * @sig s -> {s: x} -> Boolean
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @example
 *
 *      function Rectangle(width, height) {
 *        this.width = width;
 *        this.height = height;
 *      }
 *      Rectangle.prototype.area = function() {
 *        return this.width * this.height;
 *      };
 *
 *      const square = new Rectangle(2, 2);
 *      R.hasIn('width', square);  //=> true
 *      R.hasIn('area', square);  //=> true
 */


var hasIn =
/*#__PURE__*/
_curry2(function hasIn(prop, obj) {
  if (isNil(obj)) {
    return false;
  }

  return prop in obj;
});

module.exports = hasIn;

/***/ }),

/***/ 578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var isNil =
/*#__PURE__*/
__nccwpck_require__(6895);
/**
 * Returns whether or not a path exists in an object. Only the object's
 * own properties are checked.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> {a} -> Boolean
 * @param {Array} path The path to use.
 * @param {Object} obj The object to check the path in.
 * @return {Boolean} Whether the path exists.
 * @see R.has
 * @example
 *
 *      R.hasPath(['a', 'b'], {a: {b: 2}});         // => true
 *      R.hasPath(['a', 'b'], {a: {b: undefined}}); // => true
 *      R.hasPath(['a', 'b'], {a: {c: 2}});         // => false
 *      R.hasPath(['a', 'b'], {});                  // => false
 */


var hasPath =
/*#__PURE__*/
_curry2(function hasPath(_path, obj) {
  if (_path.length === 0 || isNil(obj)) {
    return false;
  }

  var val = obj;
  var idx = 0;

  while (idx < _path.length) {
    if (!isNil(val) && _has(_path[idx], val)) {
      val = val[_path[idx]];
      idx += 1;
    } else {
      return false;
    }
  }

  return true;
});

module.exports = hasPath;

/***/ }),

/***/ 8119:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var nth =
/*#__PURE__*/
__nccwpck_require__(7280);
/**
 * Returns the first element of the given list or string. In some libraries
 * this function is named `first`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {Array|String} list
 * @return {*}
 * @see R.tail, R.init, R.last
 * @example
 *
 *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
 *      R.head([]); //=> undefined
 *
 *      R.head('abc'); //=> 'a'
 *      R.head(''); //=> ''
 */


var head =
/*#__PURE__*/
nth(0);
module.exports = head;

/***/ }),

/***/ 96:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _objectIs =
/*#__PURE__*/
__nccwpck_require__(9195);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * Note this is merely a curried version of ES6 `Object.is`.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      const o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */


var identical =
/*#__PURE__*/
_curry2(_objectIs);

module.exports = identical;

/***/ }),

/***/ 6304:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _identity =
/*#__PURE__*/
__nccwpck_require__(4003);
/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      const obj = {};
 *      R.identity(obj) === obj; //=> true
 * @symb R.identity(a) = a
 */


var identity =
/*#__PURE__*/
_curry1(_identity);

module.exports = identity;

/***/ }),

/***/ 4852:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Creates a function that will process either the `onTrue` or the `onFalse`
 * function depending upon the result of the `condition` predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
 * @param {Function} condition A predicate function
 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
 * @return {Function} A new function that will process either the `onTrue` or the `onFalse`
 *                    function depending upon the result of the `condition` predicate.
 * @see R.unless, R.when, R.cond
 * @example
 *
 *      const incCount = R.ifElse(
 *        R.has('count'),
 *        R.over(R.lensProp('count'), R.inc),
 *        R.assoc('count', 1)
 *      );
 *      incCount({ count: 1 }); //=> { count: 2 }
 *      incCount({});           //=> { count: 1 }
 */


var ifElse =
/*#__PURE__*/
_curry3(function ifElse(condition, onTrue, onFalse) {
  return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
    return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
  });
});

module.exports = ifElse;

/***/ }),

/***/ 9963:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var add =
/*#__PURE__*/
__nccwpck_require__(8100);
/**
 * Increments its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n + 1
 * @see R.dec
 * @example
 *
 *      R.inc(42); //=> 43
 */


var inc =
/*#__PURE__*/
add(1);
module.exports = inc;

/***/ }),

/***/ 7641:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includes =
/*#__PURE__*/
__nccwpck_require__(3148);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
 * terms, to at least one element of the given list; `false` otherwise.
 * Also works with strings.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category List
 * @sig a -> [a] -> Boolean
 * @param {Object} a The item to compare against.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @see R.any
 * @example
 *
 *      R.includes(3, [1, 2, 3]); //=> true
 *      R.includes(4, [1, 2, 3]); //=> false
 *      R.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
 *      R.includes([42], [[42]]); //=> true
 *      R.includes('ba', 'banana'); //=>true
 */


var includes =
/*#__PURE__*/
_curry2(_includes);

module.exports = includes;

/***/ }),

/***/ 4119:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = {};
module.exports.F = __nccwpck_require__(4097);
module.exports.T = __nccwpck_require__(8554);
module.exports.__ = __nccwpck_require__(5928);
module.exports.add = __nccwpck_require__(8100);
module.exports.addIndex = __nccwpck_require__(8215);
module.exports.adjust = __nccwpck_require__(743);
module.exports.all = __nccwpck_require__(6097);
module.exports.allPass = __nccwpck_require__(440);
module.exports.always = __nccwpck_require__(7770);
module.exports.and = __nccwpck_require__(4208);
module.exports.any = __nccwpck_require__(4648);
module.exports.anyPass = __nccwpck_require__(6877);
module.exports.ap = __nccwpck_require__(2857);
module.exports.aperture = __nccwpck_require__(63);
module.exports.append = __nccwpck_require__(5059);
module.exports.apply = __nccwpck_require__(5062);
module.exports.applySpec = __nccwpck_require__(3231);
module.exports.applyTo = __nccwpck_require__(3395);
module.exports.ascend = __nccwpck_require__(8358);
module.exports.assoc = __nccwpck_require__(3295);
module.exports.assocPath = __nccwpck_require__(9947);
module.exports.binary = __nccwpck_require__(6688);
module.exports.bind = __nccwpck_require__(4458);
module.exports.both = __nccwpck_require__(7192);
module.exports.call = __nccwpck_require__(6689);
module.exports.chain = __nccwpck_require__(8210);
module.exports.clamp = __nccwpck_require__(8927);
module.exports.clone = __nccwpck_require__(2675);
module.exports.collectBy = __nccwpck_require__(441);
module.exports.comparator = __nccwpck_require__(1876);
module.exports.complement = __nccwpck_require__(2679);
module.exports.compose = __nccwpck_require__(3651);
module.exports.composeWith = __nccwpck_require__(8592);
module.exports.concat = __nccwpck_require__(7833);
module.exports.cond = __nccwpck_require__(5335);
module.exports.construct = __nccwpck_require__(5611);
module.exports.constructN = __nccwpck_require__(2596);
module.exports.converge = __nccwpck_require__(810);
module.exports.count = __nccwpck_require__(862);
module.exports.countBy = __nccwpck_require__(1126);
module.exports.curry = __nccwpck_require__(838);
module.exports.curryN = __nccwpck_require__(1071);
module.exports.dec = __nccwpck_require__(6536);
module.exports.defaultTo = __nccwpck_require__(8445);
module.exports.descend = __nccwpck_require__(3144);
module.exports.difference = __nccwpck_require__(7013);
module.exports.differenceWith = __nccwpck_require__(1204);
module.exports.dissoc = __nccwpck_require__(5699);
module.exports.dissocPath = __nccwpck_require__(7900);
module.exports.divide = __nccwpck_require__(4144);
module.exports.drop = __nccwpck_require__(6769);
module.exports.dropLast = __nccwpck_require__(681);
module.exports.dropLastWhile = __nccwpck_require__(9494);
module.exports.dropRepeats = __nccwpck_require__(5300);
module.exports.dropRepeatsWith = __nccwpck_require__(6395);
module.exports.dropWhile = __nccwpck_require__(5245);
module.exports.either = __nccwpck_require__(7575);
module.exports.empty = __nccwpck_require__(7063);
module.exports.endsWith = __nccwpck_require__(9301);
module.exports.eqBy = __nccwpck_require__(8878);
module.exports.eqProps = __nccwpck_require__(8919);
module.exports.equals = __nccwpck_require__(548);
module.exports.evolve = __nccwpck_require__(9042);
module.exports.filter = __nccwpck_require__(983);
module.exports.find = __nccwpck_require__(4683);
module.exports.findIndex = __nccwpck_require__(6102);
module.exports.findLast = __nccwpck_require__(3696);
module.exports.findLastIndex = __nccwpck_require__(7747);
module.exports.flatten = __nccwpck_require__(8463);
module.exports.flip = __nccwpck_require__(5804);
module.exports.forEach = __nccwpck_require__(1154);
module.exports.forEachObjIndexed = __nccwpck_require__(8941);
module.exports.fromPairs = __nccwpck_require__(3626);
module.exports.groupBy = __nccwpck_require__(3397);
module.exports.groupWith = __nccwpck_require__(8716);
module.exports.gt = __nccwpck_require__(181);
module.exports.gte = __nccwpck_require__(3945);
module.exports.has = __nccwpck_require__(928);
module.exports.hasIn = __nccwpck_require__(5076);
module.exports.hasPath = __nccwpck_require__(578);
module.exports.head = __nccwpck_require__(8119);
module.exports.identical = __nccwpck_require__(96);
module.exports.identity = __nccwpck_require__(6304);
module.exports.ifElse = __nccwpck_require__(4852);
module.exports.inc = __nccwpck_require__(9963);
module.exports.includes = __nccwpck_require__(7641);
module.exports.indexBy = __nccwpck_require__(4718);
module.exports.indexOf = __nccwpck_require__(2492);
module.exports.init = __nccwpck_require__(1508);
module.exports.innerJoin = __nccwpck_require__(1951);
module.exports.insert = __nccwpck_require__(8657);
module.exports.insertAll = __nccwpck_require__(2017);
module.exports.intersection = __nccwpck_require__(6984);
module.exports.intersperse = __nccwpck_require__(1823);
module.exports.into = __nccwpck_require__(1375);
module.exports.invert = __nccwpck_require__(3680);
module.exports.invertObj = __nccwpck_require__(7141);
module.exports.invoker = __nccwpck_require__(4910);
module.exports.is = __nccwpck_require__(4008);
module.exports.isEmpty = __nccwpck_require__(9838);
module.exports.isNil = __nccwpck_require__(6895);
module.exports.join = __nccwpck_require__(3981);
module.exports.juxt = __nccwpck_require__(1897);
module.exports.keys = __nccwpck_require__(6755);
module.exports.keysIn = __nccwpck_require__(1464);
module.exports.last = __nccwpck_require__(3855);
module.exports.lastIndexOf = __nccwpck_require__(8054);
module.exports.length = __nccwpck_require__(819);
module.exports.lens = __nccwpck_require__(3076);
module.exports.lensIndex = __nccwpck_require__(2757);
module.exports.lensPath = __nccwpck_require__(4540);
module.exports.lensProp = __nccwpck_require__(3704);
module.exports.lift = __nccwpck_require__(3934);
module.exports.liftN = __nccwpck_require__(3833);
module.exports.lt = __nccwpck_require__(2342);
module.exports.lte = __nccwpck_require__(5973);
module.exports.map = __nccwpck_require__(8820);
module.exports.mapAccum = __nccwpck_require__(3699);
module.exports.mapAccumRight = __nccwpck_require__(9440);
module.exports.mapObjIndexed = __nccwpck_require__(1986);
module.exports.match = __nccwpck_require__(8964);
module.exports.mathMod = __nccwpck_require__(6733);
module.exports.max = __nccwpck_require__(9356);
module.exports.maxBy = __nccwpck_require__(976);
module.exports.mean = __nccwpck_require__(7527);
module.exports.median = __nccwpck_require__(3966);
module.exports.memoizeWith = __nccwpck_require__(2454);
module.exports.mergeAll = __nccwpck_require__(3616);
module.exports.mergeDeepLeft = __nccwpck_require__(6707);
module.exports.mergeDeepRight = __nccwpck_require__(9277);
module.exports.mergeDeepWith = __nccwpck_require__(3007);
module.exports.mergeDeepWithKey = __nccwpck_require__(9500);
module.exports.mergeLeft = __nccwpck_require__(3970);
module.exports.mergeRight = __nccwpck_require__(3004);
module.exports.mergeWith = __nccwpck_require__(5661);
module.exports.mergeWithKey = __nccwpck_require__(3206);
module.exports.min = __nccwpck_require__(3229);
module.exports.minBy = __nccwpck_require__(154);
module.exports.modify = __nccwpck_require__(2720);
module.exports.modifyPath = __nccwpck_require__(478);
module.exports.modulo = __nccwpck_require__(3386);
module.exports.move = __nccwpck_require__(8801);
module.exports.multiply = __nccwpck_require__(3858);
module.exports.nAry = __nccwpck_require__(2843);
module.exports.partialObject = __nccwpck_require__(1291);
module.exports.negate = __nccwpck_require__(5905);
module.exports.none = __nccwpck_require__(2207);
module.exports.not = __nccwpck_require__(3991);
module.exports.nth = __nccwpck_require__(7280);
module.exports.nthArg = __nccwpck_require__(6295);
module.exports.o = __nccwpck_require__(6843);
module.exports.objOf = __nccwpck_require__(4572);
module.exports.of = __nccwpck_require__(6898);
module.exports.omit = __nccwpck_require__(737);
module.exports.on = __nccwpck_require__(6618);
module.exports.once = __nccwpck_require__(8111);
module.exports.or = __nccwpck_require__(5283);
module.exports.otherwise = __nccwpck_require__(9380);
module.exports.over = __nccwpck_require__(9185);
module.exports.pair = __nccwpck_require__(7314);
module.exports.partial = __nccwpck_require__(4982);
module.exports.partialRight = __nccwpck_require__(1136);
module.exports.partition = __nccwpck_require__(776);
module.exports.path = __nccwpck_require__(2767);
module.exports.paths = __nccwpck_require__(5579);
module.exports.pathEq = __nccwpck_require__(1360);
module.exports.pathOr = __nccwpck_require__(6328);
module.exports.pathSatisfies = __nccwpck_require__(9411);
module.exports.pick = __nccwpck_require__(5315);
module.exports.pickAll = __nccwpck_require__(3234);
module.exports.pickBy = __nccwpck_require__(5565);
module.exports.pipe = __nccwpck_require__(4216);
module.exports.pipeWith = __nccwpck_require__(7709);
module.exports.pluck = __nccwpck_require__(7413);
module.exports.prepend = __nccwpck_require__(6622);
module.exports.product = __nccwpck_require__(6233);
module.exports.project = __nccwpck_require__(7615);
module.exports.promap = __nccwpck_require__(3743);
module.exports.prop = __nccwpck_require__(2135);
module.exports.propEq = __nccwpck_require__(7301);
module.exports.propIs = __nccwpck_require__(9867);
module.exports.propOr = __nccwpck_require__(5694);
module.exports.propSatisfies = __nccwpck_require__(6891);
module.exports.props = __nccwpck_require__(7807);
module.exports.range = __nccwpck_require__(1808);
module.exports.reduce = __nccwpck_require__(1941);
module.exports.reduceBy = __nccwpck_require__(5645);
module.exports.reduceRight = __nccwpck_require__(2464);
module.exports.reduceWhile = __nccwpck_require__(6534);
module.exports.reduced = __nccwpck_require__(4505);
module.exports.reject = __nccwpck_require__(1545);
module.exports.remove = __nccwpck_require__(311);
module.exports.repeat = __nccwpck_require__(4868);
module.exports.replace = __nccwpck_require__(7864);
module.exports.reverse = __nccwpck_require__(8495);
module.exports.scan = __nccwpck_require__(5426);
module.exports.sequence = __nccwpck_require__(4534);
module.exports.set = __nccwpck_require__(435);
module.exports.slice = __nccwpck_require__(7108);
module.exports.sort = __nccwpck_require__(2642);
module.exports.sortBy = __nccwpck_require__(9227);
module.exports.sortWith = __nccwpck_require__(7275);
module.exports.split = __nccwpck_require__(9914);
module.exports.splitAt = __nccwpck_require__(5609);
module.exports.splitEvery = __nccwpck_require__(4447);
module.exports.splitWhen = __nccwpck_require__(7129);
module.exports.splitWhenever = __nccwpck_require__(6392);
module.exports.startsWith = __nccwpck_require__(1738);
module.exports.subtract = __nccwpck_require__(7944);
module.exports.sum = __nccwpck_require__(4761);
module.exports.symmetricDifference = __nccwpck_require__(4025);
module.exports.symmetricDifferenceWith = __nccwpck_require__(2302);
module.exports.tail = __nccwpck_require__(4900);
module.exports.take = __nccwpck_require__(1744);
module.exports.takeLast = __nccwpck_require__(2816);
module.exports.takeLastWhile = __nccwpck_require__(9617);
module.exports.takeWhile = __nccwpck_require__(1973);
module.exports.tap = __nccwpck_require__(1547);
module.exports.test = __nccwpck_require__(9289);
module.exports.andThen = __nccwpck_require__(8935);
module.exports.times = __nccwpck_require__(2791);
module.exports.toLower = __nccwpck_require__(1411);
module.exports.toPairs = __nccwpck_require__(4187);
module.exports.toPairsIn = __nccwpck_require__(7578);
module.exports.toString = __nccwpck_require__(6119);
module.exports.toUpper = __nccwpck_require__(382);
module.exports.transduce = __nccwpck_require__(1994);
module.exports.transpose = __nccwpck_require__(1016);
module.exports.traverse = __nccwpck_require__(949);
module.exports.trim = __nccwpck_require__(3930);
module.exports.tryCatch = __nccwpck_require__(5510);
module.exports.type = __nccwpck_require__(1193);
module.exports.unapply = __nccwpck_require__(3162);
module.exports.unary = __nccwpck_require__(2749);
module.exports.uncurryN = __nccwpck_require__(58);
module.exports.unfold = __nccwpck_require__(5739);
module.exports.union = __nccwpck_require__(9550);
module.exports.unionWith = __nccwpck_require__(3957);
module.exports.uniq = __nccwpck_require__(272);
module.exports.uniqBy = __nccwpck_require__(6076);
module.exports.uniqWith = __nccwpck_require__(6739);
module.exports.unless = __nccwpck_require__(9300);
module.exports.unnest = __nccwpck_require__(5442);
module.exports.until = __nccwpck_require__(135);
module.exports.unwind = __nccwpck_require__(1594);
module.exports.update = __nccwpck_require__(129);
module.exports.useWith = __nccwpck_require__(6487);
module.exports.values = __nccwpck_require__(6410);
module.exports.valuesIn = __nccwpck_require__(2168);
module.exports.view = __nccwpck_require__(3288);
module.exports.when = __nccwpck_require__(2531);
module.exports.where = __nccwpck_require__(5060);
module.exports.whereAny = __nccwpck_require__(3811);
module.exports.whereEq = __nccwpck_require__(255);
module.exports.without = __nccwpck_require__(2274);
module.exports.xor = __nccwpck_require__(219);
module.exports.xprod = __nccwpck_require__(2718);
module.exports.zip = __nccwpck_require__(9024);
module.exports.zipObj = __nccwpck_require__(2902);
module.exports.zipWith = __nccwpck_require__(1104);
module.exports.thunkify = __nccwpck_require__(1615);

/***/ }),

/***/ 4718:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var reduceBy =
/*#__PURE__*/
__nccwpck_require__(5645);
/**
 * Given a function that generates a key, turns a list of objects into an
 * object indexing the objects by the given key. Note that if multiple
 * objects generate the same value for the indexing key only the last value
 * will be included in the generated object.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> {a: b}
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} array The array of objects to index
 * @return {Object} An object indexing each array element by the given property.
 * @see R.groupBy
 * @example
 *
 *      const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
 *      R.indexBy(R.prop('id'), list);
 *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
 */


var indexBy =
/*#__PURE__*/
reduceBy(function (acc, elem) {
  return elem;
}, null);
module.exports = indexBy;

/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _indexOf =
/*#__PURE__*/
__nccwpck_require__(1702);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);
/**
 * Returns the position of the first occurrence of an item in an array, or -1
 * if the item is not included in the array. [`R.equals`](#equals) is used to
 * determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Number
 * @param {*} target The item to find.
 * @param {Array} xs The array to search in.
 * @return {Number} the index of the target, or -1 if the target is not found.
 * @see R.lastIndexOf, R.findIndex
 * @example
 *
 *      R.indexOf(3, [1,2,3,4]); //=> 2
 *      R.indexOf(10, [1,2,3,4]); //=> -1
 */


var indexOf =
/*#__PURE__*/
_curry2(function indexOf(target, xs) {
  return typeof xs.indexOf === 'function' && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
});

module.exports = indexOf;

/***/ }),

/***/ 1508:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns all but the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.last, R.head, R.tail
 * @example
 *
 *      R.init([1, 2, 3]);  //=> [1, 2]
 *      R.init([1, 2]);     //=> [1]
 *      R.init([1]);        //=> []
 *      R.init([]);         //=> []
 *
 *      R.init('abc');  //=> 'ab'
 *      R.init('ab');   //=> 'a'
 *      R.init('a');    //=> ''
 *      R.init('');     //=> ''
 */


var init =
/*#__PURE__*/
slice(0, -1);
module.exports = init;

/***/ }),

/***/ 1951:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includesWith =
/*#__PURE__*/
__nccwpck_require__(3968);

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _filter =
/*#__PURE__*/
__nccwpck_require__(9038);
/**
 * Takes a predicate `pred`, a list `xs`, and a list `ys`, and returns a list
 * `xs'` comprising each of the elements of `xs` which is equal to one or more
 * elements of `ys` according to `pred`.
 *
 * `pred` must be a binary function expecting an element from each list.
 *
 * `xs`, `ys`, and `xs'` are treated as sets, semantically, so ordering should
 * not be significant, but since `xs'` is ordered the implementation guarantees
 * that its values are in the same order as they appear in `xs`. Duplicates are
 * not removed, so `xs'` may contain duplicates if `xs` contains duplicates.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Relation
 * @sig ((a, b) -> Boolean) -> [a] -> [b] -> [a]
 * @param {Function} pred
 * @param {Array} xs
 * @param {Array} ys
 * @return {Array}
 * @see R.intersection
 * @example
 *
 *      R.innerJoin(
 *        (record, id) => record.id === id,
 *        [{id: 824, name: 'Richie Furay'},
 *         {id: 956, name: 'Dewey Martin'},
 *         {id: 313, name: 'Bruce Palmer'},
 *         {id: 456, name: 'Stephen Stills'},
 *         {id: 177, name: 'Neil Young'}],
 *        [177, 456, 999]
 *      );
 *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
 */


var innerJoin =
/*#__PURE__*/
_curry3(function innerJoin(pred, xs, ys) {
  return _filter(function (x) {
    return _includesWith(pred, x, ys);
  }, xs);
});

module.exports = innerJoin;

/***/ }),

/***/ 8657:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Inserts the supplied element into the list, at the specified `index`. _Note that

 * this is not destructive_: it returns a copy of the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -> a -> [a] -> [a]
 * @param {Number} index The position to insert the element
 * @param {*} elt The element to insert into the Array
 * @param {Array} list The list to insert into
 * @return {Array} A new Array with `elt` inserted at `index`.
 * @example
 *
 *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
 */


var insert =
/*#__PURE__*/
_curry3(function insert(idx, elt, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  var result = Array.prototype.slice.call(list, 0);
  result.splice(idx, 0, elt);
  return result;
});

module.exports = insert;

/***/ }),

/***/ 2017:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Inserts the sub-list into the list, at the specified `index`. _Note that this is not
 * destructive_: it returns a copy of the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig Number -> [a] -> [a] -> [a]
 * @param {Number} index The position to insert the sub-list
 * @param {Array} elts The sub-list to insert into the Array
 * @param {Array} list The list to insert the sub-list into
 * @return {Array} A new Array with `elts` inserted starting at `index`.
 * @example
 *
 *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
 */


var insertAll =
/*#__PURE__*/
_curry3(function insertAll(idx, elts, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  return [].concat(Array.prototype.slice.call(list, 0, idx), elts, Array.prototype.slice.call(list, idx));
});

module.exports = insertAll;

/***/ }),

/***/ 1781:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includes =
/*#__PURE__*/
__nccwpck_require__(3148);

var _Set =
/*#__PURE__*/
function () {
  function _Set() {
    /* globals Set */
    this._nativeSet = typeof Set === 'function' ? new Set() : null;
    this._items = {};
  }

  // until we figure out why jsdoc chokes on this
  // @param item The item to add to the Set
  // @returns {boolean} true if the item did not exist prior, otherwise false
  //
  _Set.prototype.add = function (item) {
    return !hasOrAdd(item, true, this);
  }; //
  // @param item The item to check for existence in the Set
  // @returns {boolean} true if the item exists in the Set, otherwise false
  //


  _Set.prototype.has = function (item) {
    return hasOrAdd(item, false, this);
  }; //
  // Combines the logic for checking whether an item is a member of the set and
  // for adding a new item to the set.
  //
  // @param item       The item to check or add to the Set instance.
  // @param shouldAdd  If true, the item will be added to the set if it doesn't
  //                   already exist.
  // @param set        The set instance to check or add to.
  // @return {boolean} true if the item already existed, otherwise false.
  //


  return _Set;
}();

function hasOrAdd(item, shouldAdd, set) {
  var type = typeof item;
  var prevSize, newSize;

  switch (type) {
    case 'string':
    case 'number':
      // distinguish between +0 and -0
      if (item === 0 && 1 / item === -Infinity) {
        if (set._items['-0']) {
          return true;
        } else {
          if (shouldAdd) {
            set._items['-0'] = true;
          }

          return false;
        }
      } // these types can all utilise the native Set


      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;

          set._nativeSet.add(item);

          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = {};
            set._items[type][item] = true;
          }

          return false;
        } else if (item in set._items[type]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][item] = true;
          }

          return false;
        }
      }

    case 'boolean':
      // set._items['boolean'] holds a two element array
      // representing [ falseExists, trueExists ]
      if (type in set._items) {
        var bIdx = item ? 1 : 0;

        if (set._items[type][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][bIdx] = true;
          }

          return false;
        }
      } else {
        if (shouldAdd) {
          set._items[type] = item ? [false, true] : [true, false];
        }

        return false;
      }

    case 'function':
      // compare functions for reference equality
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;

          set._nativeSet.add(item);

          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = [item];
          }

          return false;
        }

        if (!_includes(item, set._items[type])) {
          if (shouldAdd) {
            set._items[type].push(item);
          }

          return false;
        }

        return true;
      }

    case 'undefined':
      if (set._items[type]) {
        return true;
      } else {
        if (shouldAdd) {
          set._items[type] = true;
        }

        return false;
      }

    case 'object':
      if (item === null) {
        if (!set._items['null']) {
          if (shouldAdd) {
            set._items['null'] = true;
          }

          return false;
        }

        return true;
      }

    /* falls through */

    default:
      // reduce the search size of heterogeneous sets by creating buckets
      // for each type.
      type = Object.prototype.toString.call(item);

      if (!(type in set._items)) {
        if (shouldAdd) {
          set._items[type] = [item];
        }

        return false;
      } // scan through all previously applied items


      if (!_includes(item, set._items[type])) {
        if (shouldAdd) {
          set._items[type].push(item);
        }

        return false;
      }

      return true;
  }
} // A simple Set type that honours R.equals semantics


module.exports = _Set;

/***/ }),

/***/ 7914:
/***/ ((module) => {

function _aperture(n, list) {
  var idx = 0;
  var limit = list.length - (n - 1);
  var acc = new Array(limit >= 0 ? limit : 0);

  while (idx < limit) {
    acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
    idx += 1;
  }

  return acc;
}

module.exports = _aperture;

/***/ }),

/***/ 1414:
/***/ ((module) => {

function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };

    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };

    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };

    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

module.exports = _arity;

/***/ }),

/***/ 2785:
/***/ ((module) => {

function _arrayFromIterator(iter) {
  var list = [];
  var next;

  while (!(next = iter.next()).done) {
    list.push(next.value);
  }

  return list;
}

module.exports = _arrayFromIterator;

/***/ }),

/***/ 4549:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isFunction =
/*#__PURE__*/
__nccwpck_require__(5997);

var _toString =
/*#__PURE__*/
__nccwpck_require__(165);

function _assertPromise(name, p) {
  if (p == null || !_isFunction(p.then)) {
    throw new TypeError('`' + name + '` expected a Promise, received ' + _toString(p, []));
  }
}

module.exports = _assertPromise;

/***/ }),

/***/ 4702:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);
/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @private
 * @param {String|Number} prop The property name to set
 * @param {*} val The new value
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original except for the changed property.
 */


function _assoc(prop, val, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[prop] = val;
    return arr;
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  result[prop] = val;
  return result;
}

module.exports = _assoc;

/***/ }),

/***/ 1373:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);
/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implementation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */


function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;

    if (length === 0) {
      return fn();
    }

    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}

module.exports = _checkForMethod;

/***/ }),

/***/ 2726:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _cloneRegExp =
/*#__PURE__*/
__nccwpck_require__(2621);

var type =
/*#__PURE__*/
__nccwpck_require__(1193);
/**
 * Copies an object.
 *
 * @private
 * @param {*} value The value to be copied
 * @param {Array} refFrom Array containing the source references
 * @param {Array} refTo Array containing the copied source references
 * @param {Boolean} deep Whether or not to perform deep cloning.
 * @return {*} The copied value.
 */


function _clone(value, refFrom, refTo, deep) {
  var copy = function copy(copiedValue) {
    var len = refFrom.length;
    var idx = 0;

    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }

      idx += 1;
    }

    refFrom[idx] = value;
    refTo[idx] = copiedValue;

    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
      }
    }

    return copiedValue;
  };

  switch (type(value)) {
    case 'Object':
      return copy(Object.create(Object.getPrototypeOf(value)));

    case 'Array':
      return copy([]);

    case 'Date':
      return new Date(value.valueOf());

    case 'RegExp':
      return _cloneRegExp(value);

    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array':
      return value.slice();

    default:
      return value;
  }
}

module.exports = _clone;

/***/ }),

/***/ 2621:
/***/ ((module) => {

function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
}

module.exports = _cloneRegExp;

/***/ }),

/***/ 3134:
/***/ ((module) => {

function _complement(f) {
  return function () {
    return !f.apply(this, arguments);
  };
}

module.exports = _complement;

/***/ }),

/***/ 8118:
/***/ ((module) => {

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
function _concat(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];
  idx = 0;

  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }

  idx = 0;

  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }

  return result;
}

module.exports = _concat;

/***/ }),

/***/ 8981:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

function _createPartialApplicator(concat) {
  return _curry2(function (fn, args) {
    return _arity(Math.max(0, fn.length - args.length), function () {
      return fn.apply(this, concat(args, arguments));
    });
  });
}

module.exports = _createPartialApplicator;

/***/ }),

/***/ 713:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isPlaceholder =
/*#__PURE__*/
__nccwpck_require__(1934);
/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

module.exports = _curry1;

/***/ }),

/***/ 9483:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _isPlaceholder =
/*#__PURE__*/
__nccwpck_require__(1934);
/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

module.exports = _curry2;

/***/ }),

/***/ 7597:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isPlaceholder =
/*#__PURE__*/
__nccwpck_require__(1934);
/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;

      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });

      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

module.exports = _curry3;

/***/ }),

/***/ 4106:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _isPlaceholder =
/*#__PURE__*/
__nccwpck_require__(1934);
/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curryN(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;

    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;

      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }

      combined[combinedIdx] = result;

      if (!_isPlaceholder(result)) {
        left -= 1;
      }

      combinedIdx += 1;
    }

    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

module.exports = _curryN;

/***/ }),

/***/ 9699:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isTransformer =
/*#__PURE__*/
__nccwpck_require__(9949);
/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer created by [transducerCreator] to return a new transformer
 * (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} transducerCreator transducer factory if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */


function _dispatchable(methodNames, transducerCreator, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }

    var obj = arguments[arguments.length - 1];

    if (!_isArray(obj)) {
      var idx = 0;

      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }

        idx += 1;
      }

      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }

    return fn.apply(this, arguments);
  };
}

module.exports = _dispatchable;

/***/ }),

/***/ 5318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var remove =
/*#__PURE__*/
__nccwpck_require__(311);
/**
 * Returns a new object that does not contain a `prop` property.
 *
 * @private
 * @param {String|Number} prop The name of the property to dissociate
 * @param {Object|Array} obj The object to clone
 * @return {Object} A new object equivalent to the original but without the specified property
 */


function _dissoc(prop, obj) {
  if (obj == null) {
    return obj;
  }

  if (_isInteger(prop) && _isArray(obj)) {
    return remove(prop, 1, obj);
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  delete result[prop];
  return result;
}

module.exports = _dissoc;

/***/ }),

/***/ 1166:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var take =
/*#__PURE__*/
__nccwpck_require__(1744);

function dropLast(n, xs) {
  return take(n < xs.length ? xs.length - n : 0, xs);
}

module.exports = dropLast;

/***/ }),

/***/ 6204:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);

function dropLastWhile(pred, xs) {
  var idx = xs.length - 1;

  while (idx >= 0 && pred(xs[idx])) {
    idx -= 1;
  }

  return slice(0, idx + 1, xs);
}

module.exports = dropLastWhile;

/***/ }),

/***/ 1611:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arrayFromIterator =
/*#__PURE__*/
__nccwpck_require__(2785);

var _includesWith =
/*#__PURE__*/
__nccwpck_require__(3968);

var _functionName =
/*#__PURE__*/
__nccwpck_require__(3632);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var _objectIs =
/*#__PURE__*/
__nccwpck_require__(9195);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);

var type =
/*#__PURE__*/
__nccwpck_require__(1193);
/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparison of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */


function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);

  var b = _arrayFromIterator(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  } // if *a* array contains any element that is not included in *b*


  return !_includesWith(function (b, aItem) {
    return !_includesWith(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (_objectIs(a, b)) {
    return true;
  }

  var typeA = type(a);

  if (typeA !== type(b)) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
        return a === b;
      }

      break;

    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && _objectIs(a.valueOf(), b.valueOf()))) {
        return false;
      }

      break;

    case 'Date':
      if (!_objectIs(a.valueOf(), b.valueOf())) {
        return false;
      }

      break;

    case 'Error':
      return a.name === b.name && a.message === b.message;

    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }

      break;
  }

  var idx = stackA.length - 1;

  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }

    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;

    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);

  if (keysA.length !== keys(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;

  while (idx >= 0) {
    var key = keysA[idx];

    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }

    idx -= 1;
  }

  return true;
}

module.exports = _equals;

/***/ }),

/***/ 9038:
/***/ ((module) => {

function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }

    idx += 1;
  }

  return result;
}

module.exports = _filter;

/***/ }),

/***/ 8433:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _forceReduced =
/*#__PURE__*/
__nccwpck_require__(615);

var _isArrayLike =
/*#__PURE__*/
__nccwpck_require__(8490);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var preservingReduced = function (xf) {
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function (result) {
      return xf['@@transducer/result'](result);
    },
    '@@transducer/step': function (result, input) {
      var ret = xf['@@transducer/step'](result, input);
      return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
    }
  };
};

var _flatCat = function _xcat(xf) {
  var rxf = preservingReduced(xf);
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function (result) {
      return rxf['@@transducer/result'](result);
    },
    '@@transducer/step': function (result, input) {
      return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
    }
  };
};

module.exports = _flatCat;

/***/ }),

/***/ 615:
/***/ ((module) => {

function _forceReduced(x) {
  return {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}

module.exports = _forceReduced;

/***/ }),

/***/ 3632:
/***/ ((module) => {

function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}

module.exports = _functionName;

/***/ }),

/***/ 1693:
/***/ ((module) => {

function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = _has;

/***/ }),

/***/ 4003:
/***/ ((module) => {

function _identity(x) {
  return x;
}

module.exports = _identity;

/***/ }),

/***/ 3148:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _indexOf =
/*#__PURE__*/
__nccwpck_require__(1702);

function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

module.exports = _includes;

/***/ }),

/***/ 3968:
/***/ ((module) => {

function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}

module.exports = _includesWith;

/***/ }),

/***/ 1702:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var equals =
/*#__PURE__*/
__nccwpck_require__(548);

function _indexOf(list, a, idx) {
  var inf, item; // Array.prototype.indexOf doesn't exist below IE9

  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;

          while (idx < list.length) {
            item = list[idx];

            if (item === 0 && 1 / item === inf) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];

            if (typeof item === 'number' && item !== item) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } // non-zero numbers can utilise Set


        return list.indexOf(a, idx);
      // all these types can utilise Set

      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }

    }
  } // anything else not covered above, defer to R.equals


  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}

module.exports = _indexOf;

/***/ }),

/***/ 8989:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var toString = Object.prototype.toString;

var _isArguments =
/*#__PURE__*/
function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has('callee', x);
  };
}();

module.exports = _isArguments;

/***/ }),

/***/ 6999:
/***/ ((module) => {

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

/***/ }),

/***/ 8490:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isString =
/*#__PURE__*/
__nccwpck_require__(9076);
/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 *      _isArrayLike({nodeType: 1, length: 1}) // => false
 */


var _isArrayLike =
/*#__PURE__*/
_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }

  if (!x) {
    return false;
  }

  if (typeof x !== 'object') {
    return false;
  }

  if (_isString(x)) {
    return false;
  }

  if (x.length === 0) {
    return true;
  }

  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }

  return false;
});

module.exports = _isArrayLike;

/***/ }),

/***/ 5997:
/***/ ((module) => {

function _isFunction(x) {
  var type = Object.prototype.toString.call(x);
  return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object AsyncGeneratorFunction]';
}

module.exports = _isFunction;

/***/ }),

/***/ 7924:
/***/ ((module) => {

/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
module.exports = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};

/***/ }),

/***/ 7573:
/***/ ((module) => {

function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}

module.exports = _isNumber;

/***/ }),

/***/ 774:
/***/ ((module) => {

function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

module.exports = _isObject;

/***/ }),

/***/ 1934:
/***/ ((module) => {

function _isPlaceholder(a) {
  return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

module.exports = _isPlaceholder;

/***/ }),

/***/ 2134:
/***/ ((module) => {

function _isRegExp(x) {
  return Object.prototype.toString.call(x) === '[object RegExp]';
}

module.exports = _isRegExp;

/***/ }),

/***/ 9076:
/***/ ((module) => {

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

module.exports = _isString;

/***/ }),

/***/ 9949:
/***/ ((module) => {

function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

module.exports = _isTransformer;

/***/ }),

/***/ 2910:
/***/ ((module) => {

/**
 * Tests whether or not an object is a typed array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is a typed array, `false` otherwise.
 * @example
 *
 *      _isTypedArray(new Uint8Array([])); //=> true
 *      _isTypedArray(new Float32Array([])); //=> true
 *      _isTypedArray([]); //=> false
 *      _isTypedArray(null); //=> false
 *      _isTypedArray({}); //=> false
 */
function _isTypedArray(val) {
  var type = Object.prototype.toString.call(val);
  return type === '[object Uint8ClampedArray]' || type === '[object Int8Array]' || type === '[object Uint8Array]' || type === '[object Int16Array]' || type === '[object Uint16Array]' || type === '[object Int32Array]' || type === '[object Uint32Array]' || type === '[object Float32Array]' || type === '[object Float64Array]' || type === '[object BigInt64Array]' || type === '[object BigUint64Array]';
}

module.exports = _isTypedArray;

/***/ }),

/***/ 7840:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isArrayLike =
/*#__PURE__*/
__nccwpck_require__(8490);
/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */


function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;

        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }

      idx += 1;
    }

    return result;
  };
}

module.exports = _makeFlat;

/***/ }),

/***/ 8077:
/***/ ((module) => {

function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);

  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }

  return result;
}

module.exports = _map;

/***/ }),

/***/ 9245:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);
/**
 * Makes a shallow clone of an object, applying the given fn to the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @private
 * @param {String|Number} prop The property name to set
 * @param {Function} fn The function to apply to the property
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original except for the changed property.
 */


function _modify(prop, fn, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[prop] = fn(arr[prop]);
    return arr;
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  result[prop] = fn(result[prop]);
  return result;
}

module.exports = _modify;

/***/ }),

/***/ 5291:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _has =
/*#__PURE__*/
__nccwpck_require__(1693); // Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign


function _objectAssign(target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  var idx = 1;
  var length = arguments.length;

  while (idx < length) {
    var source = arguments[idx];

    if (source != null) {
      for (var nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }

    idx += 1;
  }

  return output;
}

module.exports = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

/***/ }),

/***/ 9195:
/***/ ((module) => {

// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

module.exports = typeof Object.is === 'function' ? Object.is : _objectIs;

/***/ }),

/***/ 7327:
/***/ ((module) => {

function _of(x) {
  return [x];
}

module.exports = _of;

/***/ }),

/***/ 4592:
/***/ ((module) => {

function _pipe(f, g) {
  return function () {
    return g.call(this, f.apply(this, arguments));
  };
}

module.exports = _pipe;

/***/ }),

/***/ 5843:
/***/ ((module) => {

function _promap(f, g, profunctor) {
  return function (x) {
    return g(profunctor(f(x)));
  };
}

module.exports = _promap;

/***/ }),

/***/ 9543:
/***/ ((module) => {

function _quote(s) {
  var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b') // \b matches word boundary; [\b] matches backspace
  .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}

module.exports = _quote;

/***/ }),

/***/ 2872:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _isArrayLike =
/*#__PURE__*/
__nccwpck_require__(8490);

var _xwrap =
/*#__PURE__*/
__nccwpck_require__(7393);

var bind =
/*#__PURE__*/
__nccwpck_require__(4458);

function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    idx += 1;
  }

  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();

  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    step = iter.next();
  }

  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = _xwrap(fn);
  }

  if (_isArrayLike(list)) {
    return _arrayReduce(fn, acc, list);
  }

  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }

  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }

  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }

  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}

module.exports = _reduce;

/***/ }),

/***/ 9400:
/***/ ((module) => {

function _reduced(x) {
  return x && x['@@transducer/reduced'] ? x : {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}

module.exports = _reduced;

/***/ }),

/***/ 8808:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _objectAssign =
/*#__PURE__*/
__nccwpck_require__(5291);

var _identity =
/*#__PURE__*/
__nccwpck_require__(4003);

var _isArrayLike =
/*#__PURE__*/
__nccwpck_require__(8490);

var _isTransformer =
/*#__PURE__*/
__nccwpck_require__(9949);

var objOf =
/*#__PURE__*/
__nccwpck_require__(4572);

var _stepCatArray = {
  '@@transducer/init': Array,
  '@@transducer/step': function (xs, x) {
    xs.push(x);
    return xs;
  },
  '@@transducer/result': _identity
};
var _stepCatString = {
  '@@transducer/init': String,
  '@@transducer/step': function (a, b) {
    return a + b;
  },
  '@@transducer/result': _identity
};
var _stepCatObject = {
  '@@transducer/init': Object,
  '@@transducer/step': function (result, input) {
    return _objectAssign(result, _isArrayLike(input) ? objOf(input[0], input[1]) : input);
  },
  '@@transducer/result': _identity
};

function _stepCat(obj) {
  if (_isTransformer(obj)) {
    return obj;
  }

  if (_isArrayLike(obj)) {
    return _stepCatArray;
  }

  if (typeof obj === 'string') {
    return _stepCatString;
  }

  if (typeof obj === 'object') {
    return _stepCatObject;
  }

  throw new Error('Cannot create transformer for ' + obj);
}

module.exports = _stepCat;

/***/ }),

/***/ 5222:
/***/ ((module) => {

/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
var pad = function pad(n) {
  return (n < 10 ? '0' : '') + n;
};

var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
  return d.toISOString();
} : function _toISOString(d) {
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};

module.exports = _toISOString;

/***/ }),

/***/ 165:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includes =
/*#__PURE__*/
__nccwpck_require__(3148);

var _map =
/*#__PURE__*/
__nccwpck_require__(8077);

var _quote =
/*#__PURE__*/
__nccwpck_require__(9543);

var _toISOString =
/*#__PURE__*/
__nccwpck_require__(5222);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);

var reject =
/*#__PURE__*/
__nccwpck_require__(1545);

function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? '<Circular>' : _toString(y, xs);
  }; //  mapPairs :: (Object, [String]) -> [String]


  var mapPairs = function (obj, keys) {
    return _map(function (k) {
      return _quote(k) + ': ' + recur(obj[k]);
    }, keys.slice().sort());
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';

    case '[object Array]':
      return '[' + _map(recur, x).concat(mapPairs(x, reject(function (k) {
        return /^\d+$/.test(k);
      }, keys(x)))).join(', ') + ']';

    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();

    case '[object Date]':
      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';

    case '[object Null]':
      return 'null';

    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);

    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);

    case '[object Undefined]':
      return 'undefined';

    default:
      if (typeof x.toString === 'function') {
        var repr = x.toString();

        if (repr !== '[object Object]') {
          return repr;
        }
      }

      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
  }
}

module.exports = _toString;

/***/ }),

/***/ 5023:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XAll =
/*#__PURE__*/
function () {
  function XAll(f, xf) {
    this.xf = xf;
    this.f = f;
    this.all = true;
  }

  XAll.prototype['@@transducer/init'] = _xfBase.init;

  XAll.prototype['@@transducer/result'] = function (result) {
    if (this.all) {
      result = this.xf['@@transducer/step'](result, true);
    }

    return this.xf['@@transducer/result'](result);
  };

  XAll.prototype['@@transducer/step'] = function (result, input) {
    if (!this.f(input)) {
      this.all = false;
      result = _reduced(this.xf['@@transducer/step'](result, false));
    }

    return result;
  };

  return XAll;
}();

var _xall =
/*#__PURE__*/
_curry2(function _xall(f, xf) {
  return new XAll(f, xf);
});

module.exports = _xall;

/***/ }),

/***/ 5447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XAny =
/*#__PURE__*/
function () {
  function XAny(f, xf) {
    this.xf = xf;
    this.f = f;
    this.any = false;
  }

  XAny.prototype['@@transducer/init'] = _xfBase.init;

  XAny.prototype['@@transducer/result'] = function (result) {
    if (!this.any) {
      result = this.xf['@@transducer/step'](result, false);
    }

    return this.xf['@@transducer/result'](result);
  };

  XAny.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.any = true;
      result = _reduced(this.xf['@@transducer/step'](result, true));
    }

    return result;
  };

  return XAny;
}();

var _xany =
/*#__PURE__*/
_curry2(function _xany(f, xf) {
  return new XAny(f, xf);
});

module.exports = _xany;

/***/ }),

/***/ 7156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XAperture =
/*#__PURE__*/
function () {
  function XAperture(n, xf) {
    this.xf = xf;
    this.pos = 0;
    this.full = false;
    this.acc = new Array(n);
  }

  XAperture.prototype['@@transducer/init'] = _xfBase.init;

  XAperture.prototype['@@transducer/result'] = function (result) {
    this.acc = null;
    return this.xf['@@transducer/result'](result);
  };

  XAperture.prototype['@@transducer/step'] = function (result, input) {
    this.store(input);
    return this.full ? this.xf['@@transducer/step'](result, this.getCopy()) : result;
  };

  XAperture.prototype.store = function (input) {
    this.acc[this.pos] = input;
    this.pos += 1;

    if (this.pos === this.acc.length) {
      this.pos = 0;
      this.full = true;
    }
  };

  XAperture.prototype.getCopy = function () {
    return _concat(Array.prototype.slice.call(this.acc, this.pos), Array.prototype.slice.call(this.acc, 0, this.pos));
  };

  return XAperture;
}();

var _xaperture =
/*#__PURE__*/
_curry2(function _xaperture(n, xf) {
  return new XAperture(n, xf);
});

module.exports = _xaperture;

/***/ }),

/***/ 3620:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _flatCat =
/*#__PURE__*/
__nccwpck_require__(8433);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);

var _xchain =
/*#__PURE__*/
_curry2(function _xchain(f, xf) {
  return map(f, _flatCat(xf));
});

module.exports = _xchain;

/***/ }),

/***/ 9796:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XDrop =
/*#__PURE__*/
function () {
  function XDrop(n, xf) {
    this.xf = xf;
    this.n = n;
  }

  XDrop.prototype['@@transducer/init'] = _xfBase.init;
  XDrop.prototype['@@transducer/result'] = _xfBase.result;

  XDrop.prototype['@@transducer/step'] = function (result, input) {
    if (this.n > 0) {
      this.n -= 1;
      return result;
    }

    return this.xf['@@transducer/step'](result, input);
  };

  return XDrop;
}();

var _xdrop =
/*#__PURE__*/
_curry2(function _xdrop(n, xf) {
  return new XDrop(n, xf);
});

module.exports = _xdrop;

/***/ }),

/***/ 3750:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XDropLast =
/*#__PURE__*/
function () {
  function XDropLast(n, xf) {
    this.xf = xf;
    this.pos = 0;
    this.full = false;
    this.acc = new Array(n);
  }

  XDropLast.prototype['@@transducer/init'] = _xfBase.init;

  XDropLast.prototype['@@transducer/result'] = function (result) {
    this.acc = null;
    return this.xf['@@transducer/result'](result);
  };

  XDropLast.prototype['@@transducer/step'] = function (result, input) {
    if (this.full) {
      result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
    }

    this.store(input);
    return result;
  };

  XDropLast.prototype.store = function (input) {
    this.acc[this.pos] = input;
    this.pos += 1;

    if (this.pos === this.acc.length) {
      this.pos = 0;
      this.full = true;
    }
  };

  return XDropLast;
}();

var _xdropLast =
/*#__PURE__*/
_curry2(function _xdropLast(n, xf) {
  return new XDropLast(n, xf);
});

module.exports = _xdropLast;

/***/ }),

/***/ 6957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XDropLastWhile =
/*#__PURE__*/
function () {
  function XDropLastWhile(fn, xf) {
    this.f = fn;
    this.retained = [];
    this.xf = xf;
  }

  XDropLastWhile.prototype['@@transducer/init'] = _xfBase.init;

  XDropLastWhile.prototype['@@transducer/result'] = function (result) {
    this.retained = null;
    return this.xf['@@transducer/result'](result);
  };

  XDropLastWhile.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.retain(result, input) : this.flush(result, input);
  };

  XDropLastWhile.prototype.flush = function (result, input) {
    result = _reduce(this.xf['@@transducer/step'], result, this.retained);
    this.retained = [];
    return this.xf['@@transducer/step'](result, input);
  };

  XDropLastWhile.prototype.retain = function (result, input) {
    this.retained.push(input);
    return result;
  };

  return XDropLastWhile;
}();

var _xdropLastWhile =
/*#__PURE__*/
_curry2(function _xdropLastWhile(fn, xf) {
  return new XDropLastWhile(fn, xf);
});

module.exports = _xdropLastWhile;

/***/ }),

/***/ 1349:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XDropRepeatsWith =
/*#__PURE__*/
function () {
  function XDropRepeatsWith(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.lastValue = undefined;
    this.seenFirstValue = false;
  }

  XDropRepeatsWith.prototype['@@transducer/init'] = _xfBase.init;
  XDropRepeatsWith.prototype['@@transducer/result'] = _xfBase.result;

  XDropRepeatsWith.prototype['@@transducer/step'] = function (result, input) {
    var sameAsLast = false;

    if (!this.seenFirstValue) {
      this.seenFirstValue = true;
    } else if (this.pred(this.lastValue, input)) {
      sameAsLast = true;
    }

    this.lastValue = input;
    return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
  };

  return XDropRepeatsWith;
}();

var _xdropRepeatsWith =
/*#__PURE__*/
_curry2(function _xdropRepeatsWith(pred, xf) {
  return new XDropRepeatsWith(pred, xf);
});

module.exports = _xdropRepeatsWith;

/***/ }),

/***/ 2591:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XDropWhile =
/*#__PURE__*/
function () {
  function XDropWhile(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
  XDropWhile.prototype['@@transducer/result'] = _xfBase.result;

  XDropWhile.prototype['@@transducer/step'] = function (result, input) {
    if (this.f) {
      if (this.f(input)) {
        return result;
      }

      this.f = null;
    }

    return this.xf['@@transducer/step'](result, input);
  };

  return XDropWhile;
}();

var _xdropWhile =
/*#__PURE__*/
_curry2(function _xdropWhile(f, xf) {
  return new XDropWhile(f, xf);
});

module.exports = _xdropWhile;

/***/ }),

/***/ 485:
/***/ ((module) => {

module.exports = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};

/***/ }),

/***/ 8114:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XFilter =
/*#__PURE__*/
function () {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;

  XFilter.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XFilter;
}();

var _xfilter =
/*#__PURE__*/
_curry2(function _xfilter(f, xf) {
  return new XFilter(f, xf);
});

module.exports = _xfilter;

/***/ }),

/***/ 3668:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XFind =
/*#__PURE__*/
function () {
  function XFind(f, xf) {
    this.xf = xf;
    this.f = f;
    this.found = false;
  }

  XFind.prototype['@@transducer/init'] = _xfBase.init;

  XFind.prototype['@@transducer/result'] = function (result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, void 0);
    }

    return this.xf['@@transducer/result'](result);
  };

  XFind.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, input));
    }

    return result;
  };

  return XFind;
}();

var _xfind =
/*#__PURE__*/
_curry2(function _xfind(f, xf) {
  return new XFind(f, xf);
});

module.exports = _xfind;

/***/ }),

/***/ 4571:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XFindIndex =
/*#__PURE__*/
function () {
  function XFindIndex(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.found = false;
  }

  XFindIndex.prototype['@@transducer/init'] = _xfBase.init;

  XFindIndex.prototype['@@transducer/result'] = function (result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, -1);
    }

    return this.xf['@@transducer/result'](result);
  };

  XFindIndex.prototype['@@transducer/step'] = function (result, input) {
    this.idx += 1;

    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, this.idx));
    }

    return result;
  };

  return XFindIndex;
}();

var _xfindIndex =
/*#__PURE__*/
_curry2(function _xfindIndex(f, xf) {
  return new XFindIndex(f, xf);
});

module.exports = _xfindIndex;

/***/ }),

/***/ 1639:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XFindLast =
/*#__PURE__*/
function () {
  function XFindLast(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFindLast.prototype['@@transducer/init'] = _xfBase.init;

  XFindLast.prototype['@@transducer/result'] = function (result) {
    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
  };

  XFindLast.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.last = input;
    }

    return result;
  };

  return XFindLast;
}();

var _xfindLast =
/*#__PURE__*/
_curry2(function _xfindLast(f, xf) {
  return new XFindLast(f, xf);
});

module.exports = _xfindLast;

/***/ }),

/***/ 4674:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XFindLastIndex =
/*#__PURE__*/
function () {
  function XFindLastIndex(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.lastIdx = -1;
  }

  XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;

  XFindLastIndex.prototype['@@transducer/result'] = function (result) {
    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
  };

  XFindLastIndex.prototype['@@transducer/step'] = function (result, input) {
    this.idx += 1;

    if (this.f(input)) {
      this.lastIdx = this.idx;
    }

    return result;
  };

  return XFindLastIndex;
}();

var _xfindLastIndex =
/*#__PURE__*/
_curry2(function _xfindLastIndex(f, xf) {
  return new XFindLastIndex(f, xf);
});

module.exports = _xfindLastIndex;

/***/ }),

/***/ 8542:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XMap =
/*#__PURE__*/
function () {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;

  XMap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return XMap;
}();

var _xmap =
/*#__PURE__*/
_curry2(function _xmap(f, xf) {
  return new XMap(f, xf);
});

module.exports = _xmap;

/***/ }),

/***/ 6093:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var _promap =
/*#__PURE__*/
__nccwpck_require__(5843);

var XPromap =
/*#__PURE__*/
function () {
  function XPromap(f, g, xf) {
    this.xf = xf;
    this.f = f;
    this.g = g;
  }

  XPromap.prototype['@@transducer/init'] = _xfBase.init;
  XPromap.prototype['@@transducer/result'] = _xfBase.result;

  XPromap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, _promap(this.f, this.g, input));
  };

  return XPromap;
}();

var _xpromap =
/*#__PURE__*/
_curry3(function _xpromap(f, g, xf) {
  return new XPromap(f, g, xf);
});

module.exports = _xpromap;

/***/ }),

/***/ 248:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curryN =
/*#__PURE__*/
__nccwpck_require__(4106);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XReduceBy =
/*#__PURE__*/
function () {
  function XReduceBy(valueFn, valueAcc, keyFn, xf) {
    this.valueFn = valueFn;
    this.valueAcc = valueAcc;
    this.keyFn = keyFn;
    this.xf = xf;
    this.inputs = {};
  }

  XReduceBy.prototype['@@transducer/init'] = _xfBase.init;

  XReduceBy.prototype['@@transducer/result'] = function (result) {
    var key;

    for (key in this.inputs) {
      if (_has(key, this.inputs)) {
        result = this.xf['@@transducer/step'](result, this.inputs[key]);

        if (result['@@transducer/reduced']) {
          result = result['@@transducer/value'];
          break;
        }
      }
    }

    this.inputs = null;
    return this.xf['@@transducer/result'](result);
  };

  XReduceBy.prototype['@@transducer/step'] = function (result, input) {
    var key = this.keyFn(input);
    this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
    this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
    return result;
  };

  return XReduceBy;
}();

var _xreduceBy =
/*#__PURE__*/
_curryN(4, [], function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
  return new XReduceBy(valueFn, valueAcc, keyFn, xf);
});

module.exports = _xreduceBy;

/***/ }),

/***/ 1664:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XTake =
/*#__PURE__*/
function () {
  function XTake(n, xf) {
    this.xf = xf;
    this.n = n;
    this.i = 0;
  }

  XTake.prototype['@@transducer/init'] = _xfBase.init;
  XTake.prototype['@@transducer/result'] = _xfBase.result;

  XTake.prototype['@@transducer/step'] = function (result, input) {
    this.i += 1;
    var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
    return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
  };

  return XTake;
}();

var _xtake =
/*#__PURE__*/
_curry2(function _xtake(n, xf) {
  return new XTake(n, xf);
});

module.exports = _xtake;

/***/ }),

/***/ 5265:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XTakeWhile =
/*#__PURE__*/
function () {
  function XTakeWhile(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
  XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;

  XTakeWhile.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
  };

  return XTakeWhile;
}();

var _xtakeWhile =
/*#__PURE__*/
_curry2(function _xtakeWhile(f, xf) {
  return new XTakeWhile(f, xf);
});

module.exports = _xtakeWhile;

/***/ }),

/***/ 3269:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XTap =
/*#__PURE__*/
function () {
  function XTap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XTap.prototype['@@transducer/init'] = _xfBase.init;
  XTap.prototype['@@transducer/result'] = _xfBase.result;

  XTap.prototype['@@transducer/step'] = function (result, input) {
    this.f(input);
    return this.xf['@@transducer/step'](result, input);
  };

  return XTap;
}();

var _xtap =
/*#__PURE__*/
_curry2(function _xtap(f, xf) {
  return new XTap(f, xf);
});

module.exports = _xtap;

/***/ }),

/***/ 9931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _Set =
/*#__PURE__*/
__nccwpck_require__(1781);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XUniqBy =
/*#__PURE__*/
function () {
  function XUniqBy(f, xf) {
    this.xf = xf;
    this.f = f;
    this.set = new _Set();
  }

  XUniqBy.prototype['@@transducer/init'] = _xfBase.init;
  XUniqBy.prototype['@@transducer/result'] = _xfBase.result;

  XUniqBy.prototype['@@transducer/step'] = function (result, input) {
    return this.set.add(this.f(input)) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XUniqBy;
}();

var _xuniqBy =
/*#__PURE__*/
_curry2(function _xuniqBy(f, xf) {
  return new XUniqBy(f, xf);
});

module.exports = _xuniqBy;

/***/ }),

/***/ 4902:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _includesWith =
/*#__PURE__*/
__nccwpck_require__(3968);

var _xfBase =
/*#__PURE__*/
__nccwpck_require__(485);

var XUniqWith =
/*#__PURE__*/
function () {
  function XUniqWith(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.items = [];
  }

  XUniqWith.prototype['@@transducer/init'] = _xfBase.init;
  XUniqWith.prototype['@@transducer/result'] = _xfBase.result;

  XUniqWith.prototype['@@transducer/step'] = function (result, input) {
    if (_includesWith(this.pred, input, this.items)) {
      return result;
    } else {
      this.items.push(input);
      return this.xf['@@transducer/step'](result, input);
    }
  };

  return XUniqWith;
}();

var _xuniqWith =
/*#__PURE__*/
_curry2(function _xuniqWith(pred, xf) {
  return new XUniqWith(pred, xf);
});

module.exports = _xuniqWith;

/***/ }),

/***/ 7393:
/***/ ((module) => {

var XWrap =
/*#__PURE__*/
function () {
  function XWrap(fn) {
    this.f = fn;
  }

  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };

  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };

  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}

module.exports = _xwrap;

/***/ }),

/***/ 6984:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includes =
/*#__PURE__*/
__nccwpck_require__(3148);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _filter =
/*#__PURE__*/
__nccwpck_require__(9038);

var flip =
/*#__PURE__*/
__nccwpck_require__(5804);

var uniq =
/*#__PURE__*/
__nccwpck_require__(272);
/**
 * Combines two lists into a set (i.e. no duplicates) composed of those
 * elements common to both lists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The list of elements found in both `list1` and `list2`.
 * @see R.innerJoin
 * @example
 *
 *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
 */


var intersection =
/*#__PURE__*/
_curry2(function intersection(list1, list2) {
  var lookupList, filteredList;

  if (list1.length > list2.length) {
    lookupList = list1;
    filteredList = list2;
  } else {
    lookupList = list2;
    filteredList = list1;
  }

  return uniq(_filter(flip(_includes)(lookupList), filteredList));
});

module.exports = intersection;

/***/ }),

/***/ 1823:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _checkForMethod =
/*#__PURE__*/
__nccwpck_require__(1373);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Creates a new list with the separator interposed between elements.
 *
 * Dispatches to the `intersperse` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} separator The element to add to the list.
 * @param {Array} list The list to be interposed.
 * @return {Array} The new list.
 * @example
 *
 *      R.intersperse('a', ['b', 'n', 'n', 's']); //=> ['b', 'a', 'n', 'a', 'n', 'a', 's']
 */


var intersperse =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('intersperse', function intersperse(separator, list) {
  var out = [];
  var idx = 0;
  var length = list.length;

  while (idx < length) {
    if (idx === length - 1) {
      out.push(list[idx]);
    } else {
      out.push(list[idx], separator);
    }

    idx += 1;
  }

  return out;
}));

module.exports = intersperse;

/***/ }),

/***/ 1375:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _clone =
/*#__PURE__*/
__nccwpck_require__(2726);

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _isTransformer =
/*#__PURE__*/
__nccwpck_require__(9949);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _stepCat =
/*#__PURE__*/
__nccwpck_require__(8808);
/**
 * Transforms the items of the list with the transducer and appends the
 * transformed items to the accumulator using an appropriate iterator function
 * based on the accumulator type.
 *
 * The accumulator can be an array, string, object or a transformer. Iterated
 * items will be appended to arrays and concatenated to strings. Objects will
 * be merged directly or 2-item arrays will be merged as key, value pairs.
 *
 * The accumulator can also be a transformer object that provides a 2-arity
 * reducing iterator function, step, 0-arity initial value function, init, and
 * 1-arity result extraction function result. The step function is used as the
 * iterator function in reduce. The result function is used to convert the
 * final accumulator into the return type and in most cases is R.identity. The
 * init function is used to provide the initial accumulator.
 *
 * The iteration is performed with [`R.reduce`](#reduce) after initializing the
 * transducer.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig a -> (b -> b) -> [c] -> a
 * @param {*} acc The initial accumulator value.
 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.transduce
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
 *
 *      R.into([], transducer, numbers); //=> [2, 3]
 *
 *      const intoArray = R.into([]);
 *      intoArray(transducer, numbers); //=> [2, 3]
 */


var into =
/*#__PURE__*/
_curry3(function into(acc, xf, list) {
  return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
});

module.exports = into;

/***/ }),

/***/ 3680:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * Same as [`R.invertObj`](#invertObj), however this accounts for objects with
 * duplicate values by putting the values into an array.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: [ s, ... ]}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object with keys in an array.
 * @see R.invertObj
 * @example
 *
 *      const raceResultsByFirstName = {
 *        first: 'alice',
 *        second: 'jake',
 *        third: 'alice',
 *      };
 *      R.invert(raceResultsByFirstName);
 *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
 */


var invert =
/*#__PURE__*/
_curry1(function invert(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = 0;
  var out = {};

  while (idx < len) {
    var key = props[idx];
    var val = obj[key];
    var list = _has(val, out) ? out[val] : out[val] = [];
    list[list.length] = key;
    idx += 1;
  }

  return out;
});

module.exports = invert;

/***/ }),

/***/ 7141:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * Returns a new object with the keys of the given object as values, and the
 * values of the given object, which are coerced to strings, as keys. Note
 * that the last key found is preferred when handling the same value.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: s}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object
 * @see R.invert
 * @example
 *
 *      const raceResults = {
 *        first: 'alice',
 *        second: 'jake'
 *      };
 *      R.invertObj(raceResults);
 *      //=> { 'alice': 'first', 'jake':'second' }
 *
 *      // Alternatively:
 *      const raceResults = ['alice', 'jake'];
 *      R.invertObj(raceResults);
 *      //=> { 'alice': '0', 'jake':'1' }
 */


var invertObj =
/*#__PURE__*/
_curry1(function invertObj(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = 0;
  var out = {};

  while (idx < len) {
    var key = props[idx];
    out[obj[key]] = key;
    idx += 1;
  }

  return out;
});

module.exports = invertObj;

/***/ }),

/***/ 4910:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isFunction =
/*#__PURE__*/
__nccwpck_require__(5997);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var toString =
/*#__PURE__*/
__nccwpck_require__(6119);
/**
 * Turns a named method with a specified arity into a function that can be
 * called directly supplied with arguments and a target object.
 *
 * The returned function is curried and accepts `arity + 1` parameters where
 * the final parameter is the target object.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
 * @param {Number} arity Number of arguments the returned function should take
 *        before the target object.
 * @param {String} method Name of any of the target object's methods to call.
 * @return {Function} A new curried function.
 * @see R.construct
 * @example
 *
 *      const sliceFrom = R.invoker(1, 'slice');
 *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
 *      const sliceFrom6 = R.invoker(2, 'slice')(6);
 *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
 *
 *      const dog = {
 *        speak: async () => 'Woof!'
 *      };
 *      const speak = R.invoker(0, 'speak');
 *      speak(dog).then(console.log) //~> 'Woof!'
 *
 * @symb R.invoker(0, 'method')(o) = o['method']()
 * @symb R.invoker(1, 'method')(a, o) = o['method'](a)
 * @symb R.invoker(2, 'method')(a, b, o) = o['method'](a, b)
 */


var invoker =
/*#__PURE__*/
_curry2(function invoker(arity, method) {
  return curryN(arity + 1, function () {
    var target = arguments[arity];

    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }

    throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
  });
});

module.exports = invoker;

/***/ }),

/***/ 4008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * See if an object (i.e. `val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 * If `val` was created using `Object.create`, `R.is(Object, val) === true`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Type
 * @sig (* -> {*}) -> a -> Boolean
 * @param {Object} ctor A constructor
 * @param {*} val The value to test
 * @return {Boolean}
 * @example
 *
 *      R.is(Object, {}); //=> true
 *      R.is(Number, 1); //=> true
 *      R.is(Object, 1); //=> false
 *      R.is(String, 's'); //=> true
 *      R.is(String, new String('')); //=> true
 *      R.is(Object, new String('')); //=> true
 *      R.is(Object, 's'); //=> false
 *      R.is(Number, {}); //=> false
 */


var is =
/*#__PURE__*/
_curry2(function is(Ctor, val) {
  return val instanceof Ctor || val != null && (val.constructor === Ctor || Ctor.name === 'Object' && typeof val === 'object');
});

module.exports = is;

/***/ }),

/***/ 9838:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var empty =
/*#__PURE__*/
__nccwpck_require__(7063);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);
/**
 * Returns `true` if the given value is its type's empty value; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> Boolean
 * @param {*} x
 * @return {Boolean}
 * @see R.empty
 * @example
 *
 *      R.isEmpty([1, 2, 3]);           //=> false
 *      R.isEmpty([]);                  //=> true
 *      R.isEmpty('');                  //=> true
 *      R.isEmpty(null);                //=> false
 *      R.isEmpty({});                  //=> true
 *      R.isEmpty({length: 0});         //=> false
 *      R.isEmpty(Uint8Array.from('')); //=> true
 */


var isEmpty =
/*#__PURE__*/
_curry1(function isEmpty(x) {
  return x != null && equals(x, empty(x));
});

module.exports = isEmpty;

/***/ }),

/***/ 6895:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Type
 * @sig * -> Boolean
 * @param {*} x The value to test.
 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
 * @example
 *
 *      R.isNil(null); //=> true
 *      R.isNil(undefined); //=> true
 *      R.isNil(0); //=> false
 *      R.isNil([]); //=> false
 */


var isNil =
/*#__PURE__*/
_curry1(function isNil(x) {
  return x == null;
});

module.exports = isNil;

/***/ }),

/***/ 3981:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var invoker =
/*#__PURE__*/
__nccwpck_require__(4910);
/**
 * Returns a string made by inserting the `separator` between each element and
 * concatenating all the elements into a single string.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig String -> [a] -> String
 * @param {Number|String} separator The string used to separate the elements.
 * @param {Array} xs The elements to join into a string.
 * @return {String} str The string made by concatenating `xs` with `separator`.
 * @see R.split
 * @example
 *
 *      const spacer = R.join(' ');
 *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
 *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
 */


var join =
/*#__PURE__*/
invoker(1, 'join');
module.exports = join;

/***/ }),

/***/ 1897:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var converge =
/*#__PURE__*/
__nccwpck_require__(810);
/**
 * juxt applies a list of functions to a list of values.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Function
 * @sig [(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])
 * @param {Array} fns An array of functions
 * @return {Function} A function that returns a list of values after applying each of the original `fns` to its parameters.
 * @see R.applySpec
 * @example
 *
 *      const getRange = R.juxt([Math.min, Math.max]);
 *      getRange(3, 4, 9, -3); //=> [-3, 9]
 * @symb R.juxt([f, g, h])(a, b) = [f(a, b), g(a, b), h(a, b)]
 */


var juxt =
/*#__PURE__*/
_curry1(function juxt(fns) {
  return converge(function () {
    return Array.prototype.slice.call(arguments, 0);
  }, fns);
});

module.exports = juxt;

/***/ }),

/***/ 6755:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var _isArguments =
/*#__PURE__*/
__nccwpck_require__(8989); // cover IE < 9 keys issues


var hasEnumBug = !
/*#__PURE__*/
{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

var hasArgsEnumBug =
/*#__PURE__*/
function () {
  'use strict';

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;

  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }

    idx += 1;
  }

  return false;
};
/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values, R.toPairs
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */


var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
/*#__PURE__*/
_curry1(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) :
/*#__PURE__*/
_curry1(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }

  var prop, nIdx;
  var ks = [];

  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }

  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;

    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];

      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }

      nIdx -= 1;
    }
  }

  return ks;
});
module.exports = keys;

/***/ }),

/***/ 1464:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Returns a list containing the names of all the properties of the supplied
 * object, including prototype properties.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own and prototype properties.
 * @see R.keys, R.valuesIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.keysIn(f); //=> ['x', 'y']
 */


var keysIn =
/*#__PURE__*/
_curry1(function keysIn(obj) {
  var prop;
  var ks = [];

  for (prop in obj) {
    ks[ks.length] = prop;
  }

  return ks;
});

module.exports = keysIn;

/***/ }),

/***/ 3855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var nth =
/*#__PURE__*/
__nccwpck_require__(7280);
/**
 * Returns the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.init, R.head, R.tail
 * @example
 *
 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
 *      R.last([]); //=> undefined
 *
 *      R.last('abc'); //=> 'c'
 *      R.last(''); //=> ''
 */


var last =
/*#__PURE__*/
nth(-1);
module.exports = last;

/***/ }),

/***/ 8054:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);
/**
 * Returns the position of the last occurrence of an item in an array, or -1 if
 * the item is not included in the array. [`R.equals`](#equals) is used to
 * determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Number
 * @param {*} target The item to find.
 * @param {Array} xs The array to search in.
 * @return {Number} the index of the target, or -1 if the target is not found.
 * @see R.indexOf, R.findLastIndex
 * @example
 *
 *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
 *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
 */


var lastIndexOf =
/*#__PURE__*/
_curry2(function lastIndexOf(target, xs) {
  if (typeof xs.lastIndexOf === 'function' && !_isArray(xs)) {
    return xs.lastIndexOf(target);
  } else {
    var idx = xs.length - 1;

    while (idx >= 0) {
      if (equals(xs[idx], target)) {
        return idx;
      }

      idx -= 1;
    }

    return -1;
  }
});

module.exports = lastIndexOf;

/***/ }),

/***/ 819:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _isNumber =
/*#__PURE__*/
__nccwpck_require__(7573);
/**
 * Returns the number of elements in the array by returning `list.length`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [a] -> Number
 * @param {Array} list The array to inspect.
 * @return {Number} The length of the array.
 * @example
 *
 *      R.length([]); //=> 0
 *      R.length([1, 2, 3]); //=> 3
 */


var length =
/*#__PURE__*/
_curry1(function length(list) {
  return list != null && _isNumber(list.length) ? list.length : NaN;
});

module.exports = length;

/***/ }),

/***/ 3076:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);
/**
 * Returns a lens for the given getter and setter functions. The getter "gets"
 * the value of the focus; the setter "sets" the value of the focus. The setter
 * should not mutate the data structure.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
 * @param {Function} getter
 * @param {Function} setter
 * @return {Lens}
 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
 * @example
 *
 *      const xLens = R.lens(R.prop('x'), R.assoc('x'));
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */


var lens =
/*#__PURE__*/
_curry2(function lens(getter, setter) {
  return function (toFunctorFn) {
    return function (target) {
      return map(function (focus) {
        return setter(focus, target);
      }, toFunctorFn(getter(target)));
    };
  };
});

module.exports = lens;

/***/ }),

/***/ 2757:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var lens =
/*#__PURE__*/
__nccwpck_require__(3076);

var nth =
/*#__PURE__*/
__nccwpck_require__(7280);

var update =
/*#__PURE__*/
__nccwpck_require__(129);
/**
 * Returns a lens whose focus is the specified index.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Number -> Lens s a
 * @param {Number} n
 * @return {Lens}
 * @see R.view, R.set, R.over, R.nth
 * @example
 *
 *      const headLens = R.lensIndex(0);
 *
 *      R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
 *      R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
 *      R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
 */


var lensIndex =
/*#__PURE__*/
_curry1(function lensIndex(n) {
  return lens(nth(n), update(n));
});

module.exports = lensIndex;

/***/ }),

/***/ 4540:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var assocPath =
/*#__PURE__*/
__nccwpck_require__(9947);

var lens =
/*#__PURE__*/
__nccwpck_require__(3076);

var path =
/*#__PURE__*/
__nccwpck_require__(2767);
/**
 * Returns a lens whose focus is the specified path.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig [Idx] -> Lens s a
 * @param {Array} path The path to use.
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      const xHeadYLens = R.lensPath(['x', 0, 'y']);
 *
 *      R.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> 2
 *      R.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
 *      R.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}
 */


var lensPath =
/*#__PURE__*/
_curry1(function lensPath(p) {
  return lens(path(p), assocPath(p));
});

module.exports = lensPath;

/***/ }),

/***/ 3704:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var assoc =
/*#__PURE__*/
__nccwpck_require__(3295);

var lens =
/*#__PURE__*/
__nccwpck_require__(3076);

var prop =
/*#__PURE__*/
__nccwpck_require__(2135);
/**
 * Returns a lens whose focus is the specified property.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig String -> Lens s a
 * @param {String} k
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */


var lensProp =
/*#__PURE__*/
_curry1(function lensProp(k) {
  return lens(prop(k), assoc(k));
});

module.exports = lensProp;

/***/ }),

/***/ 3934:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var liftN =
/*#__PURE__*/
__nccwpck_require__(3833);
/**
 * "lifts" a function of arity >= 1 so that it may "map over" a list, Function or other
 * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.liftN
 * @example
 *
 *      const madd3 = R.lift((a, b, c) => a + b + c);
 *
 *      madd3([100, 200], [30, 40], [5, 6, 7]); //=> [135, 136, 137, 145, 146, 147, 235, 236, 237, 245, 246, 247]
 *
 *      const madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);
 *
 *      madd5([10, 20], [1], [2, 3], [4], [100, 200]); //=> [117, 217, 118, 218, 127, 227, 128, 228]
 */


var lift =
/*#__PURE__*/
_curry1(function lift(fn) {
  return liftN(fn.length, fn);
});

module.exports = lift;

/***/ }),

/***/ 3833:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var ap =
/*#__PURE__*/
__nccwpck_require__(2857);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);
/**
 * "lifts" a function to be the specified arity, so that it may "map over" that
 * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig Number -> (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.lift, R.ap
 * @example
 *
 *      const madd3 = R.liftN(3, (...args) => R.sum(args));
 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
 */


var liftN =
/*#__PURE__*/
_curry2(function liftN(arity, fn) {
  var lifted = curryN(arity, fn);
  return curryN(arity, function () {
    return _reduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
});

module.exports = liftN;

/***/ }),

/***/ 2342:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns `true` if the first argument is less than the second; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @see R.gt
 * @example
 *
 *      R.lt(2, 1); //=> false
 *      R.lt(2, 2); //=> false
 *      R.lt(2, 3); //=> true
 *      R.lt('a', 'z'); //=> true
 *      R.lt('z', 'a'); //=> false
 */


var lt =
/*#__PURE__*/
_curry2(function lt(a, b) {
  return a < b;
});

module.exports = lt;

/***/ }),

/***/ 5973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns `true` if the first argument is less than or equal to the second;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @see R.gte
 * @example
 *
 *      R.lte(2, 1); //=> false
 *      R.lte(2, 2); //=> true
 *      R.lte(2, 3); //=> true
 *      R.lte('a', 'z'); //=> true
 *      R.lte('z', 'a'); //=> false
 */


var lte =
/*#__PURE__*/
_curry2(function lte(a, b) {
  return a <= b;
});

module.exports = lte;

/***/ }),

/***/ 8820:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _map =
/*#__PURE__*/
__nccwpck_require__(8077);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _xmap =
/*#__PURE__*/
__nccwpck_require__(8542);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex, R.pluck, R.project
 * @example
 *
 *      const double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */


var map =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function () {
        return fn.call(this, functor.apply(this, arguments));
      });

    case '[object Object]':
      return _reduce(function (acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));

    default:
      return _map(fn, functor);
  }
}));

module.exports = map;

/***/ }),

/***/ 3699:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * The `mapAccum` function behaves like a combination of map and reduce; it
 * applies a function to each element of a list, passing an accumulating
 * parameter from left to right, and returning a final value of this
 * accumulator together with the new list.
 *
 * The iterator function receives two arguments, *acc* and *value*, and should
 * return a tuple *[acc, value]*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.scan, R.addIndex, R.mapAccumRight
 * @example
 *
 *      const digits = ['1', '2', '3', '4'];
 *      const appender = (a, b) => [a + b, a + b];
 *
 *      R.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
 * @symb R.mapAccum(f, a, [b, c, d]) = [
 *   f(f(f(a, b)[0], c)[0], d)[0],
 *   [
 *     f(a, b)[1],
 *     f(f(a, b)[0], c)[1],
 *     f(f(f(a, b)[0], c)[0], d)[1]
 *   ]
 * ]
 */


var mapAccum =
/*#__PURE__*/
_curry3(function mapAccum(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var tuple = [acc];

  while (idx < len) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx += 1;
  }

  return [tuple[0], result];
});

module.exports = mapAccum;

/***/ }),

/***/ 9440:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * The `mapAccumRight` function behaves like a combination of map and reduce; it
 * applies a function to each element of a list, passing an accumulating
 * parameter from right to left, and returning a final value of this
 * accumulator together with the new list.
 *
 * Similar to [`mapAccum`](#mapAccum), except moves through the input list from
 * the right to the left.
 *
 * The iterator function receives two arguments, *acc* and *value*, and should
 * return a tuple *[acc, value]*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.addIndex, R.mapAccum
 * @example
 *
 *      const digits = ['1', '2', '3', '4'];
 *      const appender = (a, b) => [b + a, b + a];
 *
 *      R.mapAccumRight(appender, 5, digits); //=> ['12345', ['12345', '2345', '345', '45']]
 * @symb R.mapAccumRight(f, a, [b, c, d]) = [
 *   f(f(f(a, d)[0], c)[0], b)[0],
 *   [
 *     f(a, d)[1],
 *     f(f(a, d)[0], c)[1],
 *     f(f(f(a, d)[0], c)[0], b)[1]
 *   ]
 * ]
 */


var mapAccumRight =
/*#__PURE__*/
_curry3(function mapAccumRight(fn, acc, list) {
  var idx = list.length - 1;
  var result = [];
  var tuple = [acc];

  while (idx >= 0) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx -= 1;
  }

  return [tuple[0], result];
});

module.exports = mapAccumRight;

/***/ }),

/***/ 1986:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * An Object-specific version of [`map`](#map). The function is applied to three
 * arguments: *(value, key, obj)*. If only the value is significant, use
 * [`map`](#map) instead.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig ((*, String, Object) -> *) -> Object -> Object
 * @param {Function} fn
 * @param {Object} obj
 * @return {Object}
 * @see R.map
 * @example
 *
 *      const xyz = { x: 1, y: 2, z: 3 };
 *      const prependKeyAndDouble = (num, key, obj) => key + (num * 2);
 *
 *      R.mapObjIndexed(prependKeyAndDouble, xyz); //=> { x: 'x2', y: 'y4', z: 'z6' }
 */


var mapObjIndexed =
/*#__PURE__*/
_curry2(function mapObjIndexed(fn, obj) {
  return _reduce(function (acc, key) {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {}, keys(obj));
});

module.exports = mapObjIndexed;

/***/ }),

/***/ 8964:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Tests a regular expression against a String. Note that this function will
 * return an empty array when there are no matches. This differs from
 * [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
 * which returns `null` when there are no matches.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig RegExp -> String -> [String | Undefined]
 * @param {RegExp} rx A regular expression.
 * @param {String} str The string to match against
 * @return {Array} The list of matches or empty array.
 * @see R.test
 * @example
 *
 *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
 *      R.match(/a/, 'b'); //=> []
 *      R.match(/a/, null); //=> TypeError: null does not have a method named "match"
 */


var match =
/*#__PURE__*/
_curry2(function match(rx, str) {
  return str.match(rx) || [];
});

module.exports = match;

/***/ }),

/***/ 6733:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);
/**
 * `mathMod` behaves like the modulo operator should mathematically, unlike the
 * `%` operator (and by extension, [`R.modulo`](#modulo)). So while
 * `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`. `mathMod` requires Integer
 * arguments, and returns NaN when the modulus is zero or negative.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} m The dividend.
 * @param {Number} p the modulus.
 * @return {Number} The result of `b mod a`.
 * @see R.modulo
 * @example
 *
 *      R.mathMod(-17, 5);  //=> 3
 *      R.mathMod(17, 5);   //=> 2
 *      R.mathMod(17, -5);  //=> NaN
 *      R.mathMod(17, 0);   //=> NaN
 *      R.mathMod(17.2, 5); //=> NaN
 *      R.mathMod(17, 5.3); //=> NaN
 *
 *      const clock = R.mathMod(R.__, 12);
 *      clock(15); //=> 3
 *      clock(24); //=> 0
 *
 *      const seventeenMod = R.mathMod(17);
 *      seventeenMod(3);  //=> 2
 *      seventeenMod(4);  //=> 1
 *      seventeenMod(10); //=> 7
 */


var mathMod =
/*#__PURE__*/
_curry2(function mathMod(m, p) {
  if (!_isInteger(m)) {
    return NaN;
  }

  if (!_isInteger(p) || p < 1) {
    return NaN;
  }

  return (m % p + p) % p;
});

module.exports = mathMod;

/***/ }),

/***/ 9356:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns the larger of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.maxBy, R.min
 * @example
 *
 *      R.max(789, 123); //=> 789
 *      R.max('a', 'b'); //=> 'b'
 */


var max =
/*#__PURE__*/
_curry2(function max(a, b) {
  return b > a ? b : a;
});

module.exports = max;

/***/ }),

/***/ 976:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Takes a function and two values, and returns whichever value produces the
 * larger result when passed to the provided function.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Relation
 * @sig Ord b => (a -> b) -> a -> a -> a
 * @param {Function} f
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.max, R.minBy
 * @example
 *
 *      //  square :: Number -> Number
 *      const square = n => n * n;
 *
 *      R.maxBy(square, -3, 2); //=> -3
 *
 *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
 *      R.reduce(R.maxBy(square), 0, []); //=> 0
 */


var maxBy =
/*#__PURE__*/
_curry3(function maxBy(f, a, b) {
  return f(b) > f(a) ? b : a;
});

module.exports = maxBy;

/***/ }),

/***/ 7527:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var sum =
/*#__PURE__*/
__nccwpck_require__(4761);
/**
 * Returns the mean of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.median
 * @example
 *
 *      R.mean([2, 7, 9]); //=> 6
 *      R.mean([]); //=> NaN
 */


var mean =
/*#__PURE__*/
_curry1(function mean(list) {
  return sum(list) / list.length;
});

module.exports = mean;

/***/ }),

/***/ 3966:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var mean =
/*#__PURE__*/
__nccwpck_require__(7527);
/**
 * Returns the median of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.mean
 * @example
 *
 *      R.median([2, 9, 7]); //=> 7
 *      R.median([7, 2, 10, 9]); //=> 8
 *      R.median([]); //=> NaN
 */


var median =
/*#__PURE__*/
_curry1(function median(list) {
  var len = list.length;

  if (len === 0) {
    return NaN;
  }

  var width = 2 - len % 2;
  var idx = (len - width) / 2;
  return mean(Array.prototype.slice.call(list, 0).sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }).slice(idx, idx + width));
});

module.exports = median;

/***/ }),

/***/ 2454:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);
/**
 * Creates a new function that, when invoked, caches the result of calling `fn`
 * for a given argument set and returns the result. Subsequent calls to the
 * memoized `fn` with the same argument set will not result in an additional
 * call to `fn`; instead, the cached result for that set of arguments will be
 * returned.
 *
 * Care must be taken when implementing key generation to avoid key collision,
 * or if tracking references, memory leaks and mutating arguments.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Function
 * @sig (*... -> String) -> (*... -> a) -> (*... -> a)
 * @param {Function} fn The function to generate the cache key.
 * @param {Function} fn The function to memoize.
 * @return {Function} Memoized version of `fn`.
 * @example
 *
 *      let count = 0;
 *      const factorial = R.memoizeWith(Number, n => {
 *        count += 1;
 *        return R.product(R.range(1, n + 1));
 *      });
 *      factorial(5); //=> 120
 *      factorial(5); //=> 120
 *      factorial(5); //=> 120
 *      count; //=> 1
 */


var memoizeWith =
/*#__PURE__*/
_curry2(function memoizeWith(mFn, fn) {
  var cache = {};
  return _arity(fn.length, function () {
    var key = mFn.apply(this, arguments);

    if (!_has(key, cache)) {
      cache[key] = fn.apply(this, arguments);
    }

    return cache[key];
  });
});

module.exports = memoizeWith;

/***/ }),

/***/ 3616:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _objectAssign =
/*#__PURE__*/
__nccwpck_require__(5291);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Creates one new object with the own properties from a list of objects.
 * If a key exists in more than one object, the value from the last
 * object it exists in will be used.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig [{k: v}] -> {k: v}
 * @param {Array} list An array of objects
 * @return {Object} A merged object.
 * @see R.reduce
 * @example
 *
 *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
 *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
 * @symb R.mergeAll([{ x: 1 }, { y: 2 }, { z: 3 }]) = { x: 1, y: 2, z: 3 }
 */


var mergeAll =
/*#__PURE__*/
_curry1(function mergeAll(list) {
  return _objectAssign.apply(null, [{}].concat(list));
});

module.exports = mergeAll;

/***/ }),

/***/ 6707:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var mergeDeepWithKey =
/*#__PURE__*/
__nccwpck_require__(9500);
/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the first object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepRight, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepLeft({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                      { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 10, contact: { email: 'moo@example.com' }}
 */


var mergeDeepLeft =
/*#__PURE__*/
_curry2(function mergeDeepLeft(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return lVal;
  }, lObj, rObj);
});

module.exports = mergeDeepLeft;

/***/ }),

/***/ 9277:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var mergeDeepWithKey =
/*#__PURE__*/
__nccwpck_require__(9500);
/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                       { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
 */


var mergeDeepRight =
/*#__PURE__*/
_curry2(function mergeDeepRight(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});

module.exports = mergeDeepRight;

/***/ }),

/***/ 3007:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var mergeDeepWithKey =
/*#__PURE__*/
__nccwpck_require__(9500);
/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to associated values using the
 *   resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepWith(R.concat,
 *                      { a: true, c: { values: [10, 20] }},
 *                      { b: true, c: { values: [15, 35] }});
 *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
 */


var mergeDeepWith =
/*#__PURE__*/
_curry3(function mergeDeepWith(fn, lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return fn(lVal, rVal);
  }, lObj, rObj);
});

module.exports = mergeDeepWith;

/***/ }),

/***/ 9500:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _isObject =
/*#__PURE__*/
__nccwpck_require__(774);

var mergeWithKey =
/*#__PURE__*/
__nccwpck_require__(3206);
/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to the key and associated values
 *   using the resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWithKey, R.mergeDeepWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeDeepWithKey(concatValues,
 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
 */


var mergeDeepWithKey =
/*#__PURE__*/
_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
  return mergeWithKey(function (k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});

module.exports = mergeDeepWithKey;

/***/ }),

/***/ 3970:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _objectAssign =
/*#__PURE__*/
__nccwpck_require__(5291);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the first object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeRight, R.mergeDeepLeft, R.mergeWith, R.mergeWithKey
 * @example
 *
 *      R.mergeLeft({ 'age': 40 }, { 'name': 'fred', 'age': 10 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const resetToDefault = R.mergeLeft({x: 0});
 *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
 * @symb R.mergeLeft(a, b) = {...b, ...a}
 */


var mergeLeft =
/*#__PURE__*/
_curry2(function mergeLeft(l, r) {
  return _objectAssign({}, r, l);
});

module.exports = mergeLeft;

/***/ }),

/***/ 3004:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _objectAssign =
/*#__PURE__*/
__nccwpck_require__(5291);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeLeft, R.mergeDeepRight, R.mergeWith, R.mergeWithKey
 * @example
 *
 *      R.mergeRight({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const withDefaults = R.mergeRight({x: 0, y: 0});
 *      withDefaults({y: 2}); //=> {x: 0, y: 2}
 * @symb R.mergeRight(a, b) = {...a, ...b}
 */


var mergeRight =
/*#__PURE__*/
_curry2(function mergeRight(l, r) {
  return _objectAssign({}, l, r);
});

module.exports = mergeRight;

/***/ }),

/***/ 5661:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var mergeWithKey =
/*#__PURE__*/
__nccwpck_require__(3206);
/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the values
 * associated with the key in each object, with the result being used as the
 * value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWith, R.merge, R.mergeWithKey
 * @example
 *
 *      R.mergeWith(R.concat,
 *                  { a: true, values: [10, 20] },
 *                  { b: true, values: [15, 35] });
 *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
 */


var mergeWith =
/*#__PURE__*/
_curry3(function mergeWith(fn, l, r) {
  return mergeWithKey(function (_, _l, _r) {
    return fn(_l, _r);
  }, l, r);
});

module.exports = mergeWith;

/***/ }),

/***/ 3206:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);
/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the key
 * and the values associated with the key in each object, with the result being
 * used as the value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeWithKey(concatValues,
 *                     { a: true, thing: 'foo', values: [10, 20] },
 *                     { b: true, thing: 'bar', values: [15, 35] });
 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
 */


var mergeWithKey =
/*#__PURE__*/
_curry3(function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
});

module.exports = mergeWithKey;

/***/ }),

/***/ 3229:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns the smaller of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.minBy, R.max
 * @example
 *
 *      R.min(789, 123); //=> 123
 *      R.min('a', 'b'); //=> 'a'
 */


var min =
/*#__PURE__*/
_curry2(function min(a, b) {
  return b < a ? b : a;
});

module.exports = min;

/***/ }),

/***/ 154:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Takes a function and two values, and returns whichever value produces the
 * smaller result when passed to the provided function.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Relation
 * @sig Ord b => (a -> b) -> a -> a -> a
 * @param {Function} f
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.min, R.maxBy
 * @example
 *
 *      //  square :: Number -> Number
 *      const square = n => n * n;
 *
 *      R.minBy(square, -3, 2); //=> 2
 *
 *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
 *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
 */


var minBy =
/*#__PURE__*/
_curry3(function minBy(f, a, b) {
  return f(b) < f(a) ? b : a;
});

module.exports = minBy;

/***/ }),

/***/ 2720:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var modifyPath =
/*#__PURE__*/
__nccwpck_require__(478);
/**
 * Creates a copy of the passed object by applying an `fn` function to the given `prop` property.
 *
 * The function will not be invoked, and the object will not change
 * if its corresponding property does not exist in the object.
 * All non-primitive properties are copied to the new object by reference.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig Idx -> (v -> v) -> {k: v} -> {k: v}
 * @param {String|Number} prop The property to be modified.
 * @param {Function} fn The function to apply to the property.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const person = {name: 'James', age: 20, pets: ['dog', 'cat']};
 *      R.modify('age', R.add(1), person); //=> {name: 'James', age: 21, pets: ['dog', 'cat']}
 *      R.modify('pets', R.append('turtle'), person); //=> {name: 'James', age: 20, pets: ['dog', 'cat', 'turtle']}
 */


var modify =
/*#__PURE__*/
_curry3(function modify(prop, fn, object) {
  return modifyPath([prop], fn, object);
});

module.exports = modify;

/***/ }),

/***/ 478:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _isObject =
/*#__PURE__*/
__nccwpck_require__(774);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var _assoc =
/*#__PURE__*/
__nccwpck_require__(4702);

var _modify =
/*#__PURE__*/
__nccwpck_require__(9245);
/**
 * Creates a shallow clone of the passed object by applying an `fn` function
 * to the value at the given path.
 *
 * The function will not be invoked, and the object will not change
 * if its corresponding path does not exist in the object.
 * All non-primitive properties are copied to the new object by reference.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig [Idx] -> (v -> v) -> {k: v} -> {k: v}
 * @param {Array} path The path to be modified.
 * @param {Function} fn The function to apply to the path.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const person = {name: 'James', address: { zipCode: '90216' }};
 *      R.modifyPath(['address', 'zipCode'], R.reverse, person); //=> {name: 'James', address: { zipCode: '61209' }}
 *
 *      // Can handle arrays too
 *      const person = {name: 'James', addresses: [{ zipCode: '90216' }]};
 *      R.modifyPath(['addresses', 0, 'zipCode'], R.reverse, person); //=> {name: 'James', addresses: [{ zipCode: '61209' }]}
 */


var modifyPath =
/*#__PURE__*/
_curry3(function modifyPath(path, fn, object) {
  if (!_isObject(object) && !_isArray(object) || path.length === 0) {
    return object;
  }

  var idx = path[0];

  if (!_has(idx, object)) {
    return object;
  }

  if (path.length === 1) {
    return _modify(idx, fn, object);
  }

  var val = modifyPath(Array.prototype.slice.call(path, 1), fn, object[idx]);

  if (val === object[idx]) {
    return object;
  }

  return _assoc(idx, val, object);
});

module.exports = modifyPath;

/***/ }),

/***/ 3386:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Divides the first parameter by the second and returns the remainder. Note
 * that this function preserves the JavaScript-style behavior for modulo. For
 * mathematical modulo see [`mathMod`](#mathMod).
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The value to the divide.
 * @param {Number} b The pseudo-modulus
 * @return {Number} The result of `b % a`.
 * @see R.mathMod
 * @example
 *
 *      R.modulo(17, 3); //=> 2
 *      // JS behavior:
 *      R.modulo(-17, 3); //=> -2
 *      R.modulo(17, -3); //=> 2
 *
 *      const isOdd = R.modulo(R.__, 2);
 *      isOdd(42); //=> 0
 *      isOdd(21); //=> 1
 */


var modulo =
/*#__PURE__*/
_curry2(function modulo(a, b) {
  return a % b;
});

module.exports = modulo;

/***/ }),

/***/ 8801:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Move an item, at index `from`, to index `to`, in a list of elements.
 * A new list will be created containing the new elements order.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} from The source index
 * @param {Number} to The destination index
 * @param {Array} list The list which will serve to realise the move
 * @return {Array} The new list reordered
 * @example
 *
 *      R.move(0, 2, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['b', 'c', 'a', 'd', 'e', 'f']
 *      R.move(-1, 0, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['f', 'a', 'b', 'c', 'd', 'e'] list rotation
 */


var move =
/*#__PURE__*/
_curry3(function (from, to, list) {
  var length = list.length;
  var result = list.slice();
  var positiveFrom = from < 0 ? length + from : from;
  var positiveTo = to < 0 ? length + to : to;
  var item = result.splice(positiveFrom, 1);
  return positiveFrom < 0 || positiveFrom >= list.length || positiveTo < 0 || positiveTo >= list.length ? list : [].concat(result.slice(0, positiveTo)).concat(item).concat(result.slice(positiveTo, list.length));
});

module.exports = move;

/***/ }),

/***/ 3858:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Multiplies two numbers. Equivalent to `a * b` but curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a * b`.
 * @see R.divide
 * @example
 *
 *      const double = R.multiply(2);
 *      const triple = R.multiply(3);
 *      double(3);       //=>  6
 *      triple(4);       //=> 12
 *      R.multiply(2, 5);  //=> 10
 */


var multiply =
/*#__PURE__*/
_curry2(function multiply(a, b) {
  return a * b;
});

module.exports = multiply;

/***/ }),

/***/ 2843:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly `n` parameters. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} n The desired arity of the new function.
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity `n`.
 * @see R.binary, R.unary
 * @example
 *
 *      const takesTwoArgs = (a, b) => [a, b];
 *
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      const takesOneArg = R.nAry(1, takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // Only `n` arguments are passed to the wrapped function
 *      takesOneArg(1, 2); //=> [1, undefined]
 * @symb R.nAry(0, f)(a, b) = f()
 * @symb R.nAry(1, f)(a, b) = f(a)
 * @symb R.nAry(2, f)(a, b) = f(a, b)
 */


var nAry =
/*#__PURE__*/
_curry2(function nAry(n, fn) {
  switch (n) {
    case 0:
      return function () {
        return fn.call(this);
      };

    case 1:
      return function (a0) {
        return fn.call(this, a0);
      };

    case 2:
      return function (a0, a1) {
        return fn.call(this, a0, a1);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.call(this, a0, a1, a2);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.call(this, a0, a1, a2, a3);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.call(this, a0, a1, a2, a3, a4);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.call(this, a0, a1, a2, a3, a4, a5);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
      };

    default:
      throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
  }
});

module.exports = nAry;

/***/ }),

/***/ 5905:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Negates its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number}
 * @example
 *
 *      R.negate(42); //=> -42
 */


var negate =
/*#__PURE__*/
_curry1(function negate(n) {
  return -n;
});

module.exports = negate;

/***/ }),

/***/ 2207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _complement =
/*#__PURE__*/
__nccwpck_require__(3134);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var all =
/*#__PURE__*/
__nccwpck_require__(6097);
/**
 * Returns `true` if no elements of the list match the predicate, `false`
 * otherwise.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
 * @see R.all, R.any
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *      const isOdd = n => n % 2 !== 0;
 *
 *      R.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true
 *      R.none(isOdd, [1, 3, 5, 7, 8, 11]); //=> false
 */


var none =
/*#__PURE__*/
_curry2(function none(fn, input) {
  return all(_complement(fn), input);
});

module.exports = none;

/***/ }),

/***/ 3991:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * A function that returns the `!` of its argument. It will return `true` when
 * passed false-y value, and `false` when passed a truth-y one.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig * -> Boolean
 * @param {*} a any value
 * @return {Boolean} the logical inverse of passed argument.
 * @see R.complement
 * @example
 *
 *      R.not(true); //=> false
 *      R.not(false); //=> true
 *      R.not(0); //=> true
 *      R.not(1); //=> false
 */


var not =
/*#__PURE__*/
_curry1(function not(a) {
  return !a;
});

module.exports = not;

/***/ }),

/***/ 7280:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isString =
/*#__PURE__*/
__nccwpck_require__(9076);
/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      const list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */


var nth =
/*#__PURE__*/
_curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});

module.exports = nth;

/***/ }),

/***/ 6295:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var nth =
/*#__PURE__*/
__nccwpck_require__(7280);
/**
 * Returns a function which returns its nth argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig Number -> *... -> *
 * @param {Number} n
 * @return {Function}
 * @example
 *
 *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
 *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
 * @symb R.nthArg(-1)(a, b, c) = c
 * @symb R.nthArg(0)(a, b, c) = a
 * @symb R.nthArg(1)(a, b, c) = b
 */


var nthArg =
/*#__PURE__*/
_curry1(function nthArg(n) {
  var arity = n < 0 ? 1 : n + 1;
  return curryN(arity, function () {
    return nth(n, arguments);
  });
});

module.exports = nthArg;

/***/ }),

/***/ 6843:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * `o` is a curried composition function that returns a unary function.
 * Like [`compose`](#compose), `o` performs right-to-left function composition.
 * Unlike [`compose`](#compose), the rightmost function passed to `o` will be
 * invoked with only one argument. Also, unlike [`compose`](#compose), `o` is
 * limited to accepting only 2 unary functions. The name o was chosen because
 * of its similarity to the mathematical composition operator ∘.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Function
 * @sig (b -> c) -> (a -> b) -> a -> c
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 * @see R.compose, R.pipe
 * @example
 *
 *      const classyGreeting = name => "The name's " + name.last + ", " + name.first + " " + name.last
 *      const yellGreeting = R.o(R.toUpper, classyGreeting);
 *      yellGreeting({first: 'James', last: 'Bond'}); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.o(R.multiply(10), R.add(10))(-4) //=> 60
 *
 * @symb R.o(f, g, x) = f(g(x))
 */


var o =
/*#__PURE__*/
_curry3(function o(f, g, x) {
  return f(g(x));
});

module.exports = o;

/***/ }),

/***/ 4572:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Creates an object containing a single key:value pair.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @sig String -> a -> {String:a}
 * @param {String} key
 * @param {*} val
 * @return {Object}
 * @see R.pair
 * @example
 *
 *      const matchPhrases = R.compose(
 *        R.objOf('must'),
 *        R.map(R.objOf('match_phrase'))
 *      );
 *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
 */


var objOf =
/*#__PURE__*/
_curry2(function objOf(key, val) {
  var obj = {};
  obj[key] = val;
  return obj;
});

module.exports = objOf;

/***/ }),

/***/ 6898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _of =
/*#__PURE__*/
__nccwpck_require__(7327);
/**
 * Returns a singleton array containing the value provided.
 *
 * Note this `of` is different from the ES6 `of`; See
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> [a]
 * @param {*} x any value
 * @return {Array} An array wrapping `x`.
 * @example
 *
 *      R.of(null); //=> [null]
 *      R.of([42]); //=> [[42]]
 */


var of =
/*#__PURE__*/
_curry1(_of);

module.exports = of;

/***/ }),

/***/ 737:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [String] -> {String: *} -> {String: *}
 * @param {Array} names an array of String property names to omit from the new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with properties from `names` not on it.
 * @see R.pick
 * @example
 *
 *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
 */


var omit =
/*#__PURE__*/
_curry2(function omit(names, obj) {
  var result = {};
  var index = {};
  var idx = 0;
  var len = names.length;

  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }

  for (var prop in obj) {
    if (!index.hasOwnProperty(prop)) {
      result[prop] = obj[prop];
    }
  }

  return result;
});

module.exports = omit;

/***/ }),

/***/ 6618:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var curryN =
/*#__PURE__*/
__nccwpck_require__(4106);
/**
 * Takes a binary function `f`, a unary function `g`, and two values.
 * Applies `g` to each value, then applies the result of each to `f`.
 *
 * Also known as the P combinator.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Function
 * @sig ((a, a) -> b) -> (c -> a) -> c -> c -> b
 * @param {Function} f a binary function
 * @param {Function} g a unary function
 * @param {any} a any value
 * @param {any} b any value
 * @return {any} The result of `f`
 * @example
 *
 *      const eqBy = R.on((a, b) => a === b);
 *      eqBy(R.prop('a'), {b:0, a:1}, {a:1}) //=> true;
 *
 *      const containsInsensitive = R.on(R.contains, R.toLower);
 *      containsInsensitive('o', 'FOO'); //=> true
 * @symb R.on(f, g, a, b) = f(g(a), g(b))
 */


var on =
/*#__PURE__*/
curryN(4, [], function on(f, g, a, b) {
  return f(g(a), g(b));
});
module.exports = on;

/***/ }),

/***/ 8111:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Accepts a function `fn` and returns a function that guards invocation of
 * `fn` such that `fn` can only ever be called once, no matter how many times
 * the returned function is invoked. The first value calculated is returned in
 * subsequent invocations.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a... -> b) -> (a... -> b)
 * @param {Function} fn The function to wrap in a call-only-once wrapper.
 * @return {Function} The wrapped function.
 * @example
 *
 *      const addOneOnce = R.once(x => x + 1);
 *      addOneOnce(10); //=> 11
 *      addOneOnce(addOneOnce(50)); //=> 11
 */


var once =
/*#__PURE__*/
_curry1(function once(fn) {
  var called = false;
  var result;
  return _arity(fn.length, function () {
    if (called) {
      return result;
    }

    called = true;
    result = fn.apply(this, arguments);
    return result;
  });
});

module.exports = once;

/***/ }),

/***/ 5283:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns the first argument if it is truthy, otherwise the second argument.
 * Acts as the boolean `or` statement if both inputs are `Boolean`s.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any}
 * @see R.either, R.and
 * @example
 *
 *      R.or(true, true); //=> true
 *      R.or(true, false); //=> true
 *      R.or(false, true); //=> true
 *      R.or(false, false); //=> false
 */


var or =
/*#__PURE__*/
_curry2(function or(a, b) {
  return a || b;
});

module.exports = or;

/***/ }),

/***/ 9380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _assertPromise =
/*#__PURE__*/
__nccwpck_require__(4549);
/**
 * Returns the result of applying the onFailure function to the value inside
 * a failed promise. This is useful for handling rejected promises
 * inside function compositions.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig (e -> b) -> (Promise e a) -> (Promise e b)
 * @sig (e -> (Promise f b)) -> (Promise e a) -> (Promise f b)
 * @param {Function} onFailure The function to apply. Can return a value or a promise of a value.
 * @param {Promise} p
 * @return {Promise} The result of calling `p.then(null, onFailure)`
 * @see R.andThen
 * @example
 *
 *      const failedFetch = id => Promise.reject('bad ID');
 *      const useDefault = () => ({ firstName: 'Bob', lastName: 'Loblaw' });
 *
 *      //recoverFromFailure :: String -> Promise ({ firstName, lastName })
 *      const recoverFromFailure = R.pipe(
 *        failedFetch,
 *        R.otherwise(useDefault),
 *        R.andThen(R.pick(['firstName', 'lastName'])),
 *      );
 *      recoverFromFailure(12345).then(console.log);
 */


var otherwise =
/*#__PURE__*/
_curry2(function otherwise(f, p) {
  _assertPromise('otherwise', p);

  return p.then(null, f);
});

module.exports = otherwise;

/***/ }),

/***/ 9185:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597); // `Identity` is a functor that holds a single value, where `map` simply
// transforms the held value with the provided function.


var Identity = function (x) {
  return {
    value: x,
    map: function (f) {
      return Identity(f(x));
    }
  };
};
/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the result of applying the given function to
 * the focused value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> (a -> a) -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.view, R.set, R.lens, R.lensIndex, R.lensProp, R.lensPath
 * @example
 *
 *      const headLens = R.lensIndex(0);
 *
 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 */


var over =
/*#__PURE__*/
_curry3(function over(lens, f, x) {
  // The value returned by the getter function is first transformed with `f`,
  // then set as the value of an `Identity`. This is then mapped over with the
  // setter function of the lens.
  return lens(function (y) {
    return Identity(f(y));
  })(x).value;
});

module.exports = over;

/***/ }),

/***/ 7314:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category List
 * @sig a -> b -> (a,b)
 * @param {*} fst
 * @param {*} snd
 * @return {Array}
 * @see R.objOf, R.of
 * @example
 *
 *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
 */


var pair =
/*#__PURE__*/
_curry2(function pair(fst, snd) {
  return [fst, snd];
});

module.exports = pair;

/***/ }),

/***/ 4982:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _createPartialApplicator =
/*#__PURE__*/
__nccwpck_require__(8981);
/**
 * Takes a function `f` and a list of arguments, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the arguments
 * provided initially followed by the arguments provided to `g`.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
 * @param {Function} f
 * @param {Array} args
 * @return {Function}
 * @see R.partialRight, R.curry
 * @example
 *
 *      const multiply2 = (a, b) => a * b;
 *      const double = R.partial(multiply2, [2]);
 *      double(3); //=> 6
 *
 *      const greet = (salutation, title, firstName, lastName) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const sayHello = R.partial(greet, ['Hello']);
 *      const sayHelloToMs = R.partial(sayHello, ['Ms.']);
 *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partial(f, [a, b])(c, d) = f(a, b, c, d)
 */


var partial =
/*#__PURE__*/
_createPartialApplicator(_concat);

module.exports = partial;

/***/ }),

/***/ 1291:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

var mergeDeepRight =
/*#__PURE__*/
__nccwpck_require__(9277);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Takes a function `f` and an object, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the object
 * provided initially merged deeply (right) with the object provided as an argument to `g`.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Function
 * @sig (({ a, b, c, ..., n }) -> x) -> { a, b, c, ...} -> ({ d, e, f, ..., n } -> x)
 * @param {Function} f
 * @param {Object} props
 * @return {Function}
 * @see R.partial, R.partialRight, R.curry, R.mergeDeepRight
 * @example
 *
 *      const multiply2 = ({ a, b }) => a * b;
 *      const double = R.partialObject(multiply2, { a: 2 });
 *      double({ b: 2 }); //=> 4
 *
 *      const greet = ({ salutation, title, firstName, lastName }) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const sayHello = R.partialObject(greet, { salutation: 'Hello' });
 *      const sayHelloToMs = R.partialObject(sayHello, { title: 'Ms.' });
 *      sayHelloToMs({ firstName: 'Jane', lastName: 'Jones' }); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partialObject(f, { a, b })({ c, d }) = f({ a, b, c, d })
 */


module.exports =
/*#__PURE__*/
_curry2((f, o) => props => f.call(this, mergeDeepRight(o, props)));

/***/ }),

/***/ 1136:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _createPartialApplicator =
/*#__PURE__*/
__nccwpck_require__(8981);

var flip =
/*#__PURE__*/
__nccwpck_require__(5804);
/**
 * Takes a function `f` and a list of arguments, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the arguments
 * provided to `g` followed by the arguments provided initially.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
 * @param {Function} f
 * @param {Array} args
 * @return {Function}
 * @see R.partial
 * @example
 *
 *      const greet = (salutation, title, firstName, lastName) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
 *
 *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partialRight(f, [a, b])(c, d) = f(c, d, a, b)
 */


var partialRight =
/*#__PURE__*/
_createPartialApplicator(
/*#__PURE__*/
flip(_concat));

module.exports = partialRight;

/***/ }),

/***/ 776:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var filter =
/*#__PURE__*/
__nccwpck_require__(983);

var juxt =
/*#__PURE__*/
__nccwpck_require__(1897);

var reject =
/*#__PURE__*/
__nccwpck_require__(1545);
/**
 * Takes a predicate and a list or other `Filterable` object and returns the
 * pair of filterable objects of the same type of elements which do and do not
 * satisfy, the predicate, respectively. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> [f a, f a]
 * @param {Function} pred A predicate to determine which side the element belongs to.
 * @param {Array} filterable the list (or other filterable) to partition.
 * @return {Array} An array, containing first the subset of elements that satisfy the
 *         predicate, and second the subset of elements that do not satisfy.
 * @see R.filter, R.reject
 * @example
 *
 *      R.partition(R.includes('s'), ['sss', 'ttt', 'foo', 'bars']);
 *      // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
 *
 *      R.partition(R.includes('s'), { a: 'sss', b: 'ttt', foo: 'bars' });
 *      // => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]
 */


var partition =
/*#__PURE__*/
juxt([filter, reject]);
module.exports = partition;

/***/ }),

/***/ 2767:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var paths =
/*#__PURE__*/
__nccwpck_require__(5579);
/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> {a} -> a | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop, R.nth
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
 *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
 */


var path =
/*#__PURE__*/
_curry2(function path(pathAr, obj) {
  return paths([pathAr], obj)[0];
});

module.exports = path;

/***/ }),

/***/ 1360:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);

var path =
/*#__PURE__*/
__nccwpck_require__(2767);
/**
 * Determines whether a nested path on an object has a specific value, in
 * [`R.equals`](#equals) terms. Most likely used to filter a list.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Relation
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> a -> {a} -> Boolean
 * @param {Array} path The path of the nested property to use
 * @param {*} val The value to compare the nested property with
 * @param {Object} obj The object to check the nested property in
 * @return {Boolean} `true` if the value equals the nested object property,
 *         `false` otherwise.
 * @example
 *
 *      const user1 = { address: { zipCode: 90210 } };
 *      const user2 = { address: { zipCode: 55555 } };
 *      const user3 = { name: 'Bob' };
 *      const users = [ user1, user2, user3 ];
 *      const isFamous = R.pathEq(['address', 'zipCode'], 90210);
 *      R.filter(isFamous, users); //=> [ user1 ]
 */


var pathEq =
/*#__PURE__*/
_curry3(function pathEq(_path, val, obj) {
  return equals(path(_path, obj), val);
});

module.exports = pathEq;

/***/ }),

/***/ 6328:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var defaultTo =
/*#__PURE__*/
__nccwpck_require__(8445);

var path =
/*#__PURE__*/
__nccwpck_require__(2767);
/**
 * If the given, non-null object has a value at the given path, returns the
 * value at that path. Otherwise returns the provided default value.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig a -> [Idx] -> {a} -> a
 * @param {*} d The default value.
 * @param {Array} p The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path` of the supplied object or the default value.
 * @example
 *
 *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
 */


var pathOr =
/*#__PURE__*/
_curry3(function pathOr(d, p, obj) {
  return defaultTo(d, path(p, obj));
});

module.exports = pathOr;

/***/ }),

/***/ 9411:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var path =
/*#__PURE__*/
__nccwpck_require__(2767);
/**
 * Returns `true` if the specified object property at given path satisfies the
 * given predicate; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Logic
 * @typedefn Idx = String | Int | Symbol
 * @sig (a -> Boolean) -> [Idx] -> {a} -> Boolean
 * @param {Function} pred
 * @param {Array} propPath
 * @param {*} obj
 * @return {Boolean}
 * @see R.propSatisfies, R.path
 * @example
 *
 *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
 *      R.pathSatisfies(R.is(Object), [], {x: {y: 2}}); //=> true
 */


var pathSatisfies =
/*#__PURE__*/
_curry3(function pathSatisfies(pred, propPath, obj) {
  return pred(path(propPath, obj));
});

module.exports = pathSatisfies;

/***/ }),

/***/ 5579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);

var nth =
/*#__PURE__*/
__nccwpck_require__(7280);
/**
 * Retrieves the values at given paths of an object.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Object
 * @typedefn Idx = [String | Int | Symbol]
 * @sig [Idx] -> {a} -> [a | Undefined]
 * @param {Array} pathsArray The array of paths to be fetched.
 * @param {Object} obj The object to retrieve the nested properties from.
 * @return {Array} A list consisting of values at paths specified by "pathsArray".
 * @see R.path
 * @example
 *
 *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
 *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
 */


var paths =
/*#__PURE__*/
_curry2(function paths(pathsArray, obj) {
  return pathsArray.map(function (paths) {
    var val = obj;
    var idx = 0;
    var p;

    while (idx < paths.length) {
      if (val == null) {
        return;
      }

      p = paths[idx];
      val = _isInteger(p) ? nth(p, val) : val[p];
      idx += 1;
    }

    return val;
  });
});

module.exports = paths;

/***/ }),

/***/ 5315:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns a partial copy of an object containing only the keys specified. If
 * the key does not exist, the property is ignored.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.omit, R.props
 * @example
 *
 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
 */


var pick =
/*#__PURE__*/
_curry2(function pick(names, obj) {
  var result = {};
  var idx = 0;

  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }

    idx += 1;
  }

  return result;
});

module.exports = pick;

/***/ }),

/***/ 3234:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Similar to `pick` except that this one includes a `key: undefined` pair for
 * properties that don't exist.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.pick
 * @example
 *
 *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
 */


var pickAll =
/*#__PURE__*/
_curry2(function pickAll(names, obj) {
  var result = {};
  var idx = 0;
  var len = names.length;

  while (idx < len) {
    var name = names[idx];
    result[name] = obj[name];
    idx += 1;
  }

  return result;
});

module.exports = pickAll;

/***/ }),

/***/ 5565:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns a partial copy of an object containing only the keys that satisfy
 * the supplied predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @sig ((v, k) -> Boolean) -> {k: v} -> {k: v}
 * @param {Function} pred A predicate to determine whether or not a key
 *        should be included on the output object.
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties that satisfy `pred`
 *         on it.
 * @see R.pick, R.filter
 * @example
 *
 *      const isUpperCase = (val, key) => key.toUpperCase() === key;
 *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
 */


var pickBy =
/*#__PURE__*/
_curry2(function pickBy(test, obj) {
  var result = {};

  for (var prop in obj) {
    if (test(obj[prop], prop, obj)) {
      result[prop] = obj[prop];
    }
  }

  return result;
});

module.exports = pickBy;

/***/ }),

/***/ 4216:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _pipe =
/*#__PURE__*/
__nccwpck_require__(4592);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);

var tail =
/*#__PURE__*/
__nccwpck_require__(4900);
/**
 * Performs left-to-right function composition. The first argument may have
 * any arity; the remaining arguments must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      const f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 * @symb R.pipe(f, g, h)(a)(b) = h(g(f(a)))(b)
 */


function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }

  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}

module.exports = pipe;

/***/ }),

/***/ 7709:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var head =
/*#__PURE__*/
__nccwpck_require__(8119);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var tail =
/*#__PURE__*/
__nccwpck_require__(4900);

var identity =
/*#__PURE__*/
__nccwpck_require__(6304);
/**
 * Performs left-to-right function composition using transforming function. The first function may have
 * any arity; the remaining functions must be unary.
 *
 * **Note:** The result of pipeWith is not automatically curried. Transforming function is not used on the
 * first argument.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((* -> *), [((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)]) -> ((a, b, ..., n) -> z)
 * @param {Function} transformer The transforming function
 * @param {Array} functions The functions to pipe
 * @return {Function}
 * @see R.composeWith, R.pipe
 * @example
 *
 *      const pipeWhileNotNil = R.pipeWith((f, res) => R.isNil(res) ? res : f(res));
 *      const f = pipeWhileNotNil([Math.pow, R.negate, R.inc])
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipeWith(f)([g, h, i])(...args) = f(i, f(h, g(...args)))
 */


var pipeWith =
/*#__PURE__*/
_curry2(function pipeWith(xf, list) {
  if (list.length <= 0) {
    return identity;
  }

  var headList = head(list);
  var tailList = tail(list);
  return _arity(headList.length, function () {
    return _reduce(function (result, f) {
      return xf.call(this, f, result);
    }, headList.apply(this, arguments), tailList);
  });
});

module.exports = pipeWith;

/***/ }),

/***/ 7413:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);

var prop =
/*#__PURE__*/
__nccwpck_require__(2135);
/**
 * Returns a new list by plucking the same named property off all objects in
 * the list supplied.
 *
 * `pluck` will work on
 * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
 * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => k -> f {k: v} -> f v
 * @param {Number|String} key The key name to pluck off of each object.
 * @param {Array} f The array or functor to consider.
 * @return {Array} The list of values for the given key.
 * @see R.project, R.prop, R.props
 * @example
 *
 *      var getAges = R.pluck('age');
 *      getAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]
 *
 *      R.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]
 *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
 * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
 * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
 */


var pluck =
/*#__PURE__*/
_curry2(function pluck(p, list) {
  return map(prop(p), list);
});

module.exports = pluck;

/***/ }),

/***/ 6622:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns a new list with the given element at the front, followed by the
 * contents of the list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The item to add to the head of the output list.
 * @param {Array} list The array to add to the tail of the output list.
 * @return {Array} A new array.
 * @see R.append
 * @example
 *
 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
 */


var prepend =
/*#__PURE__*/
_curry2(function prepend(el, list) {
  return _concat([el], list);
});

module.exports = prepend;

/***/ }),

/***/ 6233:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var multiply =
/*#__PURE__*/
__nccwpck_require__(3858);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);
/**
 * Multiplies together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The product of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.product([2,4,6,8,100,1]); //=> 38400
 */


var product =
/*#__PURE__*/
reduce(multiply, 1);
module.exports = product;

/***/ }),

/***/ 7615:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _map =
/*#__PURE__*/
__nccwpck_require__(8077);

var identity =
/*#__PURE__*/
__nccwpck_require__(6304);

var pickAll =
/*#__PURE__*/
__nccwpck_require__(3234);

var useWith =
/*#__PURE__*/
__nccwpck_require__(6487);
/**
 * Reasonable analog to SQL `select` statement.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @category Relation
 * @sig [k] -> [{k: v}] -> [{k: v}]
 * @param {Array} props The property names to project
 * @param {Array} objs The objects to query
 * @return {Array} An array of objects with just the `props` properties.
 * @see R.pluck, R.props, R.prop
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
 *      const kids = [abby, fred];
 *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
 */


var project =
/*#__PURE__*/
useWith(_map, [pickAll, identity]); // passing `identity` gives correct arity

module.exports = project;

/***/ }),

/***/ 3743:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _promap =
/*#__PURE__*/
__nccwpck_require__(5843);

var _xpromap =
/*#__PURE__*/
__nccwpck_require__(6093);
/**
 * Takes two functions as pre- and post- processors respectively for a third function,
 * i.e. `promap(f, g, h)(x) === g(h(f(x)))`.
 *
 * Dispatches to the `promap` method of the third argument, if present,
 * according to the [FantasyLand Profunctor spec](https://github.com/fantasyland/fantasy-land#profunctor).
 *
 * Acts as a transducer if a transformer is given in profunctor position.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Function
 * @sig (a -> b) -> (c -> d) -> (b -> c) -> (a -> d)
 * @sig Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d
 * @param {Function} f The preprocessor function, a -> b
 * @param {Function} g The postprocessor function, c -> d
 * @param {Profunctor} profunctor The profunctor instance to be promapped, e.g. b -> c
 * @return {Profunctor} The new profunctor instance, e.g. a -> d
 * @see R.transduce
 * @example
 *
 *      const decodeChar = R.promap(s => s.charCodeAt(), String.fromCharCode, R.add(-8))
 *      const decodeString = R.promap(R.split(''), R.join(''), R.map(decodeChar))
 *      decodeString("ziuli") //=> "ramda"
 *
 * @symb R.promap(f, g, h) = x => g(h(f(x)))
 * @symb R.promap(f, g, profunctor) = profunctor.promap(f, g)
 */


var promap =
/*#__PURE__*/
_curry3(
/*#__PURE__*/
_dispatchable(['fantasy-land/promap', 'promap'], _xpromap, _promap));

module.exports = promap;

/***/ }),

/***/ 2135:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isInteger =
/*#__PURE__*/
__nccwpck_require__(7924);

var nth =
/*#__PURE__*/
__nccwpck_require__(7280);
/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx -> {s: a} -> a | Undefined
 * @param {String|Number} p The property name or array index
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path, R.props, R.pluck, R.project, R.nth
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 *      R.prop(0, [100]); //=> 100
 *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
 */


var prop =
/*#__PURE__*/
_curry2(function prop(p, obj) {
  if (obj == null) {
    return;
  }

  return _isInteger(p) ? nth(p, obj) : obj[p];
});

module.exports = prop;

/***/ }),

/***/ 7301:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var prop =
/*#__PURE__*/
__nccwpck_require__(2135);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);
/**
 * Returns `true` if the specified object property is equal, in
 * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
 * You can test multiple properties with [`R.whereEq`](#whereEq).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig String -> a -> Object -> Boolean
 * @param {String} name
 * @param {*} val
 * @param {*} obj
 * @return {Boolean}
 * @see R.whereEq, R.propSatisfies, R.equals
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond'};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown'};
 *      const rusty = {name: 'Rusty', age: 10, hair: 'brown'};
 *      const alois = {name: 'Alois', age: 15, disposition: 'surly'};
 *      const kids = [abby, fred, rusty, alois];
 *      const hasBrownHair = R.propEq('hair', 'brown');
 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
 */


var propEq =
/*#__PURE__*/
_curry3(function propEq(name, val, obj) {
  return equals(val, prop(name, obj));
});

module.exports = propEq;

/***/ }),

/***/ 9867:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var prop =
/*#__PURE__*/
__nccwpck_require__(2135);

var is =
/*#__PURE__*/
__nccwpck_require__(4008);
/**
 * Returns `true` if the specified object property is of the given type;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Type
 * @sig Type -> String -> Object -> Boolean
 * @param {Function} type
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.is, R.propSatisfies
 * @example
 *
 *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
 *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
 *      R.propIs(Number, 'x', {});            //=> false
 */


var propIs =
/*#__PURE__*/
_curry3(function propIs(type, name, obj) {
  return is(type, prop(name, obj));
});

module.exports = propIs;

/***/ }),

/***/ 5694:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var defaultTo =
/*#__PURE__*/
__nccwpck_require__(8445);

var prop =
/*#__PURE__*/
__nccwpck_require__(2135);
/**
 * Return the specified property of the given non-null object if the property
 * is present and it's value is not `null`, `undefined` or `NaN`.
 *
 * Otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Object
 * @sig a -> String -> Object -> a
 * @param {*} val The default value.
 * @param {String} p The name of the property to return.
 * @param {Object} obj The object to query.
 * @return {*} The value of given property of the supplied object or the default value.
 * @example
 *
 *      const alice = {
 *        name: 'ALICE',
 *        age: 101
 *      };
 *      const favorite = R.prop('favoriteLibrary');
 *      const favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
 *
 *      favorite(alice);  //=> undefined
 *      favoriteWithDefault(alice);  //=> 'Ramda'
 */


var propOr =
/*#__PURE__*/
_curry3(function propOr(val, p, obj) {
  return defaultTo(val, prop(p, obj));
});

module.exports = propOr;

/***/ }),

/***/ 6891:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var prop =
/*#__PURE__*/
__nccwpck_require__(2135);
/**
 * Returns `true` if the specified object property satisfies the given
 * predicate; `false` otherwise. You can test multiple properties with
 * [`R.where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Logic
 * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
 * @param {Function} pred
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.where, R.propEq, R.propIs
 * @example
 *
 *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
 */


var propSatisfies =
/*#__PURE__*/
_curry3(function propSatisfies(pred, name, obj) {
  return pred(prop(name, obj));
});

module.exports = propSatisfies;

/***/ }),

/***/ 7807:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var path =
/*#__PURE__*/
__nccwpck_require__(2767);
/**
 * Acts as multiple `prop`: array of keys in, array of values out. Preserves
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> [v]
 * @param {Array} ps The property names to fetch
 * @param {Object} obj The object to query
 * @return {Array} The corresponding values or partially applied function.
 * @see R.prop, R.pluck, R.project
 * @example
 *
 *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
 *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
 *
 *      const fullName = R.compose(R.join(' '), R.props(['first', 'last']));
 *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
 */


var props =
/*#__PURE__*/
_curry2(function props(ps, obj) {
  return ps.map(function (p) {
    return path([p], obj);
  });
});

module.exports = props;

/***/ }),

/***/ 1808:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isNumber =
/*#__PURE__*/
__nccwpck_require__(7573);
/**
 * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> Number -> [Number]
 * @param {Number} from The first number in the list.
 * @param {Number} to One more than the last number in the list.
 * @return {Array} The list of numbers in the set `[a, b)`.
 * @example
 *
 *      R.range(1, 5);    //=> [1, 2, 3, 4]
 *      R.range(50, 53);  //=> [50, 51, 52]
 */


var range =
/*#__PURE__*/
_curry2(function range(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError('Both arguments to range must be numbers');
  }

  var result = [];
  var n = from;

  while (n < to) {
    result.push(n);
    n += 1;
  }

  return result;
});

module.exports = range;

/***/ }),

/***/ 1941:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);
/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *      //          -               -10
 *      //         / \              / \
 *      //        -   4           -6   4
 *      //       / \              / \
 *      //      -   3   ==>     -3   3
 *      //     / \              / \
 *      //    -   2           -1   2
 *      //   / \              / \
 *      //  0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */


var reduce =
/*#__PURE__*/
_curry3(_reduce);

module.exports = reduce;

/***/ }),

/***/ 5645:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _clone =
/*#__PURE__*/
__nccwpck_require__(2726);

var _curryN =
/*#__PURE__*/
__nccwpck_require__(4106);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);

var _xreduceBy =
/*#__PURE__*/
__nccwpck_require__(248);
/**
 * Groups the elements of the list according to the result of calling
 * the String-returning function `keyFn` on each element and reduces the elements
 * of each group to a single value via the reducer function `valueFn`.
 *
 * The value function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to short circuit the iteration.
 *
 * This function is basically a more general [`groupBy`](#groupBy) function.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category List
 * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
 * @param {Function} valueFn The function that reduces the elements of each group to a single
 *        value. Receives two values, accumulator for a particular group and the current element.
 * @param {*} acc The (initial) accumulator value for each group.
 * @param {Function} keyFn The function that maps the list's element into a key.
 * @param {Array} list The array to group.
 * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
 *         `valueFn` for elements which produced that key when passed to `keyFn`.
 * @see R.groupBy, R.reduce, R.reduced
 * @example
 *
 *      const groupNames = (acc, {name}) => acc.concat(name)
 *      const toGrade = ({score}) =>
 *        score < 65 ? 'F' :
 *        score < 70 ? 'D' :
 *        score < 80 ? 'C' :
 *        score < 90 ? 'B' : 'A'
 *
 *      var students = [
 *        {name: 'Abby', score: 83},
 *        {name: 'Bart', score: 62},
 *        {name: 'Curt', score: 88},
 *        {name: 'Dora', score: 92},
 *      ]
 *
 *      reduceBy(groupNames, [], toGrade, students)
 *      //=> {"A": ["Dora"], "B": ["Abby", "Curt"], "F": ["Bart"]}
 */


var reduceBy =
/*#__PURE__*/
_curryN(4, [],
/*#__PURE__*/
_dispatchable([], _xreduceBy, function reduceBy(valueFn, valueAcc, keyFn, list) {
  return _reduce(function (acc, elt) {
    var key = keyFn(elt);
    var value = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], [], false), elt);

    if (value && value['@@transducer/reduced']) {
      return _reduced(acc);
    }

    acc[key] = value;
    return acc;
  }, {}, list);
}));

module.exports = reduceBy;

/***/ }),

/***/ 2464:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * Similar to [`reduce`](#reduce), except moves through the input list from the
 * right to the left.
 *
 * The iterator function receives two values: *(value, acc)*, while the arguments'
 * order of `reduce`'s iterator function is *(acc, value)*. `reduceRight` may use [`reduced`](#reduced)
 * to short circuit the iteration.
 *
 * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduceRight` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> b) -> b -> [a] -> b
 * @param {Function} fn The iterator function. Receives two values, the current element from the array
 *        and the accumulator.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.addIndex, R.reduced
 * @example
 *
 *      R.reduceRight(R.subtract, 0, [1, 2, 3, 4]) // => (1 - (2 - (3 - (4 - 0)))) = -2
 *      //    -               -2
 *      //   / \              / \
 *      //  1   -            1   3
 *      //     / \              / \
 *      //    2   -     ==>    2  -1
 *      //       / \              / \
 *      //      3   -            3   4
 *      //         / \              / \
 *      //        4   0            4   0
 *
 * @symb R.reduceRight(f, a, [b, c, d]) = f(b, f(c, f(d, a)))
 */


var reduceRight =
/*#__PURE__*/
_curry3(function reduceRight(fn, acc, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    acc = fn(list[idx], acc);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    idx -= 1;
  }

  return acc;
});

module.exports = reduceRight;

/***/ }),

/***/ 6534:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curryN =
/*#__PURE__*/
__nccwpck_require__(4106);

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);
/**
 * Like [`reduce`](#reduce), `reduceWhile` returns a single item by iterating
 * through the list, successively calling the iterator function. `reduceWhile`
 * also takes a predicate that is evaluated before each step. If the predicate
 * returns `false`, it "short-circuits" the iteration and returns the current
 * value of the accumulator. `reduceWhile` may alternatively be short-circuited
 * via [`reduced`](#reduced).
 *
 * @func
 * @memberOf R
 * @since v0.22.0
 * @category List
 * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} pred The predicate. It is passed the accumulator and the
 *        current element.
 * @param {Function} fn The iterator function. Receives two values, the
 *        accumulator and the current element.
 * @param {*} a The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced
 * @example
 *
 *      const isOdd = (acc, x) => x % 2 !== 0;
 *      const xs = [1, 3, 5, 60, 777, 800];
 *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
 *
 *      const ys = [2, 4, 6]
 *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
 */


var reduceWhile =
/*#__PURE__*/
_curryN(4, [], function _reduceWhile(pred, fn, a, list) {
  return _reduce(function (acc, x) {
    return pred(acc, x) ? fn(acc, x) : _reduced(acc);
  }, a, list);
});

module.exports = reduceWhile;

/***/ }),

/***/ 4505:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _reduced =
/*#__PURE__*/
__nccwpck_require__(9400);
/**
 * Returns a value wrapped to indicate that it is the final value of the reduce
 * and transduce functions. The returned value should be considered a black
 * box: the internal structure is not guaranteed to be stable.
 *
 * This optimization is available to the below functions:
 * - [`reduce`](#reduce)
 * - [`reduceWhile`](#reduceWhile)
 * - [`reduceBy`](#reduceBy)
 * - [`reduceRight`](#reduceRight)
 * - [`transduce`](#transduce)
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category List
 * @sig a -> *
 * @param {*} x The final value of the reduce.
 * @return {*} The wrapped value.
 * @see R.reduce, R.reduceWhile, R.reduceBy, R.reduceRight, R.transduce
 * @example
 *
 *     R.reduce(
 *       (acc, item) => item > 3 ? R.reduced(acc) : acc.concat(item),
 *       [],
 *       [1, 2, 3, 4, 5]) // [1, 2, 3]
 */


var reduced =
/*#__PURE__*/
_curry1(_reduced);

module.exports = reduced;

/***/ }),

/***/ 1545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _complement =
/*#__PURE__*/
__nccwpck_require__(3134);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var filter =
/*#__PURE__*/
__nccwpck_require__(983);
/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      const isOdd = (n) => n % 2 !== 0;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */


var reject =
/*#__PURE__*/
_curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});

module.exports = reject;

/***/ }),

/***/ 311:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Removes the sub-list of `list` starting at index `start` and containing
 * `count` elements. _Note that this is not destructive_: it returns a copy of
 * the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} start The position to start removing elements
 * @param {Number} count The number of elements to remove
 * @param {Array} list The list to remove from
 * @return {Array} A new Array with `count` elements from `start` removed.
 * @see R.without
 * @example
 *
 *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
 */


var remove =
/*#__PURE__*/
_curry3(function remove(start, count, list) {
  var result = Array.prototype.slice.call(list, 0);
  result.splice(start, count);
  return result;
});

module.exports = remove;

/***/ }),

/***/ 4868:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var always =
/*#__PURE__*/
__nccwpck_require__(7770);

var times =
/*#__PURE__*/
__nccwpck_require__(2791);
/**
 * Returns a fixed list of size `n` containing a specified identical value.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig a -> n -> [a]
 * @param {*} value The value to repeat.
 * @param {Number} n The desired size of the output list.
 * @return {Array} A new array containing `n` `value`s.
 * @see R.times
 * @example
 *
 *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
 *
 *      const obj = {};
 *      const repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
 *      repeatedObjs[0] === repeatedObjs[1]; //=> true
 * @symb R.repeat(a, 0) = []
 * @symb R.repeat(a, 1) = [a]
 * @symb R.repeat(a, 2) = [a, a]
 */


var repeat =
/*#__PURE__*/
_curry2(function repeat(value, n) {
  return times(always(value), n);
});

module.exports = repeat;

/***/ }),

/***/ 7864:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Replace a substring or regex match in a string with a replacement.
 *
 * The first two parameters correspond to the parameters of the
 * `String.prototype.replace()` function, so the second parameter can also be a
 * function.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category String
 * @sig RegExp|String -> String -> String -> String
 * @param {RegExp|String} pattern A regular expression or a substring to match.
 * @param {String} replacement The string to replace the matches with.
 * @param {String} str The String to do the search and replacement in.
 * @return {String} The result.
 * @example
 *
 *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *
 *      // Use the "g" (global) flag to replace all occurrences:
 *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
 */


var replace =
/*#__PURE__*/
_curry3(function replace(regex, replacement, str) {
  return str.replace(regex, replacement);
});

module.exports = replace;

/***/ }),

/***/ 8495:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _isString =
/*#__PURE__*/
__nccwpck_require__(9076);
/**
 * Returns a new list or string with the elements or characters in reverse
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {Array|String} list
 * @return {Array|String}
 * @example
 *
 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
 *      R.reverse([1, 2]);     //=> [2, 1]
 *      R.reverse([1]);        //=> [1]
 *      R.reverse([]);         //=> []
 *
 *      R.reverse('abc');      //=> 'cba'
 *      R.reverse('ab');       //=> 'ba'
 *      R.reverse('a');        //=> 'a'
 *      R.reverse('');         //=> ''
 */


var reverse =
/*#__PURE__*/
_curry1(function reverse(list) {
  return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
});

module.exports = reverse;

/***/ }),

/***/ 5426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Scan is similar to [`reduce`](#reduce), but returns a list of successively
 * reduced values from the left
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> [a]
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {Array} A list of all intermediately reduced values.
 * @see R.reduce, R.mapAccum
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
 * @symb R.scan(f, a, [b, c]) = [a, f(a, b), f(f(a, b), c)]
 */


var scan =
/*#__PURE__*/
_curry3(function scan(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [acc];

  while (idx < len) {
    acc = fn(acc, list[idx]);
    result[idx + 1] = acc;
    idx += 1;
  }

  return result;
});

module.exports = scan;

/***/ }),

/***/ 4534:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var ap =
/*#__PURE__*/
__nccwpck_require__(2857);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);

var prepend =
/*#__PURE__*/
__nccwpck_require__(6622);

var reduceRight =
/*#__PURE__*/
__nccwpck_require__(2464);
/**
 * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
 * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
 * Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
 * @param {Function} of
 * @param {*} traversable
 * @return {*}
 * @see R.traverse
 * @example
 *
 *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
 *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
 *
 *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
 *      R.sequence(R.of, Nothing());       //=> [Nothing()]
 */


var sequence =
/*#__PURE__*/
_curry2(function sequence(of, traversable) {
  return typeof traversable.sequence === 'function' ? traversable.sequence(of) : reduceRight(function (x, acc) {
    return ap(map(prepend, x), acc);
  }, of([]), traversable);
});

module.exports = sequence;

/***/ }),

/***/ 435:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var always =
/*#__PURE__*/
__nccwpck_require__(7770);

var over =
/*#__PURE__*/
__nccwpck_require__(9185);
/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the given value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> a -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.view, R.over, R.lens, R.lensIndex, R.lensProp, R.lensPath
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
 *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
 */


var set =
/*#__PURE__*/
_curry3(function set(lens, v, x) {
  return over(lens, always(v), x);
});

module.exports = set;

/***/ }),

/***/ 7108:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _checkForMethod =
/*#__PURE__*/
__nccwpck_require__(1373);

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */


var slice =
/*#__PURE__*/
_curry3(
/*#__PURE__*/
_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

module.exports = slice;

/***/ }),

/***/ 2642:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Returns a copy of the list, sorted according to the comparator function,
 * which should accept two values at a time and return a negative number if the
 * first value is smaller, a positive number if it's larger, and zero if they
 * are equal. Please note that this is a **copy** of the list. It does not
 * modify the original.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, a) -> Number) -> [a] -> [a]
 * @param {Function} comparator A sorting function :: a -> b -> Int
 * @param {Array} list The list to sort
 * @return {Array} a new array with its elements sorted by the comparator function.
 * @see R.ascend, R.descend
 * @example
 *
 *      const diff = function(a, b) { return a - b; };
 *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
 */


var sort =
/*#__PURE__*/
_curry2(function sort(comparator, list) {
  return Array.prototype.slice.call(list, 0).sort(comparator);
});

module.exports = sort;

/***/ }),

/***/ 9227:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Sorts the list according to the supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord b => (a -> b) -> [a] -> [a]
 * @param {Function} fn
 * @param {Array} list The list to sort.
 * @return {Array} A new list sorted by the keys generated by `fn`.
 * @example
 *
 *      const sortByFirstItem = R.sortBy(R.prop(0));
 *      const pairs = [[-1, 1], [-2, 2], [-3, 3]];
 *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
 *
 *      const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
 *      const alice = {
 *        name: 'ALICE',
 *        age: 101
 *      };
 *      const bob = {
 *        name: 'Bob',
 *        age: -10
 *      };
 *      const clara = {
 *        name: 'clara',
 *        age: 314.159
 *      };
 *      const people = [clara, bob, alice];
 *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
 */


var sortBy =
/*#__PURE__*/
_curry2(function sortBy(fn, list) {
  return Array.prototype.slice.call(list, 0).sort(function (a, b) {
    var aa = fn(a);
    var bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
});

module.exports = sortBy;

/***/ }),

/***/ 7275:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Sorts a list according to a list of comparators.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Relation
 * @sig [(a, a) -> Number] -> [a] -> [a]
 * @param {Array} functions A list of comparator functions.
 * @param {Array} list The list to sort.
 * @return {Array} A new list sorted according to the comarator functions.
 * @see R.ascend, R.descend
 * @example
 *
 *      const alice = {
 *        name: 'alice',
 *        age: 40
 *      };
 *      const bob = {
 *        name: 'bob',
 *        age: 30
 *      };
 *      const clara = {
 *        name: 'clara',
 *        age: 40
 *      };
 *      const people = [clara, bob, alice];
 *      const ageNameSort = R.sortWith([
 *        R.descend(R.prop('age')),
 *        R.ascend(R.prop('name'))
 *      ]);
 *      ageNameSort(people); //=> [alice, clara, bob]
 */


var sortWith =
/*#__PURE__*/
_curry2(function sortWith(fns, list) {
  return Array.prototype.slice.call(list, 0).sort(function (a, b) {
    var result = 0;
    var i = 0;

    while (result === 0 && i < fns.length) {
      result = fns[i](a, b);
      i += 1;
    }

    return result;
  });
});

module.exports = sortWith;

/***/ }),

/***/ 9914:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var invoker =
/*#__PURE__*/
__nccwpck_require__(4910);
/**
 * Splits a string into an array of strings based on the given
 * separator.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig (String | RegExp) -> String -> [String]
 * @param {String|RegExp} sep The pattern.
 * @param {String} str The string to separate into an array.
 * @return {Array} The array of strings from `str` separated by `sep`.
 * @see R.join
 * @example
 *
 *      const pathComponents = R.split('/');
 *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
 *
 *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
 */


var split =
/*#__PURE__*/
invoker(1, 'split');
module.exports = split;

/***/ }),

/***/ 5609:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var length =
/*#__PURE__*/
__nccwpck_require__(819);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Splits a given list or string at a given index.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig Number -> [a] -> [[a], [a]]
 * @sig Number -> String -> [String, String]
 * @param {Number} index The index where the array/string is split.
 * @param {Array|String} array The array/string to be split.
 * @return {Array}
 * @example
 *
 *      R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]
 *      R.splitAt(5, 'hello world');      //=> ['hello', ' world']
 *      R.splitAt(-1, 'foobar');          //=> ['fooba', 'r']
 */


var splitAt =
/*#__PURE__*/
_curry2(function splitAt(index, array) {
  return [slice(0, index, array), slice(index, length(array), array)];
});

module.exports = splitAt;

/***/ }),

/***/ 4447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Splits a collection into slices of the specified length.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [[a]]
 * @sig Number -> String -> [String]
 * @param {Number} n
 * @param {Array} list
 * @return {Array}
 * @example
 *
 *      R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]
 *      R.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']
 */


var splitEvery =
/*#__PURE__*/
_curry2(function splitEvery(n, list) {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer');
  }

  var result = [];
  var idx = 0;

  while (idx < list.length) {
    result.push(slice(idx, idx += n, list));
  }

  return result;
});

module.exports = splitEvery;

/***/ }),

/***/ 7129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Takes a list and a predicate and returns a pair of lists with the following properties:
 *
 *  - the result of concatenating the two output lists is equivalent to the input list;
 *  - none of the elements of the first output list satisfies the predicate; and
 *  - if the second output list is non-empty, its first element satisfies the predicate.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [[a], [a]]
 * @param {Function} pred The predicate that determines where the array is split.
 * @param {Array} list The array to be split.
 * @return {Array}
 * @example
 *
 *      R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]
 */


var splitWhen =
/*#__PURE__*/
_curry2(function splitWhen(pred, list) {
  var idx = 0;
  var len = list.length;
  var prefix = [];

  while (idx < len && !pred(list[idx])) {
    prefix.push(list[idx]);
    idx += 1;
  }

  return [prefix, Array.prototype.slice.call(list, idx)];
});

module.exports = splitWhen;

/***/ }),

/***/ 6392:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curryN =
/*#__PURE__*/
__nccwpck_require__(4106);
/**
 * Splits an array into slices on every occurrence of a value.
 *
 * @func
 * @memberOf R
 * @since v0.26.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> [[a]]
 * @param {Function} pred The predicate that determines where the array is split.
 * @param {Array} list The array to be split.
 * @return {Array}
 * @example
 *
 *      R.splitWhenever(R.equals(2), [1, 2, 3, 2, 4, 5, 2, 6, 7]); //=> [[1], [3], [4, 5], [6, 7]]
 */


var splitWhenever =
/*#__PURE__*/
_curryN(2, [], function splitWhenever(pred, list) {
  var acc = [];
  var curr = [];

  for (var i = 0; i < list.length; i = i + 1) {
    if (!pred(list[i])) {
      curr.push(list[i]);
    }

    if ((i < list.length - 1 && pred(list[i + 1]) || i === list.length - 1) && curr.length > 0) {
      acc.push(curr);
      curr = [];
    }
  }

  return acc;
});

module.exports = splitWhenever;

/***/ }),

/***/ 1738:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);

var take =
/*#__PURE__*/
__nccwpck_require__(1744);
/**
 * Checks if a list starts with the provided sublist.
 *
 * Similarly, checks if a string starts with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} prefix
 * @param {*} list
 * @return {Boolean}
 * @see R.endsWith
 * @example
 *
 *      R.startsWith('a', 'abc')                //=> true
 *      R.startsWith('b', 'abc')                //=> false
 *      R.startsWith(['a'], ['a', 'b', 'c'])    //=> true
 *      R.startsWith(['b'], ['a', 'b', 'c'])    //=> false
 */


var startsWith =
/*#__PURE__*/
_curry2(function (prefix, list) {
  return equals(take(prefix.length, list), prefix);
});

module.exports = startsWith;

/***/ }),

/***/ 7944:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Subtracts its second argument from its first argument.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a - b`.
 * @see R.add
 * @example
 *
 *      R.subtract(10, 8); //=> 2
 *
 *      const minus5 = R.subtract(R.__, 5);
 *      minus5(17); //=> 12
 *
 *      const complementaryAngle = R.subtract(90);
 *      complementaryAngle(30); //=> 60
 *      complementaryAngle(72); //=> 18
 */


var subtract =
/*#__PURE__*/
_curry2(function subtract(a, b) {
  return Number(a) - Number(b);
});

module.exports = subtract;

/***/ }),

/***/ 4761:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var add =
/*#__PURE__*/
__nccwpck_require__(8100);

var reduce =
/*#__PURE__*/
__nccwpck_require__(1941);
/**
 * Adds together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The sum of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.sum([2,4,6,8,100,1]); //=> 121
 */


var sum =
/*#__PURE__*/
reduce(add, 0);
module.exports = sum;

/***/ }),

/***/ 4025:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var concat =
/*#__PURE__*/
__nccwpck_require__(7833);

var difference =
/*#__PURE__*/
__nccwpck_require__(7013);
/**
 * Finds the set (i.e. no duplicates) of all elements contained in the first or
 * second list, but not both.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` or `list2`, but not both.
 * @see R.symmetricDifferenceWith, R.difference, R.differenceWith
 * @example
 *
 *      R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
 *      R.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]
 */


var symmetricDifference =
/*#__PURE__*/
_curry2(function symmetricDifference(list1, list2) {
  return concat(difference(list1, list2), difference(list2, list1));
});

module.exports = symmetricDifference;

/***/ }),

/***/ 2302:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var concat =
/*#__PURE__*/
__nccwpck_require__(7833);

var differenceWith =
/*#__PURE__*/
__nccwpck_require__(1204);
/**
 * Finds the set (i.e. no duplicates) of all elements contained in the first or
 * second list, but not both. Duplication is determined according to the value
 * returned by applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` or `list2`, but not both.
 * @see R.symmetricDifference, R.difference, R.differenceWith
 * @example
 *
 *      const eqA = R.eqBy(R.prop('a'));
 *      const l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
 *      const l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];
 *      R.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]
 */


var symmetricDifferenceWith =
/*#__PURE__*/
_curry3(function symmetricDifferenceWith(pred, list1, list2) {
  return concat(differenceWith(pred, list1, list2), differenceWith(pred, list2, list1));
});

module.exports = symmetricDifferenceWith;

/***/ }),

/***/ 4900:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _checkForMethod =
/*#__PURE__*/
__nccwpck_require__(1373);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */


var tail =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_checkForMethod('tail',
/*#__PURE__*/
slice(1, Infinity)));

module.exports = tail;

/***/ }),

/***/ 1744:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xtake =
/*#__PURE__*/
__nccwpck_require__(1664);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns the first `n` elements of the given list, string, or
 * transducer/transformer (or object with a `take` method).
 *
 * Dispatches to the `take` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n
 * @param {*} list
 * @return {*}
 * @see R.drop
 * @example
 *
 *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
 *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
 *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.take(3, 'ramda');               //=> 'ram'
 *
 *      const personnel = [
 *        'Dave Brubeck',
 *        'Paul Desmond',
 *        'Eugene Wright',
 *        'Joe Morello',
 *        'Gerry Mulligan',
 *        'Bob Bates',
 *        'Joe Dodge',
 *        'Ron Crotty'
 *      ];
 *
 *      const takeFive = R.take(5);
 *      takeFive(personnel);
 *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
 * @symb R.take(-1, [a, b]) = [a, b]
 * @symb R.take(0, [a, b]) = []
 * @symb R.take(1, [a, b]) = [a]
 * @symb R.take(2, [a, b]) = [a, b]
 */


var take =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['take'], _xtake, function take(n, xs) {
  return slice(0, n < 0 ? Infinity : n, xs);
}));

module.exports = take;

/***/ }),

/***/ 2816:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var drop =
/*#__PURE__*/
__nccwpck_require__(6769);
/**
 * Returns a new list containing the last `n` elements of the given list.
 * If `n > list.length`, returns a list of `list.length` elements.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n The number of elements to return.
 * @param {Array} xs The collection to consider.
 * @return {Array}
 * @see R.dropLast
 * @example
 *
 *      R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']
 *      R.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
 *      R.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.takeLast(3, 'ramda');               //=> 'mda'
 */


var takeLast =
/*#__PURE__*/
_curry2(function takeLast(n, xs) {
  return drop(n >= 0 ? xs.length - n : 0, xs);
});

module.exports = takeLast;

/***/ }),

/***/ 9617:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns a new list containing the last `n` elements of a given list, passing
 * each value to the supplied predicate function, and terminating when the
 * predicate function returns `false`. Excludes the element that caused the
 * predicate function to fail. The predicate function is passed one argument:
 * *(value)*.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.dropLastWhile, R.addIndex
 * @example
 *
 *      const isNotOne = x => x !== 1;
 *
 *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
 *
 *      R.takeLastWhile(x => x !== 'R' , 'Ramda'); //=> 'amda'
 */


var takeLastWhile =
/*#__PURE__*/
_curry2(function takeLastWhile(fn, xs) {
  var idx = xs.length - 1;

  while (idx >= 0 && fn(xs[idx])) {
    idx -= 1;
  }

  return slice(idx + 1, Infinity, xs);
});

module.exports = takeLastWhile;

/***/ }),

/***/ 1973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xtakeWhile =
/*#__PURE__*/
__nccwpck_require__(5265);

var slice =
/*#__PURE__*/
__nccwpck_require__(7108);
/**
 * Returns a new list containing the first `n` elements of a given list,
 * passing each value to the supplied predicate function, and terminating when
 * the predicate function returns `false`. Excludes the element that caused the
 * predicate function to fail. The predicate function is passed one argument:
 * *(value)*.
 *
 * Dispatches to the `takeWhile` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.dropWhile, R.transduce, R.addIndex
 * @example
 *
 *      const isNotFour = x => x !== 4;
 *
 *      R.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]
 *
 *      R.takeWhile(x => x !== 'd' , 'Ramda'); //=> 'Ram'
 */


var takeWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['takeWhile'], _xtakeWhile, function takeWhile(fn, xs) {
  var idx = 0;
  var len = xs.length;

  while (idx < len && fn(xs[idx])) {
    idx += 1;
  }

  return slice(0, idx, xs);
}));

module.exports = takeWhile;

/***/ }),

/***/ 1547:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xtap =
/*#__PURE__*/
__nccwpck_require__(3269);
/**
 * Runs the given function with the supplied object, then returns the object.
 *
 * Acts as a transducer if a transformer is given as second parameter.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a -> *) -> a -> a
 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
 * @param {*} x
 * @return {*} `x`.
 * @example
 *
 *      const sayX = x => console.log('x is ' + x);
 *      R.tap(sayX, 100); //=> 100
 *      // logs 'x is 100'
 * @symb R.tap(f, a) = a
 */


var tap =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xtap, function tap(fn, x) {
  fn(x);
  return x;
}));

module.exports = tap;

/***/ }),

/***/ 9289:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _cloneRegExp =
/*#__PURE__*/
__nccwpck_require__(2621);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isRegExp =
/*#__PURE__*/
__nccwpck_require__(2134);

var toString =
/*#__PURE__*/
__nccwpck_require__(6119);
/**
 * Determines whether a given string matches a given regular expression.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category String
 * @sig RegExp -> String -> Boolean
 * @param {RegExp} pattern
 * @param {String} str
 * @return {Boolean}
 * @see R.match
 * @example
 *
 *      R.test(/^x/, 'xyz'); //=> true
 *      R.test(/^y/, 'xyz'); //=> false
 */


var test =
/*#__PURE__*/
_curry2(function test(pattern, str) {
  if (!_isRegExp(pattern)) {
    throw new TypeError('‘test’ requires a value of type RegExp as its first argument; received ' + toString(pattern));
  }

  return _cloneRegExp(pattern).test(str);
});

module.exports = test;

/***/ }),

/***/ 1615:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Creates a thunk out of a function. A thunk delays a calculation until
 * its result is needed, providing lazy evaluation of arguments.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((a, b, ..., j) -> k) -> (a, b, ..., j) -> (() -> k)
 * @param {Function} fn A function to wrap in a thunk
 * @return {Function} Expects arguments for `fn` and returns a new function
 *  that, when called, applies those arguments to `fn`.
 * @see R.partial, R.partialRight
 * @example
 *
 *      R.thunkify(R.identity)(42)(); //=> 42
 *      R.thunkify((a, b) => a + b)(25, 17)(); //=> 42
 */


var thunkify =
/*#__PURE__*/
_curry1(function thunkify(fn) {
  return curryN(fn.length, function createThunk() {
    var fnArgs = arguments;
    return function invokeThunk() {
      return fn.apply(this, fnArgs);
    };
  });
});

module.exports = thunkify;

/***/ }),

/***/ 2791:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @func
 * @memberOf R
 * @since v0.2.3
 * @category List
 * @sig (Number -> a) -> Number -> [a]
 * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
 * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
 * @return {Array} An array containing the return values of all calls to `fn`.
 * @see R.repeat
 * @example
 *
 *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
 * @symb R.times(f, 0) = []
 * @symb R.times(f, 1) = [f(0)]
 * @symb R.times(f, 2) = [f(0), f(1)]
 */


var times =
/*#__PURE__*/
_curry2(function times(fn, n) {
  var len = Number(n);
  var idx = 0;
  var list;

  if (len < 0 || isNaN(len)) {
    throw new RangeError('n must be a non-negative number');
  }

  list = new Array(len);

  while (idx < len) {
    list[idx] = fn(idx);
    idx += 1;
  }

  return list;
});

module.exports = times;

/***/ }),

/***/ 1411:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var invoker =
/*#__PURE__*/
__nccwpck_require__(4910);
/**
 * The lower case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to lower case.
 * @return {String} The lower case version of `str`.
 * @see R.toUpper
 * @example
 *
 *      R.toLower('XYZ'); //=> 'xyz'
 */


var toLower =
/*#__PURE__*/
invoker(0, 'toLowerCase');
module.exports = toLower;

/***/ }),

/***/ 4187:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);
/**
 * Converts an object into an array of key, value arrays. Only the object's
 * own properties are used.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own properties.
 * @see R.fromPairs, R.keys, R.values
 * @example
 *
 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
 */


var toPairs =
/*#__PURE__*/
_curry1(function toPairs(obj) {
  var pairs = [];

  for (var prop in obj) {
    if (_has(prop, obj)) {
      pairs[pairs.length] = [prop, obj[prop]];
    }
  }

  return pairs;
});

module.exports = toPairs;

/***/ }),

/***/ 7578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Converts an object into an array of key, value arrays. The object's own
 * properties and prototype properties are used. Note that the order of the
 * output array is not guaranteed to be consistent across different JS
 * platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own
 *         and prototype properties.
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
 */


var toPairsIn =
/*#__PURE__*/
_curry1(function toPairsIn(obj) {
  var pairs = [];

  for (var prop in obj) {
    pairs[pairs.length] = [prop, obj[prop]];
  }

  return pairs;
});

module.exports = toPairsIn;

/***/ }),

/***/ 6119:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var _toString =
/*#__PURE__*/
__nccwpck_require__(165);
/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */


var toString =
/*#__PURE__*/
_curry1(function toString(val) {
  return _toString(val, []);
});

module.exports = toString;

/***/ }),

/***/ 382:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var invoker =
/*#__PURE__*/
__nccwpck_require__(4910);
/**
 * The upper case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to upper case.
 * @return {String} The upper case version of `str`.
 * @see R.toLower
 * @example
 *
 *      R.toUpper('abc'); //=> 'ABC'
 */


var toUpper =
/*#__PURE__*/
invoker(0, 'toUpperCase');
module.exports = toUpper;

/***/ }),

/***/ 1994:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _reduce =
/*#__PURE__*/
__nccwpck_require__(2872);

var _xwrap =
/*#__PURE__*/
__nccwpck_require__(7393);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Initializes a transducer using supplied iterator function. Returns a single
 * item by iterating through the list, successively calling the transformed
 * iterator function and passing it an accumulator value and the current value
 * from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It will be
 * wrapped as a transformer to initialize the transducer. A transformer can be
 * passed directly in place of an iterator function. In both cases, iteration
 * may be stopped early with the [`R.reduced`](#reduced) function.
 *
 * A transducer is a function that accepts a transformer and returns a
 * transformer and can be composed directly.
 *
 * A transformer is an object that provides a 2-arity reducing iterator
 * function, step, 0-arity initial value function, init, and 1-arity result
 * extraction function, result. The step function is used as the iterator
 * function in reduce. The result function is used to convert the final
 * accumulator into the return type and in most cases is
 * [`R.identity`](#identity). The init function can be used to provide an
 * initial accumulator, but is ignored by transduce.
 *
 * The iteration is performed with [`R.reduce`](#reduce) after initializing the transducer.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig (c -> c) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array. Wrapped as transformer, if necessary, and used to
 *        initialize the transducer
 * @param {*} acc The initial accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced, R.into
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
 *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
 *
 *      const isOdd = (x) => x % 2 !== 0;
 *      const firstOddTransducer = R.compose(R.filter(isOdd), R.take(1));
 *      R.transduce(firstOddTransducer, R.flip(R.append), [], R.range(0, 100)); //=> [1]
 */


var transduce =
/*#__PURE__*/
curryN(4, function transduce(xf, fn, acc, list) {
  return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
});
module.exports = transduce;

/***/ }),

/***/ 1016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Transposes the rows and columns of a 2D list.
 * When passed a list of `n` lists of length `x`,
 * returns a list of `x` lists of length `n`.
 *
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig [[a]] -> [[a]]
 * @param {Array} list A 2D list
 * @return {Array} A 2D list
 * @example
 *
 *      R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]
 *      R.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 *      // If some of the rows are shorter than the following rows, their elements are skipped:
 *      R.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]
 * @symb R.transpose([[a], [b], [c]]) = [a, b, c]
 * @symb R.transpose([[a, b], [c, d]]) = [[a, c], [b, d]]
 * @symb R.transpose([[a, b], [c]]) = [[a, c], [b]]
 */


var transpose =
/*#__PURE__*/
_curry1(function transpose(outerlist) {
  var i = 0;
  var result = [];

  while (i < outerlist.length) {
    var innerlist = outerlist[i];
    var j = 0;

    while (j < innerlist.length) {
      if (typeof result[j] === 'undefined') {
        result[j] = [];
      }

      result[j].push(innerlist[j]);
      j += 1;
    }

    i += 1;
  }

  return result;
});

module.exports = transpose;

/***/ }),

/***/ 949:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);

var sequence =
/*#__PURE__*/
__nccwpck_require__(4534);
/**
 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
 * into an Applicative of Traversable.
 *
 * Dispatches to the `traverse` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
 * @param {Function} of
 * @param {Function} f
 * @param {*} traversable
 * @return {*}
 * @see R.sequence
 * @example
 *
 *      // Returns `Maybe.Nothing` if the given divisor is `0`
 *      const safeDiv = n => d => d === 0 ? Maybe.Nothing() : Maybe.Just(n / d)
 *
 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Maybe.Just([5, 2.5, 2])
 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Maybe.Nothing
 */


var traverse =
/*#__PURE__*/
_curry3(function traverse(of, f, traversable) {
  return typeof traversable['fantasy-land/traverse'] === 'function' ? traversable['fantasy-land/traverse'](f, of) : typeof traversable.traverse === 'function' ? traversable.traverse(f, of) : sequence(of, map(f, traversable));
});

module.exports = traverse;

/***/ }),

/***/ 3930:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
var zeroWidth = '\u200b';
var hasProtoTrim = typeof String.prototype.trim === 'function';
/**
 * Removes (strips) whitespace from both ends of the string.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to trim.
 * @return {String} Trimmed version of `str`.
 * @example
 *
 *      R.trim('   xyz  '); //=> 'xyz'
 *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
 */

var trim = !hasProtoTrim ||
/*#__PURE__*/
ws.trim() || !
/*#__PURE__*/
zeroWidth.trim() ?
/*#__PURE__*/
_curry1(function trim(str) {
  var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
  var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
  return str.replace(beginRx, '').replace(endRx, '');
}) :
/*#__PURE__*/
_curry1(function trim(str) {
  return str.trim();
});
module.exports = trim;

/***/ }),

/***/ 5510:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _arity =
/*#__PURE__*/
__nccwpck_require__(1414);

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
 * function evaluates the `tryer`; if it does not throw, it simply returns the
 * result. If the `tryer` *does* throw, the returned function evaluates the
 * `catcher` function and returns its result. Note that for effective
 * composition with this function, both the `tryer` and `catcher` functions
 * must return the same type of results.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Function
 * @sig (...x -> a) -> ((e, ...x) -> a) -> (...x -> a)
 * @param {Function} tryer The function that may throw.
 * @param {Function} catcher The function that will be evaluated if `tryer` throws.
 * @return {Function} A new function that will catch exceptions and send them to the catcher.
 * @example
 *
 *      R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true
 *      R.tryCatch(() => { throw 'foo'}, R.always('caught'))('bar') // =>
 *      'caught'
 *      R.tryCatch(R.times(R.identity), R.always([]))('s') // => []
 *      R.tryCatch(() => { throw 'this is not a valid value'}, (err, value)=>({error : err,  value }))('bar') // => {'error': 'this is not a valid value', 'value': 'bar'}
 */


var tryCatch =
/*#__PURE__*/
_curry2(function _tryCatch(tryer, catcher) {
  return _arity(tryer.length, function () {
    try {
      return tryer.apply(this, arguments);
    } catch (e) {
      return catcher.apply(this, _concat([e], arguments));
    }
  });
});

module.exports = tryCatch;

/***/ }),

/***/ 1193:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */


var type =
/*#__PURE__*/
_curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});

module.exports = type;

/***/ }),

/***/ 3162:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Takes a function `fn`, which takes a single array argument, and returns a
 * function which:
 *
 *   - takes any number of positional arguments;
 *   - passes these arguments to `fn` as an array; and
 *   - returns the result.
 *
 * In other words, `R.unapply` derives a variadic function from a function which
 * takes an array. `R.unapply` is the inverse of [`R.apply`](#apply).
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Function
 * @sig ([*...] -> a) -> (*... -> a)
 * @param {Function} fn
 * @return {Function}
 * @see R.apply
 * @example
 *
 *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
 * @symb R.unapply(f)(a, b) = f([a, b])
 */


var unapply =
/*#__PURE__*/
_curry1(function unapply(fn) {
  return function () {
    return fn(Array.prototype.slice.call(arguments, 0));
  };
});

module.exports = unapply;

/***/ }),

/***/ 2749:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var nAry =
/*#__PURE__*/
__nccwpck_require__(2843);
/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly 1 parameter. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Function
 * @sig (a -> b -> c -> ... -> z) -> (a -> z)
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity 1.
 * @see R.binary, R.nAry
 * @example
 *
 *      const takesTwoArgs = function(a, b) {
 *        return [a, b];
 *      };
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      const takesOneArg = R.unary(takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // Only 1 argument is passed to the wrapped function
 *      takesOneArg(1, 2); //=> [1, undefined]
 * @symb R.unary(f)(a, b, c) = f(a)
 */


var unary =
/*#__PURE__*/
_curry1(function unary(fn) {
  return nAry(1, fn);
});

module.exports = unary;

/***/ }),

/***/ 58:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Returns a function of arity `n` from a (manually) curried function.
 * Note that, the returned function is actually a ramda style
 * curryied function, which can accept one or more arguments in each
 * function calling.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Function
 * @sig Number -> (a -> b -> c ... -> z) -> ((a -> b -> c ...) -> z)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to uncurry.
 * @return {Function} A new function.
 * @see R.curry, R.curryN
 * @example
 *
 *      const addFour = a => b => c => d => a + b + c + d;
 *
 *      const uncurriedAddFour = R.uncurryN(4, addFour);
 *      uncurriedAddFour(1, 2, 3, 4); //=> 10
 */


var uncurryN =
/*#__PURE__*/
_curry2(function uncurryN(depth, fn) {
  return curryN(depth, function () {
    var currentDepth = 1;
    var value = fn;
    var idx = 0;
    var endIdx;

    while (currentDepth <= depth && typeof value === 'function') {
      endIdx = currentDepth === depth ? arguments.length : idx + value.length;
      value = value.apply(this, Array.prototype.slice.call(arguments, idx, endIdx));
      currentDepth += 1;
      idx = endIdx;
    }

    return value;
  });
});

module.exports = uncurryN;

/***/ }),

/***/ 5739:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Builds a list from a seed value. Accepts an iterator function, which returns
 * either false to stop iteration or an array of length 2 containing the value
 * to add to the resulting list and the seed to be used in the next call to the
 * iterator function.
 *
 * The iterator function receives one argument: *(seed)*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig (a -> [b]) -> * -> [b]
 * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
 *        either false to quit iteration or an array of length two to proceed. The element
 *        at index 0 of this array will be added to the resulting array, and the element
 *        at index 1 will be passed to the next call to `fn`.
 * @param {*} seed The seed value.
 * @return {Array} The final list.
 * @example
 *
 *      const f = n => n > 50 ? false : [-n, n + 10];
 *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
 * @symb R.unfold(f, x) = [f(x)[0], f(f(x)[1])[0], f(f(f(x)[1])[1])[0], ...]
 */


var unfold =
/*#__PURE__*/
_curry2(function unfold(fn, seed) {
  var pair = fn(seed);
  var result = [];

  while (pair && pair.length) {
    result[result.length] = pair[0];
    pair = fn(pair[1]);
  }

  return result;
});

module.exports = unfold;

/***/ }),

/***/ 9550:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var compose =
/*#__PURE__*/
__nccwpck_require__(3651);

var uniq =
/*#__PURE__*/
__nccwpck_require__(272);
/**
 * Combines two lists into a set (i.e. no duplicates) composed of the elements
 * of each list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} as The first list.
 * @param {Array} bs The second list.
 * @return {Array} The first and second lists concatenated, with
 *         duplicates removed.
 * @example
 *
 *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
 */


var union =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
compose(uniq, _concat));

module.exports = union;

/***/ }),

/***/ 3957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _concat =
/*#__PURE__*/
__nccwpck_require__(8118);

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var uniqWith =
/*#__PURE__*/
__nccwpck_require__(6739);
/**
 * Combines two lists into a set (i.e. no duplicates) composed of the elements
 * of each list. Duplication is determined according to the value returned by
 * applying the supplied predicate to two list elements. If an element exists
 * in both lists, the first element from the first list will be used.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [*] -> [*] -> [*]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The first and second lists concatenated, with
 *         duplicates removed.
 * @see R.union
 * @example
 *
 *      const l1 = [{a: 1}, {a: 2}];
 *      const l2 = [{a: 1}, {a: 4}];
 *      R.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
 */


var unionWith =
/*#__PURE__*/
_curry3(function unionWith(pred, list1, list2) {
  return uniqWith(pred, _concat(list1, list2));
});

module.exports = unionWith;

/***/ }),

/***/ 272:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var identity =
/*#__PURE__*/
__nccwpck_require__(6304);

var uniqBy =
/*#__PURE__*/
__nccwpck_require__(6076);
/**
 * Returns a new list containing only one copy of each element in the original
 * list. [`R.equals`](#equals) is used to determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
 *      R.uniq([1, '1']);     //=> [1, '1']
 *      R.uniq([[42], [42]]); //=> [[42]]
 */


var uniq =
/*#__PURE__*/
uniqBy(identity);
module.exports = uniq;

/***/ }),

/***/ 6076:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _Set =
/*#__PURE__*/
__nccwpck_require__(1781);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _xuniqBy =
/*#__PURE__*/
__nccwpck_require__(9931);
/**
 * Returns a new list containing only one copy of each element in the original
 * list, based upon the value returned by applying the supplied function to
 * each list element. Prefers the first item if the supplied function produces
 * the same value on two items. [`R.equals`](#equals) is used for comparison.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> b) -> [a] -> [a]
 * @param {Function} fn A function used to produce a value to use during comparisons.
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
 */


var uniqBy =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xuniqBy, function (fn, list) {
  var set = new _Set();
  var result = [];
  var idx = 0;
  var appliedItem, item;

  while (idx < list.length) {
    item = list[idx];
    appliedItem = fn(item);

    if (set.add(appliedItem)) {
      result.push(item);
    }

    idx += 1;
  }

  return result;
}));

module.exports = uniqBy;

/***/ }),

/***/ 6739:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _dispatchable =
/*#__PURE__*/
__nccwpck_require__(9699);

var _includesWith =
/*#__PURE__*/
__nccwpck_require__(3968);

var _xuniqWith =
/*#__PURE__*/
__nccwpck_require__(4902);
/**
 * Returns a new list containing only one copy of each element in the original
 * list, based upon the value returned by applying the supplied predicate to
 * two list elements. Prefers the first item if two items compare equal based
 * on the predicate.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category List
 * @sig ((a, a) -> Boolean) -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      const strEq = R.eqBy(String);
 *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
 *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
 *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
 *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
 */


var uniqWith =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xuniqWith, function (pred, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var item;

  while (idx < len) {
    item = list[idx];

    if (!_includesWith(pred, item, result)) {
      result[result.length] = item;
    }

    idx += 1;
  }

  return result;
}));

module.exports = uniqWith;

/***/ }),

/***/ 9300:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is not satisfied, the function will return the result of
 * calling the `whenFalseFn` function with the same argument. If the predicate
 * is satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> b) -> a -> a | b
 * @param {Function} pred        A predicate function
 * @param {Function} whenFalseFn A function to invoke when the `pred` evaluates
 *                               to a falsy value.
 * @param {*}        x           An object to test with the `pred` function and
 *                               pass to `whenFalseFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenFalseFn`.
 * @see R.ifElse, R.when, R.cond
 * @example
 *
 *      let safeInc = R.unless(R.isNil, R.inc);
 *      safeInc(null); //=> null
 *      safeInc(1); //=> 2
 */


var unless =
/*#__PURE__*/
_curry3(function unless(pred, whenFalseFn, x) {
  return pred(x) ? x : whenFalseFn(x);
});

module.exports = unless;

/***/ }),

/***/ 5442:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _identity =
/*#__PURE__*/
__nccwpck_require__(4003);

var chain =
/*#__PURE__*/
__nccwpck_require__(8210);
/**
 * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
 * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain c => c (c a) -> c a
 * @param {*} list
 * @return {*}
 * @see R.flatten, R.chain
 * @example
 *
 *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
 *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
 */


var unnest =
/*#__PURE__*/
chain(_identity);
module.exports = unnest;

/***/ }),

/***/ 135:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Takes a predicate, a transformation function, and an initial value,
 * and returns a value of the same type as the initial value.
 * It does so by applying the transformation until the predicate is satisfied,
 * at which point it returns the satisfactory value.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> a) -> a -> a
 * @param {Function} pred A predicate function
 * @param {Function} fn The iterator function
 * @param {*} init Initial value
 * @return {*} Final value that satisfies predicate
 * @example
 *
 *      R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
 */


var until =
/*#__PURE__*/
_curry3(function until(pred, fn, init) {
  var val = init;

  while (!pred(val)) {
    val = fn(val);
  }

  return val;
});

module.exports = until;

/***/ }),

/***/ 1594:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _isArray =
/*#__PURE__*/
__nccwpck_require__(6999);

var _map =
/*#__PURE__*/
__nccwpck_require__(8077);

var _assoc =
/*#__PURE__*/
__nccwpck_require__(4702);
/**
 *
 * Deconstructs an array field from the input documents to output a document for each element.
 * Each output document is the input document with the value of the array field replaced by the element.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig String -> {k: [v]} -> [{k: v}]
 * @param {String} key The key to determine which property of the object should be unwind
 * @param {Object} object The object containing list under property named as key which is to unwind
 * @return {List} A new list of object containing the value of input key having list replaced by each element in the object.
 * @example
 *
 * R.unwind('hobbies', {
 *   name: 'alice',
 *   hobbies: ['Golf', 'Hacking'],
 *   colors: ['red', 'green'],
 * });
 * // [
 * //   { name: 'alice', hobbies: 'Golf', colors: ['red', 'green'] },
 * //   { name: 'alice', hobbies: 'Hacking', colors: ['red', 'green'] }
 * // ]
 */


var unwind =
/*#__PURE__*/
_curry2(function (key, object) {
  // If key is not in object or key is not as a list in object
  if (!(key in object && _isArray(object[key]))) {
    return [object];
  } // Map over object[key] which is a list and assoc each element with key


  return _map(function (item) {
    return _assoc(key, item, object);
  }, object[key]);
});

module.exports = unwind;

/***/ }),

/***/ 129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);

var adjust =
/*#__PURE__*/
__nccwpck_require__(743);

var always =
/*#__PURE__*/
__nccwpck_require__(7770);
/**
 * Returns a new copy of the array with the element at the provided index
 * replaced with the given value.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> a -> [a] -> [a]
 * @param {Number} idx The index to update.
 * @param {*} x The value to exist at the given index of the returned array.
 * @param {Array|Arguments} list The source array-like object to be updated.
 * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
 * @see R.adjust
 * @example
 *
 *      R.update(1, '_', ['a', 'b', 'c']);      //=> ['a', '_', 'c']
 *      R.update(-1, '_', ['a', 'b', 'c']);     //=> ['a', 'b', '_']
 * @symb R.update(-1, a, [b, c]) = [b, a]
 * @symb R.update(0, a, [b, c]) = [a, c]
 * @symb R.update(1, a, [b, c]) = [b, a]
 */


var update =
/*#__PURE__*/
_curry3(function update(idx, x, list) {
  return adjust(idx, always(x), list);
});

module.exports = update;

/***/ }),

/***/ 6487:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var curryN =
/*#__PURE__*/
__nccwpck_require__(1071);
/**
 * Accepts a function `fn` and a list of transformer functions and returns a
 * new curried function. When the new function is invoked, it calls the
 * function `fn` with parameters consisting of the result of calling each
 * supplied handler on successive arguments to the new function.
 *
 * If more arguments are passed to the returned function than transformer
 * functions, those arguments are passed directly to `fn` as additional
 * parameters. If you expect additional arguments that don't need to be
 * transformed, although you can ignore them, it's best to pass an identity
 * function so that the new function reports the correct arity.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((x1, x2, ...) -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} fn The function to wrap.
 * @param {Array} transformers A list of transformer functions
 * @return {Function} The wrapped function.
 * @see R.converge
 * @example
 *
 *      R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81
 *      R.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81
 *      R.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32
 *      R.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32
 * @symb R.useWith(f, [g, h])(a, b) = f(g(a), h(b))
 */


var useWith =
/*#__PURE__*/
_curry2(function useWith(fn, transformers) {
  return curryN(transformers.length, function () {
    var args = [];
    var idx = 0;

    while (idx < transformers.length) {
      args.push(transformers[idx].call(this, arguments[idx]));
      idx += 1;
    }

    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
  });
});

module.exports = useWith;

/***/ }),

/***/ 6410:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);

var keys =
/*#__PURE__*/
__nccwpck_require__(6755);
/**
 * Returns a list of all the enumerable own properties of the supplied object.
 * Note that the order of the output array is not guaranteed across different
 * JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own properties.
 * @see R.valuesIn, R.keys, R.toPairs
 * @example
 *
 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
 */


var values =
/*#__PURE__*/
_curry1(function values(obj) {
  var props = keys(obj);
  var len = props.length;
  var vals = [];
  var idx = 0;

  while (idx < len) {
    vals[idx] = obj[props[idx]];
    idx += 1;
  }

  return vals;
});

module.exports = values;

/***/ }),

/***/ 2168:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry1 =
/*#__PURE__*/
__nccwpck_require__(713);
/**
 * Returns a list of all the properties, including prototype properties, of the
 * supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own and prototype properties.
 * @see R.values, R.keysIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.valuesIn(f); //=> ['X', 'Y']
 */


var valuesIn =
/*#__PURE__*/
_curry1(function valuesIn(obj) {
  var prop;
  var vs = [];

  for (prop in obj) {
    vs[vs.length] = obj[prop];
  }

  return vs;
});

module.exports = valuesIn;

/***/ }),

/***/ 3288:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483); // `Const` is a functor that effectively ignores the function given to `map`.


var Const = function (x) {
  return {
    value: x,
    'fantasy-land/map': function () {
      return this;
    }
  };
};
/**
 * Returns a "view" of the given data structure, determined by the given lens.
 * The lens's focus determines which portion of the data structure is visible.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> s -> a
 * @param {Lens} lens
 * @param {*} x
 * @return {*}
 * @see R.set, R.over, R.lens, R.lensIndex, R.lensProp, R.lensPath
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});  //=> 1
 *      R.view(xLens, {x: 4, y: 2});  //=> 4
 */


var view =
/*#__PURE__*/
_curry2(function view(lens, x) {
  // Using `Const` effectively ignores the setter function of the `lens`,
  // leaving the value returned by the getter function unmodified.
  return lens(Const)(x).value;
});

module.exports = view;

/***/ }),

/***/ 2531:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is satisfied, the function will return the result of calling
 * the `whenTrueFn` function with the same argument. If the predicate is not
 * satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> b) -> a -> a | b
 * @param {Function} pred       A predicate function
 * @param {Function} whenTrueFn A function to invoke when the `condition`
 *                              evaluates to a truthy value.
 * @param {*}        x          An object to test with the `pred` function and
 *                              pass to `whenTrueFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
 * @see R.ifElse, R.unless, R.cond
 * @example
 *
 *      // truncate :: String -> String
 *      const truncate = R.when(
 *        R.propSatisfies(R.gt(R.__, 10), 'length'),
 *        R.pipe(R.take(10), R.append('…'), R.join(''))
 *      );
 *      truncate('12345');         //=> '12345'
 *      truncate('0123456789ABC'); //=> '0123456789…'
 */


var when =
/*#__PURE__*/
_curry3(function when(pred, whenTrueFn, x) {
  return pred(x) ? whenTrueFn(x) : x;
});

module.exports = when;

/***/ }),

/***/ 5060:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);
/**
 * Takes a spec object and a test object; returns true if the test satisfies
 * the spec. Each of the spec's own properties must be a predicate function.
 * Each predicate is applied to the value of the corresponding property of the
 * test object. `where` returns true if all the predicates return true, false
 * otherwise.
 *
 * `where` is well suited to declaratively expressing constraints for other
 * functions such as [`filter`](#filter) and [`find`](#find).
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category Object
 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propSatisfies, R.whereEq
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.where({
 *        a: R.equals('foo'),
 *        b: R.complement(R.equals('bar')),
 *        x: R.gt(R.__, 10),
 *        y: R.lt(R.__, 20)
 *      });
 *
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
 *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
 *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
 *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
 */


var where =
/*#__PURE__*/
_curry2(function where(spec, testObj) {
  for (var prop in spec) {
    if (_has(prop, spec) && !spec[prop](testObj[prop])) {
      return false;
    }
  }

  return true;
});

module.exports = where;

/***/ }),

/***/ 3811:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var _has =
/*#__PURE__*/
__nccwpck_require__(1693);
/**
 * Takes a spec object and a test object; each of the spec's own properties must be a predicate function.
 * Each predicate is applied to the value of the corresponding property of the
 * test object. `whereAny` returns true if at least one of the predicates return true,
 * false otherwise.
 *
 * `whereAny` is well suited to declaratively expressing constraints for other
 * functions such as [`filter`](#filter) and [`find`](#find).
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propSatisfies, R.where
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.whereAny({
 *        a: R.equals('foo'),
 *        b: R.complement(R.equals('xxx')),
 *        x: R.gt(R.__, 10),
 *        y: R.lt(R.__, 20)
 *      });
 *
 *      pred({a: 'foo', b: 'xxx', x: 8, y: 34}); //=> true
 *      pred({a: 'xxx', b: 'xxx', x: 9, y: 21}); //=> false
 *      pred({a: 'bar', b: 'xxx', x: 10, y: 20}); //=> false
 *      pred({a: 'foo', b: 'bar', x: 10, y: 20}); //=> true
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> true
 */


var whereAny =
/*#__PURE__*/
_curry2(function whereAny(spec, testObj) {
  for (var prop in spec) {
    if (_has(prop, spec) && spec[prop](testObj[prop])) {
      return true;
    }
  }

  return false;
});

module.exports = whereAny;

/***/ }),

/***/ 255:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var equals =
/*#__PURE__*/
__nccwpck_require__(548);

var map =
/*#__PURE__*/
__nccwpck_require__(8820);

var where =
/*#__PURE__*/
__nccwpck_require__(5060);
/**
 * Takes a spec object and a test object; returns true if the test satisfies
 * the spec, false otherwise. An object satisfies the spec if, for each of the
 * spec's own properties, accessing that property of the object gives the same
 * value (in [`R.equals`](#equals) terms) as accessing that property of the
 * spec.
 *
 * `whereEq` is a specialization of [`where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @sig {String: *} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propEq, R.where
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.whereEq({a: 1, b: 2});
 *
 *      pred({a: 1});              //=> false
 *      pred({a: 1, b: 2});        //=> true
 *      pred({a: 1, b: 2, c: 3});  //=> true
 *      pred({a: 1, b: 1});        //=> false
 */


var whereEq =
/*#__PURE__*/
_curry2(function whereEq(spec, testObj) {
  return where(map(equals, spec), testObj);
});

module.exports = whereEq;

/***/ }),

/***/ 2274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _includes =
/*#__PURE__*/
__nccwpck_require__(3148);

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);

var flip =
/*#__PURE__*/
__nccwpck_require__(5804);

var reject =
/*#__PURE__*/
__nccwpck_require__(1545);
/**
 * Returns a new list without values in the first argument.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @param {Array} list1 The values to be removed from `list2`.
 * @param {Array} list2 The array to remove values from.
 * @return {Array} The new array without values in `list1`.
 * @see R.transduce, R.difference, R.remove
 * @example
 *
 *      R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]
 */


var without =
/*#__PURE__*/
_curry2(function (xs, list) {
  return reject(flip(_includes)(xs), list);
});

module.exports = without;

/***/ }),

/***/ 219:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Exclusive disjunction logical operation.
 * Returns `true` if one of the arguments is truthy and the other is falsy.
 * Otherwise, it returns `false`.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Logic
 * @sig a -> b -> Boolean
 * @param {Any} a
 * @param {Any} b
 * @return {Boolean} true if one of the arguments is truthy and the other is falsy
 * @see R.or, R.and
 * @example
 *
 *      R.xor(true, true); //=> false
 *      R.xor(true, false); //=> true
 *      R.xor(false, true); //=> true
 *      R.xor(false, false); //=> false
 */


var xor =
/*#__PURE__*/
_curry2(function xor(a, b) {
  return Boolean(!a ^ !b);
});

module.exports = xor;

/***/ }),

/***/ 2718:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Creates a new list out of the two supplied by creating each possible pair
 * from the lists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b] -> [[a,b]]
 * @param {Array} as The first list.
 * @param {Array} bs The second list.
 * @return {Array} The list made by combining each possible pair from
 *         `as` and `bs` into pairs (`[a, b]`).
 * @example
 *
 *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * @symb R.xprod([a, b], [c, d]) = [[a, c], [a, d], [b, c], [b, d]]
 */


var xprod =
/*#__PURE__*/
_curry2(function xprod(a, b) {
  // = xprodWith(prepend); (takes about 3 times as long...)
  var idx = 0;
  var ilen = a.length;
  var j;
  var jlen = b.length;
  var result = [];

  while (idx < ilen) {
    j = 0;

    while (j < jlen) {
      result[result.length] = [a[idx], b[j]];
      j += 1;
    }

    idx += 1;
  }

  return result;
});

module.exports = xprod;

/***/ }),

/***/ 9024:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Creates a new list out of the two supplied by pairing up equally-positioned
 * items from both lists. The returned list is truncated to the length of the
 * shorter of the two input lists.
 * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b] -> [[a,b]]
 * @param {Array} list1 The first array to consider.
 * @param {Array} list2 The second array to consider.
 * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
 * @example
 *
 *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
 * @symb R.zip([a, b, c], [d, e, f]) = [[a, d], [b, e], [c, f]]
 */


var zip =
/*#__PURE__*/
_curry2(function zip(a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);

  while (idx < len) {
    rv[idx] = [a[idx], b[idx]];
    idx += 1;
  }

  return rv;
});

module.exports = zip;

/***/ }),

/***/ 2902:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry2 =
/*#__PURE__*/
__nccwpck_require__(9483);
/**
 * Creates a new object out of a list of keys and a list of values.
 * Key/value pairing is truncated to the length of the shorter of the two lists.
 * Note: `zipObj` is equivalent to `pipe(zip, fromPairs)`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [String] -> [*] -> {String: *}
 * @param {Array} keys The array that will be properties on the output object.
 * @param {Array} values The list of values on the output object.
 * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
 * @example
 *
 *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
 */


var zipObj =
/*#__PURE__*/
_curry2(function zipObj(keys, values) {
  var idx = 0;
  var len = Math.min(keys.length, values.length);
  var out = {};

  while (idx < len) {
    out[keys[idx]] = values[idx];
    idx += 1;
  }

  return out;
});

module.exports = zipObj;

/***/ }),

/***/ 1104:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var _curry3 =
/*#__PURE__*/
__nccwpck_require__(7597);
/**
 * Creates a new list out of the two supplied by applying the function to each
 * equally-positioned pair in the lists. The returned list is truncated to the
 * length of the shorter of the two input lists.
 *
 * @function
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> c) -> [a] -> [b] -> [c]
 * @param {Function} fn The function used to combine the two elements into one value.
 * @param {Array} list1 The first array to consider.
 * @param {Array} list2 The second array to consider.
 * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
 *         using `fn`.
 * @example
 *
 *      const f = (x, y) => {
 *        // ...
 *      };
 *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
 *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
 * @symb R.zipWith(fn, [a, b, c], [d, e, f]) = [fn(a, d), fn(b, e), fn(c, f)]
 */


var zipWith =
/*#__PURE__*/
_curry3(function zipWith(fn, a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);

  while (idx < len) {
    rv[idx] = fn(a[idx], b[idx]);
    idx += 1;
  }

  return rv;
});

module.exports = zipWith;

/***/ }),

/***/ 1872:
/***/ (function(module) {

;/*! showdown v 1.9.1 - 02-11-2019 */
(function(){
/**
 * Created by Tivie on 13-07-2015.
 */

function getDefaultOpts (simple) {
  'use strict';

  var defaultOptions = {
    omitExtraWLInCodeBlocks: {
      defaultValue: false,
      describe: 'Omit the default extra whiteline added to code blocks',
      type: 'boolean'
    },
    noHeaderId: {
      defaultValue: false,
      describe: 'Turn on/off generated header id',
      type: 'boolean'
    },
    prefixHeaderId: {
      defaultValue: false,
      describe: 'Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic \'section-\' prefix',
      type: 'string'
    },
    rawPrefixHeaderId: {
      defaultValue: false,
      describe: 'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',
      type: 'boolean'
    },
    ghCompatibleHeaderId: {
      defaultValue: false,
      describe: 'Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)',
      type: 'boolean'
    },
    rawHeaderId: {
      defaultValue: false,
      describe: 'Remove only spaces, \' and " from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids',
      type: 'boolean'
    },
    headerLevelStart: {
      defaultValue: false,
      describe: 'The header blocks level start',
      type: 'integer'
    },
    parseImgDimensions: {
      defaultValue: false,
      describe: 'Turn on/off image dimension parsing',
      type: 'boolean'
    },
    simplifiedAutoLink: {
      defaultValue: false,
      describe: 'Turn on/off GFM autolink style',
      type: 'boolean'
    },
    excludeTrailingPunctuationFromURLs: {
      defaultValue: false,
      describe: 'Excludes trailing punctuation from links generated with autoLinking',
      type: 'boolean'
    },
    literalMidWordUnderscores: {
      defaultValue: false,
      describe: 'Parse midword underscores as literal underscores',
      type: 'boolean'
    },
    literalMidWordAsterisks: {
      defaultValue: false,
      describe: 'Parse midword asterisks as literal asterisks',
      type: 'boolean'
    },
    strikethrough: {
      defaultValue: false,
      describe: 'Turn on/off strikethrough support',
      type: 'boolean'
    },
    tables: {
      defaultValue: false,
      describe: 'Turn on/off tables support',
      type: 'boolean'
    },
    tablesHeaderId: {
      defaultValue: false,
      describe: 'Add an id to table headers',
      type: 'boolean'
    },
    ghCodeBlocks: {
      defaultValue: true,
      describe: 'Turn on/off GFM fenced code blocks support',
      type: 'boolean'
    },
    tasklists: {
      defaultValue: false,
      describe: 'Turn on/off GFM tasklist support',
      type: 'boolean'
    },
    smoothLivePreview: {
      defaultValue: false,
      describe: 'Prevents weird effects in live previews due to incomplete input',
      type: 'boolean'
    },
    smartIndentationFix: {
      defaultValue: false,
      description: 'Tries to smartly fix indentation in es6 strings',
      type: 'boolean'
    },
    disableForced4SpacesIndentedSublists: {
      defaultValue: false,
      description: 'Disables the requirement of indenting nested sublists by 4 spaces',
      type: 'boolean'
    },
    simpleLineBreaks: {
      defaultValue: false,
      description: 'Parses simple line breaks as <br> (GFM Style)',
      type: 'boolean'
    },
    requireSpaceBeforeHeadingText: {
      defaultValue: false,
      description: 'Makes adding a space between `#` and the header text mandatory (GFM Style)',
      type: 'boolean'
    },
    ghMentions: {
      defaultValue: false,
      description: 'Enables github @mentions',
      type: 'boolean'
    },
    ghMentionsLink: {
      defaultValue: 'https://github.com/{u}',
      description: 'Changes the link generated by @mentions. Only applies if ghMentions option is enabled.',
      type: 'string'
    },
    encodeEmails: {
      defaultValue: true,
      description: 'Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities',
      type: 'boolean'
    },
    openLinksInNewWindow: {
      defaultValue: false,
      description: 'Open all links in new windows',
      type: 'boolean'
    },
    backslashEscapesHTMLTags: {
      defaultValue: false,
      description: 'Support for HTML Tag escaping. ex: \<div>foo\</div>',
      type: 'boolean'
    },
    emoji: {
      defaultValue: false,
      description: 'Enable emoji support. Ex: `this is a :smile: emoji`',
      type: 'boolean'
    },
    underline: {
      defaultValue: false,
      description: 'Enable support for underline. Syntax is double or triple underscores: `__underline word__`. With this option enabled, underscores no longer parses into `<em>` and `<strong>`',
      type: 'boolean'
    },
    completeHTMLDocument: {
      defaultValue: false,
      description: 'Outputs a complete html document, including `<html>`, `<head>` and `<body>` tags',
      type: 'boolean'
    },
    metadata: {
      defaultValue: false,
      description: 'Enable support for document metadata (defined at the top of the document between `«««` and `»»»` or between `---` and `---`).',
      type: 'boolean'
    },
    splitAdjacentBlockquotes: {
      defaultValue: false,
      description: 'Split adjacent blockquote blocks',
      type: 'boolean'
    }
  };
  if (simple === false) {
    return JSON.parse(JSON.stringify(defaultOptions));
  }
  var ret = {};
  for (var opt in defaultOptions) {
    if (defaultOptions.hasOwnProperty(opt)) {
      ret[opt] = defaultOptions[opt].defaultValue;
    }
  }
  return ret;
}

function allOptionsOn () {
  'use strict';
  var options = getDefaultOpts(true),
      ret = {};
  for (var opt in options) {
    if (options.hasOwnProperty(opt)) {
      ret[opt] = true;
    }
  }
  return ret;
}

/**
 * Created by Tivie on 06-01-2015.
 */

// Private properties
var showdown = {},
    parsers = {},
    extensions = {},
    globalOptions = getDefaultOpts(true),
    setFlavor = 'vanilla',
    flavor = {
      github: {
        omitExtraWLInCodeBlocks:              true,
        simplifiedAutoLink:                   true,
        excludeTrailingPunctuationFromURLs:   true,
        literalMidWordUnderscores:            true,
        strikethrough:                        true,
        tables:                               true,
        tablesHeaderId:                       true,
        ghCodeBlocks:                         true,
        tasklists:                            true,
        disableForced4SpacesIndentedSublists: true,
        simpleLineBreaks:                     true,
        requireSpaceBeforeHeadingText:        true,
        ghCompatibleHeaderId:                 true,
        ghMentions:                           true,
        backslashEscapesHTMLTags:             true,
        emoji:                                true,
        splitAdjacentBlockquotes:             true
      },
      original: {
        noHeaderId:                           true,
        ghCodeBlocks:                         false
      },
      ghost: {
        omitExtraWLInCodeBlocks:              true,
        parseImgDimensions:                   true,
        simplifiedAutoLink:                   true,
        excludeTrailingPunctuationFromURLs:   true,
        literalMidWordUnderscores:            true,
        strikethrough:                        true,
        tables:                               true,
        tablesHeaderId:                       true,
        ghCodeBlocks:                         true,
        tasklists:                            true,
        smoothLivePreview:                    true,
        simpleLineBreaks:                     true,
        requireSpaceBeforeHeadingText:        true,
        ghMentions:                           false,
        encodeEmails:                         true
      },
      vanilla: getDefaultOpts(true),
      allOn: allOptionsOn()
    };

/**
 * helper namespace
 * @type {{}}
 */
showdown.helper = {};

/**
 * TODO LEGACY SUPPORT CODE
 * @type {{}}
 */
showdown.extensions = {};

/**
 * Set a global option
 * @static
 * @param {string} key
 * @param {*} value
 * @returns {showdown}
 */
showdown.setOption = function (key, value) {
  'use strict';
  globalOptions[key] = value;
  return this;
};

/**
 * Get a global option
 * @static
 * @param {string} key
 * @returns {*}
 */
showdown.getOption = function (key) {
  'use strict';
  return globalOptions[key];
};

/**
 * Get the global options
 * @static
 * @returns {{}}
 */
showdown.getOptions = function () {
  'use strict';
  return globalOptions;
};

/**
 * Reset global options to the default values
 * @static
 */
showdown.resetOptions = function () {
  'use strict';
  globalOptions = getDefaultOpts(true);
};

/**
 * Set the flavor showdown should use as default
 * @param {string} name
 */
showdown.setFlavor = function (name) {
  'use strict';
  if (!flavor.hasOwnProperty(name)) {
    throw Error(name + ' flavor was not found');
  }
  showdown.resetOptions();
  var preset = flavor[name];
  setFlavor = name;
  for (var option in preset) {
    if (preset.hasOwnProperty(option)) {
      globalOptions[option] = preset[option];
    }
  }
};

/**
 * Get the currently set flavor
 * @returns {string}
 */
showdown.getFlavor = function () {
  'use strict';
  return setFlavor;
};

/**
 * Get the options of a specified flavor. Returns undefined if the flavor was not found
 * @param {string} name Name of the flavor
 * @returns {{}|undefined}
 */
showdown.getFlavorOptions = function (name) {
  'use strict';
  if (flavor.hasOwnProperty(name)) {
    return flavor[name];
  }
};

/**
 * Get the default options
 * @static
 * @param {boolean} [simple=true]
 * @returns {{}}
 */
showdown.getDefaultOptions = function (simple) {
  'use strict';
  return getDefaultOpts(simple);
};

/**
 * Get or set a subParser
 *
 * subParser(name)       - Get a registered subParser
 * subParser(name, func) - Register a subParser
 * @static
 * @param {string} name
 * @param {function} [func]
 * @returns {*}
 */
showdown.subParser = function (name, func) {
  'use strict';
  if (showdown.helper.isString(name)) {
    if (typeof func !== 'undefined') {
      parsers[name] = func;
    } else {
      if (parsers.hasOwnProperty(name)) {
        return parsers[name];
      } else {
        throw Error('SubParser named ' + name + ' not registered!');
      }
    }
  }
};

/**
 * Gets or registers an extension
 * @static
 * @param {string} name
 * @param {object|function=} ext
 * @returns {*}
 */
showdown.extension = function (name, ext) {
  'use strict';

  if (!showdown.helper.isString(name)) {
    throw Error('Extension \'name\' must be a string');
  }

  name = showdown.helper.stdExtName(name);

  // Getter
  if (showdown.helper.isUndefined(ext)) {
    if (!extensions.hasOwnProperty(name)) {
      throw Error('Extension named ' + name + ' is not registered!');
    }
    return extensions[name];

    // Setter
  } else {
    // Expand extension if it's wrapped in a function
    if (typeof ext === 'function') {
      ext = ext();
    }

    // Ensure extension is an array
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExtension = validate(ext, name);

    if (validExtension.valid) {
      extensions[name] = ext;
    } else {
      throw Error(validExtension.error);
    }
  }
};

/**
 * Gets all extensions registered
 * @returns {{}}
 */
showdown.getAllExtensions = function () {
  'use strict';
  return extensions;
};

/**
 * Remove an extension
 * @param {string} name
 */
showdown.removeExtension = function (name) {
  'use strict';
  delete extensions[name];
};

/**
 * Removes all extensions
 */
showdown.resetExtensions = function () {
  'use strict';
  extensions = {};
};

/**
 * Validate extension
 * @param {array} extension
 * @param {string} name
 * @returns {{valid: boolean, error: string}}
 */
function validate (extension, name) {
  'use strict';

  var errMsg = (name) ? 'Error in ' + name + ' extension->' : 'Error in unnamed extension',
      ret = {
        valid: true,
        error: ''
      };

  if (!showdown.helper.isArray(extension)) {
    extension = [extension];
  }

  for (var i = 0; i < extension.length; ++i) {
    var baseMsg = errMsg + ' sub-extension ' + i + ': ',
        ext = extension[i];
    if (typeof ext !== 'object') {
      ret.valid = false;
      ret.error = baseMsg + 'must be an object, but ' + typeof ext + ' given';
      return ret;
    }

    if (!showdown.helper.isString(ext.type)) {
      ret.valid = false;
      ret.error = baseMsg + 'property "type" must be a string, but ' + typeof ext.type + ' given';
      return ret;
    }

    var type = ext.type = ext.type.toLowerCase();

    // normalize extension type
    if (type === 'language') {
      type = ext.type = 'lang';
    }

    if (type === 'html') {
      type = ext.type = 'output';
    }

    if (type !== 'lang' && type !== 'output' && type !== 'listener') {
      ret.valid = false;
      ret.error = baseMsg + 'type ' + type + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"';
      return ret;
    }

    if (type === 'listener') {
      if (showdown.helper.isUndefined(ext.listeners)) {
        ret.valid = false;
        ret.error = baseMsg + '. Extensions of type "listener" must have a property called "listeners"';
        return ret;
      }
    } else {
      if (showdown.helper.isUndefined(ext.filter) && showdown.helper.isUndefined(ext.regex)) {
        ret.valid = false;
        ret.error = baseMsg + type + ' extensions must define either a "regex" property or a "filter" method';
        return ret;
      }
    }

    if (ext.listeners) {
      if (typeof ext.listeners !== 'object') {
        ret.valid = false;
        ret.error = baseMsg + '"listeners" property must be an object but ' + typeof ext.listeners + ' given';
        return ret;
      }
      for (var ln in ext.listeners) {
        if (ext.listeners.hasOwnProperty(ln)) {
          if (typeof ext.listeners[ln] !== 'function') {
            ret.valid = false;
            ret.error = baseMsg + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + ln +
              ' must be a function but ' + typeof ext.listeners[ln] + ' given';
            return ret;
          }
        }
      }
    }

    if (ext.filter) {
      if (typeof ext.filter !== 'function') {
        ret.valid = false;
        ret.error = baseMsg + '"filter" must be a function, but ' + typeof ext.filter + ' given';
        return ret;
      }
    } else if (ext.regex) {
      if (showdown.helper.isString(ext.regex)) {
        ext.regex = new RegExp(ext.regex, 'g');
      }
      if (!(ext.regex instanceof RegExp)) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" property must either be a string or a RegExp object, but ' + typeof ext.regex + ' given';
        return ret;
      }
      if (showdown.helper.isUndefined(ext.replace)) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" extensions must implement a replace string or function';
        return ret;
      }
    }
  }
  return ret;
}

/**
 * Validate extension
 * @param {object} ext
 * @returns {boolean}
 */
showdown.validateExtension = function (ext) {
  'use strict';

  var validateExtension = validate(ext, null);
  if (!validateExtension.valid) {
    console.warn(validateExtension.error);
    return false;
  }
  return true;
};

/**
 * showdownjs helper functions
 */

if (!showdown.hasOwnProperty('helper')) {
  showdown.helper = {};
}

/**
 * Check if var is string
 * @static
 * @param {string} a
 * @returns {boolean}
 */
showdown.helper.isString = function (a) {
  'use strict';
  return (typeof a === 'string' || a instanceof String);
};

/**
 * Check if var is a function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isFunction = function (a) {
  'use strict';
  var getType = {};
  return a && getType.toString.call(a) === '[object Function]';
};

/**
 * isArray helper function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isArray = function (a) {
  'use strict';
  return Array.isArray(a);
};

/**
 * Check if value is undefined
 * @static
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 */
showdown.helper.isUndefined = function (value) {
  'use strict';
  return typeof value === 'undefined';
};

/**
 * ForEach helper function
 * Iterates over Arrays and Objects (own properties only)
 * @static
 * @param {*} obj
 * @param {function} callback Accepts 3 params: 1. value, 2. key, 3. the original array/object
 */
showdown.helper.forEach = function (obj, callback) {
  'use strict';
  // check if obj is defined
  if (showdown.helper.isUndefined(obj)) {
    throw new Error('obj param is required');
  }

  if (showdown.helper.isUndefined(callback)) {
    throw new Error('callback param is required');
  }

  if (!showdown.helper.isFunction(callback)) {
    throw new Error('callback param must be a function/closure');
  }

  if (typeof obj.forEach === 'function') {
    obj.forEach(callback);
  } else if (showdown.helper.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      callback(obj[i], i, obj);
    }
  } else if (typeof (obj) === 'object') {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        callback(obj[prop], prop, obj);
      }
    }
  } else {
    throw new Error('obj does not seem to be an array or an iterable object');
  }
};

/**
 * Standardidize extension name
 * @static
 * @param {string} s extension name
 * @returns {string}
 */
showdown.helper.stdExtName = function (s) {
  'use strict';
  return s.replace(/[_?*+\/\\.^-]/g, '').replace(/\s/g, '').toLowerCase();
};

function escapeCharactersCallback (wholeMatch, m1) {
  'use strict';
  var charCodeToEscape = m1.charCodeAt(0);
  return '¨E' + charCodeToEscape + 'E';
}

/**
 * Callback used to escape characters when passing through String.replace
 * @static
 * @param {string} wholeMatch
 * @param {string} m1
 * @returns {string}
 */
showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

/**
 * Escape characters in a string
 * @static
 * @param {string} text
 * @param {string} charsToEscape
 * @param {boolean} afterBackslash
 * @returns {XML|string|void|*}
 */
showdown.helper.escapeCharacters = function (text, charsToEscape, afterBackslash) {
  'use strict';
  // First we have to escape the escape characters so that
  // we can build a character class out of them
  var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';

  if (afterBackslash) {
    regexString = '\\\\' + regexString;
  }

  var regex = new RegExp(regexString, 'g');
  text = text.replace(regex, escapeCharactersCallback);

  return text;
};

/**
 * Unescape HTML entities
 * @param txt
 * @returns {string}
 */
showdown.helper.unescapeHTMLEntities = function (txt) {
  'use strict';

  return txt
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
};

var rgxFindMatchPos = function (str, left, right, flags) {
  'use strict';
  var f = flags || '',
      g = f.indexOf('g') > -1,
      x = new RegExp(left + '|' + right, 'g' + f.replace(/g/g, '')),
      l = new RegExp(left, f.replace(/g/g, '')),
      pos = [],
      t, s, m, start, end;

  do {
    t = 0;
    while ((m = x.exec(str))) {
      if (l.test(m[0])) {
        if (!(t++)) {
          s = x.lastIndex;
          start = s - m[0].length;
        }
      } else if (t) {
        if (!--t) {
          end = m.index + m[0].length;
          var obj = {
            left: {start: start, end: s},
            match: {start: s, end: m.index},
            right: {start: m.index, end: end},
            wholeMatch: {start: start, end: end}
          };
          pos.push(obj);
          if (!g) {
            return pos;
          }
        }
      }
    }
  } while (t && (x.lastIndex = s));

  return pos;
};

/**
 * matchRecursiveRegExp
 *
 * (c) 2007 Steven Levithan <stevenlevithan.com>
 * MIT License
 *
 * Accepts a string to search, a left and right format delimiter
 * as regex patterns, and optional regex flags. Returns an array
 * of matches, allowing nested instances of left/right delimiters.
 * Use the "g" flag to return all matches, otherwise only the
 * first is returned. Be careful to ensure that the left and
 * right format delimiters produce mutually exclusive matches.
 * Backreferences are not supported within the right delimiter
 * due to how it is internally combined with the left delimiter.
 * When matching strings whose format delimiters are unbalanced
 * to the left or right, the output is intentionally as a
 * conventional regex library with recursion support would
 * produce, e.g. "<<x>" and "<x>>" both produce ["x"] when using
 * "<" and ">" as the delimiters (both strings contain a single,
 * balanced instance of "<x>").
 *
 * examples:
 * matchRecursiveRegExp("test", "\\(", "\\)")
 * returns: []
 * matchRecursiveRegExp("<t<<e>><s>>t<>", "<", ">", "g")
 * returns: ["t<<e>><s>", ""]
 * matchRecursiveRegExp("<div id=\"x\">test</div>", "<div\\b[^>]*>", "</div>", "gi")
 * returns: ["test"]
 */
showdown.helper.matchRecursiveRegExp = function (str, left, right, flags) {
  'use strict';

  var matchPos = rgxFindMatchPos (str, left, right, flags),
      results = [];

  for (var i = 0; i < matchPos.length; ++i) {
    results.push([
      str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end),
      str.slice(matchPos[i].match.start, matchPos[i].match.end),
      str.slice(matchPos[i].left.start, matchPos[i].left.end),
      str.slice(matchPos[i].right.start, matchPos[i].right.end)
    ]);
  }
  return results;
};

/**
 *
 * @param {string} str
 * @param {string|function} replacement
 * @param {string} left
 * @param {string} right
 * @param {string} flags
 * @returns {string}
 */
showdown.helper.replaceRecursiveRegExp = function (str, replacement, left, right, flags) {
  'use strict';

  if (!showdown.helper.isFunction(replacement)) {
    var repStr = replacement;
    replacement = function () {
      return repStr;
    };
  }

  var matchPos = rgxFindMatchPos(str, left, right, flags),
      finalStr = str,
      lng = matchPos.length;

  if (lng > 0) {
    var bits = [];
    if (matchPos[0].wholeMatch.start !== 0) {
      bits.push(str.slice(0, matchPos[0].wholeMatch.start));
    }
    for (var i = 0; i < lng; ++i) {
      bits.push(
        replacement(
          str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end),
          str.slice(matchPos[i].match.start, matchPos[i].match.end),
          str.slice(matchPos[i].left.start, matchPos[i].left.end),
          str.slice(matchPos[i].right.start, matchPos[i].right.end)
        )
      );
      if (i < lng - 1) {
        bits.push(str.slice(matchPos[i].wholeMatch.end, matchPos[i + 1].wholeMatch.start));
      }
    }
    if (matchPos[lng - 1].wholeMatch.end < str.length) {
      bits.push(str.slice(matchPos[lng - 1].wholeMatch.end));
    }
    finalStr = bits.join('');
  }
  return finalStr;
};

/**
 * Returns the index within the passed String object of the first occurrence of the specified regex,
 * starting the search at fromIndex. Returns -1 if the value is not found.
 *
 * @param {string} str string to search
 * @param {RegExp} regex Regular expression to search
 * @param {int} [fromIndex = 0] Index to start the search
 * @returns {Number}
 * @throws InvalidArgumentError
 */
showdown.helper.regexIndexOf = function (str, regex, fromIndex) {
  'use strict';
  if (!showdown.helper.isString(str)) {
    throw 'InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string';
  }
  if (regex instanceof RegExp === false) {
    throw 'InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp';
  }
  var indexOf = str.substring(fromIndex || 0).search(regex);
  return (indexOf >= 0) ? (indexOf + (fromIndex || 0)) : indexOf;
};

/**
 * Splits the passed string object at the defined index, and returns an array composed of the two substrings
 * @param {string} str string to split
 * @param {int} index index to split string at
 * @returns {[string,string]}
 * @throws InvalidArgumentError
 */
showdown.helper.splitAtIndex = function (str, index) {
  'use strict';
  if (!showdown.helper.isString(str)) {
    throw 'InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string';
  }
  return [str.substring(0, index), str.substring(index)];
};

/**
 * Obfuscate an e-mail address through the use of Character Entities,
 * transforming ASCII characters into their equivalent decimal or hex entities.
 *
 * Since it has a random component, subsequent calls to this function produce different results
 *
 * @param {string} mail
 * @returns {string}
 */
showdown.helper.encodeEmailAddress = function (mail) {
  'use strict';
  var encode = [
    function (ch) {
      return '&#' + ch.charCodeAt(0) + ';';
    },
    function (ch) {
      return '&#x' + ch.charCodeAt(0).toString(16) + ';';
    },
    function (ch) {
      return ch;
    }
  ];

  mail = mail.replace(/./g, function (ch) {
    if (ch === '@') {
      // this *must* be encoded. I insist.
      ch = encode[Math.floor(Math.random() * 2)](ch);
    } else {
      var r = Math.random();
      // roughly 10% raw, 45% hex, 45% dec
      ch = (
        r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch)
      );
    }
    return ch;
  });

  return mail;
};

/**
 *
 * @param str
 * @param targetLength
 * @param padString
 * @returns {string}
 */
showdown.helper.padEnd = function padEnd (str, targetLength, padString) {
  'use strict';
  /*jshint bitwise: false*/
  // eslint-disable-next-line space-infix-ops
  targetLength = targetLength>>0; //floor if number or convert non-number to 0;
  /*jshint bitwise: true*/
  padString = String(padString || ' ');
  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
    }
    return String(str) + padString.slice(0,targetLength);
  }
};

/**
 * POLYFILLS
 */
// use this instead of builtin is undefined for IE8 compatibility
if (typeof console === 'undefined') {
  console = {
    warn: function (msg) {
      'use strict';
      alert(msg);
    },
    log: function (msg) {
      'use strict';
      alert(msg);
    },
    error: function (msg) {
      'use strict';
      throw msg;
    }
  };
}

/**
 * Common regexes.
 * We declare some common regexes to improve performance
 */
showdown.helper.regexes = {
  asteriskDashAndColon: /([*_:~])/g
};

/**
 * EMOJIS LIST
 */
showdown.helper.emojis = {
  '+1':'\ud83d\udc4d',
  '-1':'\ud83d\udc4e',
  '100':'\ud83d\udcaf',
  '1234':'\ud83d\udd22',
  '1st_place_medal':'\ud83e\udd47',
  '2nd_place_medal':'\ud83e\udd48',
  '3rd_place_medal':'\ud83e\udd49',
  '8ball':'\ud83c\udfb1',
  'a':'\ud83c\udd70\ufe0f',
  'ab':'\ud83c\udd8e',
  'abc':'\ud83d\udd24',
  'abcd':'\ud83d\udd21',
  'accept':'\ud83c\ude51',
  'aerial_tramway':'\ud83d\udea1',
  'airplane':'\u2708\ufe0f',
  'alarm_clock':'\u23f0',
  'alembic':'\u2697\ufe0f',
  'alien':'\ud83d\udc7d',
  'ambulance':'\ud83d\ude91',
  'amphora':'\ud83c\udffa',
  'anchor':'\u2693\ufe0f',
  'angel':'\ud83d\udc7c',
  'anger':'\ud83d\udca2',
  'angry':'\ud83d\ude20',
  'anguished':'\ud83d\ude27',
  'ant':'\ud83d\udc1c',
  'apple':'\ud83c\udf4e',
  'aquarius':'\u2652\ufe0f',
  'aries':'\u2648\ufe0f',
  'arrow_backward':'\u25c0\ufe0f',
  'arrow_double_down':'\u23ec',
  'arrow_double_up':'\u23eb',
  'arrow_down':'\u2b07\ufe0f',
  'arrow_down_small':'\ud83d\udd3d',
  'arrow_forward':'\u25b6\ufe0f',
  'arrow_heading_down':'\u2935\ufe0f',
  'arrow_heading_up':'\u2934\ufe0f',
  'arrow_left':'\u2b05\ufe0f',
  'arrow_lower_left':'\u2199\ufe0f',
  'arrow_lower_right':'\u2198\ufe0f',
  'arrow_right':'\u27a1\ufe0f',
  'arrow_right_hook':'\u21aa\ufe0f',
  'arrow_up':'\u2b06\ufe0f',
  'arrow_up_down':'\u2195\ufe0f',
  'arrow_up_small':'\ud83d\udd3c',
  'arrow_upper_left':'\u2196\ufe0f',
  'arrow_upper_right':'\u2197\ufe0f',
  'arrows_clockwise':'\ud83d\udd03',
  'arrows_counterclockwise':'\ud83d\udd04',
  'art':'\ud83c\udfa8',
  'articulated_lorry':'\ud83d\ude9b',
  'artificial_satellite':'\ud83d\udef0',
  'astonished':'\ud83d\ude32',
  'athletic_shoe':'\ud83d\udc5f',
  'atm':'\ud83c\udfe7',
  'atom_symbol':'\u269b\ufe0f',
  'avocado':'\ud83e\udd51',
  'b':'\ud83c\udd71\ufe0f',
  'baby':'\ud83d\udc76',
  'baby_bottle':'\ud83c\udf7c',
  'baby_chick':'\ud83d\udc24',
  'baby_symbol':'\ud83d\udebc',
  'back':'\ud83d\udd19',
  'bacon':'\ud83e\udd53',
  'badminton':'\ud83c\udff8',
  'baggage_claim':'\ud83d\udec4',
  'baguette_bread':'\ud83e\udd56',
  'balance_scale':'\u2696\ufe0f',
  'balloon':'\ud83c\udf88',
  'ballot_box':'\ud83d\uddf3',
  'ballot_box_with_check':'\u2611\ufe0f',
  'bamboo':'\ud83c\udf8d',
  'banana':'\ud83c\udf4c',
  'bangbang':'\u203c\ufe0f',
  'bank':'\ud83c\udfe6',
  'bar_chart':'\ud83d\udcca',
  'barber':'\ud83d\udc88',
  'baseball':'\u26be\ufe0f',
  'basketball':'\ud83c\udfc0',
  'basketball_man':'\u26f9\ufe0f',
  'basketball_woman':'\u26f9\ufe0f&zwj;\u2640\ufe0f',
  'bat':'\ud83e\udd87',
  'bath':'\ud83d\udec0',
  'bathtub':'\ud83d\udec1',
  'battery':'\ud83d\udd0b',
  'beach_umbrella':'\ud83c\udfd6',
  'bear':'\ud83d\udc3b',
  'bed':'\ud83d\udecf',
  'bee':'\ud83d\udc1d',
  'beer':'\ud83c\udf7a',
  'beers':'\ud83c\udf7b',
  'beetle':'\ud83d\udc1e',
  'beginner':'\ud83d\udd30',
  'bell':'\ud83d\udd14',
  'bellhop_bell':'\ud83d\udece',
  'bento':'\ud83c\udf71',
  'biking_man':'\ud83d\udeb4',
  'bike':'\ud83d\udeb2',
  'biking_woman':'\ud83d\udeb4&zwj;\u2640\ufe0f',
  'bikini':'\ud83d\udc59',
  'biohazard':'\u2623\ufe0f',
  'bird':'\ud83d\udc26',
  'birthday':'\ud83c\udf82',
  'black_circle':'\u26ab\ufe0f',
  'black_flag':'\ud83c\udff4',
  'black_heart':'\ud83d\udda4',
  'black_joker':'\ud83c\udccf',
  'black_large_square':'\u2b1b\ufe0f',
  'black_medium_small_square':'\u25fe\ufe0f',
  'black_medium_square':'\u25fc\ufe0f',
  'black_nib':'\u2712\ufe0f',
  'black_small_square':'\u25aa\ufe0f',
  'black_square_button':'\ud83d\udd32',
  'blonde_man':'\ud83d\udc71',
  'blonde_woman':'\ud83d\udc71&zwj;\u2640\ufe0f',
  'blossom':'\ud83c\udf3c',
  'blowfish':'\ud83d\udc21',
  'blue_book':'\ud83d\udcd8',
  'blue_car':'\ud83d\ude99',
  'blue_heart':'\ud83d\udc99',
  'blush':'\ud83d\ude0a',
  'boar':'\ud83d\udc17',
  'boat':'\u26f5\ufe0f',
  'bomb':'\ud83d\udca3',
  'book':'\ud83d\udcd6',
  'bookmark':'\ud83d\udd16',
  'bookmark_tabs':'\ud83d\udcd1',
  'books':'\ud83d\udcda',
  'boom':'\ud83d\udca5',
  'boot':'\ud83d\udc62',
  'bouquet':'\ud83d\udc90',
  'bowing_man':'\ud83d\ude47',
  'bow_and_arrow':'\ud83c\udff9',
  'bowing_woman':'\ud83d\ude47&zwj;\u2640\ufe0f',
  'bowling':'\ud83c\udfb3',
  'boxing_glove':'\ud83e\udd4a',
  'boy':'\ud83d\udc66',
  'bread':'\ud83c\udf5e',
  'bride_with_veil':'\ud83d\udc70',
  'bridge_at_night':'\ud83c\udf09',
  'briefcase':'\ud83d\udcbc',
  'broken_heart':'\ud83d\udc94',
  'bug':'\ud83d\udc1b',
  'building_construction':'\ud83c\udfd7',
  'bulb':'\ud83d\udca1',
  'bullettrain_front':'\ud83d\ude85',
  'bullettrain_side':'\ud83d\ude84',
  'burrito':'\ud83c\udf2f',
  'bus':'\ud83d\ude8c',
  'business_suit_levitating':'\ud83d\udd74',
  'busstop':'\ud83d\ude8f',
  'bust_in_silhouette':'\ud83d\udc64',
  'busts_in_silhouette':'\ud83d\udc65',
  'butterfly':'\ud83e\udd8b',
  'cactus':'\ud83c\udf35',
  'cake':'\ud83c\udf70',
  'calendar':'\ud83d\udcc6',
  'call_me_hand':'\ud83e\udd19',
  'calling':'\ud83d\udcf2',
  'camel':'\ud83d\udc2b',
  'camera':'\ud83d\udcf7',
  'camera_flash':'\ud83d\udcf8',
  'camping':'\ud83c\udfd5',
  'cancer':'\u264b\ufe0f',
  'candle':'\ud83d\udd6f',
  'candy':'\ud83c\udf6c',
  'canoe':'\ud83d\udef6',
  'capital_abcd':'\ud83d\udd20',
  'capricorn':'\u2651\ufe0f',
  'car':'\ud83d\ude97',
  'card_file_box':'\ud83d\uddc3',
  'card_index':'\ud83d\udcc7',
  'card_index_dividers':'\ud83d\uddc2',
  'carousel_horse':'\ud83c\udfa0',
  'carrot':'\ud83e\udd55',
  'cat':'\ud83d\udc31',
  'cat2':'\ud83d\udc08',
  'cd':'\ud83d\udcbf',
  'chains':'\u26d3',
  'champagne':'\ud83c\udf7e',
  'chart':'\ud83d\udcb9',
  'chart_with_downwards_trend':'\ud83d\udcc9',
  'chart_with_upwards_trend':'\ud83d\udcc8',
  'checkered_flag':'\ud83c\udfc1',
  'cheese':'\ud83e\uddc0',
  'cherries':'\ud83c\udf52',
  'cherry_blossom':'\ud83c\udf38',
  'chestnut':'\ud83c\udf30',
  'chicken':'\ud83d\udc14',
  'children_crossing':'\ud83d\udeb8',
  'chipmunk':'\ud83d\udc3f',
  'chocolate_bar':'\ud83c\udf6b',
  'christmas_tree':'\ud83c\udf84',
  'church':'\u26ea\ufe0f',
  'cinema':'\ud83c\udfa6',
  'circus_tent':'\ud83c\udfaa',
  'city_sunrise':'\ud83c\udf07',
  'city_sunset':'\ud83c\udf06',
  'cityscape':'\ud83c\udfd9',
  'cl':'\ud83c\udd91',
  'clamp':'\ud83d\udddc',
  'clap':'\ud83d\udc4f',
  'clapper':'\ud83c\udfac',
  'classical_building':'\ud83c\udfdb',
  'clinking_glasses':'\ud83e\udd42',
  'clipboard':'\ud83d\udccb',
  'clock1':'\ud83d\udd50',
  'clock10':'\ud83d\udd59',
  'clock1030':'\ud83d\udd65',
  'clock11':'\ud83d\udd5a',
  'clock1130':'\ud83d\udd66',
  'clock12':'\ud83d\udd5b',
  'clock1230':'\ud83d\udd67',
  'clock130':'\ud83d\udd5c',
  'clock2':'\ud83d\udd51',
  'clock230':'\ud83d\udd5d',
  'clock3':'\ud83d\udd52',
  'clock330':'\ud83d\udd5e',
  'clock4':'\ud83d\udd53',
  'clock430':'\ud83d\udd5f',
  'clock5':'\ud83d\udd54',
  'clock530':'\ud83d\udd60',
  'clock6':'\ud83d\udd55',
  'clock630':'\ud83d\udd61',
  'clock7':'\ud83d\udd56',
  'clock730':'\ud83d\udd62',
  'clock8':'\ud83d\udd57',
  'clock830':'\ud83d\udd63',
  'clock9':'\ud83d\udd58',
  'clock930':'\ud83d\udd64',
  'closed_book':'\ud83d\udcd5',
  'closed_lock_with_key':'\ud83d\udd10',
  'closed_umbrella':'\ud83c\udf02',
  'cloud':'\u2601\ufe0f',
  'cloud_with_lightning':'\ud83c\udf29',
  'cloud_with_lightning_and_rain':'\u26c8',
  'cloud_with_rain':'\ud83c\udf27',
  'cloud_with_snow':'\ud83c\udf28',
  'clown_face':'\ud83e\udd21',
  'clubs':'\u2663\ufe0f',
  'cocktail':'\ud83c\udf78',
  'coffee':'\u2615\ufe0f',
  'coffin':'\u26b0\ufe0f',
  'cold_sweat':'\ud83d\ude30',
  'comet':'\u2604\ufe0f',
  'computer':'\ud83d\udcbb',
  'computer_mouse':'\ud83d\uddb1',
  'confetti_ball':'\ud83c\udf8a',
  'confounded':'\ud83d\ude16',
  'confused':'\ud83d\ude15',
  'congratulations':'\u3297\ufe0f',
  'construction':'\ud83d\udea7',
  'construction_worker_man':'\ud83d\udc77',
  'construction_worker_woman':'\ud83d\udc77&zwj;\u2640\ufe0f',
  'control_knobs':'\ud83c\udf9b',
  'convenience_store':'\ud83c\udfea',
  'cookie':'\ud83c\udf6a',
  'cool':'\ud83c\udd92',
  'policeman':'\ud83d\udc6e',
  'copyright':'\u00a9\ufe0f',
  'corn':'\ud83c\udf3d',
  'couch_and_lamp':'\ud83d\udecb',
  'couple':'\ud83d\udc6b',
  'couple_with_heart_woman_man':'\ud83d\udc91',
  'couple_with_heart_man_man':'\ud83d\udc68&zwj;\u2764\ufe0f&zwj;\ud83d\udc68',
  'couple_with_heart_woman_woman':'\ud83d\udc69&zwj;\u2764\ufe0f&zwj;\ud83d\udc69',
  'couplekiss_man_man':'\ud83d\udc68&zwj;\u2764\ufe0f&zwj;\ud83d\udc8b&zwj;\ud83d\udc68',
  'couplekiss_man_woman':'\ud83d\udc8f',
  'couplekiss_woman_woman':'\ud83d\udc69&zwj;\u2764\ufe0f&zwj;\ud83d\udc8b&zwj;\ud83d\udc69',
  'cow':'\ud83d\udc2e',
  'cow2':'\ud83d\udc04',
  'cowboy_hat_face':'\ud83e\udd20',
  'crab':'\ud83e\udd80',
  'crayon':'\ud83d\udd8d',
  'credit_card':'\ud83d\udcb3',
  'crescent_moon':'\ud83c\udf19',
  'cricket':'\ud83c\udfcf',
  'crocodile':'\ud83d\udc0a',
  'croissant':'\ud83e\udd50',
  'crossed_fingers':'\ud83e\udd1e',
  'crossed_flags':'\ud83c\udf8c',
  'crossed_swords':'\u2694\ufe0f',
  'crown':'\ud83d\udc51',
  'cry':'\ud83d\ude22',
  'crying_cat_face':'\ud83d\ude3f',
  'crystal_ball':'\ud83d\udd2e',
  'cucumber':'\ud83e\udd52',
  'cupid':'\ud83d\udc98',
  'curly_loop':'\u27b0',
  'currency_exchange':'\ud83d\udcb1',
  'curry':'\ud83c\udf5b',
  'custard':'\ud83c\udf6e',
  'customs':'\ud83d\udec3',
  'cyclone':'\ud83c\udf00',
  'dagger':'\ud83d\udde1',
  'dancer':'\ud83d\udc83',
  'dancing_women':'\ud83d\udc6f',
  'dancing_men':'\ud83d\udc6f&zwj;\u2642\ufe0f',
  'dango':'\ud83c\udf61',
  'dark_sunglasses':'\ud83d\udd76',
  'dart':'\ud83c\udfaf',
  'dash':'\ud83d\udca8',
  'date':'\ud83d\udcc5',
  'deciduous_tree':'\ud83c\udf33',
  'deer':'\ud83e\udd8c',
  'department_store':'\ud83c\udfec',
  'derelict_house':'\ud83c\udfda',
  'desert':'\ud83c\udfdc',
  'desert_island':'\ud83c\udfdd',
  'desktop_computer':'\ud83d\udda5',
  'male_detective':'\ud83d\udd75\ufe0f',
  'diamond_shape_with_a_dot_inside':'\ud83d\udca0',
  'diamonds':'\u2666\ufe0f',
  'disappointed':'\ud83d\ude1e',
  'disappointed_relieved':'\ud83d\ude25',
  'dizzy':'\ud83d\udcab',
  'dizzy_face':'\ud83d\ude35',
  'do_not_litter':'\ud83d\udeaf',
  'dog':'\ud83d\udc36',
  'dog2':'\ud83d\udc15',
  'dollar':'\ud83d\udcb5',
  'dolls':'\ud83c\udf8e',
  'dolphin':'\ud83d\udc2c',
  'door':'\ud83d\udeaa',
  'doughnut':'\ud83c\udf69',
  'dove':'\ud83d\udd4a',
  'dragon':'\ud83d\udc09',
  'dragon_face':'\ud83d\udc32',
  'dress':'\ud83d\udc57',
  'dromedary_camel':'\ud83d\udc2a',
  'drooling_face':'\ud83e\udd24',
  'droplet':'\ud83d\udca7',
  'drum':'\ud83e\udd41',
  'duck':'\ud83e\udd86',
  'dvd':'\ud83d\udcc0',
  'e-mail':'\ud83d\udce7',
  'eagle':'\ud83e\udd85',
  'ear':'\ud83d\udc42',
  'ear_of_rice':'\ud83c\udf3e',
  'earth_africa':'\ud83c\udf0d',
  'earth_americas':'\ud83c\udf0e',
  'earth_asia':'\ud83c\udf0f',
  'egg':'\ud83e\udd5a',
  'eggplant':'\ud83c\udf46',
  'eight_pointed_black_star':'\u2734\ufe0f',
  'eight_spoked_asterisk':'\u2733\ufe0f',
  'electric_plug':'\ud83d\udd0c',
  'elephant':'\ud83d\udc18',
  'email':'\u2709\ufe0f',
  'end':'\ud83d\udd1a',
  'envelope_with_arrow':'\ud83d\udce9',
  'euro':'\ud83d\udcb6',
  'european_castle':'\ud83c\udff0',
  'european_post_office':'\ud83c\udfe4',
  'evergreen_tree':'\ud83c\udf32',
  'exclamation':'\u2757\ufe0f',
  'expressionless':'\ud83d\ude11',
  'eye':'\ud83d\udc41',
  'eye_speech_bubble':'\ud83d\udc41&zwj;\ud83d\udde8',
  'eyeglasses':'\ud83d\udc53',
  'eyes':'\ud83d\udc40',
  'face_with_head_bandage':'\ud83e\udd15',
  'face_with_thermometer':'\ud83e\udd12',
  'fist_oncoming':'\ud83d\udc4a',
  'factory':'\ud83c\udfed',
  'fallen_leaf':'\ud83c\udf42',
  'family_man_woman_boy':'\ud83d\udc6a',
  'family_man_boy':'\ud83d\udc68&zwj;\ud83d\udc66',
  'family_man_boy_boy':'\ud83d\udc68&zwj;\ud83d\udc66&zwj;\ud83d\udc66',
  'family_man_girl':'\ud83d\udc68&zwj;\ud83d\udc67',
  'family_man_girl_boy':'\ud83d\udc68&zwj;\ud83d\udc67&zwj;\ud83d\udc66',
  'family_man_girl_girl':'\ud83d\udc68&zwj;\ud83d\udc67&zwj;\ud83d\udc67',
  'family_man_man_boy':'\ud83d\udc68&zwj;\ud83d\udc68&zwj;\ud83d\udc66',
  'family_man_man_boy_boy':'\ud83d\udc68&zwj;\ud83d\udc68&zwj;\ud83d\udc66&zwj;\ud83d\udc66',
  'family_man_man_girl':'\ud83d\udc68&zwj;\ud83d\udc68&zwj;\ud83d\udc67',
  'family_man_man_girl_boy':'\ud83d\udc68&zwj;\ud83d\udc68&zwj;\ud83d\udc67&zwj;\ud83d\udc66',
  'family_man_man_girl_girl':'\ud83d\udc68&zwj;\ud83d\udc68&zwj;\ud83d\udc67&zwj;\ud83d\udc67',
  'family_man_woman_boy_boy':'\ud83d\udc68&zwj;\ud83d\udc69&zwj;\ud83d\udc66&zwj;\ud83d\udc66',
  'family_man_woman_girl':'\ud83d\udc68&zwj;\ud83d\udc69&zwj;\ud83d\udc67',
  'family_man_woman_girl_boy':'\ud83d\udc68&zwj;\ud83d\udc69&zwj;\ud83d\udc67&zwj;\ud83d\udc66',
  'family_man_woman_girl_girl':'\ud83d\udc68&zwj;\ud83d\udc69&zwj;\ud83d\udc67&zwj;\ud83d\udc67',
  'family_woman_boy':'\ud83d\udc69&zwj;\ud83d\udc66',
  'family_woman_boy_boy':'\ud83d\udc69&zwj;\ud83d\udc66&zwj;\ud83d\udc66',
  'family_woman_girl':'\ud83d\udc69&zwj;\ud83d\udc67',
  'family_woman_girl_boy':'\ud83d\udc69&zwj;\ud83d\udc67&zwj;\ud83d\udc66',
  'family_woman_girl_girl':'\ud83d\udc69&zwj;\ud83d\udc67&zwj;\ud83d\udc67',
  'family_woman_woman_boy':'\ud83d\udc69&zwj;\ud83d\udc69&zwj;\ud83d\udc66',
  'family_woman_woman_boy_boy':'\ud83d\udc69&zwj;\ud83d\udc69&zwj;\ud83d\udc66&zwj;\ud83d\udc66',
  'family_woman_woman_girl':'\ud83d\udc69&zwj;\ud83d\udc69&zwj;\ud83d\udc67',
  'family_woman_woman_girl_boy':'\ud83d\udc69&zwj;\ud83d\udc69&zwj;\ud83d\udc67&zwj;\ud83d\udc66',
  'family_woman_woman_girl_girl':'\ud83d\udc69&zwj;\ud83d\udc69&zwj;\ud83d\udc67&zwj;\ud83d\udc67',
  'fast_forward':'\u23e9',
  'fax':'\ud83d\udce0',
  'fearful':'\ud83d\ude28',
  'feet':'\ud83d\udc3e',
  'female_detective':'\ud83d\udd75\ufe0f&zwj;\u2640\ufe0f',
  'ferris_wheel':'\ud83c\udfa1',
  'ferry':'\u26f4',
  'field_hockey':'\ud83c\udfd1',
  'file_cabinet':'\ud83d\uddc4',
  'file_folder':'\ud83d\udcc1',
  'film_projector':'\ud83d\udcfd',
  'film_strip':'\ud83c\udf9e',
  'fire':'\ud83d\udd25',
  'fire_engine':'\ud83d\ude92',
  'fireworks':'\ud83c\udf86',
  'first_quarter_moon':'\ud83c\udf13',
  'first_quarter_moon_with_face':'\ud83c\udf1b',
  'fish':'\ud83d\udc1f',
  'fish_cake':'\ud83c\udf65',
  'fishing_pole_and_fish':'\ud83c\udfa3',
  'fist_raised':'\u270a',
  'fist_left':'\ud83e\udd1b',
  'fist_right':'\ud83e\udd1c',
  'flags':'\ud83c\udf8f',
  'flashlight':'\ud83d\udd26',
  'fleur_de_lis':'\u269c\ufe0f',
  'flight_arrival':'\ud83d\udeec',
  'flight_departure':'\ud83d\udeeb',
  'floppy_disk':'\ud83d\udcbe',
  'flower_playing_cards':'\ud83c\udfb4',
  'flushed':'\ud83d\ude33',
  'fog':'\ud83c\udf2b',
  'foggy':'\ud83c\udf01',
  'football':'\ud83c\udfc8',
  'footprints':'\ud83d\udc63',
  'fork_and_knife':'\ud83c\udf74',
  'fountain':'\u26f2\ufe0f',
  'fountain_pen':'\ud83d\udd8b',
  'four_leaf_clover':'\ud83c\udf40',
  'fox_face':'\ud83e\udd8a',
  'framed_picture':'\ud83d\uddbc',
  'free':'\ud83c\udd93',
  'fried_egg':'\ud83c\udf73',
  'fried_shrimp':'\ud83c\udf64',
  'fries':'\ud83c\udf5f',
  'frog':'\ud83d\udc38',
  'frowning':'\ud83d\ude26',
  'frowning_face':'\u2639\ufe0f',
  'frowning_man':'\ud83d\ude4d&zwj;\u2642\ufe0f',
  'frowning_woman':'\ud83d\ude4d',
  'middle_finger':'\ud83d\udd95',
  'fuelpump':'\u26fd\ufe0f',
  'full_moon':'\ud83c\udf15',
  'full_moon_with_face':'\ud83c\udf1d',
  'funeral_urn':'\u26b1\ufe0f',
  'game_die':'\ud83c\udfb2',
  'gear':'\u2699\ufe0f',
  'gem':'\ud83d\udc8e',
  'gemini':'\u264a\ufe0f',
  'ghost':'\ud83d\udc7b',
  'gift':'\ud83c\udf81',
  'gift_heart':'\ud83d\udc9d',
  'girl':'\ud83d\udc67',
  'globe_with_meridians':'\ud83c\udf10',
  'goal_net':'\ud83e\udd45',
  'goat':'\ud83d\udc10',
  'golf':'\u26f3\ufe0f',
  'golfing_man':'\ud83c\udfcc\ufe0f',
  'golfing_woman':'\ud83c\udfcc\ufe0f&zwj;\u2640\ufe0f',
  'gorilla':'\ud83e\udd8d',
  'grapes':'\ud83c\udf47',
  'green_apple':'\ud83c\udf4f',
  'green_book':'\ud83d\udcd7',
  'green_heart':'\ud83d\udc9a',
  'green_salad':'\ud83e\udd57',
  'grey_exclamation':'\u2755',
  'grey_question':'\u2754',
  'grimacing':'\ud83d\ude2c',
  'grin':'\ud83d\ude01',
  'grinning':'\ud83d\ude00',
  'guardsman':'\ud83d\udc82',
  'guardswoman':'\ud83d\udc82&zwj;\u2640\ufe0f',
  'guitar':'\ud83c\udfb8',
  'gun':'\ud83d\udd2b',
  'haircut_woman':'\ud83d\udc87',
  'haircut_man':'\ud83d\udc87&zwj;\u2642\ufe0f',
  'hamburger':'\ud83c\udf54',
  'hammer':'\ud83d\udd28',
  'hammer_and_pick':'\u2692',
  'hammer_and_wrench':'\ud83d\udee0',
  'hamster':'\ud83d\udc39',
  'hand':'\u270b',
  'handbag':'\ud83d\udc5c',
  'handshake':'\ud83e\udd1d',
  'hankey':'\ud83d\udca9',
  'hatched_chick':'\ud83d\udc25',
  'hatching_chick':'\ud83d\udc23',
  'headphones':'\ud83c\udfa7',
  'hear_no_evil':'\ud83d\ude49',
  'heart':'\u2764\ufe0f',
  'heart_decoration':'\ud83d\udc9f',
  'heart_eyes':'\ud83d\ude0d',
  'heart_eyes_cat':'\ud83d\ude3b',
  'heartbeat':'\ud83d\udc93',
  'heartpulse':'\ud83d\udc97',
  'hearts':'\u2665\ufe0f',
  'heavy_check_mark':'\u2714\ufe0f',
  'heavy_division_sign':'\u2797',
  'heavy_dollar_sign':'\ud83d\udcb2',
  'heavy_heart_exclamation':'\u2763\ufe0f',
  'heavy_minus_sign':'\u2796',
  'heavy_multiplication_x':'\u2716\ufe0f',
  'heavy_plus_sign':'\u2795',
  'helicopter':'\ud83d\ude81',
  'herb':'\ud83c\udf3f',
  'hibiscus':'\ud83c\udf3a',
  'high_brightness':'\ud83d\udd06',
  'high_heel':'\ud83d\udc60',
  'hocho':'\ud83d\udd2a',
  'hole':'\ud83d\udd73',
  'honey_pot':'\ud83c\udf6f',
  'horse':'\ud83d\udc34',
  'horse_racing':'\ud83c\udfc7',
  'hospital':'\ud83c\udfe5',
  'hot_pepper':'\ud83c\udf36',
  'hotdog':'\ud83c\udf2d',
  'hotel':'\ud83c\udfe8',
  'hotsprings':'\u2668\ufe0f',
  'hourglass':'\u231b\ufe0f',
  'hourglass_flowing_sand':'\u23f3',
  'house':'\ud83c\udfe0',
  'house_with_garden':'\ud83c\udfe1',
  'houses':'\ud83c\udfd8',
  'hugs':'\ud83e\udd17',
  'hushed':'\ud83d\ude2f',
  'ice_cream':'\ud83c\udf68',
  'ice_hockey':'\ud83c\udfd2',
  'ice_skate':'\u26f8',
  'icecream':'\ud83c\udf66',
  'id':'\ud83c\udd94',
  'ideograph_advantage':'\ud83c\ude50',
  'imp':'\ud83d\udc7f',
  'inbox_tray':'\ud83d\udce5',
  'incoming_envelope':'\ud83d\udce8',
  'tipping_hand_woman':'\ud83d\udc81',
  'information_source':'\u2139\ufe0f',
  'innocent':'\ud83d\ude07',
  'interrobang':'\u2049\ufe0f',
  'iphone':'\ud83d\udcf1',
  'izakaya_lantern':'\ud83c\udfee',
  'jack_o_lantern':'\ud83c\udf83',
  'japan':'\ud83d\uddfe',
  'japanese_castle':'\ud83c\udfef',
  'japanese_goblin':'\ud83d\udc7a',
  'japanese_ogre':'\ud83d\udc79',
  'jeans':'\ud83d\udc56',
  'joy':'\ud83d\ude02',
  'joy_cat':'\ud83d\ude39',
  'joystick':'\ud83d\udd79',
  'kaaba':'\ud83d\udd4b',
  'key':'\ud83d\udd11',
  'keyboard':'\u2328\ufe0f',
  'keycap_ten':'\ud83d\udd1f',
  'kick_scooter':'\ud83d\udef4',
  'kimono':'\ud83d\udc58',
  'kiss':'\ud83d\udc8b',
  'kissing':'\ud83d\ude17',
  'kissing_cat':'\ud83d\ude3d',
  'kissing_closed_eyes':'\ud83d\ude1a',
  'kissing_heart':'\ud83d\ude18',
  'kissing_smiling_eyes':'\ud83d\ude19',
  'kiwi_fruit':'\ud83e\udd5d',
  'koala':'\ud83d\udc28',
  'koko':'\ud83c\ude01',
  'label':'\ud83c\udff7',
  'large_blue_circle':'\ud83d\udd35',
  'large_blue_diamond':'\ud83d\udd37',
  'large_orange_diamond':'\ud83d\udd36',
  'last_quarter_moon':'\ud83c\udf17',
  'last_quarter_moon_with_face':'\ud83c\udf1c',
  'latin_cross':'\u271d\ufe0f',
  'laughing':'\ud83d\ude06',
  'leaves':'\ud83c\udf43',
  'ledger':'\ud83d\udcd2',
  'left_luggage':'\ud83d\udec5',
  'left_right_arrow':'\u2194\ufe0f',
  'leftwards_arrow_with_hook':'\u21a9\ufe0f',
  'lemon':'\ud83c\udf4b',
  'leo':'\u264c\ufe0f',
  'leopard':'\ud83d\udc06',
  'level_slider':'\ud83c\udf9a',
  'libra':'\u264e\ufe0f',
  'light_rail':'\ud83d\ude88',
  'link':'\ud83d\udd17',
  'lion':'\ud83e\udd81',
  'lips':'\ud83d\udc44',
  'lipstick':'\ud83d\udc84',
  'lizard':'\ud83e\udd8e',
  'lock':'\ud83d\udd12',
  'lock_with_ink_pen':'\ud83d\udd0f',
  'lollipop':'\ud83c\udf6d',
  'loop':'\u27bf',
  'loud_sound':'\ud83d\udd0a',
  'loudspeaker':'\ud83d\udce2',
  'love_hotel':'\ud83c\udfe9',
  'love_letter':'\ud83d\udc8c',
  'low_brightness':'\ud83d\udd05',
  'lying_face':'\ud83e\udd25',
  'm':'\u24c2\ufe0f',
  'mag':'\ud83d\udd0d',
  'mag_right':'\ud83d\udd0e',
  'mahjong':'\ud83c\udc04\ufe0f',
  'mailbox':'\ud83d\udceb',
  'mailbox_closed':'\ud83d\udcea',
  'mailbox_with_mail':'\ud83d\udcec',
  'mailbox_with_no_mail':'\ud83d\udced',
  'man':'\ud83d\udc68',
  'man_artist':'\ud83d\udc68&zwj;\ud83c\udfa8',
  'man_astronaut':'\ud83d\udc68&zwj;\ud83d\ude80',
  'man_cartwheeling':'\ud83e\udd38&zwj;\u2642\ufe0f',
  'man_cook':'\ud83d\udc68&zwj;\ud83c\udf73',
  'man_dancing':'\ud83d\udd7a',
  'man_facepalming':'\ud83e\udd26&zwj;\u2642\ufe0f',
  'man_factory_worker':'\ud83d\udc68&zwj;\ud83c\udfed',
  'man_farmer':'\ud83d\udc68&zwj;\ud83c\udf3e',
  'man_firefighter':'\ud83d\udc68&zwj;\ud83d\ude92',
  'man_health_worker':'\ud83d\udc68&zwj;\u2695\ufe0f',
  'man_in_tuxedo':'\ud83e\udd35',
  'man_judge':'\ud83d\udc68&zwj;\u2696\ufe0f',
  'man_juggling':'\ud83e\udd39&zwj;\u2642\ufe0f',
  'man_mechanic':'\ud83d\udc68&zwj;\ud83d\udd27',
  'man_office_worker':'\ud83d\udc68&zwj;\ud83d\udcbc',
  'man_pilot':'\ud83d\udc68&zwj;\u2708\ufe0f',
  'man_playing_handball':'\ud83e\udd3e&zwj;\u2642\ufe0f',
  'man_playing_water_polo':'\ud83e\udd3d&zwj;\u2642\ufe0f',
  'man_scientist':'\ud83d\udc68&zwj;\ud83d\udd2c',
  'man_shrugging':'\ud83e\udd37&zwj;\u2642\ufe0f',
  'man_singer':'\ud83d\udc68&zwj;\ud83c\udfa4',
  'man_student':'\ud83d\udc68&zwj;\ud83c\udf93',
  'man_teacher':'\ud83d\udc68&zwj;\ud83c\udfeb',
  'man_technologist':'\ud83d\udc68&zwj;\ud83d\udcbb',
  'man_with_gua_pi_mao':'\ud83d\udc72',
  'man_with_turban':'\ud83d\udc73',
  'tangerine':'\ud83c\udf4a',
  'mans_shoe':'\ud83d\udc5e',
  'mantelpiece_clock':'\ud83d\udd70',
  'maple_leaf':'\ud83c\udf41',
  'martial_arts_uniform':'\ud83e\udd4b',
  'mask':'\ud83d\ude37',
  'massage_woman':'\ud83d\udc86',
  'massage_man':'\ud83d\udc86&zwj;\u2642\ufe0f',
  'meat_on_bone':'\ud83c\udf56',
  'medal_military':'\ud83c\udf96',
  'medal_sports':'\ud83c\udfc5',
  'mega':'\ud83d\udce3',
  'melon':'\ud83c\udf48',
  'memo':'\ud83d\udcdd',
  'men_wrestling':'\ud83e\udd3c&zwj;\u2642\ufe0f',
  'menorah':'\ud83d\udd4e',
  'mens':'\ud83d\udeb9',
  'metal':'\ud83e\udd18',
  'metro':'\ud83d\ude87',
  'microphone':'\ud83c\udfa4',
  'microscope':'\ud83d\udd2c',
  'milk_glass':'\ud83e\udd5b',
  'milky_way':'\ud83c\udf0c',
  'minibus':'\ud83d\ude90',
  'minidisc':'\ud83d\udcbd',
  'mobile_phone_off':'\ud83d\udcf4',
  'money_mouth_face':'\ud83e\udd11',
  'money_with_wings':'\ud83d\udcb8',
  'moneybag':'\ud83d\udcb0',
  'monkey':'\ud83d\udc12',
  'monkey_face':'\ud83d\udc35',
  'monorail':'\ud83d\ude9d',
  'moon':'\ud83c\udf14',
  'mortar_board':'\ud83c\udf93',
  'mosque':'\ud83d\udd4c',
  'motor_boat':'\ud83d\udee5',
  'motor_scooter':'\ud83d\udef5',
  'motorcycle':'\ud83c\udfcd',
  'motorway':'\ud83d\udee3',
  'mount_fuji':'\ud83d\uddfb',
  'mountain':'\u26f0',
  'mountain_biking_man':'\ud83d\udeb5',
  'mountain_biking_woman':'\ud83d\udeb5&zwj;\u2640\ufe0f',
  'mountain_cableway':'\ud83d\udea0',
  'mountain_railway':'\ud83d\ude9e',
  'mountain_snow':'\ud83c\udfd4',
  'mouse':'\ud83d\udc2d',
  'mouse2':'\ud83d\udc01',
  'movie_camera':'\ud83c\udfa5',
  'moyai':'\ud83d\uddff',
  'mrs_claus':'\ud83e\udd36',
  'muscle':'\ud83d\udcaa',
  'mushroom':'\ud83c\udf44',
  'musical_keyboard':'\ud83c\udfb9',
  'musical_note':'\ud83c\udfb5',
  'musical_score':'\ud83c\udfbc',
  'mute':'\ud83d\udd07',
  'nail_care':'\ud83d\udc85',
  'name_badge':'\ud83d\udcdb',
  'national_park':'\ud83c\udfde',
  'nauseated_face':'\ud83e\udd22',
  'necktie':'\ud83d\udc54',
  'negative_squared_cross_mark':'\u274e',
  'nerd_face':'\ud83e\udd13',
  'neutral_face':'\ud83d\ude10',
  'new':'\ud83c\udd95',
  'new_moon':'\ud83c\udf11',
  'new_moon_with_face':'\ud83c\udf1a',
  'newspaper':'\ud83d\udcf0',
  'newspaper_roll':'\ud83d\uddde',
  'next_track_button':'\u23ed',
  'ng':'\ud83c\udd96',
  'no_good_man':'\ud83d\ude45&zwj;\u2642\ufe0f',
  'no_good_woman':'\ud83d\ude45',
  'night_with_stars':'\ud83c\udf03',
  'no_bell':'\ud83d\udd15',
  'no_bicycles':'\ud83d\udeb3',
  'no_entry':'\u26d4\ufe0f',
  'no_entry_sign':'\ud83d\udeab',
  'no_mobile_phones':'\ud83d\udcf5',
  'no_mouth':'\ud83d\ude36',
  'no_pedestrians':'\ud83d\udeb7',
  'no_smoking':'\ud83d\udead',
  'non-potable_water':'\ud83d\udeb1',
  'nose':'\ud83d\udc43',
  'notebook':'\ud83d\udcd3',
  'notebook_with_decorative_cover':'\ud83d\udcd4',
  'notes':'\ud83c\udfb6',
  'nut_and_bolt':'\ud83d\udd29',
  'o':'\u2b55\ufe0f',
  'o2':'\ud83c\udd7e\ufe0f',
  'ocean':'\ud83c\udf0a',
  'octopus':'\ud83d\udc19',
  'oden':'\ud83c\udf62',
  'office':'\ud83c\udfe2',
  'oil_drum':'\ud83d\udee2',
  'ok':'\ud83c\udd97',
  'ok_hand':'\ud83d\udc4c',
  'ok_man':'\ud83d\ude46&zwj;\u2642\ufe0f',
  'ok_woman':'\ud83d\ude46',
  'old_key':'\ud83d\udddd',
  'older_man':'\ud83d\udc74',
  'older_woman':'\ud83d\udc75',
  'om':'\ud83d\udd49',
  'on':'\ud83d\udd1b',
  'oncoming_automobile':'\ud83d\ude98',
  'oncoming_bus':'\ud83d\ude8d',
  'oncoming_police_car':'\ud83d\ude94',
  'oncoming_taxi':'\ud83d\ude96',
  'open_file_folder':'\ud83d\udcc2',
  'open_hands':'\ud83d\udc50',
  'open_mouth':'\ud83d\ude2e',
  'open_umbrella':'\u2602\ufe0f',
  'ophiuchus':'\u26ce',
  'orange_book':'\ud83d\udcd9',
  'orthodox_cross':'\u2626\ufe0f',
  'outbox_tray':'\ud83d\udce4',
  'owl':'\ud83e\udd89',
  'ox':'\ud83d\udc02',
  'package':'\ud83d\udce6',
  'page_facing_up':'\ud83d\udcc4',
  'page_with_curl':'\ud83d\udcc3',
  'pager':'\ud83d\udcdf',
  'paintbrush':'\ud83d\udd8c',
  'palm_tree':'\ud83c\udf34',
  'pancakes':'\ud83e\udd5e',
  'panda_face':'\ud83d\udc3c',
  'paperclip':'\ud83d\udcce',
  'paperclips':'\ud83d\udd87',
  'parasol_on_ground':'\u26f1',
  'parking':'\ud83c\udd7f\ufe0f',
  'part_alternation_mark':'\u303d\ufe0f',
  'partly_sunny':'\u26c5\ufe0f',
  'passenger_ship':'\ud83d\udef3',
  'passport_control':'\ud83d\udec2',
  'pause_button':'\u23f8',
  'peace_symbol':'\u262e\ufe0f',
  'peach':'\ud83c\udf51',
  'peanuts':'\ud83e\udd5c',
  'pear':'\ud83c\udf50',
  'pen':'\ud83d\udd8a',
  'pencil2':'\u270f\ufe0f',
  'penguin':'\ud83d\udc27',
  'pensive':'\ud83d\ude14',
  'performing_arts':'\ud83c\udfad',
  'persevere':'\ud83d\ude23',
  'person_fencing':'\ud83e\udd3a',
  'pouting_woman':'\ud83d\ude4e',
  'phone':'\u260e\ufe0f',
  'pick':'\u26cf',
  'pig':'\ud83d\udc37',
  'pig2':'\ud83d\udc16',
  'pig_nose':'\ud83d\udc3d',
  'pill':'\ud83d\udc8a',
  'pineapple':'\ud83c\udf4d',
  'ping_pong':'\ud83c\udfd3',
  'pisces':'\u2653\ufe0f',
  'pizza':'\ud83c\udf55',
  'place_of_worship':'\ud83d\uded0',
  'plate_with_cutlery':'\ud83c\udf7d',
  'play_or_pause_button':'\u23ef',
  'point_down':'\ud83d\udc47',
  'point_left':'\ud83d\udc48',
  'point_right':'\ud83d\udc49',
  'point_up':'\u261d\ufe0f',
  'point_up_2':'\ud83d\udc46',
  'police_car':'\ud83d\ude93',
  'policewoman':'\ud83d\udc6e&zwj;\u2640\ufe0f',
  'poodle':'\ud83d\udc29',
  'popcorn':'\ud83c\udf7f',
  'post_office':'\ud83c\udfe3',
  'postal_horn':'\ud83d\udcef',
  'postbox':'\ud83d\udcee',
  'potable_water':'\ud83d\udeb0',
  'potato':'\ud83e\udd54',
  'pouch':'\ud83d\udc5d',
  'poultry_leg':'\ud83c\udf57',
  'pound':'\ud83d\udcb7',
  'rage':'\ud83d\ude21',
  'pouting_cat':'\ud83d\ude3e',
  'pouting_man':'\ud83d\ude4e&zwj;\u2642\ufe0f',
  'pray':'\ud83d\ude4f',
  'prayer_beads':'\ud83d\udcff',
  'pregnant_woman':'\ud83e\udd30',
  'previous_track_button':'\u23ee',
  'prince':'\ud83e\udd34',
  'princess':'\ud83d\udc78',
  'printer':'\ud83d\udda8',
  'purple_heart':'\ud83d\udc9c',
  'purse':'\ud83d\udc5b',
  'pushpin':'\ud83d\udccc',
  'put_litter_in_its_place':'\ud83d\udeae',
  'question':'\u2753',
  'rabbit':'\ud83d\udc30',
  'rabbit2':'\ud83d\udc07',
  'racehorse':'\ud83d\udc0e',
  'racing_car':'\ud83c\udfce',
  'radio':'\ud83d\udcfb',
  'radio_button':'\ud83d\udd18',
  'radioactive':'\u2622\ufe0f',
  'railway_car':'\ud83d\ude83',
  'railway_track':'\ud83d\udee4',
  'rainbow':'\ud83c\udf08',
  'rainbow_flag':'\ud83c\udff3\ufe0f&zwj;\ud83c\udf08',
  'raised_back_of_hand':'\ud83e\udd1a',
  'raised_hand_with_fingers_splayed':'\ud83d\udd90',
  'raised_hands':'\ud83d\ude4c',
  'raising_hand_woman':'\ud83d\ude4b',
  'raising_hand_man':'\ud83d\ude4b&zwj;\u2642\ufe0f',
  'ram':'\ud83d\udc0f',
  'ramen':'\ud83c\udf5c',
  'rat':'\ud83d\udc00',
  'record_button':'\u23fa',
  'recycle':'\u267b\ufe0f',
  'red_circle':'\ud83d\udd34',
  'registered':'\u00ae\ufe0f',
  'relaxed':'\u263a\ufe0f',
  'relieved':'\ud83d\ude0c',
  'reminder_ribbon':'\ud83c\udf97',
  'repeat':'\ud83d\udd01',
  'repeat_one':'\ud83d\udd02',
  'rescue_worker_helmet':'\u26d1',
  'restroom':'\ud83d\udebb',
  'revolving_hearts':'\ud83d\udc9e',
  'rewind':'\u23ea',
  'rhinoceros':'\ud83e\udd8f',
  'ribbon':'\ud83c\udf80',
  'rice':'\ud83c\udf5a',
  'rice_ball':'\ud83c\udf59',
  'rice_cracker':'\ud83c\udf58',
  'rice_scene':'\ud83c\udf91',
  'right_anger_bubble':'\ud83d\uddef',
  'ring':'\ud83d\udc8d',
  'robot':'\ud83e\udd16',
  'rocket':'\ud83d\ude80',
  'rofl':'\ud83e\udd23',
  'roll_eyes':'\ud83d\ude44',
  'roller_coaster':'\ud83c\udfa2',
  'rooster':'\ud83d\udc13',
  'rose':'\ud83c\udf39',
  'rosette':'\ud83c\udff5',
  'rotating_light':'\ud83d\udea8',
  'round_pushpin':'\ud83d\udccd',
  'rowing_man':'\ud83d\udea3',
  'rowing_woman':'\ud83d\udea3&zwj;\u2640\ufe0f',
  'rugby_football':'\ud83c\udfc9',
  'running_man':'\ud83c\udfc3',
  'running_shirt_with_sash':'\ud83c\udfbd',
  'running_woman':'\ud83c\udfc3&zwj;\u2640\ufe0f',
  'sa':'\ud83c\ude02\ufe0f',
  'sagittarius':'\u2650\ufe0f',
  'sake':'\ud83c\udf76',
  'sandal':'\ud83d\udc61',
  'santa':'\ud83c\udf85',
  'satellite':'\ud83d\udce1',
  'saxophone':'\ud83c\udfb7',
  'school':'\ud83c\udfeb',
  'school_satchel':'\ud83c\udf92',
  'scissors':'\u2702\ufe0f',
  'scorpion':'\ud83e\udd82',
  'scorpius':'\u264f\ufe0f',
  'scream':'\ud83d\ude31',
  'scream_cat':'\ud83d\ude40',
  'scroll':'\ud83d\udcdc',
  'seat':'\ud83d\udcba',
  'secret':'\u3299\ufe0f',
  'see_no_evil':'\ud83d\ude48',
  'seedling':'\ud83c\udf31',
  'selfie':'\ud83e\udd33',
  'shallow_pan_of_food':'\ud83e\udd58',
  'shamrock':'\u2618\ufe0f',
  'shark':'\ud83e\udd88',
  'shaved_ice':'\ud83c\udf67',
  'sheep':'\ud83d\udc11',
  'shell':'\ud83d\udc1a',
  'shield':'\ud83d\udee1',
  'shinto_shrine':'\u26e9',
  'ship':'\ud83d\udea2',
  'shirt':'\ud83d\udc55',
  'shopping':'\ud83d\udecd',
  'shopping_cart':'\ud83d\uded2',
  'shower':'\ud83d\udebf',
  'shrimp':'\ud83e\udd90',
  'signal_strength':'\ud83d\udcf6',
  'six_pointed_star':'\ud83d\udd2f',
  'ski':'\ud83c\udfbf',
  'skier':'\u26f7',
  'skull':'\ud83d\udc80',
  'skull_and_crossbones':'\u2620\ufe0f',
  'sleeping':'\ud83d\ude34',
  'sleeping_bed':'\ud83d\udecc',
  'sleepy':'\ud83d\ude2a',
  'slightly_frowning_face':'\ud83d\ude41',
  'slightly_smiling_face':'\ud83d\ude42',
  'slot_machine':'\ud83c\udfb0',
  'small_airplane':'\ud83d\udee9',
  'small_blue_diamond':'\ud83d\udd39',
  'small_orange_diamond':'\ud83d\udd38',
  'small_red_triangle':'\ud83d\udd3a',
  'small_red_triangle_down':'\ud83d\udd3b',
  'smile':'\ud83d\ude04',
  'smile_cat':'\ud83d\ude38',
  'smiley':'\ud83d\ude03',
  'smiley_cat':'\ud83d\ude3a',
  'smiling_imp':'\ud83d\ude08',
  'smirk':'\ud83d\ude0f',
  'smirk_cat':'\ud83d\ude3c',
  'smoking':'\ud83d\udeac',
  'snail':'\ud83d\udc0c',
  'snake':'\ud83d\udc0d',
  'sneezing_face':'\ud83e\udd27',
  'snowboarder':'\ud83c\udfc2',
  'snowflake':'\u2744\ufe0f',
  'snowman':'\u26c4\ufe0f',
  'snowman_with_snow':'\u2603\ufe0f',
  'sob':'\ud83d\ude2d',
  'soccer':'\u26bd\ufe0f',
  'soon':'\ud83d\udd1c',
  'sos':'\ud83c\udd98',
  'sound':'\ud83d\udd09',
  'space_invader':'\ud83d\udc7e',
  'spades':'\u2660\ufe0f',
  'spaghetti':'\ud83c\udf5d',
  'sparkle':'\u2747\ufe0f',
  'sparkler':'\ud83c\udf87',
  'sparkles':'\u2728',
  'sparkling_heart':'\ud83d\udc96',
  'speak_no_evil':'\ud83d\ude4a',
  'speaker':'\ud83d\udd08',
  'speaking_head':'\ud83d\udde3',
  'speech_balloon':'\ud83d\udcac',
  'speedboat':'\ud83d\udea4',
  'spider':'\ud83d\udd77',
  'spider_web':'\ud83d\udd78',
  'spiral_calendar':'\ud83d\uddd3',
  'spiral_notepad':'\ud83d\uddd2',
  'spoon':'\ud83e\udd44',
  'squid':'\ud83e\udd91',
  'stadium':'\ud83c\udfdf',
  'star':'\u2b50\ufe0f',
  'star2':'\ud83c\udf1f',
  'star_and_crescent':'\u262a\ufe0f',
  'star_of_david':'\u2721\ufe0f',
  'stars':'\ud83c\udf20',
  'station':'\ud83d\ude89',
  'statue_of_liberty':'\ud83d\uddfd',
  'steam_locomotive':'\ud83d\ude82',
  'stew':'\ud83c\udf72',
  'stop_button':'\u23f9',
  'stop_sign':'\ud83d\uded1',
  'stopwatch':'\u23f1',
  'straight_ruler':'\ud83d\udccf',
  'strawberry':'\ud83c\udf53',
  'stuck_out_tongue':'\ud83d\ude1b',
  'stuck_out_tongue_closed_eyes':'\ud83d\ude1d',
  'stuck_out_tongue_winking_eye':'\ud83d\ude1c',
  'studio_microphone':'\ud83c\udf99',
  'stuffed_flatbread':'\ud83e\udd59',
  'sun_behind_large_cloud':'\ud83c\udf25',
  'sun_behind_rain_cloud':'\ud83c\udf26',
  'sun_behind_small_cloud':'\ud83c\udf24',
  'sun_with_face':'\ud83c\udf1e',
  'sunflower':'\ud83c\udf3b',
  'sunglasses':'\ud83d\ude0e',
  'sunny':'\u2600\ufe0f',
  'sunrise':'\ud83c\udf05',
  'sunrise_over_mountains':'\ud83c\udf04',
  'surfing_man':'\ud83c\udfc4',
  'surfing_woman':'\ud83c\udfc4&zwj;\u2640\ufe0f',
  'sushi':'\ud83c\udf63',
  'suspension_railway':'\ud83d\ude9f',
  'sweat':'\ud83d\ude13',
  'sweat_drops':'\ud83d\udca6',
  'sweat_smile':'\ud83d\ude05',
  'sweet_potato':'\ud83c\udf60',
  'swimming_man':'\ud83c\udfca',
  'swimming_woman':'\ud83c\udfca&zwj;\u2640\ufe0f',
  'symbols':'\ud83d\udd23',
  'synagogue':'\ud83d\udd4d',
  'syringe':'\ud83d\udc89',
  'taco':'\ud83c\udf2e',
  'tada':'\ud83c\udf89',
  'tanabata_tree':'\ud83c\udf8b',
  'taurus':'\u2649\ufe0f',
  'taxi':'\ud83d\ude95',
  'tea':'\ud83c\udf75',
  'telephone_receiver':'\ud83d\udcde',
  'telescope':'\ud83d\udd2d',
  'tennis':'\ud83c\udfbe',
  'tent':'\u26fa\ufe0f',
  'thermometer':'\ud83c\udf21',
  'thinking':'\ud83e\udd14',
  'thought_balloon':'\ud83d\udcad',
  'ticket':'\ud83c\udfab',
  'tickets':'\ud83c\udf9f',
  'tiger':'\ud83d\udc2f',
  'tiger2':'\ud83d\udc05',
  'timer_clock':'\u23f2',
  'tipping_hand_man':'\ud83d\udc81&zwj;\u2642\ufe0f',
  'tired_face':'\ud83d\ude2b',
  'tm':'\u2122\ufe0f',
  'toilet':'\ud83d\udebd',
  'tokyo_tower':'\ud83d\uddfc',
  'tomato':'\ud83c\udf45',
  'tongue':'\ud83d\udc45',
  'top':'\ud83d\udd1d',
  'tophat':'\ud83c\udfa9',
  'tornado':'\ud83c\udf2a',
  'trackball':'\ud83d\uddb2',
  'tractor':'\ud83d\ude9c',
  'traffic_light':'\ud83d\udea5',
  'train':'\ud83d\ude8b',
  'train2':'\ud83d\ude86',
  'tram':'\ud83d\ude8a',
  'triangular_flag_on_post':'\ud83d\udea9',
  'triangular_ruler':'\ud83d\udcd0',
  'trident':'\ud83d\udd31',
  'triumph':'\ud83d\ude24',
  'trolleybus':'\ud83d\ude8e',
  'trophy':'\ud83c\udfc6',
  'tropical_drink':'\ud83c\udf79',
  'tropical_fish':'\ud83d\udc20',
  'truck':'\ud83d\ude9a',
  'trumpet':'\ud83c\udfba',
  'tulip':'\ud83c\udf37',
  'tumbler_glass':'\ud83e\udd43',
  'turkey':'\ud83e\udd83',
  'turtle':'\ud83d\udc22',
  'tv':'\ud83d\udcfa',
  'twisted_rightwards_arrows':'\ud83d\udd00',
  'two_hearts':'\ud83d\udc95',
  'two_men_holding_hands':'\ud83d\udc6c',
  'two_women_holding_hands':'\ud83d\udc6d',
  'u5272':'\ud83c\ude39',
  'u5408':'\ud83c\ude34',
  'u55b6':'\ud83c\ude3a',
  'u6307':'\ud83c\ude2f\ufe0f',
  'u6708':'\ud83c\ude37\ufe0f',
  'u6709':'\ud83c\ude36',
  'u6e80':'\ud83c\ude35',
  'u7121':'\ud83c\ude1a\ufe0f',
  'u7533':'\ud83c\ude38',
  'u7981':'\ud83c\ude32',
  'u7a7a':'\ud83c\ude33',
  'umbrella':'\u2614\ufe0f',
  'unamused':'\ud83d\ude12',
  'underage':'\ud83d\udd1e',
  'unicorn':'\ud83e\udd84',
  'unlock':'\ud83d\udd13',
  'up':'\ud83c\udd99',
  'upside_down_face':'\ud83d\ude43',
  'v':'\u270c\ufe0f',
  'vertical_traffic_light':'\ud83d\udea6',
  'vhs':'\ud83d\udcfc',
  'vibration_mode':'\ud83d\udcf3',
  'video_camera':'\ud83d\udcf9',
  'video_game':'\ud83c\udfae',
  'violin':'\ud83c\udfbb',
  'virgo':'\u264d\ufe0f',
  'volcano':'\ud83c\udf0b',
  'volleyball':'\ud83c\udfd0',
  'vs':'\ud83c\udd9a',
  'vulcan_salute':'\ud83d\udd96',
  'walking_man':'\ud83d\udeb6',
  'walking_woman':'\ud83d\udeb6&zwj;\u2640\ufe0f',
  'waning_crescent_moon':'\ud83c\udf18',
  'waning_gibbous_moon':'\ud83c\udf16',
  'warning':'\u26a0\ufe0f',
  'wastebasket':'\ud83d\uddd1',
  'watch':'\u231a\ufe0f',
  'water_buffalo':'\ud83d\udc03',
  'watermelon':'\ud83c\udf49',
  'wave':'\ud83d\udc4b',
  'wavy_dash':'\u3030\ufe0f',
  'waxing_crescent_moon':'\ud83c\udf12',
  'wc':'\ud83d\udebe',
  'weary':'\ud83d\ude29',
  'wedding':'\ud83d\udc92',
  'weight_lifting_man':'\ud83c\udfcb\ufe0f',
  'weight_lifting_woman':'\ud83c\udfcb\ufe0f&zwj;\u2640\ufe0f',
  'whale':'\ud83d\udc33',
  'whale2':'\ud83d\udc0b',
  'wheel_of_dharma':'\u2638\ufe0f',
  'wheelchair':'\u267f\ufe0f',
  'white_check_mark':'\u2705',
  'white_circle':'\u26aa\ufe0f',
  'white_flag':'\ud83c\udff3\ufe0f',
  'white_flower':'\ud83d\udcae',
  'white_large_square':'\u2b1c\ufe0f',
  'white_medium_small_square':'\u25fd\ufe0f',
  'white_medium_square':'\u25fb\ufe0f',
  'white_small_square':'\u25ab\ufe0f',
  'white_square_button':'\ud83d\udd33',
  'wilted_flower':'\ud83e\udd40',
  'wind_chime':'\ud83c\udf90',
  'wind_face':'\ud83c\udf2c',
  'wine_glass':'\ud83c\udf77',
  'wink':'\ud83d\ude09',
  'wolf':'\ud83d\udc3a',
  'woman':'\ud83d\udc69',
  'woman_artist':'\ud83d\udc69&zwj;\ud83c\udfa8',
  'woman_astronaut':'\ud83d\udc69&zwj;\ud83d\ude80',
  'woman_cartwheeling':'\ud83e\udd38&zwj;\u2640\ufe0f',
  'woman_cook':'\ud83d\udc69&zwj;\ud83c\udf73',
  'woman_facepalming':'\ud83e\udd26&zwj;\u2640\ufe0f',
  'woman_factory_worker':'\ud83d\udc69&zwj;\ud83c\udfed',
  'woman_farmer':'\ud83d\udc69&zwj;\ud83c\udf3e',
  'woman_firefighter':'\ud83d\udc69&zwj;\ud83d\ude92',
  'woman_health_worker':'\ud83d\udc69&zwj;\u2695\ufe0f',
  'woman_judge':'\ud83d\udc69&zwj;\u2696\ufe0f',
  'woman_juggling':'\ud83e\udd39&zwj;\u2640\ufe0f',
  'woman_mechanic':'\ud83d\udc69&zwj;\ud83d\udd27',
  'woman_office_worker':'\ud83d\udc69&zwj;\ud83d\udcbc',
  'woman_pilot':'\ud83d\udc69&zwj;\u2708\ufe0f',
  'woman_playing_handball':'\ud83e\udd3e&zwj;\u2640\ufe0f',
  'woman_playing_water_polo':'\ud83e\udd3d&zwj;\u2640\ufe0f',
  'woman_scientist':'\ud83d\udc69&zwj;\ud83d\udd2c',
  'woman_shrugging':'\ud83e\udd37&zwj;\u2640\ufe0f',
  'woman_singer':'\ud83d\udc69&zwj;\ud83c\udfa4',
  'woman_student':'\ud83d\udc69&zwj;\ud83c\udf93',
  'woman_teacher':'\ud83d\udc69&zwj;\ud83c\udfeb',
  'woman_technologist':'\ud83d\udc69&zwj;\ud83d\udcbb',
  'woman_with_turban':'\ud83d\udc73&zwj;\u2640\ufe0f',
  'womans_clothes':'\ud83d\udc5a',
  'womans_hat':'\ud83d\udc52',
  'women_wrestling':'\ud83e\udd3c&zwj;\u2640\ufe0f',
  'womens':'\ud83d\udeba',
  'world_map':'\ud83d\uddfa',
  'worried':'\ud83d\ude1f',
  'wrench':'\ud83d\udd27',
  'writing_hand':'\u270d\ufe0f',
  'x':'\u274c',
  'yellow_heart':'\ud83d\udc9b',
  'yen':'\ud83d\udcb4',
  'yin_yang':'\u262f\ufe0f',
  'yum':'\ud83d\ude0b',
  'zap':'\u26a1\ufe0f',
  'zipper_mouth_face':'\ud83e\udd10',
  'zzz':'\ud83d\udca4',

  /* special emojis :P */
  'octocat':  '<img alt=":octocat:" height="20" width="20" align="absmiddle" src="https://assets-cdn.github.com/images/icons/emoji/octocat.png">',
  'showdown': '<span style="font-family: \'Anonymous Pro\', monospace; text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #3e8b8a;text-underline-position: under;">S</span>'
};

/**
 * Created by Estevao on 31-05-2015.
 */

/**
 * Showdown Converter class
 * @class
 * @param {object} [converterOptions]
 * @returns {Converter}
 */
showdown.Converter = function (converterOptions) {
  'use strict';

  var
      /**
       * Options used by this converter
       * @private
       * @type {{}}
       */
      options = {},

      /**
       * Language extensions used by this converter
       * @private
       * @type {Array}
       */
      langExtensions = [],

      /**
       * Output modifiers extensions used by this converter
       * @private
       * @type {Array}
       */
      outputModifiers = [],

      /**
       * Event listeners
       * @private
       * @type {{}}
       */
      listeners = {},

      /**
       * The flavor set in this converter
       */
      setConvFlavor = setFlavor,

      /**
       * Metadata of the document
       * @type {{parsed: {}, raw: string, format: string}}
       */
      metadata = {
        parsed: {},
        raw: '',
        format: ''
      };

  _constructor();

  /**
   * Converter constructor
   * @private
   */
  function _constructor () {
    converterOptions = converterOptions || {};

    for (var gOpt in globalOptions) {
      if (globalOptions.hasOwnProperty(gOpt)) {
        options[gOpt] = globalOptions[gOpt];
      }
    }

    // Merge options
    if (typeof converterOptions === 'object') {
      for (var opt in converterOptions) {
        if (converterOptions.hasOwnProperty(opt)) {
          options[opt] = converterOptions[opt];
        }
      }
    } else {
      throw Error('Converter expects the passed parameter to be an object, but ' + typeof converterOptions +
      ' was passed instead.');
    }

    if (options.extensions) {
      showdown.helper.forEach(options.extensions, _parseExtension);
    }
  }

  /**
   * Parse extension
   * @param {*} ext
   * @param {string} [name='']
   * @private
   */
  function _parseExtension (ext, name) {

    name = name || null;
    // If it's a string, the extension was previously loaded
    if (showdown.helper.isString(ext)) {
      ext = showdown.helper.stdExtName(ext);
      name = ext;

      // LEGACY_SUPPORT CODE
      if (showdown.extensions[ext]) {
        console.warn('DEPRECATION WARNING: ' + ext + ' is an old extension that uses a deprecated loading method.' +
          'Please inform the developer that the extension should be updated!');
        legacyExtensionLoading(showdown.extensions[ext], ext);
        return;
        // END LEGACY SUPPORT CODE

      } else if (!showdown.helper.isUndefined(extensions[ext])) {
        ext = extensions[ext];

      } else {
        throw Error('Extension "' + ext + '" could not be loaded. It was either not found or is not a valid extension.');
      }
    }

    if (typeof ext === 'function') {
      ext = ext();
    }

    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExt = validate(ext, name);
    if (!validExt.valid) {
      throw Error(validExt.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {

        case 'lang':
          langExtensions.push(ext[i]);
          break;

        case 'output':
          outputModifiers.push(ext[i]);
          break;
      }
      if (ext[i].hasOwnProperty('listeners')) {
        for (var ln in ext[i].listeners) {
          if (ext[i].listeners.hasOwnProperty(ln)) {
            listen(ln, ext[i].listeners[ln]);
          }
        }
      }
    }

  }

  /**
   * LEGACY_SUPPORT
   * @param {*} ext
   * @param {string} name
   */
  function legacyExtensionLoading (ext, name) {
    if (typeof ext === 'function') {
      ext = ext(new showdown.Converter());
    }
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }
    var valid = validate(ext, name);

    if (!valid.valid) {
      throw Error(valid.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {
        case 'lang':
          langExtensions.push(ext[i]);
          break;
        case 'output':
          outputModifiers.push(ext[i]);
          break;
        default:// should never reach here
          throw Error('Extension loader error: Type unrecognized!!!');
      }
    }
  }

  /**
   * Listen to an event
   * @param {string} name
   * @param {function} callback
   */
  function listen (name, callback) {
    if (!showdown.helper.isString(name)) {
      throw Error('Invalid argument in converter.listen() method: name must be a string, but ' + typeof name + ' given');
    }

    if (typeof callback !== 'function') {
      throw Error('Invalid argument in converter.listen() method: callback must be a function, but ' + typeof callback + ' given');
    }

    if (!listeners.hasOwnProperty(name)) {
      listeners[name] = [];
    }
    listeners[name].push(callback);
  }

  function rTrimInputText (text) {
    var rsp = text.match(/^\s*/)[0].length,
        rgx = new RegExp('^\\s{0,' + rsp + '}', 'gm');
    return text.replace(rgx, '');
  }

  /**
   * Dispatch an event
   * @private
   * @param {string} evtName Event name
   * @param {string} text Text
   * @param {{}} options Converter Options
   * @param {{}} globals
   * @returns {string}
   */
  this._dispatch = function dispatch (evtName, text, options, globals) {
    if (listeners.hasOwnProperty(evtName)) {
      for (var ei = 0; ei < listeners[evtName].length; ++ei) {
        var nText = listeners[evtName][ei](evtName, text, this, options, globals);
        if (nText && typeof nText !== 'undefined') {
          text = nText;
        }
      }
    }
    return text;
  };

  /**
   * Listen to an event
   * @param {string} name
   * @param {function} callback
   * @returns {showdown.Converter}
   */
  this.listen = function (name, callback) {
    listen(name, callback);
    return this;
  };

  /**
   * Converts a markdown string into HTML
   * @param {string} text
   * @returns {*}
   */
  this.makeHtml = function (text) {
    //check if text is not falsy
    if (!text) {
      return text;
    }

    var globals = {
      gHtmlBlocks:     [],
      gHtmlMdBlocks:   [],
      gHtmlSpans:      [],
      gUrls:           {},
      gTitles:         {},
      gDimensions:     {},
      gListLevel:      0,
      hashLinkCounts:  {},
      langExtensions:  langExtensions,
      outputModifiers: outputModifiers,
      converter:       this,
      ghCodeBlocks:    [],
      metadata: {
        parsed: {},
        raw: '',
        format: ''
      }
    };

    // This lets us use ¨ trema as an escape char to avoid md5 hashes
    // The choice of character is arbitrary; anything that isn't
    // magic in Markdown will work.
    text = text.replace(/¨/g, '¨T');

    // Replace $ with ¨D
    // RegExp interprets $ as a special character
    // when it's in a replacement string
    text = text.replace(/\$/g, '¨D');

    // Standardize line endings
    text = text.replace(/\r\n/g, '\n'); // DOS to Unix
    text = text.replace(/\r/g, '\n'); // Mac to Unix

    // Stardardize line spaces
    text = text.replace(/\u00A0/g, '&nbsp;');

    if (options.smartIndentationFix) {
      text = rTrimInputText(text);
    }

    // Make sure text begins and ends with a couple of newlines:
    text = '\n\n' + text + '\n\n';

    // detab
    text = showdown.subParser('detab')(text, options, globals);

    /**
     * Strip any lines consisting only of spaces and tabs.
     * This makes subsequent regexs easier to write, because we can
     * match consecutive blank lines with /\n+/ instead of something
     * contorted like /[ \t]*\n+/
     */
    text = text.replace(/^[ \t]+$/mg, '');

    //run languageExtensions
    showdown.helper.forEach(langExtensions, function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    });

    // run the sub parsers
    text = showdown.subParser('metadata')(text, options, globals);
    text = showdown.subParser('hashPreCodeTags')(text, options, globals);
    text = showdown.subParser('githubCodeBlocks')(text, options, globals);
    text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
    text = showdown.subParser('hashCodeTags')(text, options, globals);
    text = showdown.subParser('stripLinkDefinitions')(text, options, globals);
    text = showdown.subParser('blockGamut')(text, options, globals);
    text = showdown.subParser('unhashHTMLSpans')(text, options, globals);
    text = showdown.subParser('unescapeSpecialChars')(text, options, globals);

    // attacklab: Restore dollar signs
    text = text.replace(/¨D/g, '$$');

    // attacklab: Restore tremas
    text = text.replace(/¨T/g, '¨');

    // render a complete html document instead of a partial if the option is enabled
    text = showdown.subParser('completeHTMLDocument')(text, options, globals);

    // Run output modifiers
    showdown.helper.forEach(outputModifiers, function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    });

    // update metadata
    metadata = globals.metadata;
    return text;
  };

  /**
   * Converts an HTML string into a markdown string
   * @param src
   * @param [HTMLParser] A WHATWG DOM and HTML parser, such as JSDOM. If none is supplied, window.document will be used.
   * @returns {string}
   */
  this.makeMarkdown = this.makeMd = function (src, HTMLParser) {

    // replace \r\n with \n
    src = src.replace(/\r\n/g, '\n');
    src = src.replace(/\r/g, '\n'); // old macs

    // due to an edge case, we need to find this: > <
    // to prevent removing of non silent white spaces
    // ex: <em>this is</em> <strong>sparta</strong>
    src = src.replace(/>[ \t]+</, '>¨NBSP;<');

    if (!HTMLParser) {
      if (window && window.document) {
        HTMLParser = window.document;
      } else {
        throw new Error('HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM');
      }
    }

    var doc = HTMLParser.createElement('div');
    doc.innerHTML = src;

    var globals = {
      preList: substitutePreCodeTags(doc)
    };

    // remove all newlines and collapse spaces
    clean(doc);

    // some stuff, like accidental reference links must now be escaped
    // TODO
    // doc.innerHTML = doc.innerHTML.replace(/\[[\S\t ]]/);

    var nodes = doc.childNodes,
        mdDoc = '';

    for (var i = 0; i < nodes.length; i++) {
      mdDoc += showdown.subParser('makeMarkdown.node')(nodes[i], globals);
    }

    function clean (node) {
      for (var n = 0; n < node.childNodes.length; ++n) {
        var child = node.childNodes[n];
        if (child.nodeType === 3) {
          if (!/\S/.test(child.nodeValue)) {
            node.removeChild(child);
            --n;
          } else {
            child.nodeValue = child.nodeValue.split('\n').join(' ');
            child.nodeValue = child.nodeValue.replace(/(\s)+/g, '$1');
          }
        } else if (child.nodeType === 1) {
          clean(child);
        }
      }
    }

    // find all pre tags and replace contents with placeholder
    // we need this so that we can remove all indentation from html
    // to ease up parsing
    function substitutePreCodeTags (doc) {

      var pres = doc.querySelectorAll('pre'),
          presPH = [];

      for (var i = 0; i < pres.length; ++i) {

        if (pres[i].childElementCount === 1 && pres[i].firstChild.tagName.toLowerCase() === 'code') {
          var content = pres[i].firstChild.innerHTML.trim(),
              language = pres[i].firstChild.getAttribute('data-language') || '';

          // if data-language attribute is not defined, then we look for class language-*
          if (language === '') {
            var classes = pres[i].firstChild.className.split(' ');
            for (var c = 0; c < classes.length; ++c) {
              var matches = classes[c].match(/^language-(.+)$/);
              if (matches !== null) {
                language = matches[1];
                break;
              }
            }
          }

          // unescape html entities in content
          content = showdown.helper.unescapeHTMLEntities(content);

          presPH.push(content);
          pres[i].outerHTML = '<precode language="' + language + '" precodenum="' + i.toString() + '"></precode>';
        } else {
          presPH.push(pres[i].innerHTML);
          pres[i].innerHTML = '';
          pres[i].setAttribute('prenum', i.toString());
        }
      }
      return presPH;
    }

    return mdDoc;
  };

  /**
   * Set an option of this Converter instance
   * @param {string} key
   * @param {*} value
   */
  this.setOption = function (key, value) {
    options[key] = value;
  };

  /**
   * Get the option of this Converter instance
   * @param {string} key
   * @returns {*}
   */
  this.getOption = function (key) {
    return options[key];
  };

  /**
   * Get the options of this Converter instance
   * @returns {{}}
   */
  this.getOptions = function () {
    return options;
  };

  /**
   * Add extension to THIS converter
   * @param {{}} extension
   * @param {string} [name=null]
   */
  this.addExtension = function (extension, name) {
    name = name || null;
    _parseExtension(extension, name);
  };

  /**
   * Use a global registered extension with THIS converter
   * @param {string} extensionName Name of the previously registered extension
   */
  this.useExtension = function (extensionName) {
    _parseExtension(extensionName);
  };

  /**
   * Set the flavor THIS converter should use
   * @param {string} name
   */
  this.setFlavor = function (name) {
    if (!flavor.hasOwnProperty(name)) {
      throw Error(name + ' flavor was not found');
    }
    var preset = flavor[name];
    setConvFlavor = name;
    for (var option in preset) {
      if (preset.hasOwnProperty(option)) {
        options[option] = preset[option];
      }
    }
  };

  /**
   * Get the currently set flavor of this converter
   * @returns {string}
   */
  this.getFlavor = function () {
    return setConvFlavor;
  };

  /**
   * Remove an extension from THIS converter.
   * Note: This is a costly operation. It's better to initialize a new converter
   * and specify the extensions you wish to use
   * @param {Array} extension
   */
  this.removeExtension = function (extension) {
    if (!showdown.helper.isArray(extension)) {
      extension = [extension];
    }
    for (var a = 0; a < extension.length; ++a) {
      var ext = extension[a];
      for (var i = 0; i < langExtensions.length; ++i) {
        if (langExtensions[i] === ext) {
          langExtensions[i].splice(i, 1);
        }
      }
      for (var ii = 0; ii < outputModifiers.length; ++i) {
        if (outputModifiers[ii] === ext) {
          outputModifiers[ii].splice(i, 1);
        }
      }
    }
  };

  /**
   * Get all extension of THIS converter
   * @returns {{language: Array, output: Array}}
   */
  this.getAllExtensions = function () {
    return {
      language: langExtensions,
      output: outputModifiers
    };
  };

  /**
   * Get the metadata of the previously parsed document
   * @param raw
   * @returns {string|{}}
   */
  this.getMetadata = function (raw) {
    if (raw) {
      return metadata.raw;
    } else {
      return metadata.parsed;
    }
  };

  /**
   * Get the metadata format of the previously parsed document
   * @returns {string}
   */
  this.getMetadataFormat = function () {
    return metadata.format;
  };

  /**
   * Private: set a single key, value metadata pair
   * @param {string} key
   * @param {string} value
   */
  this._setMetadataPair = function (key, value) {
    metadata.parsed[key] = value;
  };

  /**
   * Private: set metadata format
   * @param {string} format
   */
  this._setMetadataFormat = function (format) {
    metadata.format = format;
  };

  /**
   * Private: set metadata raw text
   * @param {string} raw
   */
  this._setMetadataRaw = function (raw) {
    metadata.raw = raw;
  };
};

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('anchors', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('anchors.before', text, options, globals);

  var writeAnchorTag = function (wholeMatch, linkText, linkId, url, m5, m6, title) {
    if (showdown.helper.isUndefined(title)) {
      title = '';
    }
    linkId = linkId.toLowerCase();

    // Special case for explicit empty url
    if (wholeMatch.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1) {
      url = '';
    } else if (!url) {
      if (!linkId) {
        // lower-case and turn embedded newlines into spaces
        linkId = linkText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(globals.gUrls[linkId])) {
        url = globals.gUrls[linkId];
        if (!showdown.helper.isUndefined(globals.gTitles[linkId])) {
          title = globals.gTitles[linkId];
        }
      } else {
        return wholeMatch;
      }
    }

    //url = showdown.helper.escapeCharacters(url, '*_', false); // replaced line to improve performance
    url = url.replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);

    var result = '<a href="' + url + '"';

    if (title !== '' && title !== null) {
      title = title.replace(/"/g, '&quot;');
      //title = showdown.helper.escapeCharacters(title, '*_', false); // replaced line to improve performance
      title = title.replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
      result += ' title="' + title + '"';
    }

    // optionLinksInNewWindow only applies
    // to external links. Hash links (#) open in same page
    if (options.openLinksInNewWindow && !/^#/.test(url)) {
      // escaped _
      result += ' rel="noopener noreferrer" target="¨E95Eblank"';
    }

    result += '>' + linkText + '</a>';

    return result;
  };

  // First, handle reference-style links: [link text] [id]
  text = text.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, writeAnchorTag);

  // Next, inline-style links: [link text](url "optional title")
  // cases with crazy urls like ./image/cat1).png
  text = text.replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
    writeAnchorTag);

  // normal cases
  text = text.replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
    writeAnchorTag);

  // handle reference-style shortcuts: [link text]
  // These must come last in case you've also got [link test][1]
  // or [link test](/foo)
  text = text.replace(/\[([^\[\]]+)]()()()()()/g, writeAnchorTag);

  // Lastly handle GithubMentions if option is enabled
  if (options.ghMentions) {
    text = text.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function (wm, st, escape, mentions, username) {
      if (escape === '\\') {
        return st + mentions;
      }

      //check if options.ghMentionsLink is a string
      if (!showdown.helper.isString(options.ghMentionsLink)) {
        throw new Error('ghMentionsLink option must be a string');
      }
      var lnk = options.ghMentionsLink.replace(/\{u}/g, username),
          target = '';
      if (options.openLinksInNewWindow) {
        target = ' rel="noopener noreferrer" target="¨E95Eblank"';
      }
      return st + '<a href="' + lnk + '"' + target + '>' + mentions + '</a>';
    });
  }

  text = globals.converter._dispatch('anchors.after', text, options, globals);
  return text;
});

// url allowed chars [a-z\d_.~:/?#[]@!$&'()*+,;=-]

var simpleURLRegex  = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi,
    simpleURLRegex2 = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi,
    delimUrlRegex   = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi,
    simpleMailRegex = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi,
    delimMailRegex  = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,

    replaceLink = function (options) {
      'use strict';
      return function (wm, leadingMagicChars, link, m2, m3, trailingPunctuation, trailingMagicChars) {
        link = link.replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
        var lnkTxt = link,
            append = '',
            target = '',
            lmc    = leadingMagicChars || '',
            tmc    = trailingMagicChars || '';
        if (/^www\./i.test(link)) {
          link = link.replace(/^www\./i, 'http://www.');
        }
        if (options.excludeTrailingPunctuationFromURLs && trailingPunctuation) {
          append = trailingPunctuation;
        }
        if (options.openLinksInNewWindow) {
          target = ' rel="noopener noreferrer" target="¨E95Eblank"';
        }
        return lmc + '<a href="' + link + '"' + target + '>' + lnkTxt + '</a>' + append + tmc;
      };
    },

    replaceMail = function (options, globals) {
      'use strict';
      return function (wholeMatch, b, mail) {
        var href = 'mailto:';
        b = b || '';
        mail = showdown.subParser('unescapeSpecialChars')(mail, options, globals);
        if (options.encodeEmails) {
          href = showdown.helper.encodeEmailAddress(href + mail);
          mail = showdown.helper.encodeEmailAddress(mail);
        } else {
          href = href + mail;
        }
        return b + '<a href="' + href + '">' + mail + '</a>';
      };
    };

showdown.subParser('autoLinks', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('autoLinks.before', text, options, globals);

  text = text.replace(delimUrlRegex, replaceLink(options));
  text = text.replace(delimMailRegex, replaceMail(options, globals));

  text = globals.converter._dispatch('autoLinks.after', text, options, globals);

  return text;
});

showdown.subParser('simplifiedAutoLinks', function (text, options, globals) {
  'use strict';

  if (!options.simplifiedAutoLink) {
    return text;
  }

  text = globals.converter._dispatch('simplifiedAutoLinks.before', text, options, globals);

  if (options.excludeTrailingPunctuationFromURLs) {
    text = text.replace(simpleURLRegex2, replaceLink(options));
  } else {
    text = text.replace(simpleURLRegex, replaceLink(options));
  }
  text = text.replace(simpleMailRegex, replaceMail(options, globals));

  text = globals.converter._dispatch('simplifiedAutoLinks.after', text, options, globals);

  return text;
});

/**
 * These are all the transformations that form block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('blockGamut', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('blockGamut.before', text, options, globals);

  // we parse blockquotes first so that we can have headings and hrs
  // inside blockquotes
  text = showdown.subParser('blockQuotes')(text, options, globals);
  text = showdown.subParser('headers')(text, options, globals);

  // Do Horizontal Rules:
  text = showdown.subParser('horizontalRule')(text, options, globals);

  text = showdown.subParser('lists')(text, options, globals);
  text = showdown.subParser('codeBlocks')(text, options, globals);
  text = showdown.subParser('tables')(text, options, globals);

  // We already ran _HashHTMLBlocks() before, in Markdown(), but that
  // was to escape raw HTML in the original Markdown source. This time,
  // we're escaping the markup we've just created, so that we don't wrap
  // <p> tags around block-level tags.
  text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
  text = showdown.subParser('paragraphs')(text, options, globals);

  text = globals.converter._dispatch('blockGamut.after', text, options, globals);

  return text;
});

showdown.subParser('blockQuotes', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('blockQuotes.before', text, options, globals);

  // add a couple extra lines after the text and endtext mark
  text = text + '\n\n';

  var rgx = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;

  if (options.splitAdjacentBlockquotes) {
    rgx = /^ {0,3}>[\s\S]*?(?:\n\n)/gm;
  }

  text = text.replace(rgx, function (bq) {
    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g,"") == "bug"
    bq = bq.replace(/^[ \t]*>[ \t]?/gm, ''); // trim one level of quoting

    // attacklab: clean up hack
    bq = bq.replace(/¨0/g, '');

    bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
    bq = showdown.subParser('githubCodeBlocks')(bq, options, globals);
    bq = showdown.subParser('blockGamut')(bq, options, globals); // recurse

    bq = bq.replace(/(^|\n)/g, '$1  ');
    // These leading spaces screw with <pre> content, so we need to fix that:
    bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
      var pre = m1;
      // attacklab: hack around Konqueror 3.5.4 bug:
      pre = pre.replace(/^  /mg, '¨0');
      pre = pre.replace(/¨0/g, '');
      return pre;
    });

    return showdown.subParser('hashBlock')('<blockquote>\n' + bq + '\n</blockquote>', options, globals);
  });

  text = globals.converter._dispatch('blockQuotes.after', text, options, globals);
  return text;
});

/**
 * Process Markdown `<pre><code>` blocks.
 */
showdown.subParser('codeBlocks', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('codeBlocks.before', text, options, globals);

  // sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '¨0';

  var pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
  text = text.replace(pattern, function (wholeMatch, m1, m2) {
    var codeblock = m1,
        nextChar = m2,
        end = '\n';

    codeblock = showdown.subParser('outdent')(codeblock, options, globals);
    codeblock = showdown.subParser('encodeCode')(codeblock, options, globals);
    codeblock = showdown.subParser('detab')(codeblock, options, globals);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing newlines

    if (options.omitExtraWLInCodeBlocks) {
      end = '';
    }

    codeblock = '<pre><code>' + codeblock + end + '</code></pre>';

    return showdown.subParser('hashBlock')(codeblock, options, globals) + nextChar;
  });

  // strip sentinel
  text = text.replace(/¨0/, '');

  text = globals.converter._dispatch('codeBlocks.after', text, options, globals);
  return text;
});

/**
 *
 *   *  Backtick quotes are used for <code></code> spans.
 *
 *   *  You can use multiple backticks as the delimiters if you want to
 *     include literal backticks in the code span. So, this input:
 *
 *         Just type ``foo `bar` baz`` at the prompt.
 *
 *       Will translate to:
 *
 *         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
 *
 *    There's no arbitrary limit to the number of backticks you
 *    can use as delimters. If you need three consecutive backticks
 *    in your code, use four for delimiters, etc.
 *
 *  *  You can use spaces to get literal backticks at the edges:
 *
 *         ... type `` `bar` `` ...
 *
 *       Turns to:
 *
 *         ... type <code>`bar`</code> ...
 */
showdown.subParser('codeSpans', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('codeSpans.before', text, options, globals);

  if (typeof text === 'undefined') {
    text = '';
  }
  text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
    function (wholeMatch, m1, m2, m3) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
      c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
      c = showdown.subParser('encodeCode')(c, options, globals);
      c = m1 + '<code>' + c + '</code>';
      c = showdown.subParser('hashHTMLSpans')(c, options, globals);
      return c;
    }
  );

  text = globals.converter._dispatch('codeSpans.after', text, options, globals);
  return text;
});

/**
 * Create a full HTML document from the processed markdown
 */
showdown.subParser('completeHTMLDocument', function (text, options, globals) {
  'use strict';

  if (!options.completeHTMLDocument) {
    return text;
  }

  text = globals.converter._dispatch('completeHTMLDocument.before', text, options, globals);

  var doctype = 'html',
      doctypeParsed = '<!DOCTYPE HTML>\n',
      title = '',
      charset = '<meta charset="utf-8">\n',
      lang = '',
      metadata = '';

  if (typeof globals.metadata.parsed.doctype !== 'undefined') {
    doctypeParsed = '<!DOCTYPE ' +  globals.metadata.parsed.doctype + '>\n';
    doctype = globals.metadata.parsed.doctype.toString().toLowerCase();
    if (doctype === 'html' || doctype === 'html5') {
      charset = '<meta charset="utf-8">';
    }
  }

  for (var meta in globals.metadata.parsed) {
    if (globals.metadata.parsed.hasOwnProperty(meta)) {
      switch (meta.toLowerCase()) {
        case 'doctype':
          break;

        case 'title':
          title = '<title>' +  globals.metadata.parsed.title + '</title>\n';
          break;

        case 'charset':
          if (doctype === 'html' || doctype === 'html5') {
            charset = '<meta charset="' + globals.metadata.parsed.charset + '">\n';
          } else {
            charset = '<meta name="charset" content="' + globals.metadata.parsed.charset + '">\n';
          }
          break;

        case 'language':
        case 'lang':
          lang = ' lang="' + globals.metadata.parsed[meta] + '"';
          metadata += '<meta name="' + meta + '" content="' + globals.metadata.parsed[meta] + '">\n';
          break;

        default:
          metadata += '<meta name="' + meta + '" content="' + globals.metadata.parsed[meta] + '">\n';
      }
    }
  }

  text = doctypeParsed + '<html' + lang + '>\n<head>\n' + title + charset + metadata + '</head>\n<body>\n' + text.trim() + '\n</body>\n</html>';

  text = globals.converter._dispatch('completeHTMLDocument.after', text, options, globals);
  return text;
});

/**
 * Convert all tabs to spaces
 */
showdown.subParser('detab', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('detab.before', text, options, globals);

  // expand first n-1 tabs
  text = text.replace(/\t(?=\t)/g, '    '); // g_tab_width

  // replace the nth with two sentinels
  text = text.replace(/\t/g, '¨A¨B');

  // use the sentinel to anchor our regex so it doesn't explode
  text = text.replace(/¨B(.+?)¨A/g, function (wholeMatch, m1) {
    var leadingText = m1,
        numSpaces = 4 - leadingText.length % 4;  // g_tab_width

    // there *must* be a better way to do this:
    for (var i = 0; i < numSpaces; i++) {
      leadingText += ' ';
    }

    return leadingText;
  });

  // clean up sentinels
  text = text.replace(/¨A/g, '    ');  // g_tab_width
  text = text.replace(/¨B/g, '');

  text = globals.converter._dispatch('detab.after', text, options, globals);
  return text;
});

showdown.subParser('ellipsis', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('ellipsis.before', text, options, globals);

  text = text.replace(/\.\.\./g, '…');

  text = globals.converter._dispatch('ellipsis.after', text, options, globals);

  return text;
});

/**
 * Turn emoji codes into emojis
 *
 * List of supported emojis: https://github.com/showdownjs/showdown/wiki/Emojis
 */
showdown.subParser('emoji', function (text, options, globals) {
  'use strict';

  if (!options.emoji) {
    return text;
  }

  text = globals.converter._dispatch('emoji.before', text, options, globals);

  var emojiRgx = /:([\S]+?):/g;

  text = text.replace(emojiRgx, function (wm, emojiCode) {
    if (showdown.helper.emojis.hasOwnProperty(emojiCode)) {
      return showdown.helper.emojis[emojiCode];
    }
    return wm;
  });

  text = globals.converter._dispatch('emoji.after', text, options, globals);

  return text;
});

/**
 * Smart processing for ampersands and angle brackets that need to be encoded.
 */
showdown.subParser('encodeAmpsAndAngles', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('encodeAmpsAndAngles.before', text, options, globals);

  // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
  // http://bumppo.net/projects/amputator/
  text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');

  // Encode naked <'s
  text = text.replace(/<(?![a-z\/?$!])/gi, '&lt;');

  // Encode <
  text = text.replace(/</g, '&lt;');

  // Encode >
  text = text.replace(/>/g, '&gt;');

  text = globals.converter._dispatch('encodeAmpsAndAngles.after', text, options, globals);
  return text;
});

/**
 * Returns the string, with after processing the following backslash escape sequences.
 *
 * attacklab: The polite way to do this is with the new escapeCharacters() function:
 *
 *    text = escapeCharacters(text,"\\",true);
 *    text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
 *
 * ...but we're sidestepping its use of the (slow) RegExp constructor
 * as an optimization for Firefox.  This function gets called a LOT.
 */
showdown.subParser('encodeBackslashEscapes', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('encodeBackslashEscapes.before', text, options, globals);

  text = text.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
  text = text.replace(/\\([`*_{}\[\]()>#+.!~=|-])/g, showdown.helper.escapeCharactersCallback);

  text = globals.converter._dispatch('encodeBackslashEscapes.after', text, options, globals);
  return text;
});

/**
 * Encode/escape certain characters inside Markdown code runs.
 * The point is that in code, these characters are literals,
 * and lose their special Markdown meanings.
 */
showdown.subParser('encodeCode', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('encodeCode.before', text, options, globals);

  // Encode all ampersands; HTML entities are not
  // entities within a Markdown code span.
  text = text
    .replace(/&/g, '&amp;')
  // Do the angle bracket song and dance:
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Now, escape characters that are magic in Markdown:
    .replace(/([*_{}\[\]\\=~-])/g, showdown.helper.escapeCharactersCallback);

  text = globals.converter._dispatch('encodeCode.after', text, options, globals);
  return text;
});

/**
 * Within tags -- meaning between < and > -- encode [\ ` * _ ~ =] so they
 * don't conflict with their use in Markdown for code, italics and strong.
 */
showdown.subParser('escapeSpecialCharsWithinTagAttributes', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('escapeSpecialCharsWithinTagAttributes.before', text, options, globals);

  // Build a regex to find HTML tags.
  var tags     = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi,
      comments = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;

  text = text.replace(tags, function (wholeMatch) {
    return wholeMatch
      .replace(/(.)<\/?code>(?=.)/g, '$1`')
      .replace(/([\\`*_~=|])/g, showdown.helper.escapeCharactersCallback);
  });

  text = text.replace(comments, function (wholeMatch) {
    return wholeMatch
      .replace(/([\\`*_~=|])/g, showdown.helper.escapeCharactersCallback);
  });

  text = globals.converter._dispatch('escapeSpecialCharsWithinTagAttributes.after', text, options, globals);
  return text;
});

/**
 * Handle github codeblocks prior to running HashHTML so that
 * HTML contained within the codeblock gets escaped properly
 * Example:
 * ```ruby
 *     def hello_world(x)
 *       puts "Hello, #{x}"
 *     end
 * ```
 */
showdown.subParser('githubCodeBlocks', function (text, options, globals) {
  'use strict';

  // early exit if option is not enabled
  if (!options.ghCodeBlocks) {
    return text;
  }

  text = globals.converter._dispatch('githubCodeBlocks.before', text, options, globals);

  text += '¨0';

  text = text.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function (wholeMatch, delim, language, codeblock) {
    var end = (options.omitExtraWLInCodeBlocks) ? '' : '\n';

    // First parse the github code block
    codeblock = showdown.subParser('encodeCode')(codeblock, options, globals);
    codeblock = showdown.subParser('detab')(codeblock, options, globals);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

    codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

    codeblock = showdown.subParser('hashBlock')(codeblock, options, globals);

    // Since GHCodeblocks can be false positives, we need to
    // store the primitive text and the parsed text in a global var,
    // and then return a token
    return '\n\n¨G' + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: codeblock}) - 1) + 'G\n\n';
  });

  // attacklab: strip sentinel
  text = text.replace(/¨0/, '');

  return globals.converter._dispatch('githubCodeBlocks.after', text, options, globals);
});

showdown.subParser('hashBlock', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashBlock.before', text, options, globals);
  text = text.replace(/(^\n+|\n+$)/g, '');
  text = '\n\n¨K' + (globals.gHtmlBlocks.push(text) - 1) + 'K\n\n';
  text = globals.converter._dispatch('hashBlock.after', text, options, globals);
  return text;
});

/**
 * Hash and escape <code> elements that should not be parsed as markdown
 */
showdown.subParser('hashCodeTags', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashCodeTags.before', text, options, globals);

  var repFunc = function (wholeMatch, match, left, right) {
    var codeblock = left + showdown.subParser('encodeCode')(match, options, globals) + right;
    return '¨C' + (globals.gHtmlSpans.push(codeblock) - 1) + 'C';
  };

  // Hash naked <code>
  text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '<code\\b[^>]*>', '</code>', 'gim');

  text = globals.converter._dispatch('hashCodeTags.after', text, options, globals);
  return text;
});

showdown.subParser('hashElement', function (text, options, globals) {
  'use strict';

  return function (wholeMatch, m1) {
    var blockText = m1;

    // Undo double lines
    blockText = blockText.replace(/\n\n/g, '\n');
    blockText = blockText.replace(/^\n/, '');

    // strip trailing blank lines
    blockText = blockText.replace(/\n+$/g, '');

    // Replace the element text with a marker ("¨KxK" where x is its key)
    blockText = '\n\n¨K' + (globals.gHtmlBlocks.push(blockText) - 1) + 'K\n\n';

    return blockText;
  };
});

showdown.subParser('hashHTMLBlocks', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashHTMLBlocks.before', text, options, globals);

  var blockTags = [
        'pre',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'table',
        'dl',
        'ol',
        'ul',
        'script',
        'noscript',
        'form',
        'fieldset',
        'iframe',
        'math',
        'style',
        'section',
        'header',
        'footer',
        'nav',
        'article',
        'aside',
        'address',
        'audio',
        'canvas',
        'figure',
        'hgroup',
        'output',
        'video',
        'p'
      ],
      repFunc = function (wholeMatch, match, left, right) {
        var txt = wholeMatch;
        // check if this html element is marked as markdown
        // if so, it's contents should be parsed as markdown
        if (left.search(/\bmarkdown\b/) !== -1) {
          txt = left + globals.converter.makeHtml(match) + right;
        }
        return '\n\n¨K' + (globals.gHtmlBlocks.push(txt) - 1) + 'K\n\n';
      };

  if (options.backslashEscapesHTMLTags) {
    // encode backslash escaped HTML tags
    text = text.replace(/\\<(\/?[^>]+?)>/g, function (wm, inside) {
      return '&lt;' + inside + '&gt;';
    });
  }

  // hash HTML Blocks
  for (var i = 0; i < blockTags.length; ++i) {

    var opTagPos,
        rgx1     = new RegExp('^ {0,3}(<' + blockTags[i] + '\\b[^>]*>)', 'im'),
        patLeft  = '<' + blockTags[i] + '\\b[^>]*>',
        patRight = '</' + blockTags[i] + '>';
    // 1. Look for the first position of the first opening HTML tag in the text
    while ((opTagPos = showdown.helper.regexIndexOf(text, rgx1)) !== -1) {

      // if the HTML tag is \ escaped, we need to escape it and break


      //2. Split the text in that position
      var subTexts = showdown.helper.splitAtIndex(text, opTagPos),
          //3. Match recursively
          newSubText1 = showdown.helper.replaceRecursiveRegExp(subTexts[1], repFunc, patLeft, patRight, 'im');

      // prevent an infinite loop
      if (newSubText1 === subTexts[1]) {
        break;
      }
      text = subTexts[0].concat(newSubText1);
    }
  }
  // HR SPECIAL CASE
  text = text.replace(/(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
    showdown.subParser('hashElement')(text, options, globals));

  // Special case for standalone HTML comments
  text = showdown.helper.replaceRecursiveRegExp(text, function (txt) {
    return '\n\n¨K' + (globals.gHtmlBlocks.push(txt) - 1) + 'K\n\n';
  }, '^ {0,3}<!--', '-->', 'gm');

  // PHP and ASP-style processor instructions (<?...?> and <%...%>)
  text = text.replace(/(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
    showdown.subParser('hashElement')(text, options, globals));

  text = globals.converter._dispatch('hashHTMLBlocks.after', text, options, globals);
  return text;
});

/**
 * Hash span elements that should not be parsed as markdown
 */
showdown.subParser('hashHTMLSpans', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashHTMLSpans.before', text, options, globals);

  function hashHTMLSpan (html) {
    return '¨C' + (globals.gHtmlSpans.push(html) - 1) + 'C';
  }

  // Hash Self Closing tags
  text = text.replace(/<[^>]+?\/>/gi, function (wm) {
    return hashHTMLSpan(wm);
  });

  // Hash tags without properties
  text = text.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function (wm) {
    return hashHTMLSpan(wm);
  });

  // Hash tags with properties
  text = text.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function (wm) {
    return hashHTMLSpan(wm);
  });

  // Hash self closing tags without />
  text = text.replace(/<[^>]+?>/gi, function (wm) {
    return hashHTMLSpan(wm);
  });

  /*showdown.helper.matchRecursiveRegExp(text, '<code\\b[^>]*>', '</code>', 'gi');*/

  text = globals.converter._dispatch('hashHTMLSpans.after', text, options, globals);
  return text;
});

/**
 * Unhash HTML spans
 */
showdown.subParser('unhashHTMLSpans', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('unhashHTMLSpans.before', text, options, globals);

  for (var i = 0; i < globals.gHtmlSpans.length; ++i) {
    var repText = globals.gHtmlSpans[i],
        // limiter to prevent infinite loop (assume 10 as limit for recurse)
        limit = 0;

    while (/¨C(\d+)C/.test(repText)) {
      var num = RegExp.$1;
      repText = repText.replace('¨C' + num + 'C', globals.gHtmlSpans[num]);
      if (limit === 10) {
        console.error('maximum nesting of 10 spans reached!!!');
        break;
      }
      ++limit;
    }
    text = text.replace('¨C' + i + 'C', repText);
  }

  text = globals.converter._dispatch('unhashHTMLSpans.after', text, options, globals);
  return text;
});

/**
 * Hash and escape <pre><code> elements that should not be parsed as markdown
 */
showdown.subParser('hashPreCodeTags', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashPreCodeTags.before', text, options, globals);

  var repFunc = function (wholeMatch, match, left, right) {
    // encode html entities
    var codeblock = left + showdown.subParser('encodeCode')(match, options, globals) + right;
    return '\n\n¨G' + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: codeblock}) - 1) + 'G\n\n';
  };

  // Hash <pre><code>
  text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>', '^ {0,3}</code>\\s*</pre>', 'gim');

  text = globals.converter._dispatch('hashPreCodeTags.after', text, options, globals);
  return text;
});

showdown.subParser('headers', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('headers.before', text, options, globals);

  var headerLevelStart = (isNaN(parseInt(options.headerLevelStart))) ? 1 : parseInt(options.headerLevelStart),

      // Set text-style headers:
      //	Header 1
      //	========
      //
      //	Header 2
      //	--------
      //
      setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

  text = text.replace(setextRegexH1, function (wholeMatch, m1) {

    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart,
        hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  text = text.replace(setextRegexH2, function (matchFound, m1) {
    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart + 1,
        hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  // atx-style headers:
  //  # Header 1
  //  ## Header 2
  //  ## Header 2 with closing hashes ##
  //  ...
  //  ###### Header 6
  //
  var atxStyle = (options.requireSpaceBeforeHeadingText) ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;

  text = text.replace(atxStyle, function (wholeMatch, m1, m2) {
    var hText = m2;
    if (options.customizedHeaderId) {
      hText = m2.replace(/\s?\{([^{]+?)}\s*$/, '');
    }

    var span = showdown.subParser('spanGamut')(hText, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m2) + '"',
        hLevel = headerLevelStart - 1 + m1.length,
        header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

    return showdown.subParser('hashBlock')(header, options, globals);
  });

  function headerId (m) {
    var title,
        prefix;

    // It is separate from other options to allow combining prefix and customized
    if (options.customizedHeaderId) {
      var match = m.match(/\{([^{]+?)}\s*$/);
      if (match && match[1]) {
        m = match[1];
      }
    }

    title = m;

    // Prefix id to prevent causing inadvertent pre-existing style matches.
    if (showdown.helper.isString(options.prefixHeaderId)) {
      prefix = options.prefixHeaderId;
    } else if (options.prefixHeaderId === true) {
      prefix = 'section-';
    } else {
      prefix = '';
    }

    if (!options.rawPrefixHeaderId) {
      title = prefix + title;
    }

    if (options.ghCompatibleHeaderId) {
      title = title
        .replace(/ /g, '-')
        // replace previously escaped chars (&, ¨ and $)
        .replace(/&amp;/g, '')
        .replace(/¨T/g, '')
        .replace(/¨D/g, '')
        // replace rest of the chars (&~$ are repeated as they might have been escaped)
        // borrowed from github's redcarpet (some they should produce similar results)
        .replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, '')
        .toLowerCase();
    } else if (options.rawHeaderId) {
      title = title
        .replace(/ /g, '-')
        // replace previously escaped chars (&, ¨ and $)
        .replace(/&amp;/g, '&')
        .replace(/¨T/g, '¨')
        .replace(/¨D/g, '$')
        // replace " and '
        .replace(/["']/g, '-')
        .toLowerCase();
    } else {
      title = title
        .replace(/[^\w]/g, '')
        .toLowerCase();
    }

    if (options.rawPrefixHeaderId) {
      title = prefix + title;
    }

    if (globals.hashLinkCounts[title]) {
      title = title + '-' + (globals.hashLinkCounts[title]++);
    } else {
      globals.hashLinkCounts[title] = 1;
    }
    return title;
  }

  text = globals.converter._dispatch('headers.after', text, options, globals);
  return text;
});

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('horizontalRule', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('horizontalRule.before', text, options, globals);

  var key = showdown.subParser('hashBlock')('<hr />', options, globals);
  text = text.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, key);
  text = text.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, key);
  text = text.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, key);

  text = globals.converter._dispatch('horizontalRule.after', text, options, globals);
  return text;
});

/**
 * Turn Markdown image shortcuts into <img> tags.
 */
showdown.subParser('images', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('images.before', text, options, globals);

  var inlineRegExp      = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,
      crazyRegExp       = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g,
      base64RegExp      = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,
      referenceRegExp   = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g,
      refShortcutRegExp = /!\[([^\[\]]+)]()()()()()/g;

  function writeImageTagBase64 (wholeMatch, altText, linkId, url, width, height, m5, title) {
    url = url.replace(/\s/g, '');
    return writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title);
  }

  function writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title) {

    var gUrls   = globals.gUrls,
        gTitles = globals.gTitles,
        gDims   = globals.gDimensions;

    linkId = linkId.toLowerCase();

    if (!title) {
      title = '';
    }
    // Special case for explicit empty url
    if (wholeMatch.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1) {
      url = '';

    } else if (url === '' || url === null) {
      if (linkId === '' || linkId === null) {
        // lower-case and turn embedded newlines into spaces
        linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(gUrls[linkId])) {
        url = gUrls[linkId];
        if (!showdown.helper.isUndefined(gTitles[linkId])) {
          title = gTitles[linkId];
        }
        if (!showdown.helper.isUndefined(gDims[linkId])) {
          width = gDims[linkId].width;
          height = gDims[linkId].height;
        }
      } else {
        return wholeMatch;
      }
    }

    altText = altText
      .replace(/"/g, '&quot;')
    //altText = showdown.helper.escapeCharacters(altText, '*_', false);
      .replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
    //url = showdown.helper.escapeCharacters(url, '*_', false);
    url = url.replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
    var result = '<img src="' + url + '" alt="' + altText + '"';

    if (title && showdown.helper.isString(title)) {
      title = title
        .replace(/"/g, '&quot;')
      //title = showdown.helper.escapeCharacters(title, '*_', false);
        .replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
      result += ' title="' + title + '"';
    }

    if (width && height) {
      width  = (width === '*') ? 'auto' : width;
      height = (height === '*') ? 'auto' : height;

      result += ' width="' + width + '"';
      result += ' height="' + height + '"';
    }

    result += ' />';

    return result;
  }

  // First, handle reference-style labeled images: ![alt text][id]
  text = text.replace(referenceRegExp, writeImageTag);

  // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")

  // base64 encoded images
  text = text.replace(base64RegExp, writeImageTagBase64);

  // cases with crazy urls like ./image/cat1).png
  text = text.replace(crazyRegExp, writeImageTag);

  // normal cases
  text = text.replace(inlineRegExp, writeImageTag);

  // handle reference-style shortcuts: ![img text]
  text = text.replace(refShortcutRegExp, writeImageTag);

  text = globals.converter._dispatch('images.after', text, options, globals);
  return text;
});

showdown.subParser('italicsAndBold', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('italicsAndBold.before', text, options, globals);

  // it's faster to have 3 separate regexes for each case than have just one
  // because of backtracing, in some cases, it could lead to an exponential effect
  // called "catastrophic backtrace". Ominous!

  function parseInside (txt, left, right) {
    /*
    if (options.simplifiedAutoLink) {
      txt = showdown.subParser('simplifiedAutoLinks')(txt, options, globals);
    }
    */
    return left + txt + right;
  }

  // Parse underscores
  if (options.literalMidWordUnderscores) {
    text = text.replace(/\b___(\S[\s\S]*?)___\b/g, function (wm, txt) {
      return parseInside (txt, '<strong><em>', '</em></strong>');
    });
    text = text.replace(/\b__(\S[\s\S]*?)__\b/g, function (wm, txt) {
      return parseInside (txt, '<strong>', '</strong>');
    });
    text = text.replace(/\b_(\S[\s\S]*?)_\b/g, function (wm, txt) {
      return parseInside (txt, '<em>', '</em>');
    });
  } else {
    text = text.replace(/___(\S[\s\S]*?)___/g, function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong><em>', '</em></strong>') : wm;
    });
    text = text.replace(/__(\S[\s\S]*?)__/g, function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong>', '</strong>') : wm;
    });
    text = text.replace(/_([^\s_][\s\S]*?)_/g, function (wm, m) {
      // !/^_[^_]/.test(m) - test if it doesn't start with __ (since it seems redundant, we removed it)
      return (/\S$/.test(m)) ? parseInside (m, '<em>', '</em>') : wm;
    });
  }

  // Now parse asterisks
  if (options.literalMidWordAsterisks) {
    text = text.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function (wm, lead, txt) {
      return parseInside (txt, lead + '<strong><em>', '</em></strong>');
    });
    text = text.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function (wm, lead, txt) {
      return parseInside (txt, lead + '<strong>', '</strong>');
    });
    text = text.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function (wm, lead, txt) {
      return parseInside (txt, lead + '<em>', '</em>');
    });
  } else {
    text = text.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong><em>', '</em></strong>') : wm;
    });
    text = text.replace(/\*\*(\S[\s\S]*?)\*\*/g, function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong>', '</strong>') : wm;
    });
    text = text.replace(/\*([^\s*][\s\S]*?)\*/g, function (wm, m) {
      // !/^\*[^*]/.test(m) - test if it doesn't start with ** (since it seems redundant, we removed it)
      return (/\S$/.test(m)) ? parseInside (m, '<em>', '</em>') : wm;
    });
  }


  text = globals.converter._dispatch('italicsAndBold.after', text, options, globals);
  return text;
});

/**
 * Form HTML ordered (numbered) and unordered (bulleted) lists.
 */
showdown.subParser('lists', function (text, options, globals) {
  'use strict';

  /**
   * Process the contents of a single ordered or unordered list, splitting it
   * into individual list items.
   * @param {string} listStr
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function processListItems (listStr, trimTrailing) {
    // The $g_list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //    I recommend upgrading to version
    //    8. Oops, now this line is treated
    //    as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".
    globals.gListLevel++;

    // trim trailing blank lines:
    listStr = listStr.replace(/\n{2,}$/, '\n');

    // attacklab: add sentinel to emulate \z
    listStr += '¨0';

    var rgx = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm,
        isParagraphed = (/\n[ \t]*\n(?!¨0)/.test(listStr));

    // Since version 1.5, nesting sublists requires 4 spaces (or 1 tab) indentation,
    // which is a syntax breaking change
    // activating this option reverts to old behavior
    if (options.disableForced4SpacesIndentedSublists) {
      rgx = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm;
    }

    listStr = listStr.replace(rgx, function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
      checked = (checked && checked.trim() !== '');

      var item = showdown.subParser('outdent')(m4, options, globals),
          bulletStyle = '';

      // Support for github tasklists
      if (taskbtn && options.tasklists) {
        bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
        item = item.replace(/^[ \t]*\[(x|X| )?]/m, function () {
          var otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
          if (checked) {
            otp += ' checked';
          }
          otp += '>';
          return otp;
        });
      }

      // ISSUE #312
      // This input: - - - a
      // causes trouble to the parser, since it interprets it as:
      // <ul><li><li><li>a</li></li></li></ul>
      // instead of:
      // <ul><li>- - a</li></ul>
      // So, to prevent it, we will put a marker (¨A)in the beginning of the line
      // Kind of hackish/monkey patching, but seems more effective than overcomplicating the list parser
      item = item.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function (wm2) {
        return '¨A' + wm2;
      });

      // m1 - Leading line or
      // Has a double return (multi paragraph) or
      // Has sublist
      if (m1 || (item.search(/\n{2,}/) > -1)) {
        item = showdown.subParser('githubCodeBlocks')(item, options, globals);
        item = showdown.subParser('blockGamut')(item, options, globals);
      } else {
        // Recursion for sub-lists:
        item = showdown.subParser('lists')(item, options, globals);
        item = item.replace(/\n$/, ''); // chomp(item)
        item = showdown.subParser('hashHTMLBlocks')(item, options, globals);

        // Colapse double linebreaks
        item = item.replace(/\n\n+/g, '\n\n');
        if (isParagraphed) {
          item = showdown.subParser('paragraphs')(item, options, globals);
        } else {
          item = showdown.subParser('spanGamut')(item, options, globals);
        }
      }

      // now we need to remove the marker (¨A)
      item = item.replace('¨A', '');
      // we can finally wrap the line in list item tags
      item =  '<li' + bulletStyle + '>' + item + '</li>\n';

      return item;
    });

    // attacklab: strip sentinel
    listStr = listStr.replace(/¨0/g, '');

    globals.gListLevel--;

    if (trimTrailing) {
      listStr = listStr.replace(/\s+$/, '');
    }

    return listStr;
  }

  function styleStartNumber (list, listType) {
    // check if ol and starts by a number different than 1
    if (listType === 'ol') {
      var res = list.match(/^ *(\d+)\./);
      if (res && res[1] !== '1') {
        return ' start="' + res[1] + '"';
      }
    }
    return '';
  }

  /**
   * Check and parse consecutive lists (better fix for issue #142)
   * @param {string} list
   * @param {string} listType
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function parseConsecutiveLists (list, listType, trimTrailing) {
    // check if we caught 2 or more consecutive lists by mistake
    // we use the counterRgx, meaning if listType is UL we look for OL and vice versa
    var olRgx = (options.disableForced4SpacesIndentedSublists) ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm,
        ulRgx = (options.disableForced4SpacesIndentedSublists) ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm,
        counterRxg = (listType === 'ul') ? olRgx : ulRgx,
        result = '';

    if (list.search(counterRxg) !== -1) {
      (function parseCL (txt) {
        var pos = txt.search(counterRxg),
            style = styleStartNumber(list, listType);
        if (pos !== -1) {
          // slice
          result += '\n\n<' + listType + style + '>\n' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n';

          // invert counterType and listType
          listType = (listType === 'ul') ? 'ol' : 'ul';
          counterRxg = (listType === 'ul') ? olRgx : ulRgx;

          //recurse
          parseCL(txt.slice(pos));
        } else {
          result += '\n\n<' + listType + style + '>\n' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n';
        }
      })(list);
    } else {
      var style = styleStartNumber(list, listType);
      result = '\n\n<' + listType + style + '>\n' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n';
    }

    return result;
  }

  /** Start of list parsing **/
  text = globals.converter._dispatch('lists.before', text, options, globals);
  // add sentinel to hack around khtml/safari bug:
  // http://bugs.webkit.org/show_bug.cgi?id=11231
  text += '¨0';

  if (globals.gListLevel) {
    text = text.replace(/^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
      function (wholeMatch, list, m2) {
        var listType = (m2.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
        return parseConsecutiveLists(list, listType, true);
      }
    );
  } else {
    text = text.replace(/(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
      function (wholeMatch, m1, list, m3) {
        var listType = (m3.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
        return parseConsecutiveLists(list, listType, false);
      }
    );
  }

  // strip sentinel
  text = text.replace(/¨0/, '');
  text = globals.converter._dispatch('lists.after', text, options, globals);
  return text;
});

/**
 * Parse metadata at the top of the document
 */
showdown.subParser('metadata', function (text, options, globals) {
  'use strict';

  if (!options.metadata) {
    return text;
  }

  text = globals.converter._dispatch('metadata.before', text, options, globals);

  function parseMetadataContents (content) {
    // raw is raw so it's not changed in any way
    globals.metadata.raw = content;

    // escape chars forbidden in html attributes
    // double quotes
    content = content
      // ampersand first
      .replace(/&/g, '&amp;')
      // double quotes
      .replace(/"/g, '&quot;');

    content = content.replace(/\n {4}/g, ' ');
    content.replace(/^([\S ]+): +([\s\S]+?)$/gm, function (wm, key, value) {
      globals.metadata.parsed[key] = value;
      return '';
    });
  }

  text = text.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function (wholematch, format, content) {
    parseMetadataContents(content);
    return '¨M';
  });

  text = text.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function (wholematch, format, content) {
    if (format) {
      globals.metadata.format = format;
    }
    parseMetadataContents(content);
    return '¨M';
  });

  text = text.replace(/¨M/g, '');

  text = globals.converter._dispatch('metadata.after', text, options, globals);
  return text;
});

/**
 * Remove one level of line-leading tabs or spaces
 */
showdown.subParser('outdent', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('outdent.before', text, options, globals);

  // attacklab: hack around Konqueror 3.5.4 bug:
  // "----------bug".replace(/^-/g,"") == "bug"
  text = text.replace(/^(\t|[ ]{1,4})/gm, '¨0'); // attacklab: g_tab_width

  // attacklab: clean up hack
  text = text.replace(/¨0/g, '');

  text = globals.converter._dispatch('outdent.after', text, options, globals);
  return text;
});

/**
 *
 */
showdown.subParser('paragraphs', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('paragraphs.before', text, options, globals);
  // Strip leading and trailing lines:
  text = text.replace(/^\n+/g, '');
  text = text.replace(/\n+$/g, '');

  var grafs = text.split(/\n{2,}/g),
      grafsOut = [],
      end = grafs.length; // Wrap <p> tags

  for (var i = 0; i < end; i++) {
    var str = grafs[i];
    // if this is an HTML marker, copy it
    if (str.search(/¨(K|G)(\d+)\1/g) >= 0) {
      grafsOut.push(str);

    // test for presence of characters to prevent empty lines being parsed
    // as paragraphs (resulting in undesired extra empty paragraphs)
    } else if (str.search(/\S/) >= 0) {
      str = showdown.subParser('spanGamut')(str, options, globals);
      str = str.replace(/^([ \t]*)/g, '<p>');
      str += '</p>';
      grafsOut.push(str);
    }
  }

  /** Unhashify HTML blocks */
  end = grafsOut.length;
  for (i = 0; i < end; i++) {
    var blockText = '',
        grafsOutIt = grafsOut[i],
        codeFlag = false;
    // if this is a marker for an html block...
    // use RegExp.test instead of string.search because of QML bug
    while (/¨(K|G)(\d+)\1/.test(grafsOutIt)) {
      var delim = RegExp.$1,
          num   = RegExp.$2;

      if (delim === 'K') {
        blockText = globals.gHtmlBlocks[num];
      } else {
        // we need to check if ghBlock is a false positive
        if (codeFlag) {
          // use encoded version of all text
          blockText = showdown.subParser('encodeCode')(globals.ghCodeBlocks[num].text, options, globals);
        } else {
          blockText = globals.ghCodeBlocks[num].codeblock;
        }
      }
      blockText = blockText.replace(/\$/g, '$$$$'); // Escape any dollar signs

      grafsOutIt = grafsOutIt.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, blockText);
      // Check if grafsOutIt is a pre->code
      if (/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(grafsOutIt)) {
        codeFlag = true;
      }
    }
    grafsOut[i] = grafsOutIt;
  }
  text = grafsOut.join('\n');
  // Strip leading and trailing lines:
  text = text.replace(/^\n+/g, '');
  text = text.replace(/\n+$/g, '');
  return globals.converter._dispatch('paragraphs.after', text, options, globals);
});

/**
 * Run extension
 */
showdown.subParser('runExtension', function (ext, text, options, globals) {
  'use strict';

  if (ext.filter) {
    text = ext.filter(text, globals.converter, options);

  } else if (ext.regex) {
    // TODO remove this when old extension loading mechanism is deprecated
    var re = ext.regex;
    if (!(re instanceof RegExp)) {
      re = new RegExp(re, 'g');
    }
    text = text.replace(re, ext.replace);
  }

  return text;
});

/**
 * These are all the transformations that occur *within* block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('spanGamut', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('spanGamut.before', text, options, globals);
  text = showdown.subParser('codeSpans')(text, options, globals);
  text = showdown.subParser('escapeSpecialCharsWithinTagAttributes')(text, options, globals);
  text = showdown.subParser('encodeBackslashEscapes')(text, options, globals);

  // Process anchor and image tags. Images must come first,
  // because ![foo][f] looks like an anchor.
  text = showdown.subParser('images')(text, options, globals);
  text = showdown.subParser('anchors')(text, options, globals);

  // Make links out of things like `<http://example.com/>`
  // Must come after anchors, because you can use < and >
  // delimiters in inline links like [this](<url>).
  text = showdown.subParser('autoLinks')(text, options, globals);
  text = showdown.subParser('simplifiedAutoLinks')(text, options, globals);
  text = showdown.subParser('emoji')(text, options, globals);
  text = showdown.subParser('underline')(text, options, globals);
  text = showdown.subParser('italicsAndBold')(text, options, globals);
  text = showdown.subParser('strikethrough')(text, options, globals);
  text = showdown.subParser('ellipsis')(text, options, globals);

  // we need to hash HTML tags inside spans
  text = showdown.subParser('hashHTMLSpans')(text, options, globals);

  // now we encode amps and angles
  text = showdown.subParser('encodeAmpsAndAngles')(text, options, globals);

  // Do hard breaks
  if (options.simpleLineBreaks) {
    // GFM style hard breaks
    // only add line breaks if the text does not contain a block (special case for lists)
    if (!/\n\n¨K/.test(text)) {
      text = text.replace(/\n+/g, '<br />\n');
    }
  } else {
    // Vanilla hard breaks
    text = text.replace(/  +\n/g, '<br />\n');
  }

  text = globals.converter._dispatch('spanGamut.after', text, options, globals);
  return text;
});

showdown.subParser('strikethrough', function (text, options, globals) {
  'use strict';

  function parseInside (txt) {
    if (options.simplifiedAutoLink) {
      txt = showdown.subParser('simplifiedAutoLinks')(txt, options, globals);
    }
    return '<del>' + txt + '</del>';
  }

  if (options.strikethrough) {
    text = globals.converter._dispatch('strikethrough.before', text, options, globals);
    text = text.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function (wm, txt) { return parseInside(txt); });
    text = globals.converter._dispatch('strikethrough.after', text, options, globals);
  }

  return text;
});

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 * Link defs are in the form: ^[id]: url "optional title"
 */
showdown.subParser('stripLinkDefinitions', function (text, options, globals) {
  'use strict';

  var regex       = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm,
      base64Regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;

  // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '¨0';

  var replaceFunc = function (wholeMatch, linkId, url, width, height, blankLines, title) {
    linkId = linkId.toLowerCase();
    if (url.match(/^data:.+?\/.+?;base64,/)) {
      // remove newlines
      globals.gUrls[linkId] = url.replace(/\s/g, '');
    } else {
      globals.gUrls[linkId] = showdown.subParser('encodeAmpsAndAngles')(url, options, globals);  // Link IDs are case-insensitive
    }

    if (blankLines) {
      // Oops, found blank lines, so it's not a title.
      // Put back the parenthetical statement we stole.
      return blankLines + title;

    } else {
      if (title) {
        globals.gTitles[linkId] = title.replace(/"|'/g, '&quot;');
      }
      if (options.parseImgDimensions && width && height) {
        globals.gDimensions[linkId] = {
          width:  width,
          height: height
        };
      }
    }
    // Completely remove the definition from the text
    return '';
  };

  // first we try to find base64 link references
  text = text.replace(base64Regex, replaceFunc);

  text = text.replace(regex, replaceFunc);

  // attacklab: strip sentinel
  text = text.replace(/¨0/, '');

  return text;
});

showdown.subParser('tables', function (text, options, globals) {
  'use strict';

  if (!options.tables) {
    return text;
  }

  var tableRgx       = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm,
      //singeColTblRgx = /^ {0,3}\|.+\|\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n(?: {0,3}\|.+\|\n)+(?:\n\n|¨0)/gm;
      singeColTblRgx = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;

  function parseStyles (sLine) {
    if (/^:[ \t]*--*$/.test(sLine)) {
      return ' style="text-align:left;"';
    } else if (/^--*[ \t]*:[ \t]*$/.test(sLine)) {
      return ' style="text-align:right;"';
    } else if (/^:[ \t]*--*[ \t]*:$/.test(sLine)) {
      return ' style="text-align:center;"';
    } else {
      return '';
    }
  }

  function parseHeaders (header, style) {
    var id = '';
    header = header.trim();
    // support both tablesHeaderId and tableHeaderId due to error in documentation so we don't break backwards compatibility
    if (options.tablesHeaderId || options.tableHeaderId) {
      id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
    }
    header = showdown.subParser('spanGamut')(header, options, globals);

    return '<th' + id + style + '>' + header + '</th>\n';
  }

  function parseCells (cell, style) {
    var subText = showdown.subParser('spanGamut')(cell, options, globals);
    return '<td' + style + '>' + subText + '</td>\n';
  }

  function buildTable (headers, cells) {
    var tb = '<table>\n<thead>\n<tr>\n',
        tblLgn = headers.length;

    for (var i = 0; i < tblLgn; ++i) {
      tb += headers[i];
    }
    tb += '</tr>\n</thead>\n<tbody>\n';

    for (i = 0; i < cells.length; ++i) {
      tb += '<tr>\n';
      for (var ii = 0; ii < tblLgn; ++ii) {
        tb += cells[i][ii];
      }
      tb += '</tr>\n';
    }
    tb += '</tbody>\n</table>\n';
    return tb;
  }

  function parseTable (rawTable) {
    var i, tableLines = rawTable.split('\n');

    for (i = 0; i < tableLines.length; ++i) {
      // strip wrong first and last column if wrapped tables are used
      if (/^ {0,3}\|/.test(tableLines[i])) {
        tableLines[i] = tableLines[i].replace(/^ {0,3}\|/, '');
      }
      if (/\|[ \t]*$/.test(tableLines[i])) {
        tableLines[i] = tableLines[i].replace(/\|[ \t]*$/, '');
      }
      // parse code spans first, but we only support one line code spans
      tableLines[i] = showdown.subParser('codeSpans')(tableLines[i], options, globals);
    }

    var rawHeaders = tableLines[0].split('|').map(function (s) { return s.trim();}),
        rawStyles = tableLines[1].split('|').map(function (s) { return s.trim();}),
        rawCells = [],
        headers = [],
        styles = [],
        cells = [];

    tableLines.shift();
    tableLines.shift();

    for (i = 0; i < tableLines.length; ++i) {
      if (tableLines[i].trim() === '') {
        continue;
      }
      rawCells.push(
        tableLines[i]
          .split('|')
          .map(function (s) {
            return s.trim();
          })
      );
    }

    if (rawHeaders.length < rawStyles.length) {
      return rawTable;
    }

    for (i = 0; i < rawStyles.length; ++i) {
      styles.push(parseStyles(rawStyles[i]));
    }

    for (i = 0; i < rawHeaders.length; ++i) {
      if (showdown.helper.isUndefined(styles[i])) {
        styles[i] = '';
      }
      headers.push(parseHeaders(rawHeaders[i], styles[i]));
    }

    for (i = 0; i < rawCells.length; ++i) {
      var row = [];
      for (var ii = 0; ii < headers.length; ++ii) {
        if (showdown.helper.isUndefined(rawCells[i][ii])) {

        }
        row.push(parseCells(rawCells[i][ii], styles[ii]));
      }
      cells.push(row);
    }

    return buildTable(headers, cells);
  }

  text = globals.converter._dispatch('tables.before', text, options, globals);

  // find escaped pipe characters
  text = text.replace(/\\(\|)/g, showdown.helper.escapeCharactersCallback);

  // parse multi column tables
  text = text.replace(tableRgx, parseTable);

  // parse one column tables
  text = text.replace(singeColTblRgx, parseTable);

  text = globals.converter._dispatch('tables.after', text, options, globals);

  return text;
});

showdown.subParser('underline', function (text, options, globals) {
  'use strict';

  if (!options.underline) {
    return text;
  }

  text = globals.converter._dispatch('underline.before', text, options, globals);

  if (options.literalMidWordUnderscores) {
    text = text.replace(/\b___(\S[\s\S]*?)___\b/g, function (wm, txt) {
      return '<u>' + txt + '</u>';
    });
    text = text.replace(/\b__(\S[\s\S]*?)__\b/g, function (wm, txt) {
      return '<u>' + txt + '</u>';
    });
  } else {
    text = text.replace(/___(\S[\s\S]*?)___/g, function (wm, m) {
      return (/\S$/.test(m)) ? '<u>' + m + '</u>' : wm;
    });
    text = text.replace(/__(\S[\s\S]*?)__/g, function (wm, m) {
      return (/\S$/.test(m)) ? '<u>' + m + '</u>' : wm;
    });
  }

  // escape remaining underscores to prevent them being parsed by italic and bold
  text = text.replace(/(_)/g, showdown.helper.escapeCharactersCallback);

  text = globals.converter._dispatch('underline.after', text, options, globals);

  return text;
});

/**
 * Swap back in all the special characters we've hidden.
 */
showdown.subParser('unescapeSpecialChars', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('unescapeSpecialChars.before', text, options, globals);

  text = text.replace(/¨E(\d+)E/g, function (wholeMatch, m1) {
    var charCodeToReplace = parseInt(m1);
    return String.fromCharCode(charCodeToReplace);
  });

  text = globals.converter._dispatch('unescapeSpecialChars.after', text, options, globals);
  return text;
});

showdown.subParser('makeMarkdown.blockquote', function (node, globals) {
  'use strict';

  var txt = '';
  if (node.hasChildNodes()) {
    var children = node.childNodes,
        childrenLength = children.length;

    for (var i = 0; i < childrenLength; ++i) {
      var innerTxt = showdown.subParser('makeMarkdown.node')(children[i], globals);

      if (innerTxt === '') {
        continue;
      }
      txt += innerTxt;
    }
  }
  // cleanup
  txt = txt.trim();
  txt = '> ' + txt.split('\n').join('\n> ');
  return txt;
});

showdown.subParser('makeMarkdown.codeBlock', function (node, globals) {
  'use strict';

  var lang = node.getAttribute('language'),
      num  = node.getAttribute('precodenum');
  return '```' + lang + '\n' + globals.preList[num] + '\n```';
});

showdown.subParser('makeMarkdown.codeSpan', function (node) {
  'use strict';

  return '`' + node.innerHTML + '`';
});

showdown.subParser('makeMarkdown.emphasis', function (node, globals) {
  'use strict';

  var txt = '';
  if (node.hasChildNodes()) {
    txt += '*';
    var children = node.childNodes,
        childrenLength = children.length;
    for (var i = 0; i < childrenLength; ++i) {
      txt += showdown.subParser('makeMarkdown.node')(children[i], globals);
    }
    txt += '*';
  }
  return txt;
});

showdown.subParser('makeMarkdown.header', function (node, globals, headerLevel) {
  'use strict';

  var headerMark = new Array(headerLevel + 1).join('#'),
      txt = '';

  if (node.hasChildNodes()) {
    txt = headerMark + ' ';
    var children = node.childNodes,
        childrenLength = children.length;

    for (var i = 0; i < childrenLength; ++i) {
      txt += showdown.subParser('makeMarkdown.node')(children[i], globals);
    }
  }
  return txt;
});

showdown.subParser('makeMarkdown.hr', function () {
  'use strict';

  return '---';
});

showdown.subParser('makeMarkdown.image', function (node) {
  'use strict';

  var txt = '';
  if (node.hasAttribute('src')) {
    txt += '![' + node.getAttribute('alt') + '](';
    txt += '<' + node.getAttribute('src') + '>';
    if (node.hasAttribute('width') && node.hasAttribute('height')) {
      txt += ' =' + node.getAttribute('width') + 'x' + node.getAttribute('height');
    }

    if (node.hasAttribute('title')) {
      txt += ' "' + node.getAttribute('title') + '"';
    }
    txt += ')';
  }
  return txt;
});

showdown.subParser('makeMarkdown.links', function (node, globals) {
  'use strict';

  var txt = '';
  if (node.hasChildNodes() && node.hasAttribute('href')) {
    var children = node.childNodes,
        childrenLength = children.length;
    txt = '[';
    for (var i = 0; i < childrenLength; ++i) {
      txt += showdown.subParser('makeMarkdown.node')(children[i], globals);
    }
    txt += '](';
    txt += '<' + node.getAttribute('href') + '>';
    if (node.hasAttribute('title')) {
      txt += ' "' + node.getAttribute('title') + '"';
    }
    txt += ')';
  }
  return txt;
});

showdown.subParser('makeMarkdown.list', function (node, globals, type) {
  'use strict';

  var txt = '';
  if (!node.hasChildNodes()) {
    return '';
  }
  var listItems       = node.childNodes,
      listItemsLenght = listItems.length,
      listNum = node.getAttribute('start') || 1;

  for (var i = 0; i < listItemsLenght; ++i) {
    if (typeof listItems[i].tagName === 'undefined' || listItems[i].tagName.toLowerCase() !== 'li') {
      continue;
    }

    // define the bullet to use in list
    var bullet = '';
    if (type === 'ol') {
      bullet = listNum.toString() + '. ';
    } else {
      bullet = '- ';
    }

    // parse list item
    txt += bullet + showdown.subParser('makeMarkdown.listItem')(listItems[i], globals);
    ++listNum;
  }

  // add comment at the end to prevent consecutive lists to be parsed as one
  txt += '\n<!-- -->\n';
  return txt.trim();
});

showdown.subParser('makeMarkdown.listItem', function (node, globals) {
  'use strict';

  var listItemTxt = '';

  var children = node.childNodes,
      childrenLenght = children.length;

  for (var i = 0; i < childrenLenght; ++i) {
    listItemTxt += showdown.subParser('makeMarkdown.node')(children[i], globals);
  }
  // if it's only one liner, we need to add a newline at the end
  if (!/\n$/.test(listItemTxt)) {
    listItemTxt += '\n';
  } else {
    // it's multiparagraph, so we need to indent
    listItemTxt = listItemTxt
      .split('\n')
      .join('\n    ')
      .replace(/^ {4}$/gm, '')
      .replace(/\n\n+/g, '\n\n');
  }

  return listItemTxt;
});



showdown.subParser('makeMarkdown.node', function (node, globals, spansOnly) {
  'use strict';

  spansOnly = spansOnly || false;

  var txt = '';

  // edge case of text without wrapper paragraph
  if (node.nodeType === 3) {
    return showdown.subParser('makeMarkdown.txt')(node, globals);
  }

  // HTML comment
  if (node.nodeType === 8) {
    return '<!--' + node.data + '-->\n\n';
  }

  // process only node elements
  if (node.nodeType !== 1) {
    return '';
  }

  var tagName = node.tagName.toLowerCase();

  switch (tagName) {

    //
    // BLOCKS
    //
    case 'h1':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 1) + '\n\n'; }
      break;
    case 'h2':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 2) + '\n\n'; }
      break;
    case 'h3':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 3) + '\n\n'; }
      break;
    case 'h4':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 4) + '\n\n'; }
      break;
    case 'h5':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 5) + '\n\n'; }
      break;
    case 'h6':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.header')(node, globals, 6) + '\n\n'; }
      break;

    case 'p':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.paragraph')(node, globals) + '\n\n'; }
      break;

    case 'blockquote':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.blockquote')(node, globals) + '\n\n'; }
      break;

    case 'hr':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.hr')(node, globals) + '\n\n'; }
      break;

    case 'ol':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.list')(node, globals, 'ol') + '\n\n'; }
      break;

    case 'ul':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.list')(node, globals, 'ul') + '\n\n'; }
      break;

    case 'precode':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.codeBlock')(node, globals) + '\n\n'; }
      break;

    case 'pre':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.pre')(node, globals) + '\n\n'; }
      break;

    case 'table':
      if (!spansOnly) { txt = showdown.subParser('makeMarkdown.table')(node, globals) + '\n\n'; }
      break;

    //
    // SPANS
    //
    case 'code':
      txt = showdown.subParser('makeMarkdown.codeSpan')(node, globals);
      break;

    case 'em':
    case 'i':
      txt = showdown.subParser('makeMarkdown.emphasis')(node, globals);
      break;

    case 'strong':
    case 'b':
      txt = showdown.subParser('makeMarkdown.strong')(node, globals);
      break;

    case 'del':
      txt = showdown.subParser('makeMarkdown.strikethrough')(node, globals);
      break;

    case 'a':
      txt = showdown.subParser('makeMarkdown.links')(node, globals);
      break;

    case 'img':
      txt = showdown.subParser('makeMarkdown.image')(node, globals);
      break;

    default:
      txt = node.outerHTML + '\n\n';
  }

  // common normalization
  // TODO eventually

  return txt;
});

showdown.subParser('makeMarkdown.paragraph', function (node, globals) {
  'use strict';

  var txt = '';
  if (node.hasChildNodes()) {
    var children = node.childNodes,
        childrenLength = children.length;
    for (var i = 0; i < childrenLength; ++i) {
      txt += showdown.subParser('makeMarkdown.node')(children[i], globals);
    }
  }

  // some text normalization
  txt = txt.trim();

  return txt;
});

showdown.subParser('makeMarkdown.pre', function (node, globals) {
  'use strict';

  var num  = node.getAttribute('prenum');
  return '<pre>' + globals.preList[num] + '</pre>';
});

showdown.subParser('makeMarkdown.strikethrough', function (node, globals) {
  'use strict';

  var txt = '';
  if (node.hasChildNodes()) {
    txt += '~~';
    var children = node.childNodes,
        childrenLength = children.length;
    for (var i = 0; i < childrenLength; ++i) {
      txt += showdown.subParser('makeMarkdown.node')(children[i], globals);
    }
    txt += '~~';
  }
  return txt;
});

showdown.subParser('makeMarkdown.strong', function (node, globals) {
  'use strict';

  var txt = '';
  if (node.hasChildNodes()) {
    txt += '**';
    var children = node.childNodes,
        childrenLength = children.length;
    for (var i = 0; i < childrenLength; ++i) {
      txt += showdown.subParser('makeMarkdown.node')(children[i], globals);
    }
    txt += '**';
  }
  return txt;
});

showdown.subParser('makeMarkdown.table', function (node, globals) {
  'use strict';

  var txt = '',
      tableArray = [[], []],
      headings   = node.querySelectorAll('thead>tr>th'),
      rows       = node.querySelectorAll('tbody>tr'),
      i, ii;
  for (i = 0; i < headings.length; ++i) {
    var headContent = showdown.subParser('makeMarkdown.tableCell')(headings[i], globals),
        allign = '---';

    if (headings[i].hasAttribute('style')) {
      var style = headings[i].getAttribute('style').toLowerCase().replace(/\s/g, '');
      switch (style) {
        case 'text-align:left;':
          allign = ':---';
          break;
        case 'text-align:right;':
          allign = '---:';
          break;
        case 'text-align:center;':
          allign = ':---:';
          break;
      }
    }
    tableArray[0][i] = headContent.trim();
    tableArray[1][i] = allign;
  }

  for (i = 0; i < rows.length; ++i) {
    var r = tableArray.push([]) - 1,
        cols = rows[i].getElementsByTagName('td');

    for (ii = 0; ii < headings.length; ++ii) {
      var cellContent = ' ';
      if (typeof cols[ii] !== 'undefined') {
        cellContent = showdown.subParser('makeMarkdown.tableCell')(cols[ii], globals);
      }
      tableArray[r].push(cellContent);
    }
  }

  var cellSpacesCount = 3;
  for (i = 0; i < tableArray.length; ++i) {
    for (ii = 0; ii < tableArray[i].length; ++ii) {
      var strLen = tableArray[i][ii].length;
      if (strLen > cellSpacesCount) {
        cellSpacesCount = strLen;
      }
    }
  }

  for (i = 0; i < tableArray.length; ++i) {
    for (ii = 0; ii < tableArray[i].length; ++ii) {
      if (i === 1) {
        if (tableArray[i][ii].slice(-1) === ':') {
          tableArray[i][ii] = showdown.helper.padEnd(tableArray[i][ii].slice(-1), cellSpacesCount - 1, '-') + ':';
        } else {
          tableArray[i][ii] = showdown.helper.padEnd(tableArray[i][ii], cellSpacesCount, '-');
        }
      } else {
        tableArray[i][ii] = showdown.helper.padEnd(tableArray[i][ii], cellSpacesCount);
      }
    }
    txt += '| ' + tableArray[i].join(' | ') + ' |\n';
  }

  return txt.trim();
});

showdown.subParser('makeMarkdown.tableCell', function (node, globals) {
  'use strict';

  var txt = '';
  if (!node.hasChildNodes()) {
    return '';
  }
  var children = node.childNodes,
      childrenLength = children.length;

  for (var i = 0; i < childrenLength; ++i) {
    txt += showdown.subParser('makeMarkdown.node')(children[i], globals, true);
  }
  return txt.trim();
});

showdown.subParser('makeMarkdown.txt', function (node) {
  'use strict';

  var txt = node.nodeValue;

  // multiple spaces are collapsed
  txt = txt.replace(/ +/g, ' ');

  // replace the custom ¨NBSP; with a space
  txt = txt.replace(/¨NBSP;/g, ' ');

  // ", <, > and & should replace escaped html entities
  txt = showdown.helper.unescapeHTMLEntities(txt);

  // escape markdown magic characters
  // emphasis, strong and strikethrough - can appear everywhere
  // we also escape pipe (|) because of tables
  // and escape ` because of code blocks and spans
  txt = txt.replace(/([*_~|`])/g, '\\$1');

  // escape > because of blockquotes
  txt = txt.replace(/^(\s*)>/g, '\\$1>');

  // hash character, only troublesome at the beginning of a line because of headers
  txt = txt.replace(/^#/gm, '\\#');

  // horizontal rules
  txt = txt.replace(/^(\s*)([-=]{3,})(\s*)$/, '$1\\$2$3');

  // dot, because of ordered lists, only troublesome at the beginning of a line when preceded by an integer
  txt = txt.replace(/^( {0,3}\d+)\./gm, '$1\\.');

  // +, * and -, at the beginning of a line becomes a list, so we need to escape them also (asterisk was already escaped)
  txt = txt.replace(/^( {0,3})([+-])/gm, '$1\\$2');

  // images and links, ] followed by ( is problematic, so we escape it
  txt = txt.replace(/]([\s]*)\(/g, '\\]$1\\(');

  // reference URIs must also be escaped
  txt = txt.replace(/^ {0,3}\[([\S \t]*?)]:/gm, '\\[$1]:');

  return txt;
});

var root = this;

// AMD Loader
if (typeof define === 'function' && define.amd) {
  define(function () {
    'use strict';
    return showdown;
  });

// CommonJS/nodeJS Loader
} else if ( true && module.exports) {
  module.exports = showdown;

// Regular Browser loader
} else {
  root.showdown = showdown;
}
}).call(this);

//# sourceMappingURL=showdown.js.map


/***/ }),

/***/ 4351:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 8207:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
const markdown_1 = __nccwpck_require__(1033);
const htmlparser2_1 = __nccwpck_require__(2928);
const utils_1 = __nccwpck_require__(6252);
(0, utils_1.createEdtrIoMigration)({
    exports,
    migrateState: (0, utils_1.replacePlugins)({
        table({ plugin }) {
            if (typeof plugin.state !== 'string') {
                throw new Error('plugin state is not a string');
            }
            const html = markdown_1.converter.makeHtml(plugin.state);
            return convertTable(html);
        },
    }),
});
function convertTable(html) {
    const dom = (0, htmlparser2_1.parseDocument)(html);
    const table = dom[0].children.filter((child) => child.type === 'tag')[0];
    if (!table || table.name !== 'table') {
        throw new Error('table is not defined');
    }
    const tHeadAndTBody = table.children.filter((child) => child.type === 'tag');
    if (tHeadAndTBody.length !== 2) {
        throw new Error('table has empty length');
    }
    const rows = [
        ...tHeadAndTBody[0].children,
        ...tHeadAndTBody[1].children,
    ].filter((child) => child.type === 'tag');
    const convertedRows = rows.map((row) => {
        const columns = row.children
            .filter((col) => col.type === 'tag')
            .map((col) => {
            return {
                content: {
                    plugin: 'text',
                    state: convertCellContent(col),
                },
            };
        });
        return {
            columns,
        };
    });
    return {
        plugin: 'serloTable',
        state: {
            tableType: 'OnlyColumnHeader',
            rows: convertedRows,
        },
    };
}
function convertCellContent(cell) {
    if (cell.children.length === 0)
        return [];
    if (cell.children.length > 1 || cell.children[0].name !== 'p') {
        throw 'unknown state';
    }
    const contentNodes = cell.children[0].children;
    const converted = contentNodes.map(convertContentNode);
    // console.log([{ type: 'p', children: [converted] }])
    return [{ plugin: 'text', state: [{ type: 'p', children: converted }] }];
}
function convertContentNode(node) {
    //handle code? 0: {text: "Test", code: true}
    var _a, _b, _c, _d, _e;
    if (node.type === 'text')
        return { text: (_a = node.data) !== null && _a !== void 0 ? _a : '' };
    if (node.type === 'tag') {
        // console.log(node.name)
        if (node.name === 'br') {
            return { text: ' ' };
        }
        if (node.name === 'strong') {
            return { text: (_b = node.children[0].data) !== null && _b !== void 0 ? _b : '', strong: true };
        }
        if (node.name === 'em') {
            return { text: (_c = node.children[0].data) !== null && _c !== void 0 ? _c : '', em: true };
        }
        if (node.name === 'span' && node.attribs.class === 'mathInline') {
            if (node.children.length !== 1) {
                console.log('mathInline: unexpected state, skipping');
                return { text: '' };
            }
            const mathContent = (_e = (_d = node.children[0].children[0].data) === null || _d === void 0 ? void 0 : _d.replace(/%%/, '')) !== null && _e !== void 0 ? _e : '';
            // not working as expected?!
            return {
                type: 'math',
                src: mathContent,
                inline: true,
                children: [{ text: mathContent }], //???
            };
        }
        console.log('unsupported tag');
        console.log(node.name);
        console.log(node);
        return [];
    }
    console.log('unsupported type');
    console.log(node.type);
    console.log(node);
    return { text: 'test' };
}


/***/ }),

/***/ 3771:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearDeadUuids = void 0;
const tslib_1 = __nccwpck_require__(4351);
function clearDeadUuids(db) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'taxonomyTerm'
      AND (SELECT count(*) FROM term_taxonomy WHERE term_taxonomy.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'user'
      AND (SELECT count(*) FROM user WHERE user.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'attachment'
      AND (SELECT count(*) FROM attachment_container WHERE attachment_container.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'entity'
      AND (SELECT count(*) FROM entity WHERE entity.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'entityRevision'
      AND (SELECT count(*) FROM entity_revision WHERE entity_revision.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'page'
      AND (SELECT count(*) FROM page_repository WHERE page_repository.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'pageRevision'
      AND (SELECT count(*) FROM page_revision WHERE page_revision.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'comment'
      AND (SELECT count(*) FROM comment WHERE comment.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM event_log WHERE EXISTS (
      SELECT ep.id FROM event_parameter ep
        WHERE ep.log_id = event_log.id
        AND NOT EXISTS (SELECT id FROM event_parameter_string eps WHERE eps.event_parameter_id = ep.id)
        AND NOT EXISTS (SELECT id FROM event_parameter_uuid epu WHERE epu.event_parameter_id = ep.id)
    )
  `);
    });
}
exports.clearDeadUuids = clearDeadUuids;


/***/ }),

/***/ 1066:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createEdtrIoMigration = exports.createMigration = void 0;
const tslib_1 = __nccwpck_require__(4351);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
const edtr_io_1 = __nccwpck_require__(899);
const database_1 = __nccwpck_require__(1879);
function createMigration(exports, { up, down, }) {
    exports._meta = {
        version: 1,
    };
    exports.up = (db, cb) => {
        up((0, database_1.createDatabase)(db))
            .then(() => {
            cb(undefined);
        })
            .catch((error) => {
            cb(error);
        });
    };
    exports.down = (db, cb) => {
        if (typeof down === 'function') {
            down((0, database_1.createDatabase)(db))
                .then(() => {
                cb();
            })
                .catch((error) => {
                cb(error);
            });
        }
        else {
            cb();
        }
    };
}
exports.createMigration = createMigration;
function createEdtrIoMigration({ exports, migrateState, }) {
    createMigration(exports, {
        up: (db) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield changeAllRevisions({
                revisions: yield db.runSql(`
        SELECT erf.id, erf.value as content, erf.entity_revision_id as revisionId
        FROM entity_revision_field erf
        WHERE erf.field = 'content'
      `),
                migrateState,
                updateRevision(newContent, revision) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        yield db.runSql(`UPDATE entity_revision_field SET value = ? WHERE id = ?`, newContent, revision.id);
                    });
                },
            });
            yield changeAllRevisions({
                revisions: yield db.runSql(`
        SELECT
          page_revision.id, page_revision.content, page_revision.id as revisionId
        FROM page_revision
      `),
                migrateState,
                updateRevision(newContent, revision) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        yield db.runSql(`UPDATE page_revision SET content = ? WHERE id = ?`, newContent, revision.id);
                    });
                },
            });
        }),
    });
}
exports.createEdtrIoMigration = createEdtrIoMigration;
function changeAllRevisions({ revisions, updateRevision, migrateState, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (const revision of revisions) {
            let oldState;
            try {
                oldState = JSON.parse(revision.content);
            }
            catch (e) {
                // Ignore (some articles have raw text)
            }
            if (!(0, edtr_io_1.isPlugin)(oldState)) {
                // state of legacy markdown editor
                continue;
            }
            const newState = JSON.stringify(migrateState(oldState));
            if (newState !== revision.content) {
                yield updateRevision(newState, revision);
                console.log('Updated revision', revision.revisionId);
            }
        }
    });
}


/***/ }),

/***/ 1879:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDatabase = void 0;
const tslib_1 = __nccwpck_require__(4351);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
function createDatabase(db) {
    return {
        runSql: (query, ...params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.runSql(query, ...params, (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });
        }),
        dropTable: (table) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.dropTable(table, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        }),
    };
}
exports.createDatabase = createDatabase;


/***/ }),

/***/ 899:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPlugin = exports.replacePluginState = exports.replacePlugins = void 0;
const tslib_1 = __nccwpck_require__(4351);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
const R = tslib_1.__importStar(__nccwpck_require__(4119));
function replacePlugins(transformations) {
    return updatePlugins((plugin, applyChangeToChildren) => {
        const transformFunc = transformations[plugin.plugin];
        if (typeof transformFunc === 'function') {
            return transformFunc({ plugin, applyChangeToChildren });
        }
    });
}
exports.replacePlugins = replacePlugins;
function replacePluginState(transformations) {
    return updatePlugins(({ plugin, state }, applyChangeToChildren) => {
        const transformFunc = transformations[plugin];
        if (typeof transformFunc === 'function') {
            return { plugin, state: transformFunc({ state, applyChangeToChildren }) };
        }
    });
}
exports.replacePluginState = replacePluginState;
function updatePlugins(updatePlugin) {
    function applyChangeToChildren(value) {
        if (isPlugin(value)) {
            const newPlugin = updatePlugin(value, applyChangeToChildren);
            if (newPlugin)
                return newPlugin;
        }
        if (Array.isArray(value)) {
            return value.map(applyChangeToChildren);
        }
        if (typeof value === 'object' && value !== null) {
            return R.mapObjIndexed(applyChangeToChildren, value);
        }
        return value;
    }
    return applyChangeToChildren;
}
function isPlugin(value) {
    return (R.has('plugin', value) &&
        R.has('state', value) &&
        typeof value.plugin === 'string');
}
exports.isPlugin = isPlugin;


/***/ }),

/***/ 6252:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
tslib_1.__exportStar(__nccwpck_require__(3771), exports);
tslib_1.__exportStar(__nccwpck_require__(1066), exports);
tslib_1.__exportStar(__nccwpck_require__(1879), exports);
tslib_1.__exportStar(__nccwpck_require__(899), exports);


/***/ }),

/***/ 3600:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}');

/***/ }),

/***/ 9323:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');

/***/ }),

/***/ 9591:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}');

/***/ }),

/***/ 2586:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(8207);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;