/* global MathJax */
import $ from 'jquery'

var Spoiler

Spoiler = function () {
  return $(this).each(function () {
    $('> .spoiler-teaser', this)
      .unbind('click')
      .first()
      .click(function (e) {
        var icon = $(this).find('.fa')
        var $content = $(this).next('.spoiler-content')
        e.preventDefault()
        $content.slideToggle()
        icon.toggleClass('fa-caret-square-o-up')
        icon.toggleClass('fa-caret-square-o-down')
      })
    $('> .spoiler-teaser', this).one('click', function () {
      var $content = $(this).next('.spoiler-content')
      MathJax.Hub.Queue(['Reprocess', MathJax.Hub, $content.get()])
    })
  })
}

$.fn.Spoiler = Spoiler
