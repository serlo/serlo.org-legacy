import { Plugin } from '@serlo/editor-plugins-registry'

import {
  SplishBlockquoteState,
  SplishCodeState,
  SplishInjectionState,
  SplishSpoilerState,
  SplishTextState
} from '../legacyToSplish/createPlugin'
import { convertOldSlate, htmlToSlate } from './convertSlate'
import { ContentCell, Edtr, LayoutPlugin, OtherPlugin } from './types'
import { convertSplishToEdtrIO } from '..'

export function convertPlugin(cell: ContentCell): OtherPlugin {
  const { plugin, state } = cell.content
  switch (plugin.name) {
    case Plugin.Blockquote:
      const bState = state as SplishBlockquoteState
      return {
        plugin: 'important',
        state: convertSplishToEdtrIO(bState.child.state)
      }
    case Plugin.Image:
      return {
        plugin: 'image',
        state
      }
    case Plugin.Injection:
      const injectionState = state as SplishInjectionState
      return {
        plugin: 'injection',
        state: injectionState.src
      }
    case Plugin.Spoiler:
      const spoilerState = state as SplishSpoilerState
      return {
        plugin: 'spoiler',
        state: {
          title: spoilerState.title,
          content: convertSplishToEdtrIO(spoilerState.content.state)
        }
      }
    case Plugin.Text:
      const textState = state as SplishTextState
      if (textState.editorState) {
        return {
          plugin: 'text',
          state: convertOldSlate(textState.editorState)
        }
      } else {
        return {
          plugin: 'text',
          state: htmlToSlate(textState.importFromHtml || '')
        }
      }
    case Plugin.Table:
      return {
        plugin: 'table',
        state
      }
    case Plugin.Geogebra:
      return {
        plugin: 'geogebra',
        state
      }
    case 'code':
      const code = state as SplishCodeState
      return {
        plugin: 'highlight',
        state: {
          language: code.language,
          text: code.src
        }
      }
    default:
      return {
        plugin: 'error',
        state: {
          plugin: plugin.name,
          state: state
        }
      }
  }
}
