import $ from 'jquery'
import 'jquery-ui'

var MobileNavigation, defaults

defaults = {
  // main wrapper selector
  wrapperId: '#mobile-nav',

  // primary items selector
  primaryClass: '.primary',

  // nav header class
  navHeaderClass: 'mobile-nav-header',

  // navigation toggle selector
  toggleId: '#mobile-nav-toggle',

  // serlo navigation
  serloNavId: 'mobile-serlo-nav',

  // main navigation
  mainNavId: 'mobile-main-nav',

  // navigation for primary items
  primaryNavId: 'mobile-primary-nav',

  asyncNav: {
    // fetch location
    loc: '/navigation/render/json/default_navigation',
    // maximum levels to fetch per iteration
    max: 10,
    // attribute name to indicate that this branch has been fetched already
    indicator: 'needs-fetching',
    // attribute name to decide whether a subnav should be shown
    sidenav: 'sidenav',
    // attribute name to identify the menuitem
    identifier: 'identifier'
  }
}

/**
     * @class MobileNavigation
     * @param {Object} options See defaults
     *
     * Main constructor
     **/
MobileNavigation = function (options) {
  if (!(this instanceof MobileNavigation)) {
    return new MobileNavigation(options)
  }

  this.options = options
    ? $.extend({}, defaults, options)
    : $.extend({}, defaults)

  this.$el = $(this.options.wrapperId)

  // create wrappers for the navigations
  this.$serloNav = $('<ul>', { id: this.options.serloNavId, class: 'nav' })
  this.$primaryNav = $('<ul>', { id: this.options.primaryNavId, class: 'nav' })
  this.$mainNav = $('<ul>', { id: this.options.mainNavId, class: 'nav' })

  // change serlo navigation into a dropdown menu
  this.$serloNavDropdown = $('<ul>', { class: 'dropdown-menu' })
  this.$serloNav.append(
    $(
      '<li class="dropdown"><a href="#" data-toggle="dropdown">Serlo <b class="caret"></b></a></li>'
    ).append(this.$serloNavDropdown)
  )

  this.$el.append(this.$serloNav)
  this.$el.append(this.$primaryNav)
  this.$el.append(this.$mainNav)

  // get navigation elements
  this.copyNav('#serlo-menu .navbar-inner>ul', this.$serloNavDropdown, {
    skip: '.notifications, .authentication'
  })
  this.copyNav('#side-navigation-social', this.$serloNavDropdown)
  this.copyNav('#main-nav', this.$mainNav)
  this.movePrimaries(this.$serloNav, this.$primaryNav)

  // special case when there is no main navigation
  if (this.$mainNav.children().length === 0) {
    this.$el.addClass('has-no-main-navigation')
  }

  // change first element in main navigation into navigation header
  this.$mainNav
    .children()
    .first()
    .removeClass('is-hidden')
    .addClass(this.options.navHeaderClass)
    .click(function (e) {
      e.preventDefault()
    })

  // remove active path from main navigation
  this.$mainNav.find('li ul').remove()

  this.attachEventHandler()
  this.renderSubNavigation(this.$mainNav)
}

/**
     * @method attachEventHandler
     *
     * Attaches all needed event handlers
     **/
MobileNavigation.prototype.attachEventHandler = function () {
  var self = this

  // toggle menu and refresh affixes
  $(self.options.toggleId).click(function () {
    self.$el.slideToggle({
      duration: 300,
      // easing: 'easeInOutCubic',
      complete: function () {
        $(document).trigger('affix-refresh')
      }
    })
  })

  self.attachDropdownEventHandlers(self.$el.find('.dropdown'))
}

/**
     * @method renderSubNavigation
     * @param {jquery} root root navigation, should be <ul> or <ol>
     *
     * Renders the sub navigation as dropdown
     */
MobileNavigation.prototype.renderSubNavigation = function (root) {
  var self = this

  /**
         * @function loop
         * @param {jquery} elem the element which the dropdown menu is appended to
         * @param {Object} navElements contains the navigation elements
         *
         * Changes the destination into a dropdown menu and appends the given elements to it.
         **/
  function loop (elem, navElements) {
    var link = elem.children().first()
    var dropdown = $('<ul>', {
      class: 'dropdown-menu'
    })

    // change element into dropdown
    elem.addClass('dropdown')

    link.attr('href', '#')
    link.attr('data-toggle', 'dropdown')
    link.append($('<b class="caret"></b>'))

    self.attachDropdownEventHandlers(elem)

    $.each(navElements, function (i, item) {
      var li = $('<li>', {
        dataNeedsFetching: item.needsFetching,
        dataSidenav: item.sidenav,
        dataIdentifier: item.identifier
      })
      var a = $('<a>', {
        href: item.href,
        text: item.label
      })

      li.append(a)
      dropdown.append(li)

      if (item.children.length > 0) {
        // Enable multilevel dropdown menus
        a.click(function (e) {
          e.preventDefault()
          e.stopPropagation()

          li.toggleClass('open')
          elem.addClass('open')

          $(document).trigger('affix-refresh')
        })

        loop(li, item.children)
      }
    })

    elem.append(dropdown)
  }

  root.children().each(function () {
    var elem = $(this)
    var sidenav = elem.data(self.options.asyncNav.sidenav) === undefined
    var id = elem.data(self.options.asyncNav.identifier)
    var fetchUrl = self.options.asyncNav.loc + '/2/10/' + id

    if (
      !elem.hasClass(self.options.navHeaderClass) &&
      elem.data(self.options.asyncNav.indicator) &&
      sidenav
    ) {
      $.getJSON(fetchUrl, function (data) {
        if (data.length > 0) {
          loop(elem, data)
        }
      })
    }
  })
}

/**
     * @method copyNav
     * @param {string} source source selector, should consist of <ul> or <ol>
     * @param {jquery} destination destination, should be <ul> or <ol>
     * @param {Object} params See defaultParams in function
     *
     * Copies the <li> from source to destination
     */
MobileNavigation.prototype.copyNav = function (source, destination, params) {
  var defaultParams = {
    // skips source items that match any of these selectors
    skip: ''
  }
  params = params
    ? $.extend({}, defaultParams, params)
    : $.extend({}, defaultParams)

  $(source).each(function () {
    if (!$(this).is(params.skip)) {
      $(this)
        .children()
        .clone()
        .appendTo(destination)
    }
  })
}

/**
     * @method movePrimaries
     * @param {jquery} source source, should be <ul> or <ol>
     * @param {jquery} destination destination, should be <ul> or <ol>
     *
     * Moves <li> items containing primary <a> from source to destination
     */
MobileNavigation.prototype.movePrimaries = function (source, destination) {
  source
    .find(this.options.primaryClass)
    .parent()
    .appendTo(destination)
}

/**
     * @method attachDropdownEventHandlers
     * @param {jquery} el the dropdown element
     *
     * Modifies the given dropdown s.th. the affix refreshes on open/close and that clicks outside of dropdown
     * do not close the dropdown.
     */
MobileNavigation.prototype.attachDropdownEventHandlers = function (el) {
  // refresh affix on open/close
  el.on(
    'shown.bs.dropdown hidden.bs.dropdown',
    $(document).trigger('affix-refresh')
  )

  // clicks outside dropdown should not close the dropdown
  el.on({
    'shown.bs.dropdown': function () {
      this.closable = false
    },
    click: function () {
      this.closable = true
    },
    'hide.bs.dropdown': function () {
      return this.closable
    }
  })
}

export default MobileNavigation
