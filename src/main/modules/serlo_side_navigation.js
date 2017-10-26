import $ from 'jquery'
import _ from 'underscore'

import eventScope from '../../libs/eventscope'
import Common from '../../modules/common'
import t from '../../modules/translator'
import ReferrerHistory from './serlo_referrer_history'

var defaults, Hierarchy, MenuItem, SubNavigation, SideNavigation

defaults = {
  // main wrapper selector
  mainId: '#main-nav',
  // active class, given to <li> elements
  activeClass: 'is-active',
  // the item which zf2 returns as the current route match
  routeMatchClass: 'active',
  // class given to community menu items
  communityClass: 'is-community',
  // class given to menu items the user is navigating through
  activeNavigatorClass: 'is-nav-active',
  // width of the subnavigation
  subNavigationWidth: 300,
  // min height of subnavigation
  subNavigationMinHeight: 400,
  subNavigationHeightOffset: 20,
  // duration of slide animation
  animationDuration: 150,
  // how many breadcrumbs are shown OR false for every breadcrumb
  breadcrumbDepth: false,
  // asynch nav config
  asyncNav: {
    // fetch location
    loc: '/navigation/render/json/default_navigation',
    // maximum levels to fetch per iteration
    max: 10,
    // attribute name to indicate that this branch has been fetched already
    indicator: 'needs-fetching',
    // attribute name to identify the menuitem
    identifier: 'identifier'
  }
}

/**
     * @function deepFlatten
     * @param {Array} the array
     * @return {UnderscoreChain}
     *
     * Helper function
     **/
function deepFlatten (array) {
  function dm (item) {
    if (item.children) {
      return [].concat(
        item,
        _.chain(item.children)
          .map(dm)
          .flatten()
          .value()
      )
    }
    return item
  }
  return _.chain(array)
    .map(dm)
    .flatten()
}

/**
     * @class MenuItem
     * @param {Object} data All informations about the MenuItem (url, title, position, level)
     */
MenuItem = function (data) {
  if (
    data.url === undefined ||
    !data.title ||
    !data.position ||
    data.level === undefined
  ) {
    Common.log('Invalid MenuItem', data)
  }

  if (data.needsFetching === undefined) {
    data.needsFetching = true
  }

  if (data.sidenav === undefined) {
    data.sidenav = true
  }

  eventScope(this)

  this.data = data
  this.$el = $('<li>')

  this.render()
}

/**
     * @method render
     *
     * Renders the a <li> and <a> tag on MenuItem.$el
     **/
MenuItem.prototype.render = function () {
  var self = this
  var $a
  var $children

  this.$el.empty()

  if (self.data.level === 0) {
    self.data.$a.click(function (e) {
      self.onClick(e)
    })
  } else {
    $a = $('<a>')
      .text(self.data.title)
      .click(function (e) {
        self.onClick(e)
      })
      .attr('href', self.data.url)
      .appendTo(self.$el)

    if (self.data.icon) {
      $a.html(
        '<span class="fa fa-' +
          self.data.icon +
          '"></span> <span>' +
          self.data.title +
          '</span>'
      )
    }

    if (self.data.cssClass) {
      self.$el.addClass(self.data.cssClass)
    }

    if (self.data.renderedChildren && self.data.renderedChildren.length) {
      $children = $('<ul>')
      self.$children = $children

      _.each(self.data.renderedChildren, function (child) {
        var childItem = new MenuItem(
          _.extend({}, child.data, {
            icon: false,
            needsFetching: false
          })
        )

        childItem.addEventListener('reload', function (e) {
          self.trigger('reload', {
            originalEvent: e.originalEvent
          })
        })

        childItem.$el.appendTo($children)
      })

      self.$el.append($children)
    }
  }

  return self
}

/**
     * @method onClick
     * @param {jQuery Click Event} e
     *
     * OnClick handler for MenuItem
     **/
