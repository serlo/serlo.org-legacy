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
const spoilerRegEx = new RegExp(/^\/\/\/ (.*)\n([\s\S]*?)(\n|\r)+\/\/\//m)
const injectionRegEx = new RegExp(/>\[(.*)\]\(((?!ggt\/).*)\)/)
const geogebraInjectionRegEx = new RegExp(/>\[(.*)\]\(ggt\/(.*)\)/)
const linkRegEx = new RegExp(
  /[^!>]\[(([^[()\]]*?(\[.*?\]\(.*?\))?)*?)\]\((.*?)\)/
)
const imagesRegEx = new RegExp(/!\[(.*?)\]\((.*?)( "(.*)?")?\)/)
const linkedImagesRegEx = new RegExp(
  /\[!\[(.*?)\]\((.*?)( "(.*)?")?\)\]\((.*?)\)/
)
const tableRegEx = new RegExp(/(^|\n)(((\|[^|\r\n]*)+\|( |\t)*(\r?\n|\r)?)+)/)

/**
 * Blockquote RegEx:
 *  1. Negative Lookahead: Ignore when start is injection not blockquote;
 *  2. match /> ?[\s\S]+?
 *  3. Lookahead: Match is finished, when two linebreaks, end of line or injection
 */
const blockquoteRegEx = new RegExp(
  /((((\A|\n*)(?!>\[.*?\]\(.*?\))>[\s\S]+?)(?=(\r?\n\r?\n\w)|$|(>\[.*?\]\(.*?\))))+)/m
)

const extractSpoilers = normalizedObj =>
  extract(
    spoilerRegEx,
    match => ({
      name: 'spoiler',
      title: match[1],
      content: normalizeMarkdown(match[2])
    }),
    normalizedObj
  )

const extractTable = normalizedObj =>
  extract(
    tableRegEx,
    match => ({
      name: 'table',
      src: match[0]
    }),
    normalizedObj
  )

const extractInjections = normalizedObj =>
  extract(
    injectionRegEx,
    match => ({
      name: 'injection',
      description: match[1],
      src: match[2]
    }),
    normalizedObj
  )

const extractGeogebra = normalizedObj =>
  extract(
    geogebraInjectionRegEx,
    match => ({
      name: 'geogebra',
      description: match[1],
      src: match[2]
    }),
    normalizedObj
  )

const extractLinkedImages = normalizedObj =>
  extract(
    linkedImagesRegEx,
    match => ({
      name: 'image',
      description: match[1],
      src: match[2],
      title: match[4],
      href: match[5]
    }),
    normalizedObj
  )

const extractImages = normalizedObj =>
  extract(
    imagesRegEx,
    match => ({
      name: 'image',
      description: match[1],
      src: match[2],
      title: match[4]
    }),
    normalizedObj
  )

const extractBlockquote = normalizedObj =>
  extract(
    blockquoteRegEx,
    match => ({
      name: 'blockquote',
      content: normalizeMarkdown(match[1].replace(/(^|\n)>/g, '$1'))
    }),
    normalizedObj
  )

const normalizeMarkdown = markdown => {
  let normalizedObj = {
    normalized: markdown,
    elements: []
  }
  normalizedObj = extractSpoilers(normalizedObj)
  normalizedObj = extractTable(normalizedObj)
  normalizedObj = extractBlockquote(normalizedObj)
  normalizedObj = extractInjections(normalizedObj)
  normalizedObj = extractGeogebra(normalizedObj)
  normalizedObj = extractLinkedImages(normalizedObj)
  normalizedObj = extractImages(normalizedObj)

  return normalizedObj
}

const extract = (regex, createElement, { normalized, elements }) => {
  let match = regex.exec(normalized)
  while (match !== null) {
    normalized = normalized.replace(regex, '§' + elements.length + '§')
    elements = [...elements, createElement(match)]

    match = regex.exec(normalized)
  }
  return {
    normalized: normalized,
    elements: elements
  }
}

export default normalizeMarkdown
