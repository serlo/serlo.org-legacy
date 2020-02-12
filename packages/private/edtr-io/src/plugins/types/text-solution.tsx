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
import { AddButton } from '@edtr-io/editor-ui'
import {
  EditorPlugin,
  EditorPluginProps,
  list,
  child,
  object,
  string
} from '@edtr-io/plugin'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import {
  Controls,
  entity,
  entityType,
  RemoveButton,
  serialized
} from './common'
import { RevisionHistory } from './helpers/settings'

const solutionState = list(child({ plugin: 'solutionSteps' }), 1)
export type SolutionState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionState>

export const textSolutionTypeState = entityType(
  {
    ...entity,
    content: serialized(
      object({
        plugin: string('rows'),
        state: solutionState
      })
    )
  },
  {}
)
export type TextSolutionTypeProps = EditorPluginProps<
  typeof textSolutionTypeState,
  { skipControls: boolean }
>

export const textSolutionTypePlugin: EditorPlugin<
  typeof textSolutionTypeState,
  { skipControls: boolean }
> = {
  Component: TextSolutionTypeEditor,
  state: textSolutionTypeState,
  config: {
    skipControls: false
  }
}

function TextSolutionTypeEditor(props: TextSolutionTypeProps) {
  return (
    <React.Fragment>
      {props.renderIntoToolbar(
        <RevisionHistory
          id={props.state.id.value}
          currentRevision={props.state.revision.value}
          onSwitchRevision={props.state.replaceOwnState}
        />
      )}
      <SolutionEditor {...props} state={props.state.content.state} />
      {props.config.skipControls ? null : (
        <Controls subscriptions {...props.state} />
      )}
    </React.Fragment>
  )
}

const solutionTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: '#d9edf7',
      containerBorderColor: '#d9edf7'
    }
  }
}

const solutionContentTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: 'transparent',
      containerBorderColor: 'transparent'
    }
  }
}

// TODO: replace later
const removeMessage = 'Entferne die Lösung zu Teilaufgabe '

function SolutionEditor({ state, editable }: SolutionProps) {
  const renderTitle = React.useCallback((collapsed: boolean) => {
    return (
      <React.Fragment>
        Lösung {collapsed ? 'anzeigen' : 'ausblenden'}
      </React.Fragment>
    )
  }, [])

  return (
    <ThemeProvider theme={solutionTheme}>
      <ExpandableBox renderTitle={renderTitle} editable={editable}>
        {state.length > 1
          ? state.map((solution, index) => {
              const solutionNumber = index + 1
              return (
                <ThemeProvider key={solution.id} theme={solutionContentTheme}>
                  <RemoveButton
                    onClick={() => {
                      state.remove(index)
                    }}
                    title={removeMessage + solutionNumber}
                  >
                    x
                  </RemoveButton>
                  <ExpandableBox
                    renderTitle={() => {
                      return `Lösung zu Teilaufgabe ${solutionNumber}`
                    }}
                  >
                    {solution.render()}
                  </ExpandableBox>
                </ThemeProvider>
              )
            })
          : state[0].render()}
        {editable ? (
          <AddButton
            onClick={() => {
              state.insert()
            }}
          >
            Lösung für weitere Teilaufgabe hinzufügen
          </AddButton>
        ) : null}
      </ExpandableBox>
    </ThemeProvider>
  )
}