MenuItem.prototype.onClick = function (e) {
  if (
    this.data.sidenav &&
    (this.data.needsFetching || this.children) &&
    !this.alwaysReload
  ) {
    e.preventDefault()
    e.stopPropagation()
    this.trigger('click', {
      originalEvent: e,
      menuItem: this
    })
  } else {
    this.trigger('reload', {
      originalEvent: e
    })
  }
}

/**
     * @class SubNavigation
     * @param {Array} levels An array of levels, containing MenuItems, to be rendered in an <ul>
     *
     * Creates <ul>s for each level and renders them
     **/

SubNavigation = function (levels) {
  this.$el = $('<div id="serlo-side-sub-navigation-mover">')
  eventScope(this)
  this.reset(levels)
}

/**
     * @method reset
     * @param {Array} levels An array of levels, containing MenuItems, to be rendered in an <ul>
     *
     **/
SubNavigation.prototype.reset = function (levels) {
  this.levels = levels
  this.render()
}

/**
     * @method render
     *
     * Creates the <li> and <a> elements
     **/
SubNavigation.prototype.render = function () {
  var self = this
  var backBtn
  var parentData
  var parentLink

  self.$el.empty()

  _.each(self.levels, function (level) {
    var $div = $('<div>')
    var $ul = $('<ul>')
    var msg
    var elementCount

    // add back btns
    if (level[0].data.parent) {
      parentData = level[0].data.parent.data
      if (parentData.level === 0) {
        backBtn = new MenuItem({
          icon: 'times',
          cssClass: 'sub-nav-header',
          title: t('Close'),
          url: '#',
          position: [],
          needsFetching: false,
          level: -1
        })

        backBtn.$el.unbind('click').click(function (e) {
          self.trigger('close', {
            originalEvent: e,
            menuItem: backBtn
          })
        })
      } else {
        elementCount = parentData.elementCount
        if (
          parentData.url !== '' &&
          parentData.url !== '#' &&
          typeof elementCount !== 'undefined'
        ) {
          msg = t('Show overview')

          if (elementCount > 0) {
            msg = t('Show %d contents for "%s"', elementCount, parentData.title)
          }

          parentLink = new MenuItem(
            $.extend({}, parentData, {
              icon: 'eye',
              cssClass: 'sub-nav-footer',
              level: -1,
              title: msg
            })
          )

          parentLink.$el.unbind('click').click(function (e) {
            self.trigger('navigate', {
              original: e,
              menuItem: parentLink
            })
          })
        }

        backBtn = new MenuItem(
          $.extend({}, parentData, {
            icon: 'arrow-left',
            cssClass: 'sub-nav-header'
          })
        )

        backBtn.$el.unbind('click').click(function (e) {
          self.trigger('go back', {
            originalEvent: e,
            menuItem: backBtn
          })
        })
      }
    }

    $ul.append(backBtn.$el)

    // add parent link
    if (parentLink) {
      $ul.append(parentLink.$el)
    }

    // separator
    $ul.append('<li class="sub-nav-separator">')

    // add nav links
    _.each(level, function (menuItem) {
      $ul.append(menuItem.render().$el)
    })

    if (self.levels[0][0].data.parent.data.community) {
      $div.addClass('is-community')
    }

    $div.addClass('sub-nav-slider').append($ul)
    self.$el.append($div)
  })

  return this
}

/**
     * @method getListAtLevel
     * @param {Number} level
     * @return {jQueryObject} $ul The actual <ul> element for given level
     *
     **/
SubNavigation.prototype.getListAtLevel = function (level) {
  return this.$el
    .children()
    .eq(level)
    .find('ul')
    .first()
}

/**
     * @class Hierarchy
     **/
Hierarchy = function () {
  this.data = []
}

/**
     * @method fetchFromDom
     * @param {jQueryObject} $root
     *
     * Loops through $root and creates an hierarchial array of objects
     **/
