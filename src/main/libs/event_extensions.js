import $ from 'jquery'

$.each(['show', 'hide'], function (i, ev) {
  var el = $.fn[ev]
  $.fn[ev] = function () {
    this.trigger(ev + '.before')
    var ret = el.apply(this, arguments)
    this.trigger(ev + '.after')
    return ret
  }
})
