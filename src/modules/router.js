/* global window */
import $ from 'jquery'

var Router

function navigate (url) {
  window.location.href = url
}

function post (path, params, method) {
  var key, $form

  method = method || 'post'
  params = params || {}

  $form = $('<form>').attr({
    method: method,
    action: path
  })

  for (key in params) {
    if (params.hasOwnProperty(key)) {
      $('<input>')
        .attr({
          type: 'hidden',
          name: key,
          value: params[key]
        })
        .appendTo($form)
    }
  }

  $form.appendTo('body')
  $form.submit()
}

function reload () {
  if (typeof window.location.reload === 'function') {
    window.location.reload()
    return
  }
  var href = window.location.href
  window.location.href = href
}

Router = {
  navigate: function (url) {
    navigate(url)
  },
  post: function (url, params, method) {
    post(url, params, method)
  },
  reload: function () {
    reload()
  }
}

export default Router
