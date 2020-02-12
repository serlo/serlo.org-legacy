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
import { DropResult } from 'react-beautiful-dnd'

import { solutionStepsState } from '..'
import { findPairs } from './find-pairs'

export const dragContent = (
  result: DropResult,
  state: StateTypeReturnType<typeof solutionStepsState>
) => {
  const { solutionSteps } = state
  const { source, destination } = result
  if (!destination) {
    return
  }
  const sortedArray = findPairs(solutionSteps)
  const sourceVal1 = sortedArray[source.index].val1
  const sourceVal2 = sortedArray[source.index].val2
  const destinationVal1 = sortedArray[destination.index].val1
  const destinationVal2 = sortedArray[destination.index].val2

  const movingUpwards = destination.index < source.index
  if (movingUpwards) {
    if (sourceVal2) {
      //move right source before left, so destination index is correct for both movements
      solutionSteps.move(
        sourceVal2.solutionStepIndex,
        destinationVal1.solutionStepIndex
      )
      solutionSteps.move(
        // index of sourceVal1 actually changed, so we need to adapt here
        sourceVal1.solutionStepIndex + 1,
        destinationVal1.solutionStepIndex
      )
    } else {
      solutionSteps.move(
        sourceVal1.solutionStepIndex,
        destinationVal1.solutionStepIndex
      )
    }
  } else {
    const destinationIndex = destinationVal2
      ? destinationVal2.solutionStepIndex
      : destinationVal1.solutionStepIndex

    //move left source before right, so destination index is correct for both movements
    solutionSteps.move(sourceVal1.solutionStepIndex, destinationIndex)
    if (sourceVal2) {
      solutionSteps.move(
        // index of sourceVal2 actually changed, so we need to adapt here
        sourceVal2.solutionStepIndex - 1,
        destinationIndex
      )
    }
  }
}
