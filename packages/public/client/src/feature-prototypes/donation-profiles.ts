import { activeAuthors } from './active-authors'
import { activeReviewers } from './active-reviewers'
import { activeDonors } from './active-donors'

const userProfileSpecs: UserProfileSpec[] = [
  {
    userList: activeDonors,
    img: 'donor.png',
    otherUserProfileMessage:
      '%username% trägt mit einer regelmäßigen Spende dazu bei, dass serlo.org komplett kostenlos, werbefrei und unabhängig ist. <a href="/user/me/#spendenformular">Kannst du dir auch vorstellen, uns mit einem kleinen Betrag zu unterstützen?</a>',
    ownProfileMessage: 'Danke für deine Mitarbeit als Autorin bzw. Autor!'
  },
  {
    userList: activeReviewers,
    img: 'reviewer.png',
    otherUserProfileMessage:
      'Als Reviewerin bzw. Reviewer sichert %username% die Qualität auf serlo.org und hilft unseren Autorinnen und Autoren.',
    ownProfileMessage: 'Danke für deine Mitarbeit als Autorin bzw. Autor!'
  },
  {
    userList: activeAuthors,
    img: 'authors.png',
    otherUserProfileMessage:
      '%username% trägt als Autorin bzw. Autor dazu bei, dass immer mehr fundierte, kreative und begeisternde Lerninhalte auf sero.org zu finden sind. <a href="https://de.serlo.org/mitmachen">Schon mal überlegt selbst mitzumachen?</a>.',
    ownProfileMessage: 'Danke für deine Mitarbeit als Autorin bzw. Autor!'
  }
]
const donorsSpec = userProfileSpecs[0]

interface UserProfileSpec {
  userList: string[]
  img: string
  otherUserProfileMessage: string
  ownProfileMessage: string
}

export function initDonationProfile(): void {
  addBannerToOwnUserProfile()
  addBannerToOtherUserProfile()
  addIconsToUserLinks()
  addTwingleFormular()
}

function addTwingleFormular(): void {
  if (
    location.pathname.startsWith('/user/me') &&
    !donorsSpec.userList.includes(getUserIdFromProfilePage())
  ) {
    $('div.h2').before(`
      <div id="spendenformular" style="display: flex; flex-direction: row; width: 100%;">
        <div style="flex-grow: 1; flex-basis: 50%; padding-right: 20px;">
        <p>Hallo ${getUserNameFromProfilePage()},</p>

        <p>wir von Serlo setzen uns dafür ein, dass alle Menschen weltweit freien Zugang zu hochwertiger Bildung haben. Leider sind immer mehr Bildungsangebote bezahlpflichtig oder voller Werbung.    Deshalb ist serlo.org für immer nonprofit, komplett kostenlos und werbefrei. Und wir haben Erfolg damit! Über 1 Mio User sind jeden Monat auf serlo.org.</p>

        <p>Damit wir serlo.org zügig erweitern und verbessern können, sind wir auf Spenden für Softwareentwicklung, Server und Unterstützung der ehrenamtlichen Autorinnen und Autoren angewiesen.</p>

        <p>Falls du dir vorstellen kannst, uns mit einem kleinen regelmäßigen Betrag zu unterstützen, nutze gerne das Formular rechts.</p>

        <p>Vielen Dank :)</p>

        </div>
        <div style="flex-grow: 1; flex-basis: 50%;">
          <iframe style="flex-grow: 1; min-height: 500px; flex-basis: 50%; border: none;" src="https://spenden.twingle.de/serlo-education-e-v/crowdbird/tw5e722d17489b0/page"/>
          <p><a href="https://de.serlo.org/spenden">Ich möchte nicht, dass meine Spende auf dem Profil sichtbar ist oder ich möchte einmalig spenden.</a></p>
        </div>
      </div>
    `)
  }
}

function addBannerToOwnUserProfile(): void {
  if (location.pathname.startsWith('/user/me')) {
    const userId = getUserIdFromProfilePage()

    let message = ''

    for (const spec of userProfileSpecs) {
      if (spec.userList.includes(userId)) {
        message += icon(spec, 40, 'display: block;')
        message += `<p style="margin: 0;">${spec.ownProfileMessage}</p>`
      }
    }

    if (message) {
      const finalMessage = message.replace(
        /%username%/g,
        getUserNameFromProfilePage()
      )
      const box = `<img src="${staticFileUrl("vogel111.png")}" style="display: block; float: left;" height="200" />
                   <div class="alert alert-info"
                        style="display: grid; grid-template-columns: 60px 1fr;
                        grid-column-gap: 1em; grid-row-gap: 1em; margin-bottom: 1.5em;
                        font-size: 90%; align-items: center; color: black;">
                   ${finalMessage}
                   </div>`

      $('.page-header').after(box)
    }
  }
}

function addBannerToOtherUserProfile(): void {
  if (location.pathname.startsWith('/user/profile/')) {
    const userId = getUserIdFromProfilePage()

    let message = ''

    for (const spec of userProfileSpecs) {
      if (spec.userList.includes(userId)) {
        message += icon(spec, 60, 'display: block;')
        message += `<p style="margin: 0;">${spec.otherUserProfileMessage}</p>`
      }
    }

    if (message) {
      const finalMessage = message.replace(
        /%username%/g,
        getUserNameFromProfilePage()
      )
      const box = `<div class="alert alert-info"
                        style="display: grid; grid-template-columns: 60px 1fr;
                        grid-column-gap: 1em; grid-row-gap: 1em; margin-bottom: 1.5em;
                        font-size: 90%; align-items: center; color: black;">
                   ${finalMessage}
                   </div>`

      $('.page-header').after(box)
    }
  }
}

function addIconsToUserLinks(): void {
  $('a').each((_, a) => {
    const href = a.getAttribute('href')
    const match = href === null ? null : href.match(/\/user\/profile\/(\d+)$/)

    if (match) {
      const userId = match[1]

      for (const spec of userProfileSpecs) {
        if (spec.userList.includes(userId)) {
          $(a).append(icon(spec, 23))
        }
      }
    }
  })
}

function getUserNameFromProfilePage(): string {
  const h1 = document.getElementsByTagName('h1')[0]

  return h1.childNodes[0].textContent?.trim() ?? ''
}

function getUserIdFromProfilePage(): string {
  const links = Array.prototype.slice.call(document.querySelectorAll('a'))
  return links
    .map(link => {
      const href = link.getAttribute('href')
      const match =
        href === null ? null : href.match(/\/event\/history\/user\/(\d+)$/)

      return match === null ? null : match[1]
    })
    .find(element => element !== null)
}

function icon(spec: UserProfileSpec, height: number, style = ''): string {
  return ` <img src="${staticFileUrl(
    spec.img
  )}" height="${height}" style="${style}" /> `
}

function staticFileUrl(relativePath: string): string {
  return `http://localhost:8082/feature-prototypes/donation-profiles/${relativePath}`
}
