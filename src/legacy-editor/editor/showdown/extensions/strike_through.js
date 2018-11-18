/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2018 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
/* global define */
var strikethrough = function() {
  return [
    {
      // strike-through
      // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
      type: 'lang',
      regex: '(~T){2}([^~]+)(~T){2}',
      replace: function(match, prefix, content, suffix) {
        return '<del>' + content + '</del>'
      }
    }
  ]
}

// Client-side export
if (typeof define === 'function' && define.amd) {
  define('showdown_strikethrough', ['showdown'], function(Showdown) {
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

export default strikethrough
