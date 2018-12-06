import $ from 'jquery'

const bindCallback = (index, $form) => {
  window[`reCaptchaCallbacks_${index}`] = createSubmitCallback($form)
  $('button.g-recaptcha', $form).attr(
    'data-callback',
    `reCaptchaCallbacks_${index}`
  )
}

const createSubmitCallback = $form => () => {
  $form.submit()
}

const injectReCaptchaScript = () => {
  $('body').append(
    '<script src="https://www.google.com/recaptcha/api.js" async defer></script>'
  )
}

$.fn.ReCaptcha = function() {
  const $forms = $(this)
  $forms.each(bindCallback)
  if ($forms.length > 0) {
    injectReCaptchaScript()
  }
}
