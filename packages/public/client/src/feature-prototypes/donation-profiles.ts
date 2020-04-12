import { activeAuthors } from './active-authors'
import { activeReviewers } from './active-reviewers'
import { activeDonors } from './active-donors'

const donorsSpec = {
  userList: activeDonors,
  img: 'donor.png',
  otherUserProfileMessage:
    '%username% trägt mit einer regelmäßigen Spende dazu bei, dass serlo.org komplett kostenlos, werbefrei und unabhängig ist. <a style="text-decoration: underline;" href="/user/me#spenden">Kannst auch du dir vorstellen, uns mit einem kleinen Betrag zu unterstützen?</a>',
  ownProfileMessage:
    'Wir sind die ersten %no% Pioniere beim Aufbau einer langfristigen und unabhängigen Finanzierung für serlo.org.'
}

const userProfileSpecs: UserProfileSpec[] = [
  {
    userList: activeReviewers,
    img: 'reviewer.png',
    otherUserProfileMessage:
      'Als Reviewerin bzw. Reviewer sichert %username% die Qualität auf serlo.org und hilft unseren Autorinnen und Autoren.',
    ownProfileMessage:
      'Als Team von %no% Reviewerinnen und Reviewern sorgen wir für die Qualität unserer Lernplattform.'
  },
  {
    userList: activeAuthors,
    img: 'authors.png',
    otherUserProfileMessage:
      '%username% trägt als Autorin bzw. Autor dazu bei, dass immer mehr großartige Lerninhalte auf serlo.org zu finden sind. <a style="text-decoration: underline;" href="https://de.serlo.org/mitmachen">Schon mal überlegt selbst mitzumachen?</a>.',
    ownProfileMessage:
      'Zusammen mit dir sind wir schon %no% Autorinnen und Autoren, die aktiv an serlo.org mitarbeiten.'
  },
  donorsSpec
]

interface UserProfileSpec {
  userList: string[]
  img: string
  otherUserProfileMessage: string
  ownProfileMessage: string
}

export function initDonationProfile(): void {
  addBannerToProfile()
  addIconsToUserLinks()
  addTwingleFormular()
}

function addTwingleFormular(): void {
  if (
    location.pathname.startsWith('/user/me') &&
    !donorsSpec.userList.includes(getUserIdFromProfilePage())
  ) {
    const userName = getUserNameFromProfilePage()
    const userId = getUserIdFromProfilePage()
    const donorPicture = staticFileUrl(donorsSpec.img)
    const campaignId = `Spendenprofil { userId: ${userId}, userName: ${userName} }`
    const encodedCampaignId = encodeURIComponent(campaignId)

    $('div.h2').before(`
      <h2 id="spenden" class="heading-content">Spenden</h2>
      <div style="display: flex; flex-direction: row; width: 100%; margin-bottom: 15px;">
        <style type="text/css">.no-show { display: none; }</style>
        <div style="flex-grow: 1; flex-basis: 50%; padding-right: 20px;">
        <p>Hallo ${userName},</p>

        <p>wir von Serlo setzen uns dafür ein, dass alle Menschen weltweit freien Zugang zu hochwertiger Bildung haben. Leider sind immer mehr digitale Bildungsangebote <a id="mehr-anzeigen-a" onclick="$('#mehr-anzeigen-a').css('display','none'); $('#mehr-anzeigen-span').css('display','inline'); $('.mehr-anzeigen-p').css('display', 'block');" style="cursor:pointer;">(mehr anzeigen)</a>
        <span id="mehr-anzeigen-span" style="display: none;">bezahlpflichtig oder voller Werbung. Da gehen wir einen anderen Weg. Unsere Lernplattform ist <strong>für immer</strong> komplett kostenlos, werbefrei und nonprofit. Und wir haben Erfolg damit! Über 1 Mio User sind jeden Monat auf serlo.org.</span></p>

        <p class="mehr-anzeigen-p" style="display:none;">Damit wir serlo.org zügig erweitern und verbessern können, sind wir auf Spenden für Softwareentwicklung, Server und Unterstützung der ehrenamtlichen Autorinnen und Autoren angewiesen.</p>

        <p class="mehr-anzeigen-p" style="display:none;">Dafür brauchen wir dich! Falls du dir vorstellen kannst, uns mit einem kleinen regelmäßigen Betrag zu unterstützen, dann klicke rechts.</p>

        <p class="mehr-anzeigen-p" style="display:none;">Vielen Dank :)</p>

        <img style="display: block; width: 70%; margin: 30px auto 0 auto" src="${donorPicture}" />

        </div>
        <div style="flex-grow: 1; flex-basis: 50%;">
          <iframe style="flex-grow: 1; min-height: 390px; flex-basis: 50%; border: none;" src="https://spenden.twingle.de/serlo-education-e-v/spendenprofil/tw5e8dbb1390e8b/page?tw_cid=${encodedCampaignId}"/>
          <p style="color: #999;">Du möchtest nicht, dass deine Spende auf deinem Profil sichtbar ist oder du möchtest einmalig spenden: <a href="https://de.serlo.org/spenden" style="text-decoration: underline;">Klicke hier</a></p>
        </div>
      </div>
    `)
  }
}

function addBannerToProfile(): void {
  if (
    location.pathname.startsWith('/user/me') ||
    location.pathname.startsWith('/user/profile')
  ) {
    const ownProfile = location.pathname.startsWith('/user/me')
    const userId = getUserIdFromProfilePage()
    const userName = getUserNameFromProfilePage()
    const imgWidth = 40

    let message = ''

    for (const spec of userProfileSpecs) {
      if (spec.userList.includes(userId)) {
        message += icon(spec, imgWidth, 'display: block;')

        const specMessage = ownProfile
          ? spec.ownProfileMessage
          : spec.otherUserProfileMessage
        const no = spec.userList.length.toString()
        const editedMessage = specMessage.replace(/%no%/g, no)
        message += `<p style="margin: 0;">${editedMessage}</p>`
      }
    }

    if (message) {
      const finalMessage = message.replace(/%username%/g, userName)
      const additionOwnProfile =
        '<p style="grid-column: span 2;">Gemeinsam helfen wir jeden Monat über 1 Mio jungen Menschen beim Lernen – unabhängig vom Geldbeutel ihrer Eltern. Schön, dass du dabei bist!</p>'
      const image = staticFileUrl('vogel111.png')

      const box = `<img src="${image}" style="display: block; float: left;" height="200" />
                   <div class=""
                        style="display: grid; grid-template-columns: ${imgWidth}px 1fr;
                        grid-column-gap: 1em; grid-row-gap: 1em; margin-bottom: 1.5em;
                        font-size: 90%; align-items: center; color: black;">
                   ${finalMessage}

                   ${ownProfile ? additionOwnProfile : ''}
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
