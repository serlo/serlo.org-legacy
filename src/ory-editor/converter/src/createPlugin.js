/**
 * Created by benny on 17.11.16.
 */

const createPlugins = ({ normalized, elements }) => {
  const split = normalized
    .split(/(§\d+§)/)
    .map(s => s.trim())
    .filter(s => s !== '')
  return split.map(markdown => {
    // console.log(markdown)
    var elementID = /§(\d+)§/.exec(markdown)
    // console.log(elementID)
    if (elementID !== null) {
      return {
        cells: [createPluginCell(elements[elementID[1]])]
      }
    } else {
      return {
        cells: [
          {
            markdown: markdown
          }
        ]
      }
    }
  })
}
const createPluginCell = elem => {
  switch (elem.name) {
    case 'spoiler':
      return {
        layout: {
          plugin: {
            name: 'serlo/layout/spoiler'
          },
          state: {
            title: elem.title
          }
        },
        rows: createPlugins(elem.content)
      }
    case 'injection':
      return {
        content: {
          plugin: {
            name: 'serlo/content/injection'
          },
          state: {
            alt: elem.alt,
            src: elem.src
          }
        }
      }
    case 'geogebra':
      return {
        content: {
          plugin: {
            name: 'serlo/content/geogebra'
          },
          state: {
            alt: elem.alt,
            src: elem.src
          }
        }
      }
    case 'image':
      return {
        content: {
          plugin: {
            name: 'ory/editor/core/content/image'
          },
          state: {
            alt: elem.alt,
            src: elem.src,
            href: elem.href ? elem.href : undefined
          }
        }
      }
    default:
      return {}
  }
}

export default createPlugins
