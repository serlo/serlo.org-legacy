const authors = ['26175']
const reviewers = ['26175']
const donors = ['26175']
const icons = {
  author: icon('pencil'),
  reviewer: icon('search'),
  donor: icon('heart', 'color: #337ab7;')
}

export function initDonationProfile(): void {
  initIconsNextToUserLinks()
  initIconsNextToUserProfileHeader()
}

function initIconsNextToUserLinks(): void {
  $('a').each((_, a) => {
    const href = a.getAttribute('href')
    const match = href === null ? null : href.match(/\/user\/profile\/(\d+)$/)

    if (match) {
      const userId = match[1]

      if (donors.includes(userId)) {
        $(a).append(icons.donor)
      }

      if (reviewers.includes(userId)) {
        $(a).append(icons.reviewer)
      }

      if (authors.includes(userId)) {
        $(a).append(icons.author)
      }
    }
  })
}

function initIconsNextToUserProfileHeader() {
  if (
    location.pathname.startsWith('/user/profile/') ||
    location.pathname.startsWith('/user/me')
  ) {
    const links = Array.prototype.slice.call(document.querySelectorAll('a'))
    const userId = links
      .map(link => {
        const href = link.getAttribute('href')
        const match =
          href === null ? null : href.match(/\/event\/history\/user\/(\d+)$/)

        return match === null ? null : match[1]
      })
      .find(element => element !== null)

    if (donors.includes(userId)) {
      $('h1 > small').before(icons.donor)
    }

    if (reviewers.includes(userId)) {
      $('h1 > small').before(icons.reviewer)
    }

    if (authors.includes(userId)) {
      $('h1 > small').before(icons.author)
    }
  }
}

function icon(faType: string, style = 'color: black;'): string {
  return ` <span class="fa fa-${faType}" style="${style}"></span> `
}
