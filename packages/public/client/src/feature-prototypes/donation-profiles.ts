const authors = ['26175']
const reviewers = ['26175']
const donors = ['26175']

const userProfileSpecs: UserProfileSpec[] = [
  {
    userList: donors,
    icon: icon('heart', 'color: #337ab7;')
  },
  { userList: reviewers, icon: icon('search') },
  { userList: authors, icon: icon('pencil') }
]

interface UserProfileSpec {
  userList: string[]
  icon: string
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

      for (const spec of userProfileSpecs) {
        if (spec.userList.includes(userId)) {
          $(a).append(spec.icon)
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
        $('h1 > small').before(spec.icon)
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
