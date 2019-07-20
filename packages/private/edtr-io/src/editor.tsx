import * as React from 'react';
import { Editor as Core} from '@edtr-io/core'
import { textPlugin } from '@edtr-io/plugin-text'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { videoPlugin } from '@edtr-io/plugin-video'

import { imagePlugin } from './plugins/image'
import { layoutPlugin } from './plugins/layout'

const plugins = {
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  image: imagePlugin,
  inputExercise: inputExercisePlugin,
  layout: layoutPlugin,
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  text: textPlugin,
  video: videoPlugin
}

export function Editor(props : React.PropsWithChildren<{initialState: { plugin: string, state: unknown }, editable: boolean}>) {
  return (
    <Core plugins={plugins} defaultPlugin="text" initialState={props.initialState} editable={props.editable}>{props.children}</Core>
  )
}

export function Controls() {

}