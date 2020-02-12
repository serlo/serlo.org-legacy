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

import { solutionStepsState } from '..'
import { SemanticPluginTypes } from '../../semantic-plugin-helpers'

export const findPairs = (
  solutionSteps: StateTypeReturnType<typeof solutionStepsState>['solutionSteps']
) => {
  const pairedList: {
    val1: {
      content: typeof solutionSteps[0]
      solutionStepIndex: number
    }
    val2?: {
      content: typeof solutionSteps[0]
      solutionStepIndex: number
    }
  }[] = []
  solutionSteps.forEach((solutionStep, index) => {
    if (!solutionStep.isHalf.value) {
      pairedList.push({
        val1: { content: solutionStep, solutionStepIndex: index }
      })
    } else if (solutionStep.type.value !== SemanticPluginTypes.explanation) {
      pairedList.push({
        val1: { content: solutionStep, solutionStepIndex: index },
        val2: {
          content: solutionSteps[index + 1],
          solutionStepIndex: index + 1
        }
      })
    }
  })
  return pairedList
}