Hierarchy.prototype.fetchFromDom = function ($root) {
  var self = this
  var deepness = []

  self.data = []
  self.$root = $root

  /**
         * @function loop
         * @param {jQueryObject} $element The element containing the children to loop through
         * @param {Array} dataHierarchy The current hierarchy array
         * @param {Number} level The current level of hierarchy
         *
         * Creates a recursive reflection of the <li> tags in the given $element
         * on the Hierarchy (hierarchy.data)
         *
         * Also creates MenuItem instances for every link and adds event handlers
         **/
  function loop ($element, dataHierarchy, level, parent) {
    $('> li', $element).each(function (i) {
      deepness = deepness.splice(0, level)
      deepness.push(i)

      var $listItem = $(this)
      var $link = $listItem
        .children()
        .filter('a')
        .first()
      var position = [].concat(deepness)
      var hasChildren = $listItem
        .children()
        .filter('ul')
        .find('> li').length
      var needsFetching = $listItem.data('needs-fetching') !== undefined
      var sidenav = $listItem.data('sidenav') === undefined
      var icon

      if (hasChildren) {
        icon = 'chevron-right'
      }

      dataHierarchy[i] = new MenuItem({
        url: $link.attr('href'),
        title: Common.trim($link.text()),
        $li: $listItem,
        $a: $link,
        position: position,
        level: level,
        parent: parent,
        icon: icon,
        active: $listItem.hasClass(defaults.routeMatchClass),
        community: $listItem.hasClass(defaults.communityClass),
        needsFetching: needsFetching,
        sidenav: sidenav,
        elementCount: $listItem.data('element-count'),
        identifier: $listItem.data(defaults.asyncNav.identifier)
      })

      if (hasChildren) {
        dataHierarchy[i].children = []
        loop(
          $listItem
            .children()
            .filter('ul')
            .first(),
          dataHierarchy[i].children,
          level + 1,
          dataHierarchy[i]
        )
      }
    })
  }

  loop(self.$root, self.data, 0)
  return this
}

/**
     * @method fetchFromJson
     * @param {Object} object
     * @param {MenuItem} parent
     *
     * Loops through data and creates an hierarchial array of objects
     **/
Hierarchy.prototype.fetchFromJson = function (object, parent) {
  var deepness = parent.data.position.slice()

  parent.data.needsFetching = false

  /**
         * @function loop
         * @param {Object} object The element containing the children to loop through
         * @param {Array} dataHierarchy The current hierarchy array
         * @param {Number} level The current level of hierarchy
         * @param {MenuItem} parent
         *
         * Creates a recursive reflection of the <li> tags in the given $element
         * on the Hierarchy (hierarchy.data)
         *
         * Also creates MenuItem instances for every link and adds event handlers
         **/
  function loop (object, dataHierarchy, level, parent) {
    $.each(object, function (i, item) {
      deepness = deepness.splice(0, level)
      deepness.push(i)

      var position = [].concat(deepness)
      var hasChildren = item.children.length
      var icon

      if (hasChildren) {
        icon = 'chevron-right'
      }

      dataHierarchy[i] = new MenuItem({
        url: item.href,
        title: item.label,
        position: position,
        level: level,
        parent: parent,
        icon: icon,
        needsFetching: item.needsFetching,
        elementCount: item.elements,
        identifier: item.identifier
      })

      if (hasChildren) {
        dataHierarchy[i].children = []
        loop(
          item.children,
          dataHierarchy[i].children,
          level + 1,
          dataHierarchy[i]
        )
      }

      return dataHierarchy
    })
  }

  parent.children = []
  loop(object, parent.children, parent.data.level + 1, parent)
  return this
}

/**
     * @method findByUrl
     * @param {String} url
     * @return {Object} The first found menu item
     *
     * Searches for a menu item by URL
     **/
Hierarchy.prototype.findByUrl = function (url) {
  var self = this

  return _.first(
    deepFlatten(self.data)
      .filter(function (menuItem) {
        if (menuItem.data.url === url) {
          return menuItem
        }
        return false
      })
      .value()
  )
}

