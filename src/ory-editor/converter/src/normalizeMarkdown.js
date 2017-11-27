const extractSpoilers = normalizedObj => {
  const spoilerRegEx = new RegExp(/^\/\/\/ (.*)\n([\s\S]*?)(\n|\r)+\/\/\//m)
  return extract(
    spoilerRegEx,
    match => ({
      name: 'spoiler',
      title: match[1],
      content: normalizeMarkdown(match[2])
    }),
    normalizedObj
  )
}

const extractInjections = normalizedObj => {
  const injectionRegEx = new RegExp(/>\[(.*)\]\(((?!ggt\/).*)\)/)
  return extract(
    injectionRegEx,
    match => ({
      name: 'injection',
      alt: match[1],
      src: match[2]
    }),
    normalizedObj
  )
}

const extractGeogebra = normalizedObj => {
  const geogebraInjectionRegEx = new RegExp(/>\[(.*)\]\(ggt\/(.*)\)/)
  return extract(
    geogebraInjectionRegEx,
    match => ({
      name: 'geogebra',
      alt: match[1],
      src: match[2]
    }),
    normalizedObj
  )
}

const extractLinkedImages = normalizedObj => {
  const linkedImagesRegEx = new RegExp(/\[!\[(.*?)\]\((.*?)\)\]\((.*?)\)/)
  return extract(
    linkedImagesRegEx,
    match => ({
      name: 'image',
      alt: match[1],
      src: match[2],
      href: match[3]
    }),
    normalizedObj
  )
}
const extractImages = normalizedObj => {
  const imagesRegEx = new RegExp(/!\[(.*?)\]\((.*?)\)/)
  return extract(
    imagesRegEx,
    match => ({
      name: 'image',
      alt: match[1],
      src: match[2]
    }),
    normalizedObj
  )
}

const normalizeMarkdown = markdown => {
  var normalizedObj = {
    normalized: markdown,
    elements: []
  }
  normalizedObj = extractSpoilers(normalizedObj)
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
