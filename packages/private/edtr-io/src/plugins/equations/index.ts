import {
  child,
  list,
  object,
  EditorPlugin,
  EditorPluginProps,
  string
} from '@edtr-io/plugin'

import { EquationsEditor } from './editor'

const stepProps = object({
  left: child(),
  symbol: string('equals'),
  right: child(),
  transform: child()
})

const equationsState = object({
  steps: list(stepProps)
})

/** @public */
export const equationsPlugin: EditorPlugin<EquationsState> = {
  Component: EquationsEditor,
  config: {},
  state: equationsState
}

/** @public */
export type EquationsState = typeof equationsState
/** @public */
export type EquationsProps = EditorPluginProps<EquationsState>