/**
     * @method findActiveByActive
     * @return {Object} The last found menu item
     *
     * Searches for a menu item by active property
     **/
Hierarchy.prototype.findActiveByActive = function () {
  var self = this

  return _.last(
    deepFlatten(self.data)
      .filter(function (menuItem) {
        if (menuItem.data.active) {
          return true
        }
        return false
      })
      .value()
  )
}

/**
     * @method findActive
     * @return {Object} The active menu item.
     *
     * Finds the active menu item. Searches for both the last available url as well as
     * the active menu item given by the app.
     **/
Hierarchy.prototype.findActive = function () {
  var self = this
  var foundItem
  var fromStorageItem
  var currentUrl = ReferrerHistory.getCurrent()

  foundItem = this.findActiveByActive()

  if (foundItem !== undefined) {
    if (foundItem.data.url !== currentUrl) {
      fromStorageItem = self.findPreviousMenuItem()
      if (fromStorageItem) {
        return fromStorageItem
      }
    }
    return foundItem
  }
}

/**
     * @method findPreviousMenuItem
     * @return {Object} The first found menu item matching on the last ReferrerHistory entries.
     *
     * Searches menu items by URL
     **/
Hierarchy.prototype.findPreviousMenuItem = function () {
  var self = this
  var result
  var lastUrl = ReferrerHistory.getPrevious()

  result = self.findByUrl(lastUrl)
  if (result) {
    return result
  }
}

/**
     * @method findLastAvailableUrl
     * @return {Object} The first found menu item matching on the last ReferrerHistory entries.
     *
     * Searches menu items by URL
     **/
Hierarchy.prototype.findLastAvailableUrl = function () {
  var self = this
  var foundItem
  var lastUrls = ReferrerHistory.getAll()

  _.each(lastUrls, function (lastUrl) {
    foundItem = self.findByUrl(lastUrl)
    if (foundItem) {
    }
  })

  return foundItem
}

/**
     * @method findByPosition
     * @param {Array} position An array of indexes
     * @return {MenuItem} or false
     *
     **/
Hierarchy.prototype.findByPosition = function (position) {
  if (position.length === 1) {
    return this.data[position[0]]
  }

  var cursor = this.data[position[0]]

  position = position.slice()
  position.shift()

  _.each(position, function (index) {
    cursor = cursor.children[index]
  })

  return cursor || false
}

/**
     * @method getFlattened
     * @return {Array} Returns an array of all MenuItems without hierarchy
     **/
Hierarchy.prototype.getFlattened = function () {
  return deepFlatten(this.data).value()
}

/**
     * @method getLevels
     * @param {Array} position An array of indexes
     * @return {Array} an Array of Levels
     *
     **/
Hierarchy.prototype.getLevels = function (position) {
  var self = this
  var cursor = self.data
  var result = []

  _.each(position, function (index) {
    result.push(cursor[index].children)
    cursor = cursor[index].children
  })
  return result
}

/**
     * @method getParents
     * @param {Array} position An array of indexes
     * @return {Array} an Array of menuItems
     *
     **/
Hierarchy.prototype.getParents = function (position) {
  var result = []
  var usePosition = position.slice()

  while (usePosition.length) {
    result.push(this.findByPosition(usePosition))
    usePosition.pop()
  }

  return result
}

/**
     * @method getSiblings
     * @param {Array} position An array of indexes
     * @return {Array} an Array of menuItems - the siblings of the given array
     *
     **/
Hierarchy.prototype.getSiblings = function (position) {
  var usePosition = position.slice()
  var parent = this.getParent(this.findByPosition(usePosition))

  return parent ? parent.children || [] : []
}

/**
     * @method getParent
     * @param {MenuItem} menuItem A menuItem
     * @return {MenuItem} The direct parent of the given MenuItem
     **/
Hierarchy.prototype.getParent = function (menuItem) {
  var parents = this.getParents(menuItem.data.position).reverse()
  parents.pop()
  return parents[parents.length - 1]
}

