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
import autosize from 'autosize'
import $ from 'jquery'
import 'jquery-sticky'
import 'jquery-ui'
import 'katex/dist/katex.css'
import 'magnific-popup'
import moment from 'moment'

import { initContent, initEntityEditor } from '../editor'
import '../libs/polyfills'
import Common from '../modules/common'
import Content from '../modules/content'
import { reprocess, typeset } from '../modules/mathjax'
import '../modules/modals'
import '../modules/spoiler'
import SystemNotification from '../modules/system_notification'
import t from '../modules/translator'
import '../thirdparty/jquery.nestable'
import '../thirdparty/deployggb'
import './libs/easing'
import './libs/event_extensions'
import AjaxOverlay from './modules/ajax_overlay'
import Breadcrumbs from './modules/breadcrumbs'
import { initChangeDimensionEvents } from './modules/change-dimension-events'
import { initContentApi } from './modules/content_api'
import { initConsentBanner } from './modules/consent_banner'
import './modules/forum_select'
import './modules/injections'
import './modules/input_challenge'
import './modules/math_puzzle'
import './modules/math_puzzle/algebra'
import './modules/math_puzzle/touchop'
import MobileNavigation from './modules/mobile_navigation'
import './modules/multiple_choice'
import './modules/profile_birdnest'
import './modules/recaptcha'
import './modules/sentry'
import SideElement from './modules/side_element'
import SideNavigation from './modules/side_navigation'
import './modules/single_choice'
import './modules/slider'
import './modules/sortable_list'
import Supporter from './modules/supporter'
import './modules/timeago'
import './modules/toggle'
import initTracking from './modules/tracking'
import './modules/trigger'
import './styles/main.scss'

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
  initContent()
  initConsentBanner()

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
    $('form:has(button.g-recaptcha)').ReCaptcha()
    $('.ory-edit-button', $context).click(function(e) {
      e.preventDefault()
      initEntityEditor(
        $(this).data('id'),
        $(this).attr('href'),
        $(this).data('type')
      )
      $('.convert-button').hide()
    })

    $('.convert-button', $context).click(function(e) {
      e.preventDefault()
      const id = $(this).data('content-id')
      const href = $(this).attr('href')
      const $loading = $('#loading')

      $.ajax({
        url: href,
        type: 'GET',
        async: true,
        beforeSend: () => {
          $loading.show()
        }
      }).done(function(data) {
        function getEditedArticle($all) {
          const $editable = $all.find(
            `.editable[data-id="${id}"][data-edit-type="ory"]`
          )
          return $editable.closest('article').length
            ? $editable.closest('article')
            : $all.find('#content-layout article')
        }

        const $target = getEditedArticle($('body'))
        const $dataArticle = getEditedArticle($(data))
        $target.html($dataArticle.html())

        const $editButton = $(`.ory-edit-button[data-id="${id}"]`, data)
        initEntityEditor(
          id,
          $editButton.attr('href'),
          $editButton.data('type')
        ).then(() => {
          Common.trigger('new context', $target)
          $loading.hide()
          $('.convert-button').hide()
        })
      })
    })

    const $editor = $('#editor', $context)
    if ($editor.length > 0) {
      initEntityEditor(
        {
          initialState: $editor.data('state'),
          type: $editor.data('type')
        },
        $editor.get(0)
      )
      $('.convert-button').hide()
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
