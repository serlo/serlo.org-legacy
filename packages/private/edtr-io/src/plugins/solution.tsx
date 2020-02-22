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
import {
  EditorPlugin,
  EditorPluginProps,
  child,
  object,
  string,
  optional
} from '@edtr-io/plugin'
import * as React from 'react'
import { OverlayInput, useScopedSelector } from '@edtr-io/core'
import { PrimarySettings } from '@edtr-io/editor-ui'
import { isEmpty } from '@edtr-io/store'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faChessRook } from '@fortawesome/free-solid-svg-icons/faChessRook'
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons/faPencilRuler'

import { SemanticSection } from './helpers/semantic-section'

const solutionState = object({
  prerequisite: optional(
    object({
      id: string(),
      title: string()
    })
  ),
  strategy: child({
    plugin: 'text',
    config: {
      placeholder: 'Beschreibe hier optional die Lösungsstrategie'
    }
  }),
  steps: child({ plugin: 'rows' })
})

export type SolutionState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionState>

export const solutionPlugin: EditorPlugin<SolutionState> = {
  Component: SolutionEditor,
  state: solutionState,
  config: {}
}

function SolutionEditor({ editable, state, focused }: SolutionProps) {
  const { prerequisite, strategy } = state

  const hasStrategy = !useScopedSelector(isEmpty(strategy.id))

  return (
    <React.Fragment>
      {renderPrerequisite()}
      {hasStrategy || editable ? (
        <SemanticSection editable={editable} icon={faChessRook}>
          {strategy.render()}
        </SemanticSection>
      ) : null}
      <SemanticSection editable={editable} icon={faPencilRuler}>
        {state.steps.render()}
      </SemanticSection>
    </React.Fragment>
  )

  function renderPrerequisite() {
    return (
      <SemanticSection editable={editable} icon={faBookOpen}>
        {renderContent()}
        {renderSettings()}
      </SemanticSection>
    )

    function renderContent() {
      if (
        prerequisite.defined &&
        prerequisite.id.value &&
        prerequisite.title.value
      ) {
        return (
          <p>
            Für diese Aufgabe benötigst Du folgendes Grundwissen:{' '}
            <a
              href={`/${prerequisite.id.value}`}
              onClick={
                editable
                  ? e => {
                      e.preventDefault()
                    }
                  : undefined
              }
            >
              {prerequisite.title.value}
            </a>
          </p>
        )
      }

      if (editable) {
        return (
          <p>
            <em>
              Füge optional einen Lerninhalt ein, den man für die Bearbeitung
              dieser Aufgabe benötigt:
            </em>
          </p>
        )
      }

      return null
    }

    function renderSettings() {
      if (!editable) return null
      return (
        <PrimarySettings>
          <OverlayInput
            value={prerequisite.defined ? prerequisite.id.value : ''}
            label="Serlo ID"
            placeholder="Gebe hier die ID des Artikels ein, z.B. 1855"
            onChange={e => {
              const value = e.target.value
              if (prerequisite.defined) {
                prerequisite.id.set(value)
              } else {
                prerequisite.create({
                  id: value,
                  title: ''
                })
              }
            }}
          />
          <OverlayInput
            value={prerequisite.defined ? prerequisite.title.value : ''}
            label="Titel"
            placeholder="Gebe hier den Titel ein, z.B. Parabel"
            onChange={e => {
              const value = e.target.value
              if (prerequisite.defined) {
                prerequisite.title.set(value)
              } else {
                prerequisite.create({
                  id: '',
                  title: value
                })
              }
            }}
          />
        </PrimarySettings>
      )
    }
  }
}
