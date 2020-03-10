import { Icon, styled } from '@edtr-io/ui'
import * as React from 'react'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

const Container = styled.div({
  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2)',
  marginTop: '10px',
  padding: '10px',
  minHeight: '70px',
  position: 'relative'
})

const BackgroundIcon = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  color: 'rgba(0,0,0,0.1)',
  transform: 'translate(-15px, 10px)',
  zIndex: 0
})

export function SemanticSection(props: SemanticSectionProps) {
  const { children, editable } = props
  if (!editable) return <React.Fragment>{children}</React.Fragment>

  return <Container>{props.children}</Container>
}

export interface SemanticSectionProps {
  children: React.ReactNode
  editable?: boolean
}
