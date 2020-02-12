import { styled } from '@edtr-io/renderer-ui'
import * as React from 'react'
import { SemanticArticlePorps } from '.'

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

export function SemanticArticleRenderer(props: SemanticArticlePorps) {
  return null
}
