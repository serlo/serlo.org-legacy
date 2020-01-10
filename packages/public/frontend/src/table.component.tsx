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
