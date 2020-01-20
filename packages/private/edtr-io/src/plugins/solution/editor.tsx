import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { SolutionProps } from '.'
import { AddButton } from '@edtr-io/editor-ui'

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
        {state.content.length > 1
          ? state.content.map((solution, index) => {
              const solutionNumber = index + 1
              return (
                <ThemeProvider theme={solutionContentTheme}>
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
          : state.content[0].render()}
        {editable ? (
          <AddButton
            onClick={() => {
              state.content.insert()
            }}
          >
            Lösung für weitere Teilaufgabe hinzufügen
          </AddButton>
        ) : null}
      </ExpandableBox>
    </ThemeProvider>
  )
}
