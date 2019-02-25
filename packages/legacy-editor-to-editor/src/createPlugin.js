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
import { blockquoteRendererPlugin as blockquote } from '@serlo/editor-plugin-blockquote-renderer'
import { geogebraRendererPlugin as geogebra } from '@serlo/editor-plugin-geogebra-renderer'
import { injectionRendererPlugin as injection } from '@serlo/editor-plugin-injection-renderer'
import { spoilerRendererPlugin as spoiler } from '@serlo/editor-plugin-spoiler-renderer'
import { tableRendererPlugin as table } from '@serlo/editor-plugin-table-renderer'
import { Plugin } from '@serlo/editor-plugins-registry'
import { v4 } from 'uuid'

import markdownToSlate from './markdownToSlate'

const createPlugins = ({ normalized, elements }) => {
  const split = normalized
    .split(/(§\d+§)/)
    .map(s => s.trim())
    .filter(s => s !== '')

  if (!split.length) {
    return [
      {
        cells: [markdownToSlate('')]
      }
    ]
  }
  return split.map(markdown => {
    // console.log(markdown)
    const elementIDMatch = /§(\d+)§/.exec(markdown)
    // console.log(elementID)
    if (elementIDMatch !== null) {
      return {
        cells: [createPluginCell(elements[elementIDMatch[1]])]
      }
    } else {
      return {
        cells: [markdownToSlate(markdown)]
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
            name: Plugin.Table,
            version: '0.0.0'
          },
          state: {
            src: elem.src
          }
        }
      }
    case 'spoiler':
      return {
        content: {
          plugin: {
            name: Plugin.Spoiler,
            version: '0.0.0'
          },
          state: {
            title: elem.title,
            content: {
              type: '@splish-me/editor-core/editable',
              state: {
                id: v4(),
                cells: [
                  {
                    id: v4(),
                    rows: createPlugins(elem.content)
                  }
                ]
              }
            }
          }
        }
      }
    case 'blockquote':
      return {
        content: {
          plugin: {
            name: Plugin.Blockquote,
            version: '0.0.0'
          },
          state: {
            child: {
              type: '@splish-me/editor-core/editable',
              state: {
                id: v4(),
                cells: [
                  {
                    id: v4(),
                    rows: createPlugins(elem.content)
                  }
                ]
              }
            }
          }
        }
      }
    case 'injection':
      return {
        content: {
          plugin: {
            name: Plugin.Injection,
            version: '0.0.0'
          },
          state: {
            description: elem.description,
            src: elem.src
          }
        }
      }
    case 'geogebra':
      return {
        content: {
          plugin: {
            name: Plugin.Geogebra,
            version: '0.0.0'
          },
          state: {
            description: elem.description,
            src: elem.src
          }
        }
      }
    case 'image':
      return {
        content: {
          plugin: {
            name: Plugin.Image,
            version: '0.0.0'
          },
          state: {
            description: elem.description,
            title: elem.title,
            src: elem.src,
            href: elem.href ? elem.href : undefined
          }
        }
      }
    default:
      return {
        content: {
          plugin: {
            name: elem.name
          },
          state: {
            ...elem
          }
        }
      }
  }
}

export default createPlugins
