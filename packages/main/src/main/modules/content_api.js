/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
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
