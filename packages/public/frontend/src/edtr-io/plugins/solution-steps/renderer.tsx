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
