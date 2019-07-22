import { textPlugin } from '@edtr-io/plugin-text'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { tablePlugin } from '@edtr-io/plugin-table'
import { videoPlugin } from '@edtr-io/plugin-video'

import { errorPlugin } from './plugins/error'
import { imagePlugin } from './plugins/image'
import { layoutPlugin } from './plugins/layout'

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
