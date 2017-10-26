/**
* $.SerloAjaxOverlay opens links in an overlay.
* Creates an AjaxPage for every asynchronous loaded content,
* caches them and provides tabs
*
* Available Callbacks:
* contentLoaded, contentOpened, beforeClose, beforeOpen, afterClose, beforeClose
*
* Usage: $.SerloAjaxOverlay({on: {contentLoaded: function () { ... }}});
*
* @class AjaxOverlay
* @constructor
* @param {Object} options Check 'defaults' in code
*/
import $ from 'jquery'

import Common from '../../modules/common'

var document = window.document
var instance
var lastScrollTop
var tabPages
var activePage
var pageCache = {}
var isActive = false
var defaults = {
  linkClass: 'ajax-content',
  closeClass: 'close-overlay',
  context: 'body',
  overlayActiveClass: 'ajax-content-active',
  ajaxContentSelector: '#content-container',
  titleSelector: '#pagetitle',
  activeTabClass: 'active',
  tabLimit: 5,
  on: {
    contentLoaded: function () {
      // arguments: data, AjaxOverlayInstance
      // gets called when new content is loaded
      // 'this' is the AjaxPage instance
    },
    contentOpened: function () {
      // arguments: AjaxOverlayInstance
      // gets called when an AjaxPage gets opened
      // 'this' is the AjaxPage instance
    },
    error: function () {
      // gets called when an ajax error appears
      // 'this' is the AjaxOverlay instance, arguments are all the arguments from jQuery.ajax.error
    },
    beforeClose: function () {
      // gets called right before the AjaxOverlay gets closed
      // 'this' is the AjaxOverlay instance
    },
    afterClose: function () {
      // gets called right after the AjaxOverlay has been closed
      // 'this' is the AjaxOverlay instance
    },
    beforeOpen: function () {
      // gets called right before the AjaxOverlay gets opened
      // 'this' is the AjaxOverlay instance
    },
    afterOpen: function () {
      // gets called right after the AjaxOverlay has been opened
      // 'this' is the AjaxOverlay instance
    }
  }
}
var AjaxOverlay = function (options) {
  this.options = $.extend(true, {}, defaults, options || {})

  this.$body = $('body')

  this.$overlayHTML = $(
    '<div id="ajax-content-overlay" class=""><div id="ajax-content-overlay-container"><header id="ajax-content-overlay-head"><ul id="ajax-content-overlay-tabs" class="nav nav-tabs"></ul></header><div id="ajax-content-overlay-inner"></div><footer id="ajax-content-overlay-footer"></footer><div id="ajax-content-overlay-loader"></div></div></div>'
  )
  this.$overlayHTML.hide().appendTo(this.options.context)

  this.$overlayInner = $('#ajax-content-overlay-inner')
  this.$overlayContainer = $('#ajax-content-overlay-container')

  this.$loader = $('#ajax-content-overlay-loader')

  this.$tabs = $('#ajax-content-overlay-tabs')

  this.$scrollEl = $('#ajax-content-overlay')

  this.init()
}

/**
 * Initializes the onClick event for links in a specific context
 *
 * @method init
 * @param {String} context The context where to search for links. Defaults to options.context
 * @return Returns itself for chaining
 */
AjaxOverlay.prototype.init = function (context) {
  $(context || this.options.context).on(
    'click',
    '.' + this.options.linkClass,
    this.onLinkClick
  )

  this.$overlayHTML.on(
    'click',
    '.' + this.options.closeClass,
    this.onCloseClick
  )
  this.$overlayHTML.on('click', 'a', this.onLinkClick)
  this.$overlayHTML.on('click', 'input[type="submit"]', this.onLinkClick)
  this.$overlayHTML.on('click', this.preventOverlayClosing)

  return this
}

/**
    * Click handler for links. Triggers the Overlay to start, saves current scroll position.
    *
    * @method onLinkClick
    * @param {Object} e jQuery Event Object
    */

AjaxOverlay.prototype.onLinkClick = function (e) {
  if ($(this).hasClass(instance.options.linkClass)) {
    e.preventDefault()
    var url = $(this).attr('href')
    var title = $(this).text()

    if (!isActive) {
      lastScrollTop = document.body.scrollTop

      instance.bootAjaxContent(
        url,
        title,
        instance.options.ajaxContentTop < lastScrollTop
          ? lastScrollTop + 20
          : instance.options.ajaxContentTop
      )
    } else {
      instance.addPage(url, title).scrollToPageTop()
    }

    return
  }
  if ($(this).hasClass(instance.options.closeClass)) {
    instance.forceRedirect = false
    instance.onCloseClick(e)
  } else {
    instance.forceRedirect = true
  }
}

