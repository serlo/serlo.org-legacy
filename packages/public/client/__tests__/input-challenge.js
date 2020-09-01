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
import $ from 'jquery'
import '../src/frontend/modules/input_challenge'

window.$ = window.jQuery = $

require('bootstrap-sass')

window.MathJax = { Hub: { Queue: () => {} } }
jest.mock('../src/frontend/modules/sounds')

describe('Input challenge', () => {
  let challenge

  afterEach(() => (challenge = undefined))

  describe('displays a feedback about the answer', () => {
    beforeEach(() => {
      challenge = createInputChallenge({
        solution: 'right solution',
        feedback: 'Absolutely',
        type: 'input-string-exact-match-challenge',
      })
    })

    describe('when answer is correct', () => {
      beforeEach(async () => await challenge.submit('right solution'))

      test('answer is accepted', () => {
        expect(challenge.isAnswerCorrect()).toBe(true)
      })

      test('shows correct feedback message', () => {
        expect(challenge.getFeedbackMessage()).toBe('Absolutely')
      })
    })

    describe('when answer is wrong', () => {
      beforeEach(async () => await challenge.submit('wrong answer'))

      test('answer is rejected', () => {
        expect(challenge.isAnswerCorrect()).toBe(false)
      })

      test('shows correct feedback message', () => {
        expect(challenge.getFeedbackMessage()).toBe('Wrong.')
      })
    })

    describe('shows the result of the last answer', () => {
      test('when last answer is true', async () => {
        await challenge.submit('wrong answer')
        await challenge.submit('right solution')

        expect(challenge.isAnswerCorrect()).toBe(true)
      })

      test('when last answer is false', async () => {
        await challenge.submit('right solution')
        await challenge.submit('wrong answer')

        expect(challenge.isAnswerCorrect()).toBe(false)
      })
    })
  })

  describe('when answer is passed to list of predefined wrong inputs', () => {
    beforeEach(() => {
      challenge = createInputChallenge({
        solution: 'right solution',
        type: 'input-string-exact-match-challenge',
        wrongInputs: [
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
        ],
      })
    })

    test('shows feedback of wrong input when answer is in the list', async () => {
      await challenge.submit('wa2')

      expect(challenge.isAnswerCorrect()).toBe(false)
      expect(challenge.getFeedbackMessage()).toEqual('YouFool!')
    })

    test('shows default feedback when answer is not in the list', async () => {
      await challenge.submit('wa3')

      expect(challenge.isAnswerCorrect()).toBe(false)
      expect(challenge.getFeedbackMessage()).toEqual('Wrong.')
    })
  })

  describe('normalizes the answer', () => {
    describe('type = input-string-exact-match-challenge', () => {
      beforeEach(() => {
        challenge = createInputChallenge({
          solution: 'right solution',
          type: 'input-string-exact-match-challenge',
        })
      })

      test('wrong whitespaces are ignored', async () => {
        await challenge.submit('   right   solution   ')
      })

      test('differences in upper and lower case are ignored', async () => {
        await challenge.submit('rIGHT sOLUTION')
      })

      afterEach(() => expect(challenge.isAnswerCorrect()).toBe(true))
    })

    describe('type = input-number-exact-match-challenge', () => {
      test('differences in "," and "." are ignored (Englisch vs German formatting)', async () => {
        challenge = createInputChallenge({
          solution: '1.200,5',
          type: 'input-number-exact-match-challenge',
        })

        await challenge.submit('1,200.5')
      })

      test('whitespaces are ignored', async () => {
        challenge = createInputChallenge({
          solution: '30/4',
          type: 'input-number-exact-match-challenge',
        })

        await challenge.submit('  3 0  /  4  ')
      })

      afterEach(() => expect(challenge.isAnswerCorrect()).toBe(true))
    })

    describe('type = input-expression-equal-match-challenge', () => {
      test('algebraic differences are ignored', async () => {
        challenge = createInputChallenge({
          solution: '1+x',
          type: 'input-expression-equal-match-challenge',
        })

        await challenge.submit('x + 1')

        expect(challenge.isAnswerCorrect()).toBe(true)
      })
    })
  })
})

function createInputChallenge({ wrongInputs, solution, feedback, type } = {}) {
  let $container, $form, $input, $feedback, $submit

  $container = $('<div>')
  $form = $('<form class="input-challenge-group">')
  $input = $('<input class="input-challenge-input">')

  $input.data('type', type)
  $input.data('solution', solution)
  $input.data('feedback', feedback)

  if (wrongInputs) $input.data('wrong-inputs', wrongInputs)

  $submit = $('<button class="input-challenge-submit">')
  $feedback = $('<div class="input-challenge-feedback">')

  $form.append([$input, $submit])
  $container.append([$form, $feedback])

  $container.InputChallenge()

  return {
    getFeedbackMessage() {
      return $feedback.html()
    },
    isAnswerCorrect() {
      return $feedback.hasClass('positive')
    },
    async submit(value) {
      $input.val(value)
      $form.submit()

      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
  }
}
