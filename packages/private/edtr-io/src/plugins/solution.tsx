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
import { useScopedSelector } from '@edtr-io/core'
import { isEmpty } from '@edtr-io/store'
import { Icon, faExternalLinkAlt, styled } from '@edtr-io/ui'

import { SemanticSection } from './helpers/semantic-section'
import { InlineInput } from './helpers/inline-input'
import { InlineSettings } from './helpers/inline-settings'
import { InlineSettingsInput } from './helpers/inline-settings-input'

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

const OpenInNewTab = styled.span({ margin: '0 0 0 10px' })

function SolutionEditor({ editable, state, focused }: SolutionProps) {
  const { prerequisite, strategy } = state

  const hasStrategy = !useScopedSelector(isEmpty(strategy.id))

  return (
    <React.Fragment>
      {renderPrerequisite()}
      {hasStrategy || editable ? (
        <SemanticSection editable={editable}>
          {strategy.render()}
        </SemanticSection>
      ) : null}
      <SemanticSection editable={editable}>
        {state.steps.render()}
      </SemanticSection>
    </React.Fragment>
  )

  function renderPrerequisite() {
    return (
      <SemanticSection editable={editable}>{renderContent()}</SemanticSection>
    )

    function renderContent() {
      if (editable) {
        return (
          <div>
            Für diese Aufgabe benötigst Du folgendes Grundwissen:
            {focused ? (
              <InlineSettings
                onDelete={() => {
                  if (prerequisite.defined) {
                    prerequisite.remove()
                  }
                }}
                position={'below'}
              >
                <InlineSettingsInput
                  value={
                    prerequisite.defined && prerequisite.id.value !== ''
                      ? `/${prerequisite.id.value}`
                      : ''
                  }
                  placeholder="ID des Artikels ein, z.B. 1855"
                  onChange={event => {
                    const newValue = event.target.value.replace(/[^0-9]/g, '')
                    if (prerequisite.defined) {
                      prerequisite.id.set(newValue)
                    } else {
                      prerequisite.create({
                        id: newValue,
                        title: ''
                      })
                    }
                  }}
                />
                <a
                  target="_blank"
                  href={
                    prerequisite.defined && prerequisite.id.value !== ''
                      ? `/${prerequisite.id.value}`
                      : ''
                  }
                  rel="noopener noreferrer"
                >
                  <OpenInNewTab title="Artikel im neuen Tab öffnen">
                    <Icon icon={faExternalLinkAlt} />
                  </OpenInNewTab>
                </a>
              </InlineSettings>
            ) : null}
            <a>
              <InlineInput
                value={prerequisite.defined ? prerequisite.title.value : ''}
                onChange={value => {
                  if (prerequisite.defined) {
                    prerequisite.title.set(value)
                  } else {
                    prerequisite.create({ id: '', title: value })
                  }
                }}
                placeholder="Titel der Verlinkung"
              />
            </a>
          </div>
        )
      }

      if (prerequisite.defined) {
        return (
          <p>
            Für diese Aufgabe benötigst Du folgendes Grundwissen:
            <a href={`/${prerequisite.id.value}`}>{prerequisite.title.value}</a>
          </p>
        )
      }

      return null
    }
  }
}
