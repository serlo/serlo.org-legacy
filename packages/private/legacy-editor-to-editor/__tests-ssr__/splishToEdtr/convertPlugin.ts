/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { Plugin } from '@serlo/editor-plugins-registry'
import { textPlugin as slatePlugin } from '@serlo/editor-plugin-text'
import { convertPlugin } from '../../src/splishToEdtr/convertPlugins'
import { htmlToSlate } from '../../src/splishToEdtr/convertSlate'
import { expect } from '../common'
import { SplishImageState, SplishSpoilerState, SplishTextState } from '../../src/legacyToSplish/createPlugin'
import { ContentCell } from '../../src/splishToEdtr/types'

describe('plugin convert works', () => {
  it('works with old serialized slate state', () => {
    const html = '<p>Hallo<a href="/serlo">Serlo</a>! Wie gehts?</p>'
    const textPlugin: ContentCell<SplishTextState> = {
      content: {
        plugin: { name: Plugin.Text, version: '0.0.0' },
        state: slatePlugin.serialize(
          slatePlugin.unserialize({
            importFromHtml: html
          })
        )
      }
    }
    expect(convertPlugin(textPlugin), 'to equal', {
      plugin: 'text',
      state: htmlToSlate(html)
    })
  })

  // it('works with old real slate state', () => {
  //   const slate = JSON.parse('{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with ","marks":[]},{"object":"leaf","text":"Splish","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" editor.","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"block","type":"@splish-me/ul","data":{},"nodes":[{"object":"block","type":"@splish-me/li","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"foo","marks":[]}]}]}]},{"object":"block","type":"@splish-me/li","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"bar","marks":[]}]}]}]}]}]}}')
  //   const textPlugin: ContentCell<SplishTextState> = {
  //     content: {
  //       plugin: { name: Plugin.Text, version: '0.0.0'},
  //       state: {
  //         editorState: slate
  //       }
  //     }
  //   }
  //   const expectedHTML = '<p>This was created with <strong>Splish</strong> editor</p><ul><li>foo</li><li>bar</li></ul>'
  //   expect(convertPlugin(textPlugin), 'to equal', {
  //     plugin: 'text',
  //     state: htmlToSlate(expectedHTML)
  //   })
  // })

  it('works with Spoiler wrapping an image', () => {
    const image: ContentCell<SplishImageState> = {
      content: {
        plugin: { name: Plugin.Image },
        state: {
          description: 'Some image description',
          src: 'https://assets.serlo.org/some/asset',
          title: ''
        }
      }
    }
    const spoiler: ContentCell<SplishSpoilerState> = {
      content: {
        plugin: { name: Plugin.Spoiler },
        state: {
          title: 'title',
          content: {
            type: '@splish-me/editor-core/editable',
            state: {
              id: '1',
              cells: [
                {
                  id: '2',
                  rows: [
                    {
                      cells: [image]
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }

    const expected = {
      plugin: 'spoiler',
      state: {
        content: {
          plugin: 'rows',
          state: [
            {
              plugin: 'image',
              state: {
                description: 'Some image description',
                src: 'https://assets.serlo.org/some/asset',
                title: ''
              }
            }
          ]
        },
        title: 'title'
      }
    }
    expect(convertPlugin(spoiler), 'to equal', expected)
  })
})
