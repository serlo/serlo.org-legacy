import { activeAuthors } from './active-authors'
import { activeReviewers } from './active-reviewers'
import { activeDonors } from './active-donors'

const userProfileSpecs: UserProfileSpec[] = [
  {
    userList: activeDonors,
    icon: 'heart',
    iconStyle: 'color: #337ab7;',
    otherUserProfileMessage:
      'Spende: Unsere Konkurrenten investieren Millionen in kostenpflichtige Bildung. Mit ihrer/seiner Spende unterstützt Digamma, dass Bildung kostenfrei verfügbar ist.'
  },
  {
    userList: activeReviewers,
    icon: 'search',
    iconStyle: 'color:black;',
    otherUserProfileMessage:
      '%username% sichert mit ihrer/seiner Arbeit als Revierwer*in die Qualität der Plattform und damit für 1Mio user*innen den Zugang zu hochwertiger Bildung'
  },
  {
    userList: activeAuthors,
    icon: 'pencil',
    iconStyle: 'color: black;',
    otherUserProfileMessage:
      'Digamma unterstützt zusammen mit hunderten anderer Autor*innen die Erarbeitung freier Lernmaterialien (mit mindestens 10 Bearbeitungen in den letzten 90 Tagen).'
  }
]

interface UserProfileSpec {
  userList: string[]
  icon: string
  iconStyle: string
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
        message += `<div class="fa fa-2x fa-${spec.icon}"
                         style="vertical-align: middle; ${spec.iconStyle}"></div>`
        message += `<p style="margin: 0; grid-column-start: span 2">
                    ${spec.otherUserProfileMessage}</p>`
      }
    }

    if (message) {
      const box = `<div class="alert alert-info"
                        style="display: grid; grid-template-columns: 2em 1fr 1fr;
                        grid-column-gap: 1em; grid-row-gap: 1em; margin-bottom: 1.5em;
                        font-size: 90%; align-items: center; color: black;">
                   ${message}
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
          $(a).append(icon(spec))
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
        $('h1 > small').before(icon(spec))
      }
    }
  }
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

function icon(spec: UserProfileSpec): string {
  return ` <span class="fa fa-${spec.icon}" style="${spec.iconStyle}"></span> `
}
