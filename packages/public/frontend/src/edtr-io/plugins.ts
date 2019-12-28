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
import { Plugin } from '@edtr-io/plugin'
import { createTextPlugin } from '@edtr-io/plugin-text'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createRowsPlugin, PluginRegistry } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { videoPlugin } from '@edtr-io/plugin-video'

import { appletTypePlugin } from './plugins/types/applet'
import { articleTypePlugin } from './plugins/types/article'
import { courseTypePlugin } from './plugins/types/course'
import { coursePageTypePlugin } from './plugins/types/course-page'
import { eventTypePlugin } from './plugins/types/event'
import { mathPuzzleTypePlugin } from './plugins/types/math-puzzle'
import { pageTypePlugin } from './plugins/types/page'
import { textExerciseTypePlugin } from './plugins/types/text-exercise'
import { textExerciseGroupTypePlugin } from './plugins/types/text-exercise-group'
import { textHintTypePlugin } from './plugins/types/text-hint'
import { textSolutionTypePlugin } from './plugins/types/text-solution'
import { userTypePlugin } from './plugins/types/user'
import { videoTypePlugin } from './plugins/types/video'
import { errorPlugin } from './plugins/error'
import { createImagePlugin } from './plugins/image'
import { injectionPlugin } from './plugins/injection'
import { layoutPlugin } from './plugins/layout'
import { tablePlugin } from './plugins/table'

export function createPlugins(
  getCsrfToken: () => string,
  registry?: PluginRegistry
): Record<string, Plugin> {
  return {
    anchor: anchorPlugin,
    blockquote: blockquotePlugin,
    error: errorPlugin,
    geogebra: geogebraPlugin,
    highlight: highlightPlugin,
    hint: hintPlugin,
    image: createImagePlugin(getCsrfToken),
    important: importantStatementPlugin,
    injection: injectionPlugin,
    inputExercise: inputExercisePlugin,
    layout: layoutPlugin,
    rows: createRowsPlugin(registry),
    scMcExercise: scMcExercisePlugin,
    solution: solutionPlugin,
    spoiler: spoilerPlugin,
    table: tablePlugin,
    text: createTextPlugin(registry),
    video: videoPlugin,

    // Internal plugins for our content types
    'type-applet': appletTypePlugin,
    'type-article': articleTypePlugin,
    'type-course': courseTypePlugin,
    'type-course-page': coursePageTypePlugin,
    'type-event': eventTypePlugin,
    'type-math-puzzle': mathPuzzleTypePlugin,
    'type-page': pageTypePlugin,
    'type-text-exercise': textExerciseTypePlugin,
    'type-text-exercise-group': textExerciseGroupTypePlugin,
    'type-text-hint': textHintTypePlugin,
    'type-text-solution': textSolutionTypePlugin,
    'type-user': userTypePlugin,
    'type-video': videoTypePlugin
  }
}
