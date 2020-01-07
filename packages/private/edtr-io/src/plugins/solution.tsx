import { AddButton } from '@edtr-io/editor-ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { RemoveButton } from './types/common'

import { child, EditorPlugin, EditorPluginProps, list } from '@edtr-io/plugin'

const solutionState = list(child({ plugin: 'solutionSteps' }), 1)
export type SolutionState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionState>

export function createSolutionPlugin(): EditorPlugin<SolutionState> {
  return {
    Component: SolutionEditor,
    config: {},
    state: solutionState
  }
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
