import $ from 'jquery'
import _ from 'underscore'

var Slider, pushTab, getTab, quote

quote = function (str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}

pushTab = function (id, slide) {
  var q = window.location.hash
  var re

  if (q.indexOf(id) > -1) {
    re = new RegExp(quote(id) + '\\=[0-9]+', 'g')
    window.location.href = window.location.href.replace(re, id + '=' + slide)
  } else if (q.length > 0) {
    window.location.href += '&' + id + '=' + slide
  } else {
    window.location.href = '#' + id + '=' + slide
  }
}

getTab = function (id) {
  var e
  var r = /([^&;=]+)=?([^&;]*)/g
  var d = function (s) {
    return decodeURIComponent(s)
  }
  var q = window.location.hash.substring(1)

  while ((e = r.exec(q))) {
    if (d(e[1]) === id) {
      return d(e[2])
    }
  }

  return 0
}

Slider = function () {
  var $self = $(this)
  var slideTabNav
  var id = $(this).attr('id')

  slideTabNav = function (evt) {
    var slide = $(evt.relatedTarget).index()
    var $scrollTo = $('.controls li:eq(' + slide + ')', $self)
    var $container = $('.controls', $self)
    var throttledSliding

    pushTab(id, slide)
    $('.controls li.active', $self).removeClass('active')
    $scrollTo.addClass('active')

    throttledSliding = _.throttle(
      function () {
        $container.animate(
          {
            scrollLeft:
              $scrollTo.offset().left -
              $container.offset().left +
              $container.scrollLeft() -
              Math.ceil($container.width() / 2 - $scrollTo.width() / 2)
          },
          200
        )
      },
      100,
      { trailing: false }
    )

    throttledSliding()
  }

  $self.unbind('slide.bs.carousel', slideTabNav)
  $self.bind('slide.bs.carousel', slideTabNav)

  $self.bind('slid.bs.carousel', function () {
    $self.carousel('pause')
  })

  $self.carousel(parseInt(getTab(id), 10))
  $self.carousel('pause')
}

$.fn.Slider = Slider
