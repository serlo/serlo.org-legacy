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
