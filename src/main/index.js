/* globals gaOptout, MathJax */
import autosize from 'autosize'
import $ from 'jquery'
import 'jquery-sticky'
import 'jquery-ui'
import 'magnific-popup'
import moment from 'moment'
import _ from 'underscore'

import '../libs/polyfills'
import Common from '../modules/common'
import Content from '../modules/content'
import '../modules/injections'
import '../modules/modals'
import '../modules/spoiler'
import Supporter from '../modules/supporter'
import SystemNotification from '../modules/system_notification'
import '../modules/timeago'
import t from '../modules/translator'
import '../thirdparty/jquery.nestable'
import './libs/easing'
import './libs/event_extensions'
import AjaxOverlay from './modules/serlo_ajax_overlay'
import Breadcrumbs from './modules/serlo_breadcrumbs'
import './modules/serlo_forum_select'
import './modules/serlo_input_challenge'
import './modules/serlo_math_puzzle'
import MobileNavigation from './modules/serlo_mobile_navigation'
import './modules/serlo_multiple_choice'
import './modules/serlo_profile_birdnest'
import SideElement from './modules/serlo_side_element'
import SideNavigation from './modules/serlo_side_navigation'
import './modules/serlo_single_choice'
import './modules/serlo_slider'
import './modules/serlo_sortable_list'
import './modules/serlo_toggle'
import initTracking from './modules/serlo_tracking'
import './modules/serlo_trigger'
// FIXME historyjs; not needed?

import './styles/main.scss'

window.$ = $
window.jQuery = $

// Needs to be a require call since `window.$` is needed
require('bootstrap-sass')
require('bootstrap-datepicker')
// FIXME needed?
require('jasny-bootstrap/dist/js/jasny-bootstrap.js')

// const App = () => {
const setLanguage = () => {
  const language = $('html').attr('lang') || 'de'

  t.config({
    language
  })

  moment.locale(language)
}

const initResizeEvent = () => {
  const $window = $(window)
  let cachedWidth = $window.width()

  // `resizeDelay` will be triggered if it wasn't triggered for 0.5s
  $window.resize(
    _.debounce(function () {
      const width = $window.width()
      if (cachedWidth !== width) {
        $(this).trigger('resizeDelay')
        cachedWidth = width
      }
    }, 500)
  )
}

const initNavigation = () => {
  /* eslint-disable no-new */
  new MobileNavigation()
  new Breadcrumbs()
  new SideNavigation()
  /* eslint-enable no-new */
}

const initFooter = () => {
  const $footer = $('#footer')
  const $footerPush = $('#footer-push')
  const $contentLayout = $('#content-layout')
  const $wrap = $('.wrap')
  const $sideContextCourse = $('.side-context-course')

  $footerPush.css('height', $footer.height())
  $wrap.css('margin-bottom', -$footer.height())
  setTimeout(function () {
    $sideContextCourse.css('max-height', $contentLayout.outerHeight())
  }, 300)
  $(window).bind('resizeDelay', function () {
    $footerPush.css('height', $footer.height())
    $wrap.css('margin-bottom', -$footer.height())
    $sideContextCourse.css('max-height', $contentLayout.outerHeight())
    MathJax.Hub.Queue(['Reprocess', MathJax.Hub])
    $('.nest-statistics').renderNest()
  })
}

const initSubjectNav = $context => {
  let opened = false
  const $dropdown = $('#subject-nav .subject-dropdown')

  $dropdown.click(e => {
    // stop bubbling so that outside click won't close it
    e.stopPropagation()
  })

  const closeDropdown = () => {
    opened = false
    $dropdown.removeClass('open')
    $context.unbind('click', closeDropdown)
  }

  $('.subject-dropdown-toggle', $dropdown).click(e => {
    e.preventDefault()
    opened = !opened
    $dropdown.toggleClass('open', opened)
    if (opened) {
      $context.click(closeDropdown)
    }
  })
}

const init = $context => {
  setLanguage()
  initResizeEvent()

  // create an system notification whenever Common.genericError is called
  Common.addEventListener('generic error', () => {
    SystemNotification.error()
  })

  if (!$('body').hasClass('serlo-home')) {
    $('#subject-nav').sticky()
  }

  Content.add($context => {
    $('.sortable', $context).SortableList()
    $('.timeago', $context).TimeAgo()
    $('.dialog', $context).SerloModals()
    $('.datepicker', $context).datepicker({
      format: 'yyyy-mm-dd'
    })
    $('.input-daterange', $context).datepicker({
      format: 'yyyy-mm-dd'
    })
    $('.spoiler', $context).Spoiler()
    $('.injection', $context).Injections()
    $('[data-toggle]', $context).ToggleAction()
    $('[data-trigger]', $context).TriggerAction()
    $('form[name="discussion"]', $context).ForumSelect()
    $('.carousel.slide.carousel-tabbed', $context).Slider()
    $('.nest-statistics', $context).renderNest()
    $('.math-puzzle', $context).MathPuzzle()
    $('.text-exercise:has(.input-challenge-group)', $context).InputChallenge()
    $('.text-exercise:has(.single-choice-group)', $context).SingleChoice()
    $('.text-exercise:has(.multiple-choice-group)', $context).MultipleChoice()
    autosize($('textarea.autosize'))
    $('.r img', $context).each(function () {
      var $that = $(this)
      $that.magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        fixedContentPos: false,
        items: {
          src: $that.attr('src')
        },
        image: {
          verticalFit: true
        },
        disableOn: function () {
          return $that.parents('a').length <= 0
        }
      })
    })
    MathJax.Hub.Queue(['Typeset', MathJax.Hub])
  })

  // Tooltips opt in
  $('[data-toggle="tooltip"]').tooltip({
    container: 'body'
  })
  Common.addEventListener('new context', Content.init)

  initNavigation()
  initFooter()

  // initialize ajax overlay
  let ajaxOverlay
  ajaxOverlay = new AjaxOverlay({
    on: {
      contentOpened: function () {
        Content.init(this.$el)
      },
      error: function (err) {
        ajaxOverlay.shutDownAjaxContent()
        SystemNotification.error(
          t(
            'When asynchronously trying to load a ressource, I came across an error: %s',
            err.status + ' ' + err.statusText
          )
        )
      }
    }
  })

  Common.trigger('new context', $context)

  initSubjectNav($context)

  SideElement.init()

  // Google Analytics opt out
  $('a[href=ga-opt-out]').click(function (e) {
    e.preventDefault()
    gaOptout()
    SystemNotification.notify(
      t('Successfully deactivated Google Analytics'),
      'success'
    )
    window.scrollTo(0, 0)
  })
  initTracking($context)
}

init($('body'))
Supporter.check()
