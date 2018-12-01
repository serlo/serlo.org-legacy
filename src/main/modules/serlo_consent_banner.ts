import * as $ from 'jquery'

export function initConsentBanner() {
  const { hostname } = window.location

  // Only use on de.serlo.org for now
  if (/^de\.serlo/.test(hostname)) {
    const localStorageKey = 'datenschutz-consent'

    $.get('/datenschutz/json').then(([currentRevision]: string[]) => {
      const consent = localStorage.getItem(localStorageKey)

      if (consent === currentRevision) {
        return
      }

      const $div = $(`
        <div id="consent-banner">
            Mit der Nutzung dieser Webseite erklärst du dich mit unserer
            <a href="/datenschutz">Datenschutzerklärung</a> und unseren
            <a href="/21654">Nutzungsbedingungen</a> einverstanden.
        </div>
       `)
      const $button = $('<button class="btn btn-success">Verstanden</button>')
      $div.append($button)

      $button.on('click', () => {
        localStorage.setItem(localStorageKey, currentRevision)
        $div.remove()
      })

      $('body').append($div)
    })
  }
}
