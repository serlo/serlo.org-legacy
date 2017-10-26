/* global MathJax */
import $ from 'jquery'

var ToggleAction

ToggleAction = function () {
  return $(this).each(function () {
    // Edit mode toggle
    if ($(this).data('toggle') === 'edit-controls') {
      $(this)
        .unbind('click')
        .click(function (e) {
          e.preventDefault()
          var $that = $(this)
          $that.toggleClass('active')
          $('.edit-control').toggleClass('hidden')
          return false
        })
    } else if ($(this).data('toggle') === 'discussions') {
      $(this)
        .unbind('click')
        .click(function (e) {
          e.preventDefault()
          var $that = $(this)
          var $target = $($that.data('target'))

          $that.toggleClass('active')
          $target.toggleClass('hidden')
          $('html, body').animate(
            {
              scrollTop: $target.offset().top
            },
            500
          )
          return false
        })
    } else if ($(this).data('toggle') === 'visibility') {
      $(this)
        .unbind('click')
        .click(function () {
          var $that = $(this)
          var $target = $($that.data('target'))

          $target.toggleClass('hidden')
        })
    } else if ($(this).data('toggle') === 'collapse') {
      if (/#solution-\d+/.test($(this).data('target'))) {
        var $target = $($(this).data('target'))
        var $base = $(this).closest('article')

        if (!$base.length) {
          $base = $target
        }
        $target.one('show.bs.collapse', function () {
          MathJax.Hub.Queue(['Reprocess', MathJax.Hub, $target.get()])
        })
      }
    }
  })
}

$.fn.ToggleAction = ToggleAction
