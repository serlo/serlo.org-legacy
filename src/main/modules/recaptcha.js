import $ from 'jquery'

const ReCaptcha = ($container, index) => {
  window[`reCaptchaCallbacks_${index}`] = submitCallback($container)
  $('button.g-recaptcha', $container).attr(
    'data-callback',
    `reCaptchaCallbacks_${index}`
  )
}

const submitCallback = $el => () => {
  $el.submit()
}

const injectReCaptchaScript = () => {
  $('body').append(
    '<script src="https://www.google.com/recaptcha/api.js" async defer></script>'
  )
}

$.fn.ReCaptcha = function() {
  $(this).each(function(index) {
    new ReCaptcha($(this), index)
  })
  injectReCaptchaScript()
}
