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
