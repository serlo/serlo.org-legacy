/**
 * Created by benny on 17.11.16.
 */
import { v4 } from 'uuid'
import markdownToSlate from './markdownToSlate'
import table from '@serlo-org/editor-plugin-table'
import spoiler from '@serlo-org/editor-plugin-spoiler'
import injection from '@serlo-org/editor-plugin-injection'
import geogebra from '@serlo-org/editor-plugin-geogebra'
import image from '@splish-me/editor-plugin-image'

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
            name: table.name,
            version: table.version
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
            name: spoiler.name,
            version: spoiler.version
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
            name: injection.name,
            version: injection.version
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
            name: geogebra.name,
            version: geogebra.version
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
            name: image.name,
            version: image.version
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
