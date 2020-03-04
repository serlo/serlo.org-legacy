const authors = ['26175']
const reviewers = ['26175']
const donors = ['26175']

const userIconSpec = [
  [donors, icon('heart', 'color: #337ab7;')] as const,
  [reviewers, icon('search')] as const,
  [authors, icon('pencil')] as const
]

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
    //const userId = getUserIdFromProfilePage()

    $('.page-header').after('<div class="alert alert-info">Hello World 2</div>')
  }
}

function addIconsToUserLinks(): void {
  $('a').each((_, a) => {
    const href = a.getAttribute('href')
    const match = href === null ? null : href.match(/\/user\/profile\/(\d+)$/)

    if (match) {
      const userId = match[1]

      for (const [userList, icon] of userIconSpec) {
        if (userList.includes(userId)) {
          $(a).append(icon)
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

    for (const [userList, icon] of userIconSpec.reverse()) {
      if (userList.includes(userId)) {
        $('h1 > small').before(icon)
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

function icon(faType: string, style = 'color: black;'): string {
  return ` <span class="fa fa-${faType}" style="${style}"></span> `
}
