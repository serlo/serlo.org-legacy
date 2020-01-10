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
import styled, { css } from 'styled-components'

import { getColor, lightenColor } from './provider.component'

export interface ListProps {
  ordered?: boolean
  unstyled?: boolean
}

export const List: React.FunctionComponent<ListProps> = props => {
  return (
    <StyledList
      ordered={props.ordered}
      unstyled={props.unstyled}
      as={props.ordered ? 'ol' : undefined}
    >
      {props.children}
    </StyledList>
  )
}

List.defaultProps = {
  ordered: false,
  unstyled: false
}

interface StyledListProps {
  ordered?: boolean
  unstyled?: boolean
}

const StyledList = styled.ul<StyledListProps>`
  margin-top: 0.3em;
  margin-left: 0;
  padding-left: 0;
  counter-reset: list-counter;
  list-style-type: none;

  > li {
    margin-top: 0.2rem;
  }

  ${props =>
    !props.unstyled && !props.ordered
      ? css`
          > li {
            padding-left: 1.1rem;

            &:hover:before {
              color: #fff;
              background-color: ${getColor('brand')};
              transform: scale(1.6);
            }

            &:before {
              position: absolute;
              background-color: ${getColor('lighterblue')};
              display: inline-block;
              width: 0.5em;
              content: ' ' !important;
              height: 0.5em;
              border-radius: 3em;
              margin-left: -0.9em;
              margin-top: 0.45em;
            }
          }
        `
      : null}

  ${props =>
    !props.unstyled && props.ordered
      ? css`
          > li {
            padding-left: 1.6rem;

            &:hover:before {
              color: #fff;
              background-color: ${getColor('brand')};
            }

            &:before {
              position: absolute;
              content: counter(list-counter);
              counter-increment: list-counter;
              color: ${getColor('brand')};
              font-weight: bold;
              vertical-align: top;
              display: inline-block;
              text-align: right;
              margin-left: -2.2em;
              margin-top: 0.2em;
              background-color: ${lightenColor('brand', 0.55)};
              border-radius: 4em;
              width: 1.1rem;
              height: 1.1rem;
              font-size: 0.7em;
              text-align: center;
              line-height: 1.6em;
            }
          }
        `
      : null}
`
