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
