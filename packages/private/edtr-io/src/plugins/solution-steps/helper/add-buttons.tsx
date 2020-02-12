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
import { useScopedSelector } from '@edtr-io/core'
import { AddButton, styled } from '@edtr-io/editor-ui'
import { hasFocusedDescendant } from '@edtr-io/store'
import * as React from 'react'

import { SolutionStepsProps } from '..'
import {
  SemanticSolutionTypes,
  Buttoncontainer,
  explanationLabel,
  stepLabel
} from '../../semantic-plugin-helpers'

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
      type: SemanticSolutionTypes.explanation,
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
