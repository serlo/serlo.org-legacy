import { activeAuthors } from './active-authors'
import { activeReviewers } from './active-reviewers'
import { activeDonors } from './active-donors'

const userProfileSpecs: UserProfileSpec[] = [
  {
    userList: activeDonors,
    img: 'donor.png',
    otherUserProfileMessage:
      '%username% trägt mit einer regelmäßigen Spende dazu bei, dass serlo.org komplett kostenlos, werbefrei und unabhängig ist. <a href="/user/me/#spendenformular">Kannst du dir auch vorstellen, uns mit einem kleinen Betrag zu unterstützen?</a>'
  },
  {
    userList: activeReviewers,
    img: 'reviewer.png',
    otherUserProfileMessage:
      'Als Reviewerin bzw. Reviewer sichert %username% die Qualität auf serlo.org und hilft unseren Autorinnen und Autoren.'
  },
  {
    userList: activeAuthors,
    img: 'authors.png',
    otherUserProfileMessage:
      '%username% trägt als Autorin bzw. Autor dazu bei, dass immer mehr fundierte, kreative und begeisternde Lerninhalte auf sero.org zu finden sind. <a href="https://de.serlo.org/mitmachen">Schon mal überlegt selbst mitzumachen?</a>.'
  }
]

interface UserProfileSpec {
  userList: string[]
  img: string
  otherUserProfileMessage: string
}

export function initDonationProfile(): void {
  addBannerToOwnUserProfile()
  addBannerToOtherUserProfile()
  addIconsToUserLinks()
  addIconsToUserProfileHeader()
}

function addBannerToOwnUserProfile(): void {
  if (location.pathname.startsWith('/user/me')) {
    //const userId = getUserIdFromProfilePage()

    $('.page-header').after('<div class="alert alert-info">Hello World</div>')
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

function addIconsToUserProfileHeader() {
  if (
    location.pathname.startsWith('/user/profile/') ||
    location.pathname.startsWith('/user/me')
  ) {
    const userId = getUserIdFromProfilePage()

    for (const spec of userProfileSpecs) {
      if (spec.userList.includes(userId)) {
        $('h1 > small').before(icon(spec, 42))
      }
    }
  }
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