/**
    * Click handler for overlay closing links. Triggers the Overlay to hide.
    *
    * @method onCloseClick
    * @param {Object} e jQuery Event Object
    */
AjaxOverlay.prototype.onCloseClick = function (e) {
  if (!instance.forceRedirect) {
    e.preventDefault()

    instance.shutDownAjaxContent()
  }
}

/**
     * A helper function that stops Propagation of click event bubbling:
     * makes sure the overlay only gets closed, when user did not click on the overlay itself.
     *
     * @method preventOverlayClosing
     * @param {Object} e jQuery Event Object
     */

AjaxOverlay.prototype.preventOverlayClosing = function (e) {
  if (!instance.forceRedirect) {
    e.preventDefault()
    e.stopPropagation()
  }
}

/**
    * Opens the Overlay and loads the given href.
    *
    * @method bootAjaxContent
    * @param {String} url The URL to load
    * @param {String} title The title of the page
    * @param {Number} position Where to position the Overlay vertically. Defaults to options.ajaxContentTop
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.bootAjaxContent = function (url, title) {
  var self = this

  self.options.on.beforeOpen.apply(
    self,
    Array.prototype.slice.call(arguments, 0)
  )

  isActive = true

  tabPages = []

  this.title = $(this.options.titleSelector, this.options.context).text()

  $(this.options.context).addClass(this.options.overlayActiveClass)

  this.$overlayInner.show()

  this.$overlayHTML.show().addClass('active')

  this.addPage(url, title)

  $(this.$body).click(this.onCloseClick)

  self.options.on.afterOpen.apply(
    self,
    Array.prototype.slice.call(arguments, 0)
  )
  return this
}

/**
    * Closes the overlay, unbinds clickhandler from body, scrolls the body to formerly saved scrollposition
    *
    * @method shutDownAjaxContent
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.shutDownAjaxContent = function () {
  var self = this
  var afterCloseOnce
  var allowed

  self.options.on.beforeClose.call(self)

  $(self.options.context).removeClass(self.options.overlayActiveClass)

  self.$overlayHTML.removeClass('active')

  $(self.$body).unbind('click', self.onCloseClick)

  if (typeof lastScrollTop === 'number') {
    // prevent afterClose callback to be called twice;
    afterCloseOnce = (function (fn) {
      allowed = true
      return function () {
        Common.expr(allowed && fn.apply(self))
        allowed = false
      }
    })(self.options.on.afterClose)

    self.$scrollEl.delay(300).animate(
      {
        scrollTop: lastScrollTop
      },
      {
        complete: function () {
          // only hide the inner HTML, to preserve css transitions for the next bootAjaxContent()
          self.$overlayInner.empty()
          // self.$overlayInner.hide();
          afterCloseOnce()
        }
      }
    )
  }

  isActive = false
  self.forceRedirect = null

  return self
}

/**
    * AjaxPages are stored by url in var pageCache.
    *
    * Creates a new page, or takes the cached one,
    * adds it to tabPages and triggers AjaxPage.load
    *
    * @method addPage
    * @param {String} url
    * @param {String} title
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.addPage = function (url, title) {
  var page =
    pageCache[url] || (pageCache[url] = new AjaxOverlay.AjaxPage(url, title))

  if (!elementExistsInArray(page, tabPages)) {
    tabPages.push(page)
  }

  activePage = page.load()

  return this
}

/**
    * Shows the AjaxPage by url
    *
    * @method showPage
    * @param {number} url
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.showPage = function (url) {
  var self = this
  var page = pageCache[url]

  if (undefined !== page) {
    activePage = page
    self.$overlayInner.html(page.$el)

    instance.options.on.contentOpened.call(page, instance)
  }

  return self.renderPageTabs()
}

/**
    * Renders tabs for all Pages that are in the tabPages array
    * if options.tabLimit is -1, all tabs
    * if options.tabLimit is 0, no tabs,
    * else a limited amount of tabs get rendered
    *
    *
    * @method renderPageTabs
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.renderPageTabs = function () {
  var $li
  var dublets = {}
  var self = this
  var i = 0
  var length
  var page

  self.$tabs.empty()

  if (self.options.tabLimit === 0) {
    return self
  }

  /* Add title as first Tab */

  $li = $('<li>').html(
    $('<a>')
      .attr('href', '#')
      .addClass('close-overlay')
      .addClass('root-tab')
      .html('<i class="fa fa-trash"></i> ' + self.title)
  )
  self.$tabs.append($li)

  if (self.options.tabLimit > 0) {
    i =
      self.options.tabLimit > tabPages.length
        ? 0
        : tabPages.length - self.options.tabLimit
  }

  for (length = tabPages.length; i < length; i += 1) {
    page = tabPages[i]

    if (undefined === dublets[page.url]) {
      $li = $('<li>').html(
        $('<a>')
          .attr('href', page.url)
          .addClass(self.options.linkClass)
          .text(tabPages[i].title)
      )

      if (tabPages[i] === activePage) {
        $li.addClass(self.options.activeTabClass)
      }
      self.$tabs.append($li)
      dublets[page.url] = true
    }
  }

  // if the active tab is NOT in the range of the tablimit,
  // kick out the first tab and prepend the active tab34

  if (!self.$tabs.find('.' + self.options.activeTabClass).length) {
    self.$tabs
      .find('li')
      .first()
      .remove()
    $li = $('<li>').html(
      $('<a>')
        .attr('href', activePage.url)
        .addClass(self.options.linkClass)
        .text(activePage.title)
    )

    self.$tabs.prepend($li.addClass(self.options.activeTabClass))
  }

  return self
}