/**
     * @class SideNavigation
     * @param {Object} options See defaults
     *
     * Main constructor
     **/
SideNavigation = function (options) {
  if (!(this instanceof SideNavigation)) {
    return new SideNavigation(options)
  }

  this.options = options
    ? $.extend({}, defaults, options)
    : $.extend({}, defaults)

  // when force gets true, a click on $el will propagate
  this.force = false

  this.$el = $(this.options.mainId)
  this.$nav = $('<div id="serlo-side-sub-navigation">')
  // this.$mover = $('<div id="serlo-side-sub-navigation-mover">');
  // this.$nav.append(this.$mover);
  // this.$mover.css('left', 0);
  this.$breadcrumbs = $(
    '<ul id="serlo-side-navigation-breadcrumbs" class="nav">'
  )

  this.hierarchy = new Hierarchy()
  this.hierarchy.fetchFromDom(this.$el)

  this.active = this.hierarchy.findActive()

  this.setActiveBranch()

  this.attachEventHandler()
}

/**
     * @method setActiveBranch
     *
     * Sets options.activeClass for active menu item and its parents
     **/
SideNavigation.prototype.setActiveBranch = function () {
  var self = this
  var position
  // parents,
  // siblings,
  // $rootMenuItem;

  if (self.active) {
    position = self.active.data.position

    self.active.$el
      .addClass(self.options.activeClass)
      .parents('li')
      .addClass(self.options.activeClass)

    // set the original root elements activeClass
    // $rootMenuItem = $('> li', self.$el).eq(position[0]).addClass(self.options.activeClass);
    $('> li', self.$el)
      .eq(position[0])
      .addClass(self.options.activeClass)

    // Create 'breadcrumbs'
    // parents = self.hierarchy.getParents(position).reverse();

    // parents.shift();
    // parents.pop();

    // siblings = self.hierarchy.getSiblings(position);

    // set siblings activeClass
    // _.each(siblings, function (menuItem) {
    //    if (_.isEqual(menuItem.data.position, position)) {
    //        menuItem.data.cssClass = self.options.activeClass;
    //    }
    // });

    // if (self.options.breadcrumbDepth) {
    //    parents = parents.splice(-1 * self.options.breadcrumbDepth);
    // }

    // if (!parents.length) {
    //    parents = siblings;
    //    siblings = [];
    // }

    // if (parents.length && !self.$breadcrumbs.html().length) {
    // _.each(parents, function (menuItem, key) {
    // var breadcrumb,
    //    breadCrumbOptions = {
    //    icon: false,
    //    needsFetching: false,
    //    renderedChildren: (key === parents.length - 1) ? siblings : false
    // };

    // breadcrumb = new MenuItem(_.extend({}, menuItem.data, breadCrumbOptions));

    // breadcrumb.addEventListener('click', function (e) {
    //     var parentMenuItem = self.hierarchy.getParent(e.menuItem);
    //     e.originalEvent.preventDefault();
    //     self.navigatedMenuItem = parentMenuItem;
    //     self.jumpTo(parentMenuItem);
    // });

    // breadcrumb.addEventListener('reload', function () {
    //   self.force = true;
    // });

    // self.$breadcrumbs.append(breadcrumb.$el);
    // });

    // self.$breadcrumbs.insertAfter($rootMenuItem);
    // }
  }
  return self
}

/**
     * @method setActiveNavigator
     *
     * Sets the options.activeNavigatorClass for menu items the user is navigating with
     **/
SideNavigation.prototype.setActiveNavigator = function () {
  $('.' + this.options.activeNavigatorClass, this.$el).removeClass(
    this.options.activeNavigatorClass
  )

  if (this.navigatedMenuItem) {
    this.navigatedMenuItem.$el
      .addClass(this.options.activeNavigatorClass)
      .parents('li')
      .addClass(this.options.activeNavigatorClass)
    // set the original root elements activeClass
    $('> li', this.$el)
      .eq(this.navigatedMenuItem.data.position[0])
      .addClass(this.options.activeNavigatorClass)
  }
}

