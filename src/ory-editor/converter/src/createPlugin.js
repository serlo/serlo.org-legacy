/**
 * Created by benny on 17.11.16.
 */
import { v4 } from 'uuid'
import markdownToSlate from './markdownToSlate'

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
    case 'table':
      return {
        content: {
          plugin: {
            name: 'serlo/content/markdown'
          },
          state: {
            src: elem.src
          }
        }
      }
    case 'spoiler':
      const rows = createPlugins(elem.content)

      return {
        content: {
          plugin: {
            name: 'ory/editor/core/layout/spoiler'
          },
          state: {
            title: elem.title,
            content: {
              type: '@splish-me/editor-core/editable',
              // FIXME: can we move that before createPlugin?
              state: markdownToSlate({
                id: v4(),
                cells: [
                  {
                    id: v4(),
                    rows
                  }
                ]
              })
            }
          }
        }
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
    case 'spacer':
      return {
        content: {
          plugin: {
            name: 'ory/editor/core/content/spacer'
          },
          state: {}
        }
      }
    default:
      return {}
  }
}

export default createPlugins
