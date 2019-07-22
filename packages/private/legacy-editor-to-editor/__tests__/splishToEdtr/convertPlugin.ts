import { Plugin } from '@serlo/editor-plugins-registry'
import { textPlugin as slatePlugin } from '@serlo/editor-plugin-text'
import { convertPlugin } from '../../src/splishToEdtr/convertPlugins'
import { htmlToSlate } from '../../src/splishToEdtr/convertSlate'
import { expect } from '../common'
import {
  SplishImageState,
  SplishSpoilerState,
  SplishTextState
} from '../../src/legacyToSplish/createPlugin'
import { ContentCell } from '../../src/splishToEdtr/types'

describe('plugin convert works', () => {
  it('works with old slate state', () => {
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
