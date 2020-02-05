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
import { styled } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { SolutionStepsProps } from '.'

const BigFlex = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

const Container = styled.div(({ isHalf }: { isHalf?: boolean }) => {
  return {
    padding: '0 20px',
    width: isHalf ? '50%' : '100%',
    '@media (max-width: 650px)': {
      width: '100%'
    }
  }
})

export function SolutionStepsRenderer(props: SolutionStepsProps) {
  const { state } = props
  const { introduction, strategy, solutionSteps, additionals } = state

  return (
    <React.Fragment>
      <Container>{introduction.render()} </Container>
      {strategy.defined ? <Container>{strategy.render()}</Container> : null}
      <BigFlex>
        {solutionSteps.map(solutionStep => {
          return (
            <React.Fragment key={solutionStep.content.id}>
              <Container isHalf={solutionStep.isHalf.value}>
                {solutionStep.content.render()}
              </Container>
            </React.Fragment>
          )
        })}
      </BigFlex>
      {additionals.defined ? (
        <Container>{additionals.render()}</Container>
      ) : null}
    </React.Fragment>
  )
}
