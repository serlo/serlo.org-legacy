import { useScopedSelector } from '@edtr-io/core'
import { StateTypeReturnType } from '@edtr-io/plugin'
import { getFocusPath } from '@edtr-io/store'
import { Icon, faTrashAlt, EdtrIcon, edtrDragHandle } from '@edtr-io/ui'
import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons/faLevelDownAlt'
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons/faLevelUpAlt'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import * as React from 'react'

import { explanation } from '../editor'
import { Controls, ControlButton, DragHandler } from './styled-elements'
import { SolutionStepsState } from '..'

export const RenderControls = ({
  state,
  index,
  showHelp,
  provided,
  showButtons
}: {
  state: StateTypeReturnType<SolutionStepsState>
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
        currentElement.type.value === explanation &&
        solutionSteps[index - 1].type.value !== explanation) ? (
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
