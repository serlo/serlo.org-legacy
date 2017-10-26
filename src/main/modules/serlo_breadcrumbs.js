import $ from 'jquery'

var Breadcrumbs, defaults

defaults = {
  // main wrapper selector
  wrapperId: '#subject-nav-wrapper',

  // breadcrumb selector
  breadcrumbId: '#breadcrumbs',

  // desired height
  height: '45',

  // separator icon
  icon: $('<i>', { class: 'fa fa-angle-left' })
}

/**
     * @class Breadcrumbs
     * @param {Object} options See defaults
     *
     * Main constructor
     **/
Breadcrumbs = function (options) {
  if (!(this instanceof Breadcrumbs)) {
    return new Breadcrumbs(options)
  }

  var self = this
  var elements

  self.options = options
    ? $.extend({}, defaults, options)
    : $.extend({}, defaults)

  self.$wrapper = $(this.options.wrapperId)
  self.$breadcrumbs = $(this.options.breadcrumbId)

  self.$breadcrumbs.children().each(function () {
    $(this)
      .find('a')
      .append(self.options.icon.clone())
  })

  elements = this.$breadcrumbs.children().slice(0, -1)

  // queue of shown elements
  self.shownElements = []
  // stack of hidden elements
  self.hiddenElements = []

  if (elements.length > 0) {
    self.shownElements = new Array(elements.length - 1)

    elements.each(function (i, el) {
      if (i === 0) {
        return true
      }

      self.shownElements[i - 1] = $(el)
    })

    self.initBacklink(elements.last().clone())
    self.initDots()
  } else {
    self.$wrapper.addClass('has-no-backlink')
  }

  // adapt height; repeat on resize
  this.adaptHeight()
  $(window).bind('resizeDelay', function () {
    self.adaptHeight()
  })
}

/**
     * @method initBacklink
     * @param {jquery} el the backlink
     */
Breadcrumbs.prototype.initBacklink = function (el) {
  this.backlink = el
  this.backlink.addClass('backlink')
  this.backlink
    .children()
    .first()
    .find('span')
    .remove()
  this.backlink
    .children()
    .first()
    .find('i')
    .removeClass('fa-angle-left')
    .addClass('fa-chevron-left')

  this.$breadcrumbs.append(this.backlink)
}

/**
     * @method initDots
     */
Breadcrumbs.prototype.initDots = function () {
  this.$dots = $('<li>', { class: 'hidden' })
  this.$dotsLink = $('<a>', { html: '…' }).append(this.options.icon.clone())
  this.$dots.append(this.$dotsLink)

  this.$breadcrumbs
    .children()
    .first()
    .after(this.$dots)
}

/**
     * @method hasShownElements
     * @return {boolean} true iff there are shown elements
     */
Breadcrumbs.prototype.hasShownElements = function () {
  return this.shownElements.length > 0
}

/**
     * @method hasHiddenElements
     * @return {boolean} true iff there are hidden elements
     */
Breadcrumbs.prototype.hasHiddenElements = function () {
  return this.hiddenElements.length > 0
}

/**
     * @method isTooHigh
     * @return {boolean} true iff the wrapper is too high
     */
Breadcrumbs.prototype.isTooHigh = function () {
  return this.$wrapper.height() > this.options.height
}

/**
     * @method showElement
     *
     * Shows the first hidden element
     */
Breadcrumbs.prototype.showNextElement = function () {
  var el = this.hiddenElements.pop()
  el.removeClass('hidden')
  this.shownElements.unshift(el)

  // hide suspension points if there are no hidden elements left
  if (!this.hasHiddenElements()) {
    this.$dots.addClass('hidden')
  }
}

/**
     * @method hideNextElement
     *
     * Hides the last shown element
     */
Breadcrumbs.prototype.hideNextElement = function () {
  var el = this.shownElements.shift()
  el.addClass('hidden')
  this.hiddenElements.push(el)

  // show suspension points and update its href
  this.$dots.removeClass('hidden')
  this.$dotsLink.attr(
    'href',
    el
      .children()
      .first()
      .attr('href')
  )
}

/**
     * @method adaptHeight
     *
     * Shows as much elements as possible without breaking the wrappers height. Hides exceeding elements.
     */
Breadcrumbs.prototype.adaptHeight = function () {
  var self = this

  // try to show more elements
  self.$wrapper.removeClass('backlink-only')

  while (self.hasHiddenElements() && !self.isTooHigh()) {
    self.showNextElement()
  }

  while (self.hasShownElements() && self.isTooHigh()) {
    self.hideNextElement()
  }

  // show backlink only if still to high
  if (self.isTooHigh()) {
    self.$wrapper.addClass('backlink-only')
  }
}

export default Breadcrumbs
