/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { createMigration } from './utils'

/**
 * Migrates the Edtr.io states of all equations plugins to the new format.
 * THIS IS AN IRREVERSIBLE MIGRATION!
 */
createMigration(exports, {
  up: async (db) => {
    interface Row {
      id: number
      value: string
      revision: number
    }

    async function processResults(results: Row[]) {
      if (results.length === 0) return

      const [field, ...remainingResults] = results
      const state = JSON.parse(field.value)
      const newState = JSON.stringify(migrateState(state))

      if (field.value !== newState) {
        await db.runSql(
          `UPDATE entity_revision_field SET value = ? WHERE id = ?`,
          newState,
          field.id
        )
        console.log('Updated revision', field.revision)
      }
      await processResults(remainingResults)
    }

    const results = await db.runSql<Row[]>(`
      SELECT erf.id, erf.value, er.id as revision
      FROM entity_revision_field erf
        LEFT JOIN entity_revision er on erf.entity_revision_id = er.id
        LEFT JOIN entity e on er.repository_id = e.id
      WHERE erf.field = 'content'
        AND erf.value LIKE '%{"plugin":"equations"%'
    `)
    await processResults(results)
  },
})

function migrateState(document: { plugin: string; state: any }): {
  plugin: string
  state: any
} {
  switch (document.plugin) {
    case 'equations':
      return migrateEquationsState(
        document.state as unknown as LegacyEquationsPluginState
      )
    // Layout plugins
    case 'blockquote':
      return {
        ...document,
        state: migrateState(document.state),
      }
    case 'exercise':
      return {
        ...document,
        state: {
          ...document.state,
          content: migrateState(document.state.content),
          interactive: document.state.interactive
            ? (migrateState(document.state.interactive) as {
                plugin: 'scMcExercise' | 'inputExercise'
                state: unknown
              })
            : undefined,
        },
      }
    case 'important':
      return {
        ...document,
        state: migrateState(document.state),
      }
    case 'inputExercise':
      return {
        ...document,
        state: {
          ...document.state,
          answers: document.state.answers.map((answer: any) => {
            return {
              ...answer,
              feedback: migrateState(answer.feedback),
            }
          }),
        },
      }
    case 'layout':
      return {
        ...document,
        state: document.state.map((row: any) => {
          return {
            ...row,
            child: migrateState(row.child),
          }
        }),
      }
    case 'multimedia':
      return {
        ...document,
        state: {
          ...document.state,
          explanation: migrateState(document.state.explanation),
          multimedia: migrateState(document.state.multimedia),
        },
      }
    case 'rows':
      return {
        ...document,
        state: document.state.map((row: any) => {
          return migrateState(row)
        }),
      }
    case 'scMcExercise':
      return {
        ...document,
        state: {
          ...document.state,
          answers: document.state.answers.map((answer: any) => {
            return {
              ...answer,
              content: migrateState(answer.content),
              feedback: migrateState(answer.feedback),
            }
          }),
        },
      }
    case 'spoiler':
      return {
        ...document,
        state: {
          ...document.state,
          content: migrateState(document.state.content),
        },
      }
    case 'solution':
      return {
        ...document,
        state: {
          ...document.state,
          strategy: migrateState(document.state.strategy),
          steps: migrateState(document.state.steps),
        },
      }

    // Content plugins
    case 'anchor':
    case 'deprecated':
    case 'error':
    case 'geogebra':
    case 'highlight':
    case 'image':
    case 'injection':
    case 'separator':
    case 'table':
    case 'text':
    case 'video':
      return document
    default:
      throw new Error('Unexpected plugin')
  }
}

interface LegacyEquationsPluginState {
  steps: {
    left: {
      plugin: 'text'
      state: any
    }
    sign: string
    right: {
      plugin: 'text'
      state: any
    }
    transform: {
      plugin: 'text'
      state: any
    }
  }[]
}

export function migrateEquationsState(state: LegacyEquationsPluginState): {
  plugin: string
  state: any
} {
  try {
    return {
      plugin: 'equations',
      state: {
        steps: state.steps.map((step) => {
          const { left, sign, right, transform } = step
          return {
            left: extractSingleFormulaFromText(left),
            sign: sign,
            right: extractSingleFormulaFromText(right),
            ...extractTransformOrExplanationFromText(transform),
          }
        }),
      },
    }
  } catch (e) {
    const error = e as Error
    console.log('Failed to', error.message)
    return {
      plugin: 'deprecated',
      state: {
        plugin: 'equations',
        state,
      },
    }
  }
}

function extractSingleFormulaFromText(textState: { state: any }): string {
  const paragraphs = textState.state.filter((paragraph: any) => {
    return (
      paragraph.type === 'p' && getCleanChildren(paragraph.children).length > 0
    )
  })

  if (paragraphs.length === 0) return ''
  if (paragraphs.length !== 1) {
    throw new Error('text has more than one paragraph')
  }

  const paragraph = paragraphs[0]

  if (paragraph.type !== 'p') {
    throw new Error('text has block that is not a paragraph')
  }

  const children = getCleanChildren(paragraph.children)

  if (children.length === 0) return ''

  return children
    .map((child) => {
      if (child.type === 'math') {
        return children[0].src
      } else if (child.text) {
        return child.text
      } else {
        throw new Error('text contains unexpected child')
      }
    })
    .join('')
}

function extractTransformOrExplanationFromText(textState: {
  plugin: string
  state: any
}): {
  transform: string
  explanation: { plugin: string; state?: any }
} {
  if (textState.state.length !== 1) return noTransform()
  const paragraph = textState.state[0]
  if (paragraph.type !== 'p') return noTransform()

  const cleanChildren = getCleanChildren(paragraph.children)

  if (cleanChildren.length === 1 && cleanChildren[0].type === 'math') {
    const src = cleanChildren[0].src
    if (src.startsWith('|') || src.startsWith('\\vert')) {
      return transform(src.replace(/^(\||\\vert)(\\:)*/, '').trim())
    }
    if (src.startsWith('\\left|')) {
      return transform(
        src
          .replace(/^\\left\|/, '')
          .replace(/\\right\.$/, '')
          .trim()
      )
    }
  }

  return noTransform()

  function noTransform() {
    return {
      transform: '',
      explanation: textState,
    }
  }

  function transform(src: string) {
    return {
      transform: src,
      explanation: {
        plugin: 'text',
      },
    }
  }
}

function getCleanChildren(children: any[]): any[] {
  return children.filter((child) => {
    return (
      Object.keys(child).length !== 0 &&
      child['text'] !== '' &&
      child['text'] !== ' '
    )
  })
}
