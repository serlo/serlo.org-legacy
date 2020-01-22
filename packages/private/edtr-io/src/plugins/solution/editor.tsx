import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { SolutionProps } from '.'
import { AddButton } from '@edtr-io/editor-ui'
import { RemoveButton } from '../types/common'

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
//TODO: replace later
const removeMessage = 'Entferne die Lösung zu Teilaufgabe '

export function SolutionEditor({ state, editable }: SolutionProps) {
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
                <ThemeProvider theme={solutionContentTheme}>
                  <RemoveButton
                    onClick={() => {
                      state.remove(index)
                    }}
                    title={removeMessage + solutionNumber}
                  >
                    x
                  </RemoveButton>
                  <ExpandableBox
                    renderTitle={() => (
                      <React.Fragment>
                        {'Lösung zu Teilaufgabe ' + solutionNumber}
                      </React.Fragment>
                    )}
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
