import * as React from 'react'
import styled from 'styled-components'

import { Heading as GrommetHeading } from 'grommet'

import { getColor } from './provider.component'
import { Icon, AllowedIcons } from './icon.component'

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  icon?: AllowedIcons
  color?: string
}

export const Heading: React.FunctionComponent<HeadingProps> = props => {
  const fontSizes = [1.66, 1.5, 1.3, 1.2, 1, 1]
  const fontSize = fontSizes[props.level - 1] + 'rem'

  return (
    <StyledHeading
      level={props.level.toString() as GrommetHeadingLevel}
      color={props.color}
      fontSize={fontSize}
    >
      {props.icon ? <StyledIcon icon={props.icon} /> : null}

      {props.children}
    </StyledHeading>
  )
}

type GrommetHeadingLevel = '1' | '2' | '3' | '4' | '5' | '6'

interface StyledHeadingProps {
  fontSize: string
}

const StyledHeading = styled(GrommetHeading)`
  color: ${props => (props.color ? props.color : getColor('brand'))};
  font-size: ${(props: StyledHeadingProps) => props.fontSize};

  margin: 1.5em 0 0.6em;
`

const StyledIcon = styled(Icon)`
  width: 0.75em;
  height: 0.75em;
  margin-right: 0.1em;
  margin-bottom: 0.075em;
`
