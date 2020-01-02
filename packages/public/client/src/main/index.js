/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
/* globals gaOptout */
import { reprocess, typeset } from '@serlo/mathjax'
import autosize from 'autosize'
import $ from 'jquery'
import 'jquery-sticky'
import 'jquery-ui'
import 'katex/dist/katex.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'

import 'magnific-popup'
import moment from 'moment'
import 'iframe-resizer/js/iframeResizer.contentWindow'

config.autoAddCss = false

import { initContent, initEntityEditor } from '../editor'
import '../libs/polyfills'
import Common from '../modules/common'
import Content from '../modules/content'
import '../modules/modals'
import '../modules/spoiler'
import SystemNotification from '../modules/system_notification'
import { tenant } from '../modules/tenant'
import t from '../modules/translator'
import '../thirdparty/jquery.nestable'
import '../thirdparty/deployggb'
import '../frontend/libs/easing'
import '../frontend/libs/event_extensions'
import AjaxOverlay from '../frontend/modules/ajax_overlay'
import Breadcrumbs from '../frontend/modules/breadcrumbs'
import { initChangeDimensionEvents } from '../frontend/modules/change-dimension-events'
import { initContentApi } from '../frontend/modules/content_api'
import { initConsentBanner } from '../frontend/modules/consent-banner'
import { initDiff } from './modules/diff/diff'
import '../frontend/modules/forum_select'
import '../frontend/modules/injections'
import '../frontend/modules/input_challenge'
import '../frontend/modules/math_puzzle'
import '../frontend/modules/math_puzzle/algebra'
import '../frontend/modules/math_puzzle/touchop'
import MobileNavigation from '../frontend/modules/mobile_navigation'
import '../frontend/modules/multiple_choice'
import '../frontend/modules/profile_birdnest'
import '../frontend/modules/recaptcha'
import '../frontend/modules/sentry'
import SideElement from '../frontend/modules/side_element'
import SideNavigation from '../frontend/modules/side_navigation'
import '../frontend/modules/single_choice'
import '../frontend/modules/slider'
import '../frontend/modules/sortable_list'
import Supporter from '../frontend/modules/supporter'
import '../frontend/modules/timeago'
import '../frontend/modules/toggle'
import initTracking from '../frontend/modules/tracking'
import '../frontend/modules/trigger'
import '../frontend/styles/main.scss'

window.$ = $
window.jQuery = $

// Needs to be a require call since `window.$` is needed
require('bootstrap-sass')
require('bootstrap-datepicker')
require('jasny-bootstrap/dist/js/jasny-bootstrap.js')

const { version } = require('../../package.json')

console.log('########################')
console.log(`# serlo-org-client@${version} #`)
console.log('########################')

const setLanguage = () => {
  const language = $('html').attr('lang') || 'de'

  t.config({
    language
  })

  moment.locale(language)
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
  setTimeout(function() {
    $sideContextCourse.css('max-height', $contentLayout.outerHeight())
  }, 300)
  $(window).bind('change-width', function() {
    $footerPush.css('height', $footer.height())
    $wrap.css('margin-bottom', -$footer.height())
    $sideContextCourse.css('max-height', $contentLayout.outerHeight())
    reprocess()
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
  initChangeDimensionEvents()
  initContentApi()
  initConsentBanner().then(consent => {
    initDonationBanner(consent)
  })
  initDiff()

  // create an system notification whenever Common.genericError is called
  Common.addEventListener('generic error', () => {
    SystemNotification.error()
  })

  if (!$('body').hasClass('serlo-home')) {
    $('#subject-nav').sticky()
  }

  Content.add($context => {
    initContent($context)
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
    $('form:has(button.g-recaptcha)').ReCaptcha()

    const $editor = $('#editor[data-state][data-type]', $context)
    if ($editor.length > 0) {
      initEntityEditor(
        {
          initialState: $editor.data('state'),
          type: $editor.data('type')
        },
        $editor.get(0)
      )
    }
    // Dirty Hack for Course Pages Mobile
    if ($('.side-context-course').length > 0) {
      $('#content-layout').addClass('course-page')
    }
    $('.text-exercise:has(.input-challenge-group)', $context).InputChallenge()
    $('.text-exercise:has(.single-choice-group)', $context).SingleChoice()
    $('.text-exercise:has(.multiple-choice-group)', $context).MultipleChoice()
    autosize($('textarea.autosize'))
    $('.r img', $context).each(function() {
      var $that = $(this)
      $that.magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        fixedContentPos: false,
        items: {
          src: $that.attr('src') || $that.data('cfsrc') // CloudFlare Mirage lazy loading
        },
        image: {
          verticalFit: true
        },
        disableOn: function() {
          return $that.parents('a').length <= 0
        }
      })
    })
    typeset()
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
      contentOpened: function() {
        Content.init(this.$el)
      },
      error: function(err) {
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

  initTracking($context)
}

init($('body'))
Supporter.check()

function initDonationBanner(consent) {
  if (tenant !== 'de') return
  if (localStorage.getItem('donation-popup-donated') === '1') return

  const disabledPages = [
    '/auth/login',
    '/user/register',
    '/community',
    '/spenden',
    '/eltern',
    '/lehrkraefte'
  ]
  if (
    disabledPages.indexOf(window.location.pathname) > -1 ||
    window.location.pathname.startsWith('/page/revision/create/') ||
    window.location.pathname.startsWith('/page/revision/create-old/')
  ) {
    return
  }

  import('./modules/donation-banner').then(({ initDonationBanner }) => {
    initDonationBanner()
  })
}
