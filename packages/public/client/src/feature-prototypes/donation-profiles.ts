const authors = ['26175']
const reviewers = ['26175']
const donors = ['26175']

export function initDonationProfile(): void {
  initIconsNextToUserLinks()
}

function initIconsNextToUserLinks(): void {
  $('a').each((_, a) => {
    const href = a.getAttribute('href')
    const match = href === null ? null : href.match(/\/user\/profile\/(\d+)$/)

    if (match) {
      const userId = match[1]

      if (donors.includes(userId)) {
        addIconToUserLink(a, 'heart', 'color: #337ab7;')
      }

      if (reviewers.includes(userId)) {
        addIconToUserLink(a, 'search')
      }

      if (authors.includes(userId)) {
        addIconToUserLink(a, 'pencil')
      }
    }
  })
}

function addIconToUserLink(
  a: HTMLElement,
  icon: string,
  style = 'color: black;'
): void {
  $(a).append(` <span class="fa fa-${icon}" style="${style}"></span>`)
}