/**
     * @method attachEventHandler
     *
     * Attaches all needed event handlers
     **/
SideNavigation.prototype.attachEventHandler = function () {
  var self = this
  var menuItems = this.hierarchy.getFlattened()

  // add 'open' click event to first-level items
  _.each(menuItems, function (menuItem) {
    menuItem.addEventListener('click', function (e) {
      e.originalEvent.preventDefault()
      self.navigatedMenuItem = e.menuItem
      self.fetch(e.menuItem)
    })

    menuItem.addEventListener('reload', function () {
      self.force = true
      self.close()
    })

    menuItem.data.attached = true
  })

  $('body').on('click', function () {
    if (self.isOpen) {
      self.close()
    }
  })

  self.$el.click(function (e) {
    if (!self.force) {
      e.preventDefault()
      e.stopPropagation()
      self.force = false
    }
  })
}

/**
     * @method synchEventHandlers
     *
     * Attaches all needed event handlers to new MenuItems
     **/
SideNavigation.prototype.synchEventHandlers = function () {
  var self = this
  var menuItems = this.hierarchy.getFlattened()

  // add 'open' click event to first-level items
  _.each(menuItems, function (menuItem) {
    if (!menuItem.data.attached) {
      menuItem.addEventListener('click', function (e) {
        e.originalEvent.preventDefault()
        self.navigatedMenuItem = e.menuItem
        self.fetch(e.menuItem, e)
      })

      menuItem.addEventListener('reload', function () {
        self.force = true
        self.close()
      })

      menuItem.data.attached = true
    }
  })
}

/**
     * @method fetch
     * @param {MenuItem} menuItem The clicked MenuItem instance
     *
     * This method fetches an menuItems children from the server.
     */
SideNavigation.prototype.fetch = function (menuItem) {
  var call
  var options = defaults.asyncNav
  var max = options.max
  var self = this
  var level = menuItem.data.level + 2
  var needsFetching = menuItem.data.needsFetching
  var identifier = menuItem.data.identifier
  var fetchUrl = options.loc + '/' + level + '/' + max + '/' + identifier

  if (!needsFetching) {
    self.jumpTo(menuItem)
    return
  }

  call = $.ajax({
    url: fetchUrl,
    dataType: 'json'
  })

  call.done(function (data) {
    // We triggered a false positive, there are no children for this item.
    // Therefore, let's open the damn link!
    if (data.length === 0) {
      // this is so super hacky
      // todo: fixme
      window.location.href = menuItem.data.url
      return
    }
    self.hierarchy.fetchFromJson(data, menuItem)
    self.synchEventHandlers()
    self.jumpTo(menuItem)
  })

  call.fail(function () {
    console.log('Fetch not successfull :(')
  })
}

/**
     * @method open
     * @param {Object} menuItem The clicked MenuItem instance
     *
     * Shows the generated Subnavigation
     **/
SideNavigation.prototype.open = function (menuItem) {
  this.isOpen = true
  this.$nav.appendTo(this.$el)
  this.routeAnimation(menuItem)
}

/**
     * @method close
     *
     * Hides the generated Subnavigations
     **/
SideNavigation.prototype.close = function () {
  this.isOpen = false
  this.$nav.detach()

  this.navigatedMenuItem = null
  this.setActiveNavigator()

  if (this.subNavigation) {
    this.subNavigation.$el.css('left', 0)
  }
}

/**
     * @method jumpTo
     * @param {Object} menuItem The clicked MenuItem instance
     *
     * Starts animation to the clicked MenuItem
     **/
SideNavigation.prototype.jumpTo = function (menuItem) {
  if (!this.isOpen) {
    this.open(menuItem)
  } else {
    this.routeAnimation(menuItem)
  }
}

