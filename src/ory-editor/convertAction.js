import { renderServersideContent } from './index'
import $ from 'jquery'
import EntityEditor from './index'

export default (id, href, callback) => {
  $.ajax({
    url: href,
    type: 'GET',
    async: true,
    beforeSend: () => {
      $('#loading').show()
    },
    complete: () => {
      $('#loading').hide()
    }
  }).done(function(data) {
    function getEditedArticle($all) {
      const $editable = $all.find(
        `.editable[data-id="${id}"][data-edit-type="ory"]`
      )
      return $editable.closest('article').length
        ? $editable.closest('article')
        : $all.find('#content-layout article')
    }

    const $target = getEditedArticle($('body'))
    const $dataArticle = getEditedArticle($(data))
    $target.html($dataArticle.html())
    const $editButton = $(`.ory-edit-button[data-id="${id}"]`, data)
    new EntityEditor(id, $editButton.attr('href'), $editButton.data('type'))
    callback($target)
  })
}
