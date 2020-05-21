/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import $ from 'jquery'
import t from '../../modules/translator'

var ForumSelect

function selectForum(e) {
  var $that = $(this)
  var url = $that.data('select-forum-href')

  e.preventDefault()

  $.get(url, function (data) {
    var $modal = $(
      '<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' +
        t("You're almost done!") +
        '</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">' +
        t('Abort') +
        '</button></div></div></div></div>'
    )
    $('body').append($modal)
    $('.modal-body', $modal).html(data)
    $modal.modal('show')

    $('button.select').click(function () {
      var $this = $(this)
      var href = $this.data('action')

      $this.html(t('Please wait...'))

      $that.attr('action', href)
      $that.off('submit')
      $that.submit()
      // $that.submit();
      // $that.trigger('submit');
      // $that.trigger('submit');
    })
  })

  return false
}

ForumSelect = function () {
  return $(this).each(function () {
    var $that = $(this)
    if ($that.data('select-forum-href')) {
      $that.on('submit', selectForum)
    }
  })
}

$.fn.ForumSelect = ForumSelect
