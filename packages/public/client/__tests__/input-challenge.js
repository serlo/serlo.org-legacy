/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
var $ = require('jquery')

window.$ = $
window.jQuery = $

require('bootstrap-sass')

// Mocks
window.MathJax = { Hub: { Queue: () => {} } }
jest.mock('../src/frontend/modules/sounds')

require('../src/frontend/modules/input_challenge')

describe('Input challenge', function () {
  describe('input-string-exact-match-challenge', function () {
    var $container, $form, $input, $feedback, $submit

    beforeEach(function () {
      $container = $('<div>')
      $form = $('<form class="input-challenge-group">')
      $input = $('<input class="input-challenge-input">')

      $input.data('type', 'input-string-exact-match-challenge')
      $input.data('solution', 'Foo')
      $input.data('feedback', 'Absolutely')

      $submit = $('<button class="input-challenge-submit">')
      $feedback = $('<div class="input-challenge-feedback">')

      $form.append([$input, $submit])
      $container.append([$form, $feedback])
    })

    const submit = (value) => {
      $input.val(value)
      $form.submit()

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }

    it('works when the exact correct input is passed', function () {
      $container.InputChallenge()

      return submit('Foo').then(() => {
        expect($feedback.hasClass('positive')).toBeTruthy()
        expect($feedback.html()).toEqual('Absolutely')
      })
    })

    it('works when the correct input is passed', function () {
      $container.InputChallenge()

      return submit('fOO').then(() => {
        expect($feedback.hasClass('positive')).toBeTruthy()
        expect($feedback.html()).toEqual('Absolutely')
      })
    })

    it('works when the correct input (with wrong spaces) is passed', function () {
      $container.InputChallenge()

      return submit('   Foo    ').then(() => {
        expect($feedback.hasClass('positive')).toBeTruthy()
        expect($feedback.html()).toEqual('Absolutely')
      })
    })

    it('works when the a false input is passed', function () {
      $container.InputChallenge()

      return submit('FooTotallyFalse').then(() => {
        expect($feedback.hasClass('positive')).toBeFalsy()
        expect($feedback.html()).toEqual('Wrong.')
      })
    })

    it('works when the a false input is passed', function () {
      $container.InputChallenge()

      return submit('Foo')
        .then(() => {
          return submit('FooTotallyFalse')
        })
        .then(() => {
          expect($feedback.hasClass('pos¡tive')).toBeFalsy()
          expect($feedback.html()).toEqual('Wrong.')
        })
    })

    it('works when a user feedback is passed on a false input', function () {
      $input.data('wrong-inputs', [
        {
          type: 'input-string-exact-match-challenge',
          solution: 'wa1',
          feedback: 'YouIdiot!',
        },
        {
          type: 'input-string-exact-match-challenge',
          solution: 'wa2',
          feedback: 'YouFool!',
        },
      ])

      $container.InputChallenge()

      return submit('wa1')
        .then(() => {
          expect($feedback.hasClass('pos¡tive')).toBeFalsy()
          expect($feedback.html()).toEqual('YouIdiot!')

          return submit('wa2')
        })
        .then(() => {
          expect($feedback.hasClass('pos¡tive')).toBeFalsy()
          expect($feedback.html()).toEqual('YouFool!')

          return submit('wa3')
        })
        .then(() => {
          expect($feedback.html()).toEqual('Wrong.')
        })
    })
  })
})
