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
      alt: match[1],
      src: match[2]
    }),
    normalizedObj
  )

const extractGeogebra = normalizedObj =>
  extract(
    geogebraInjectionRegEx,
    match => ({
      name: 'geogebra',
      alt: match[1],
      src: match[2]
    }),
    normalizedObj
  )

const extractLinkedImages = normalizedObj =>
  extract(
    linkedImagesRegEx,
    match => ({
      name: 'image',
      alt: match[1],
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
      alt: match[1],
      src: match[2],
      title: match[4]
    }),
    normalizedObj
  )

const normalizeMarkdown = markdown => {
  var normalizedObj = {
    normalized: markdown,
    elements: []
  }
  normalizedObj = extractSpoilers(normalizedObj)
  normalizedObj = extractTable(normalizedObj)
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