/**
     * @method routeAnimation
     * @param {Object} menuItem The target MenuItem instance
     *
     * Animations!!!!
     **/
SideNavigation.prototype.routeAnimation = function (menuItem) {
  var self = this
  var startLevels
  var breakpoint

  if (!self.activeLevels) {
    self.activeLevels = self.hierarchy.getLevels(menuItem.data.position)

    self.subNavigation = new SubNavigation(self.activeLevels)
    self.subNavigation.addEventListener('go back', function (e) {
      self.jumpTo(e.menuItem.data.parent)
    })
    self.subNavigation.addEventListener('close', function () {
      self.close()
    })
    self.subNavigation.addEventListener('navigate', function () {
      self.force = true
      self.close()
    })

    // self.subNavigation.$el.appendTo(self.$mover);
    self.subNavigation.$el.appendTo(self.$nav)
  }

  startLevels = self.activeLevels

  self.activeLevels = self.hierarchy.getLevels(menuItem.data.position)
  // determine position crossing
  breakpoint = self.determineBreakpoint(startLevels, self.activeLevels)
  // start and end level is 1, we dont need any animation
  if (startLevels.length === 1 && self.activeLevels.length === 1) {
    self.subNavigation.reset(self.activeLevels)
    self.setMoverHeight(1)
    self.setActiveNavigator()
  } else {
    if (breakpoint === startLevels.length) {
      // breakpoint is current level,
      // so we only need one animation
      self.subNavigation.reset(self.activeLevels)
      self.setActiveNavigator()
      self.animateTo(self.activeLevels.length)
    } else {
      // we need two animations,
      // first to our breakpoint
      // then to our target
      self.animateTo(breakpoint, function () {
        self.subNavigation.reset(self.activeLevels)
        self.setActiveNavigator()
        self.animateTo(self.activeLevels.length)
      })
    }
  }
}

/**
     * @method animateTo
     * @param {Number} level
     * @param {Function} callback
     **/
SideNavigation.prototype.animateTo = function (level, callback) {
  var self = this
  var targetLeft = (level - 1) * -1 * self.options.subNavigationWidth + 'px'

  self.setMoverHeight(level)

  // if (self.$mover.css('left') === targetLeft && callback) {
  if (self.subNavigation.$el.css('left') === targetLeft && callback) {
    callback()
    return
  }

  self.subNavigation.$el.animate(
    {
      left: targetLeft
    },
    {
      complete: function () {
        if (callback !== undefined) {
          callback()
        }
      },
      duration: self.options.animationDuration,
      easing: 'easeOutExpo'
    }
  )
}

/**
     * @method setMoverHeight
     * @param {Number} level
     *
     **/
SideNavigation.prototype.setMoverHeight = function (level) {
  var self = this
  var height
  var $ul

  $ul = self.subNavigation.getListAtLevel(level - 1)

  if ($ul.length) {
    if ($ul[0].scrollHeight <= self.options.subNavigationMinHeight) {
      height = self.options.subNavigationMinHeight
    } else {
      height = $ul[0].scrollHeight + self.options.subNavigationHeightOffset
    }

    self.$nav.animate(
      {
        height: height
      },
      {
        duration: self.options.animateionDuration,
        easing: 'easeOutExpo'
      }
    )
  }
}

/**
     * @method determineBreakpoint
     * @param {Array} start
     * @param {Array} end
     * @return {Object} MenuItem
     **/
SideNavigation.prototype.determineBreakpoint = function (start, end) {
  var result = 1
  var startReverse = start.slice()
  var endReverse = end.slice().splice(0, start.length)

  if (startReverse.length > endReverse.length) {
    startReverse = startReverse.splice(0, endReverse.length)
  }

  _.each(startReverse, function (level, index) {
    if (endReverse[index] !== undefined) {
      if (
        _.isEqual(level[0].data.position, endReverse[index][0].data.position)
      ) {
        result = index + 1
      }
    }
  })

  return result
}

export default SideNavigation
