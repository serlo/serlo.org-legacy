import $ from 'jquery'

var Tracking, ga

Tracking = function ($context) {
  this.$context = $context
  if (ga === undefined) {
    return
  }

  this.trackCollapse()
  this.trackControls()
  this.trackSideNavigation()
  this.trackCenterNavigation()
}

Tracking.prototype.trackCollapse = function () {
  return $('[data-toggle="collapse"]', this.$context).on('click', function () {
    ga('send', 'event', 'button', 'click', 'Collapsed an item')
  })
}

Tracking.prototype.trackControls = function () {
  return $('[data-toggle="edit-controls"]', this.$context).on(
    'click',
    function () {
      ga('send', 'event', 'button', 'click', 'Clicked on edit controls')
    }
  )
}

Tracking.prototype.trackSideNavigation = function () {
  return $('#main-nav a', this.$context).on('click', function () {
    ga('send', 'event', 'button', 'click', 'Clicked left drop down')
  })
}

Tracking.prototype.trackCenterNavigation = function () {
  return $('.subject-dropdown-toggle', this.$context).on('click', function () {
    ga('send', 'event', 'button', 'click', 'Clicked center drop down')
  })
}

export default $context => {
  ga = window[window['GoogleAnalyticsObject'] || 'ga']
  if (ga !== undefined) {
    ga('provide', 'advancedTracking', Tracking)
  }
  return new Tracking($context)
}
