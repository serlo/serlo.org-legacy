/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
/* eslint-disable */
CodeMirror.defineMode('sfm', function(cmCfg, modeCfg) {
  var defStartPos = function(stream, state) {
      state.startPos = {
        line: stream.lineNo,
        ch: stream.start
      }
      state.endPos = undefined
    },
    defEndPos = function(stream, state) {
      state.endPos = {
        line: stream.lineNo,
        ch: stream.pos
      }
    }

  return {
    startState: function() {
      return {}
    },

    blankLine: function(state) {
      // state.wasBlank = true;
      state.inEm = false
      state.inStrong = false
      state.inReference = false
      state.inInlineMath = false
      state.endPos = undefined
      state.startPos = undefined
    },

    token: function(stream, state) {
      // START OF LINE
      if (stream.sol()) {
        if (stream.match(/^\s*$/, true)) {
          state.wasBlank = true
        } else {
          state.wasBlank = false
        }
      }

      var peek = stream.peek()

      // MATH
      if (!state.inMath && stream.match(/^\$\$/, true)) {
        state.inMath = true
        defStartPos(stream, state)
      }
      if (state.inMath) {
        if (stream.skipTo('$') && stream.next() === '$') {
          stream.next()
          if (stream.peek() === '$') {
            stream.next()
          }

          state.inMath = false
          defEndPos(stream, state)
        } else {
          stream.next()
        }
        return 'math'
      }

      // INLINE MATH
      if (!state.inInlineMath && stream.match(/\%\%/, true)) {
        state.inInlineMath = true
        defStartPos(stream, state)
      }

      if (state.inInlineMath) {
        if (stream.skipTo('%') && stream.next() === '%') {
          stream.next()
          if (stream.peek() === '%') {
            stream.next()
          }
          state.inInlineMath = false
          defEndPos(stream, state)
        } else {
          stream.skipToEnd()
        }
        return 'inline-math'
      }

      // EM & STRONG
      if (!state.inEm && !state.inStrong && peek === '*') {
        stream.next()
        var anotherPeek = stream.peek()
        if (anotherPeek === '*') {
          state.inStrong = true
          stream.next()
          defStartPos(stream, state)
        } else if (anotherPeek !== ' ') {
          state.inEm = true
          defStartPos(stream, state)
        }
      }

      if (state.inStrong || state.inEm) {
        if (stream.skipTo('*')) {
          stream.next()
          var anotherPeek = stream.peek()
          if (anotherPeek === '*') {
            state.inStrong = false
            stream.next()
          } else {
            state.inEm = false
          }
          defEndPos(stream, state)
        } else {
          stream.skipToEnd()
        }
        return 'string'
      }

      // REFERENCE

      if (
        !state.inReference &&
        stream.match(/(!|>)?\[[^\]]*\] ?(?:\()/, false)
      ) {
        if (peek === '!') {
          state.referenceType = 'image'
        }
        if (peek === '>') {
          state.referenceType = 'injection'
        }
        if (peek === '[') {
          state.referenceType = 'link'
        }
        state.inReference = true
        stream.next()
        defStartPos(stream, state)
      }

      if (state.inReference) {
        if (stream.match(/(\[)?[^\]]*\]\([^\)]*\)/, true)) {
          state.inReference = false
          defEndPos(stream, state)
        } else {
          stream.skipToEnd()
        }
        return state.referenceType
      }

      stream.next()

      return null // Unstyled token
    }
  }
})

CodeMirror.defineMIME('text/x-markdown', 'markdown')
