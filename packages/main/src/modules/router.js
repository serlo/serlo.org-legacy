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
/* global window */
import $ from 'jquery'

var Router

function navigate(url) {
  window.location.href = url
}

function post(path, params, method) {
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

function reload() {
  if (typeof window.location.reload === 'function') {
    window.location.reload()
    return
  }
  var href = window.location.href
  window.location.href = href
}

Router = {
  navigate: function(url) {
    navigate(url)
  },
  post: function(url, params, method) {
    post(url, params, method)
  },
  reload: function() {
    reload()
  }
}

export default Router
