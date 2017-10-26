import _ from 'underscore'

var initializers = []

function addInitializer (fn) {
  initializers.push(fn)
}

function initializeContextual ($context) {
  _.each(initializers, function (init) {
    init($context)
  })
}

const Content = {
  init: function ($context) {
    initializeContextual($context)
  },
  add: function (fn) {
    addInitializer(fn)
  }
}

export default Content
