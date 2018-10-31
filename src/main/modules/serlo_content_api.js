import $ from 'jquery'
import * as R from 'ramda'

const contentApiQueryKeys = [
  'contentOnly',
  'hideTopbar',
  'hideLeftSidebar',
  'hideRightSidebar',
  'hideBreadcrumbs',
  'hideDiscussions',
  'hideBanner',
  'hideHorizon',
  'hideFooter',
  'fullWidth'
]

export const initContentApi = () => {
  const $page = $('#header, #page')
  const $links = $page.find('a')

  const { href, origin } = window.location
  const queryParams = parseQueryParams(href)

  const contentApiQueryParams = R.pickBy(
    (_value, key) => R.contains(key, contentApiQueryKeys),
    queryParams
  )
  const contentApiQueryString = stringifyQueryParams(contentApiQueryParams)

  $links.each(function() {
    const $link = $(this)
    const url = $link.attr('href')
    const target = $link.attr('target')

    const isInternalLink =
      url && (url[0] === '/' || url.substr(0, origin.length) === origin)
    const isBlank = target && target === '_blank'

    if (isInternalLink && !isBlank) {
      $link.attr('href', `${url}${contentApiQueryString}`)
    }
  })
}

const parseQueryParams = url => {
  const queryString = url.replace(/^.*?\?/, '').replace(/#.*?$/, '')

  if (!queryString) {
    return {}
  }

  const rawParams = queryString.split('&')
  const params = R.map(param => param.split('='), rawParams)

  return R.fromPairs(params)
}

const stringifyQueryParams = params => {
  const rawParams = R.map(([key, value]) => {
    return value ? `${key}=${value}` : key
  }, R.toPairs(params))
  const queryString = rawParams.join('&')

  return R.isEmpty(queryString) ? '' : `?${queryString}`
}
