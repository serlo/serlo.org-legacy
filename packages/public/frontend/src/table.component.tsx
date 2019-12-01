import * as React from 'react'
import styled from 'styled-components'

import { getColor, lightenColor } from './provider.component'

export const Table: React.FunctionComponent = props => {
  return <StyledTable>{props.children}</StyledTable>
}

const StyledTable = styled.table`
  border-collapse: collapse;

  > thead > tr > th {
    border-bottom-width: 2px;
    border-top: 0;
    text-align: left;
    padding-left: 0.75rem;
  }

  > tbody > tr > td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 3px solid ${lightenColor('brand', 0.55)};
  }

  > tbody > tr:nth-of-type(odd) {
    background-color: ${getColor('lightBackground')};
  }

  @media screen and (hover: hover) {
    > tbody > tr {
      &:nth-of-type(odd) {
        background-color: transparent;
      }
      &:hover {
        background-color: ${lightenColor('brand', 0.55)};
      }
    }
  }
`
