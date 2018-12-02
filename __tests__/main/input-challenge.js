var $ = require('jquery')

window.$ = $
window.jQuery = $

require('bootstrap-sass')

// Mocks
window.MathJax = { Hub: { Queue: () => {} } }
jest.mock('../../src/main/modules/sounds')

require('../../src/main/modules/input_challenge')

describe('Input challenge', function() {
  describe('input-string-exact-match-challenge', function() {
    var $container, $form, $input, $feedback, $submit

    beforeEach(function() {
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

    const submit = value => {
      $input.val(value)
      $form.submit()

      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }

    it('works when the exact correct input is passed', function() {
      $container.InputChallenge()

      return submit('Foo').then(() => {
        expect($feedback.hasClass('positive')).toBeTruthy()
        expect($feedback.html()).toEqual('Absolutely')
      })
    })

    it('works when the correct input is passed', function() {
      $container.InputChallenge()

      return submit('fOO').then(() => {
        expect($feedback.hasClass('positive')).toBeTruthy()
        expect($feedback.html()).toEqual('Absolutely')
      })
    })

    it('works when the correct input (with wrong spaces) is passed', function() {
      $container.InputChallenge()

      return submit('   Foo    ').then(() => {
        expect($feedback.hasClass('positive')).toBeTruthy()
        expect($feedback.html()).toEqual('Absolutely')
      })
    })

    it('works when the a false input is passed', function() {
      $container.InputChallenge()

      return submit('FooTotallyFalse').then(() => {
        expect($feedback.hasClass('pos¡tive')).toBeFalsy()
        expect($feedback.html()).toEqual('Wrong.')
      })
    })

    it('works when the a false input is passed', function() {
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

    it('works when a user feedback is passed on a false input', function() {
      $input.data('wrong-inputs', [
        {
          type: 'input-string-exact-match-challenge',
          solution: 'wa1',
          feedback: 'YouIdiot!'
        },
        {
          type: 'input-string-exact-match-challenge',
          solution: 'wa2',
          feedback: 'YouFool!'
        }
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
