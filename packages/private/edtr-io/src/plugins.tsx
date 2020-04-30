/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { EditorPlugin } from '@edtr-io/plugin'
import { createTextPlugin } from '@edtr-io/plugin-text'
import { createAnchorPlugin } from '@edtr-io/plugin-anchor'
import { createBlockquotePlugin } from '@edtr-io/plugin-blockquote'
import { createGeogebraPlugin } from '@edtr-io/plugin-geogebra'
import { createHighlightPlugin } from '@edtr-io/plugin-highlight'
import {
  createInputExercisePlugin,
  InputExerciseType
} from '@edtr-io/plugin-input-exercise'
import { createMultimediaExplanationPlugin } from '@edtr-io/plugin-multimedia-explanation'
import { createRowsPlugin, RowsConfig } from '@edtr-io/plugin-rows'
import { createScMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { createSpoilerPlugin } from '@edtr-io/plugin-spoiler'
import { createVideoPlugin, VideoConfig } from '@edtr-io/plugin-video'
import { i18n } from 'i18next'
import * as React from 'react'

import { appletTypePlugin } from './plugins/types/applet'
import { articleTypePlugin } from './plugins/types/article'
import { courseTypePlugin } from './plugins/types/course'
import { coursePageTypePlugin } from './plugins/types/course-page'
import { eventTypePlugin } from './plugins/types/event'
import { mathPuzzleTypePlugin } from './plugins/types/math-puzzle'
import { pageTypePlugin } from './plugins/types/page'
import { taxonomyTypePlugin } from './plugins/types/taxonomy'
import { textExerciseTypePlugin } from './plugins/types/text-exercise'
import { textExerciseGroupTypePlugin } from './plugins/types/text-exercise-group'
import { textSolutionTypePlugin } from './plugins/types/text-solution'
import { userTypePlugin } from './plugins/types/user'
import { videoTypePlugin } from './plugins/types/video'
import { errorPlugin } from './plugins/error'
import { exercisePlugin } from './plugins/exercise'
import { createImagePlugin } from './plugins/image'
import { createImportantPlugin } from './plugins/important'
import { injectionPlugin } from './plugins/injection'
import { layoutPlugin } from './plugins/layout'
import { separatorPlugin } from './plugins/separator'
import { solutionPlugin } from './plugins/solution'
import { tablePlugin } from './plugins/table'

export function createPlugins({
  getCsrfToken,
  i18next,
  registry
}: {
  getCsrfToken: () => string
  i18next: i18n
  registry: RowsConfig['plugins']
}): Record<string, EditorPlugin<any, any>> {
  return {
    anchor: createAnchorPlugin({
      i18n: {
        label: i18next.t('anchor::Identifier'),
        placeholder: i18next.t('anchor::ID of the anchor')
      }
    }),
    blockquote: createBlockquotePlugin({
      content: {
        plugin: 'text'
      }
    }),
    error: errorPlugin,
    exercise: exercisePlugin,
    geogebra: createGeogebraPlugin({
      i18n: {
        label: i18next.t('geogebra::GeoGebra URL or ID')
      }
    }),
    highlight: createHighlightPlugin({
      i18n: {
        code: {
          label: i18next.t('highlight::Click here and enter your source code…'),
          placeholder: i18next.t('highlight::Enter your source code here')
        },
        language: {
          label: i18next.t('highlight::Language'),
          placeholder: i18next.t('highlight::Enter language')
        },
        showLineNumbers: {
          label: i18next.t('highlight::Show line numbers')
        }
      }
    }),
    image: createImagePlugin(getCsrfToken),
    important: createImportantPlugin(),
    injection: injectionPlugin,
    inputExercise: createInputExercisePlugin({
      feedback: {
        plugin: 'text'
      },
      i18n: {
        types: {
          [InputExerciseType.InputStringNormalizedMatchChallenge]: i18next.t(
            'inputExercise::Text'
          ),
          [InputExerciseType.InputNumberExactMatchChallenge]: i18next.t(
            'inputExercise::Number'
          ),
          [InputExerciseType.InputExpressionEqualMatchChallenge]: i18next.t(
            'inputExercise::Mathematical expression'
          )
        },
        type: {
          label: i18next.t('inputExercise::Choose the exercise type')
        },
        unit: {
          label: i18next.t('inputExercise::Unit')
        },
        answer: {
          addLabel: i18next.t('inputExercise::Add answer'),
          value: {
            placeholder: i18next.t('inputExercise::Enter the value')
          }
        },
        inputPlaceholder: i18next.t('inputExercise::Your solution'),
        fallbackFeedback: {
          correct: i18next.t('inputExercise::Correct'),
          wrong: i18next.t('inputExercise::Wrong')
        }
      }
    }),
    layout: layoutPlugin,
    multimedia: createMultimediaExplanationPlugin({
      explanation: { plugin: 'rows' },
      plugins: [
        {
          name: 'image',
          title: i18next.t('multimedia::Image')
        },
        {
          name: 'video',
          title: i18next.t('multimedia::Video')
        },
        {
          name: 'geogebra',
          title: i18next.t('multimedia::GeoGebra Applet')
        }
      ],
      i18n: {
        changeMultimediaType: i18next.t(
          'multimedia::Change the multimedia type'
        ),
        illustrating: {
          label: i18next.t(
            'multimedia::How important is the multimedia content?'
          ),
          values: {
            illustrating: i18next.t('multimedia::It is illustrating'),
            explaining: i18next.t('multimedia::It is essential')
          }
        }
      }
    }),
    rows: createRowsPlugin({
      content: { plugin: 'text' },
      plugins: registry,
      i18n: {
        menu: {
          searchPlaceholder: i18next.t('rows::Search for tools…')
        },
        settings: {
          duplicateLabel: i18next.t('rows::Duplicate'),
          removeLabel: i18next.t('rows::Remove'),
          closeLabel: i18next.t('rows::Close')
        },
        toolbar: {
          dragLabel: i18next.t('rows::Drag the element within the document')
        },
        addLabel: i18next.t('rows::Add an element')
      }
    }),
    scMcExercise: createScMcExercisePlugin({
      content: { plugin: 'text' },
      feedback: { plugin: 'text' },
      i18n: {
        types: {
          singleChoice: i18next.t('scMcExercise::Single-choice'),
          multipleChoice: i18next.t('scMcExercise::Multiple-choice')
        },
        isSingleChoice: {
          label: i18next.t('scMcExercise::Choose the exercise type')
        },
        answer: {
          addLabel: i18next.t('scMcExercise::Add answer'),
          fallbackFeedback: {
            wrong: i18next.t('scMcExercise::Wrong')
          }
        },
        globalFeedback: {
          missingCorrectAnswers: i18next.t(
            'scMcExercise::Almost! You missed at least one correct answer'
          ),
          correct: i18next.t('scMcExercise::Correct'),
          wrong: i18next.t('scMcExercise::Wrong')
        }
      }
    }),
    separator: separatorPlugin,
    solution: solutionPlugin,
    spoiler: createSpoilerPlugin({
      content: { plugin: 'rows' },
      i18n: {
        title: {
          placeholder: i18next.t('spoiler::Enter a title')
        }
      }
    }),
    table: tablePlugin,
    text: createTextPlugin({
      registry,
      blockquote: 'blockquote',
      i18n: {
        blockquote: {
          toggleTitle: i18next.t('text::Quote')
        },
        colors: {
          setColorTitle: i18next.t('text::Set color'),
          resetColorTitle: i18next.t('text::Reset color'),
          openMenuTitle: i18next.t('text::Colors'),
          closeMenuTitle: i18next.t('text::Close sub menu')
        },
        headings: {
          setHeadingTitle(level: number) {
            return `${i18next.t('text::Heading')} ${level}`
          },
          openMenuTitle: i18next.t('text::Headings'),
          closeMenuTitle: i18next.t('text::Close sub menu')
        },
        link: {
          toggleTitle: i18next.t('text::Link (Strg + K)'),
          placeholder: i18next.t('text::Enter URL'),
          openInNewTabTitle: i18next.t('text::Open in new tab')
        },
        list: {
          toggleOrderedList: i18next.t('text::Ordered list'),
          toggleUnorderedList: i18next.t('text::Unordered list'),
          openMenuTitle: i18next.t('text::Lists'),
          closeMenuTitle: i18next.t('text::Close sub menu')
        },
        math: {
          toggleTitle: i18next.t('text::Math formula (Strg + M)'),
          displayBlockLabel: i18next.t('text::Display as block'),
          placeholder: i18next.t('text::[formula]'),
          editors: {
            visual: i18next.t('text::visual'),
            latex: i18next.t('text::LaTeX'),
            noVisualEditorAvailableMessage: i18next.t(
              'text::Only LaTeX editor available'
            )
          },
          helpText(
            KeySpan: React.ComponentType<{ children: React.ReactNode }>
          ) {
            return (
              <>
                {i18next.t('text::Shortcuts')}:
                <br />
                <br />
                <p>
                  {i18next.t('text::Fraction')}: <KeySpan>/</KeySpan>
                </p>
                <p>
                  {i18next.t('text::Superscript')}: <KeySpan>↑</KeySpan>{' '}
                  {i18next.t('text::or')} <KeySpan>^</KeySpan>
                </p>
                <p>
                  {i18next.t('text::Subscript')}: <KeySpan>↓</KeySpan>{' '}
                  {i18next.t('text::or')} <KeySpan>_</KeySpan>
                </p>
                <p>
                  π, α, β, γ: <KeySpan>pi</KeySpan>, <KeySpan>alpha</KeySpan>,{' '}
                  <KeySpan>beta</KeySpan>,<KeySpan>gamma</KeySpan>
                </p>
                <p>
                  ≤, ≥: <KeySpan>{'<='}</KeySpan>, <KeySpan>{'>='}</KeySpan>
                </p>
                <p>
                  {i18next.t('text::Root')}: <KeySpan>\sqrt</KeySpan>,{' '}
                  <KeySpan>\nthroot</KeySpan>
                </p>
                <p>
                  {i18next.t('text::Math symbols')}:{' '}
                  <KeySpan>{'\\<NAME>'}</KeySpan>, {i18next.t('text::e.g.')}{' '}
                  <KeySpan>\neq</KeySpan> (≠), <KeySpan>\pm</KeySpan> (±), ...
                </p>
                <p>
                  {i18next.t('text::Functions')}: <KeySpan>sin</KeySpan>,{' '}
                  <KeySpan>cos</KeySpan>, <KeySpan>ln</KeySpan>, ...
                </p>
              </>
            )
          }
        },
        richText: {
          toggleStrongTitle: i18next.t('text::Bold (Strg + B)'),
          toggleEmphasizeTitle: i18next.t('text::Italic (Strg + I)')
        },
        suggestions: {
          noResultsMessage: i18next.t('text::No items found')
        }
      }
    }),
    video: createVideoPlugin({
      i18n: {
        src: {
          label: i18next.t('video::Video URL')
        },
        alt: {
          label: i18next.t('video::Description')
        }
      } as VideoConfig['i18n'] // TODO: upstream bug in typing
    }),

    // Internal plugins for our content types
    'type-applet': appletTypePlugin,
    'type-article': articleTypePlugin,
    'type-course': courseTypePlugin,
    'type-course-page': coursePageTypePlugin,
    'type-event': eventTypePlugin,
    'type-math-puzzle': mathPuzzleTypePlugin,
    'type-page': pageTypePlugin,
    'type-taxonomy': taxonomyTypePlugin,
    'type-text-exercise': textExerciseTypePlugin,
    'type-text-exercise-group': textExerciseGroupTypePlugin,
    'type-text-solution': textSolutionTypePlugin,
    'type-user': userTypePlugin,
    'type-video': videoTypePlugin
  }
}
