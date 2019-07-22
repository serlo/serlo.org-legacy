import * as React from 'react'
import { Editor as Core, EditorProps } from '@edtr-io/core'
import { textPlugin } from '@edtr-io/plugin-text'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { tablePlugin } from '@edtr-io/plugin-table'
import { videoPlugin } from '@edtr-io/plugin-video'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'

import { errorPlugin } from './plugins/error'
import { imagePlugin } from './plugins/image'
import { layoutPlugin } from './plugins/layout'

export type Plugin = keyof typeof plugins

export const plugins = {
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  error: errorPlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  image: imagePlugin,
  important: importantStatementPlugin,
  injection: serloInjectionPlugin,
  inputExercise: inputExercisePlugin,
  layout: layoutPlugin,
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  table: tablePlugin,
  text: textPlugin,
  video: videoPlugin
}

export function Editor(
  props: React.PropsWithChildren<{
    initialState: EditorProps['initialState']
    editable: EditorProps['editable']
  }>
) {
  return (
    <Core
      plugins={plugins}
      defaultPlugin="text"
      initialState={props.initialState}
      editable={props.editable}
    >
      {props.children}
    </Core>
  )
}