/**
    * Tells the Overlay to scroll to the top
    * Gets called, when a new AjaxPage is loaded
    *
    * @method scrollToPageTop
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.scrollToPageTop = function () {
  var self = this

  self.$scrollEl.animate({
    scrollTop: 0 // self.$overlayHTML.position().top
  })

  return self
}

/**
    * Shows loader indicator
    *
    * @method showLoader
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.showLoader = function () {
  this.$loader.fadeIn({ queue: false })
  return this
}

/**
    * Hides loader indicator
    *
    * @method hideLoader
    * @return Returns itself for chaining
    */

AjaxOverlay.prototype.hideLoader = function () {
  this.$loader.fadeOut({ queue: false })
  return this
}

/**
    * Error handler
    *
    * @method onError
    */

AjaxOverlay.prototype.onError = function () {
  this.options.on.error.apply(this, Array.prototype.slice.call(arguments, 0))
}

/**
    * Constructor for a single AjaxPage. Allows navigation inside the AjaxOverlay
    *
    * @class AjaxPage
    * @constructor
    * @param {String} url The URL
    * @param {String} title The pages title for its tab view
    */

AjaxOverlay.AjaxPage = function (url, title) {
  this.uber = instance

  this.url = url
  this.title = title
  this.loaded = false

  this.$el = $('<div>')
}

/**
    * Loads this.url only if it hasnt been loaded earlier
    * and triggers the AjaxOverlay to show the pages content
    *
    * TODO: we do not load the href because of Allowed-X-Origin
    *
    * @method load
    * @return Returns itself for chaining
    */

AjaxOverlay.AjaxPage.prototype.load = function () {
  var self = this
  var call

  if (self.loaded) {
    self.uber.showPage(self.url).hideLoader()
    return
  }

  self.uber.showLoader()

  call = $.ajax({
    url: this.url,
    dataType: 'html'
  })

  call.then(function (data) {
    instance.options.on.contentLoaded.call(self, data, instance)

    var $data = $('<div>').html(data)
    self.loaded = true

    if ($data.find(self.uber.options.ajaxContentSelector).length) {
      self.$el.html($data.find(self.uber.options.ajaxContentSelector).html())
      self.uber.showPage(self.url).hideLoader()
    } else {
      self.uber.onError(new Error('No content found'))
    }
  })

  call.error(function () {
    self.uber.onError.apply(self.uber, arguments)
  })

  return self
}

/**
    * Helper function that checks if an array contains a specific element
    *
    * @method elementExistsInArray
    * @for AjaxOverlay
    * @param element A string, object, number, function, etc.
    * @param {array} array The array to search in
    * @return true or false
    */
function elementExistsInArray (element, array) {
  var i
  var length
  var exists = false

  for (i = 0, length = array.length; i < length; i += 1) {
    if (array[i] === element) {
      exists = true
      break
    }
  }

  return exists
}

export default AjaxOverlay
