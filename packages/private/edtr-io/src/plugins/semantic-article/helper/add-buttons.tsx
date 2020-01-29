import { useScopedSelector } from '@edtr-io/core'
import { AddButton, styled } from '@edtr-io/editor-ui'
import { hasFocusedDescendant } from '@edtr-io/store'
import * as React from 'react'

import {
  Buttoncontainer,
  explanationLabel,
  stepLabel
} from '../../semantic-plugin-helpers'
import { SolutionStepsProps } from '..'
import { SolutionElementType } from '../types'

const OrStatement = styled.div({
  color: 'lightgrey',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center'
})

export function AddButtonsComponent(
  props: SolutionStepsProps & {
    id: string
    index: number
    optionalID?: string
  }
) {
  const leftHasFocusedChild = useScopedSelector(hasFocusedDescendant(props.id))
  const rightHasFocusedChild = useScopedSelector(
    hasFocusedDescendant(props.optionalID || '')
  )

  const insertStep = () => {
    props.state.solutionSteps.insert(props.index + 1, {
      type: 'step',
      content: { plugin: 'rows' },
      isHalf: false
    })
  }
  const insertExplanation = () => {
    props.state.solutionSteps.insert(props.index + 1, {
      type: SolutionElementType.explanation,
      content: { plugin: 'rows' },
      isHalf: false
    })
  }
  return (
    <React.Fragment>
      {leftHasFocusedChild ||
      rightHasFocusedChild ||
      props.optionalID === '' ||
      props.id === '' ? (
        <Buttoncontainer>
          <AddButton title={stepLabel} onClick={insertStep}>
            Lösungsbestandteil
          </AddButton>
          <OrStatement> oder </OrStatement>
          <AddButton title={explanationLabel} onClick={insertExplanation}>
            zusätzliche Erklärung
          </AddButton>
        </Buttoncontainer>
      ) : null}
    </React.Fragment>
  )
}
