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
import { StateTypeReturnType } from '@edtr-io/plugin'
import { edtrDragHandle, EdtrIcon, faTrashAlt, Icon } from '@edtr-io/ui'
import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons/faLevelDownAlt'
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons/faLevelUpAlt'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import * as React from 'react'

import { solutionStepsState } from '..'
import { ControlButton, Controls, DragHandler } from './styled-elements'
import { SolutionElementType } from '../types'

export const RenderControls = ({
  state,
  index,
  showHelp,
  provided,
  showButtons
}: {
  state: StateTypeReturnType<typeof solutionStepsState>
  index: number
  showHelp: (show: boolean) => void
  provided: any
  showButtons: boolean
}) => {
  const { solutionSteps } = state
  const currentElement = solutionSteps[index]
  return (
    <Controls show={showButtons}>
      <ControlButton
        onMouseDown={() => {
          solutionSteps.remove(index)
          //remove explanation that belongs to step
          if (currentElement.isHalf.value) {
            solutionSteps.remove(index)
          }
        }}
      >
        <Icon icon={faTrashAlt} size="xs" />
      </ControlButton>
      <ControlButton
        onMouseDown={() => {
          showHelp(true)
        }}
      >
        <Icon icon={faQuestion} />
      </ControlButton>

      <DragHandler
        className="row"
        ref={provided.innerRef}
        {...provided.dragHandleProps}
      >
        <EdtrIcon icon={edtrDragHandle} />
      </DragHandler>
      {currentElement.isHalf.value ||
      (index > 0 &&
        currentElement.type.value === SolutionElementType.explanation &&
        solutionSteps[index - 1].type.value !==
          SolutionElementType.explanation) ? (
        <ControlButton
          onMouseDown={() => {
            if (currentElement.isHalf.value) {
              currentElement.isHalf.set(false)
              solutionSteps[index + 1].isHalf.set(false)
            } else {
              currentElement.isHalf.set(true)
              solutionSteps[index - 1].isHalf.set(true)
            }
          }}
        >
          <Icon
            icon={currentElement.isHalf.value ? faLevelDownAlt : faLevelUpAlt}
            size="xs"
          />
        </ControlButton>
      ) : null}
    </Controls>
  )
}
