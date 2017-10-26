import $ from 'jquery'

var TriggerAction

TriggerAction = function () {
  return $(this).each(function () {
    // Edit mode toggle
    if ($(this).data('trigger') === 'ping') {
      $(this).click(function () {
        var $that = $(this)
        var location = $that.data('href')

        if (location) {
          $.ajax({
            url: location
          })
        }
      })
    }
  })
}

$.fn.TriggerAction = TriggerAction
